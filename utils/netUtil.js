var con = require('constant.js');
/**
 * 网络请求的统一封装
 * params url地址 body网络请求中的body callback成功回调
 * 返回 格式res:{code:1/-1, errMsg, data} 1成功 -1失败
 * 包含统一的加载中 加载失败提示
 * **/
function netUtil(url,body,callBack) {
    console.log( "netUtil进来了" );
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    var callBackData = {};
    var tokens='';
    var operators = '';
    var shopCode = '';
    var companyCode = '';
    var model = '';
    var system = '';
    var platform = '';
wx.getSystemInfo({
  success: function(res) {
    model = res.model;
    platform = res.platform;
    system = res.system;
    console.log(res.model)
    console.log(res.system)
    console.log(res.version)
    console.log(res.platform)
  }
})

    if(con.getUserInfo()!=null){//取登录保存到本地的数据
        tokens = con.getUserInfo().currentToken;
        operators = con.getUserInfo().code;
        shopCode = con.getUserInfo().defaultShopCode;
        companyCode = con.getUserInfo().defaultCompanyCode;
        console.log(tokens+"=="+operators);
    } 
    //微信请求 
    wx.request( {
        url: url,
        header: {
      'content-type': 'application/json',
      "token": tokens,
      "source": "XYY_WX_XIAOCHENGXU",
      "shopCode":shopCode,
      "companyCode":companyCode,
      "operator": operators,
      "os":platform,
      "version":system,
      "model": model,
      "deviceCode": '',
      "appVersion":'1.0.0',
      "apiVersion":"2.5.1",
      "appType": "ANDROID_Client_PHONE",
      
        },
        method:'POST',
        data:{
            "body":body,
            "head":{
                "digest":"2017-01-10T16:07:52.444+0800",
                "operatorType":"CUSTOMER_LOGIN",                     "operator":operators,
                "operatorLevel":"CUSTOMER",                          "appVersion":8,
                "appType":"ANDROID_Client_PHONE",                    "token":tokens
                }
        },
        success: function(res) {
          if(res.data.head.errCode == 1000){
            callBackData.code = 1;
            callBackData.errMsg = "数据请求成功";
            callBackData.data = res.data.body;
          } else {
            if(res.data.head.errCode==1001){
          wx.redirectTo({
          url: '../../pages/login/login'
          })
     }
            callBackData.code = -1;
            callBackData.errMsg = res.data.body.errMsg;
          }
          callBack(callBackData);
          wx.showToast({
            title: callBackData.errMsg,
            duration: 10000,
            mask: true
          })
          setTimeout(function(){
            wx.hideToast()
          },1000)
        },
        fail: function( res ) {
            // fail( res );
            callBackData.code = -1;
            callBackData.errMsg = "请检查网络";
            callBack(callBackData);
            wx.showToast({
            title: callBackData.errMsg,
            duration: 10000,
            mask: true
            })
            setTimeout(function(){
              wx.hideToast()
            },1000)
        }
    });
}

function getOpenId(){
  wx.login({
    success: function(res){
      // success
      let parameter= {
        "code":res.code
    };
       netUtil(con.GET_OPEN_ID,parameter,function(res){
        
         let inf = JSON.parse(res.data);
         if(res.code==1){
            // res.data.openid;
            wx.setStorage({
              key: 'openId',
              data: inf.openid,
              success: function(res){
                // success
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
         }
       })
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
    // wx.login({
    //     success: function(res){
    //       console.log(res);
    //       this.netUtil(con.GET_OPEN_ID,)
        //   wx.request({
        //     url:con.GET_OPEN_ID,
        //     data: {},
        //     method: 'GET', 
        //     success: function(res){
        //       console.log(res);
        //       console.log(res.data.openid);
        //       wx.setStorage({
        //         key: 'openId',
        //         data: res.data.openid,
        //         success: function(res){
        //           // success
        //         },
        //         fail: function() {
        //           // fail
        //         },
        //         complete: function() {
        //           // complete
        //         }
        //       })
        //       return res.data.openid;
        //     },
        //     fail: function() {
        //       // fail
        //     },
        //     complete: function() {
        //       // complete
        //     }
        //   })
        //   // success
        // },
        // fail: function() {
        //   // fail
        //   console.log('失败了了=============')
        // },
        // complete: function() {
        //   // complete
        // }
      // })
}

module.exports = {
    netUtil: netUtil,
    getOpenId:getOpenId
}



