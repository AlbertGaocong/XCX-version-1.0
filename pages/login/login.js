// pages/login/login.js
var con = require('../../utils/constant.js');
var netUtil = require('../../utils/netUtil.js');
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）
var phoneNum;
var interval = null;
var type=1;

Page({
  data:{
   hidden:false,
   time: currentTime,
   clicks:false
  },
  chooseLogin:function(){
    this.setData({
        hidden:false
    });
  },
  chooseRegist:function(){
   this.setData({
        hidden:true
    });
  },
  getnum:function(){
    console.log('3333333333')
            var that = this
            sendSms(that);
            
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    var userInfo = con.getUserInfo();
    if(userInfo!=undefined&&userInfo!=''){
        goLogin(that,userInfo.mobile,userInfo.password,1)
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }, 
  bindKeyInput: function(e) {
    console.log(e.detail.value)
    phoneNum = e.detail.value;
  },
  registFormSubmit:function(e){
    var that = this;
    console.log(e.detail.value)
    regist(that,e.detail.value.input_phoneNum,e.detail.value.sms_code,e.detail.value.pwd_code)
  },
  loginFormSubmit:function(e){
    var that=this;
    goLogin(that,e.detail.value.login_phones,e.detail.value.login_pwd,0)
  }
})

/**
 * 登录
 */
function goLogin(that,phones,pwd,autos) {
  if(phones==undefined||phones.length!=11||pwd==undefined||pwd==''){
      wx.showToast({
              title: '请输入合法手机号和密码',
              icon: 'success',
              duration: 2000
            })
            return;
  }
  var loginParam = {"isNotAuto":autos,"password":pwd,
  "mobile":phones}
  netUtil.netUtil(con.LOGIN_URL,loginParam,function(res){
    if(res.code==1){
        console.log(res.data);
          wx.setStorage({
            key: 'userInfo',
            data: res.data,
            success: function(res){
            if(type==1){
 wx.switchTab({
              url: '../../pages/index/index'
            })
            }else if(type==2){
              wx.switchTab({
              url: '../../pages/myself/myself'
            })
            }
            
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
    }
  });
}

/**
 * 发送验证码SENDSMS
 */
function sendSms(that) {
   if(phoneNum==undefined||phoneNum.length!=11){
      wx.showToast({
              title: '请输入合法手机号',
              icon: 'success',
              duration: 2000
            })
            return;
  }
  var sendSms = {"operType":"CReg","mobile":phoneNum};
  netUtil.netUtil(con.SENDSMS,sendSms,function(res){
    if(res.code==1){
        console.log(res.data);
          wx.showToast({
  title: '验证码发送成功',
  icon: 'success',
  duration: 2000
})
daojishi(that);
    }
  });
}
function daojishi(that){
  currentTime = maxTime
            interval = setInterval(function(){
              if(currentTime>0){
                currentTime--
                that.setData({
                    time : currentTime,
                    clicks:true
                })
              }
                if(currentTime <= 0){
                    currentTime = 0
                     that.setData({
                    time : 60,
                    clicks:false
                })
                    clearInterval(interval)
                }
            }, 1000)
}
/**
 * 注册
 */
function regist(that,phoneNum,smsCode,pwdCode){
 if(phoneNum==undefined||phoneNum.length!=11||smsCode==undefined||smsCode==''||pwdCode==undefined||pwdCode==''){
      wx.showToast({
              title: '请完善信息',
              icon: 'success',
              duration: 2000
            })
            return;
  }
  var registParams = {"smsCode":smsCode,"password":pwdCode,"mobile":phoneNum};
  netUtil.netUtil(con.REGIST,registParams,function(res){
    if(res.code==1){
        type=2;
goLogin(that,phoneNum,pwdCode);
    }
  });
}