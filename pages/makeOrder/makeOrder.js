// pages/makeOrder/makeOrder.js
var con = require('../../utils/constant.js');
var netUtil = require('../../utils/netUtil.js');
//获取应用实例
var app = getApp()
var orders = {};
var counts = '';
var user = {};
var showTag;
var showTag1;
var isXianshis;
Page({
  data:{
        orderInfos:[],
         allHeight:0,
         balance:0,
         isChooseBalance:true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
   isXianshis = options.isXianshi;
   netUtil.getOpenId();
    counts = options.count;
    console.log("接收到的参数是obj="+isXianshis);
     console.log("接收到的参数是obj="+counts);
  console.log("接收到的参数是obj="+options.order);//此处打印出来的仅仅是字符串 需要解析，解析如下
   orders = JSON.parse(con.Decrypt(options.order));//解析得到对象;
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    var that = this;
     setOrderInfo(that);
  },
  onReady:function(){
    // 页面渲染完成
       
    var that = this;
     user = con.getUserInfo();
    getBalance(that,user);

     wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData({
          allHeight:res.windowHeight
        })
      }
    })
   
    
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  orderPay:function(){
    var that = this;
    balancePay(that,user,orders)
  }
  ,
  wxcheckClick:function(){
    console.log('ddddddddd')
    if(this.data.isChooseBalance){
      this.setData({
      isChooseBalance:!this.data.isChooseBalance
    })
  }
},
  checkClick:function(){
    console.log('cccccccccccccccc')
     if(!this.data.isChooseBalance){
        this.setData({
        isChooseBalance:!this.data.isChooseBalance
    })
  }
    
  }
})

function setOrderInfo(that){
   console.log("========="+isXianshis);
  if(isXianshis=="true"){
    console.log("111111111111========="+isXianshis);
      showTag="市场价";
      showTag1="活动价";
   }else{
     console.log("222222222222222========="+isXianshis);
     showTag="单次价格";
     showTag1="办卡价格";
   }
  var lists = new Array();
    lists.push({
        id: 'content',
        name: orders.ordersn,
        hint:'订单编号'
      });
    lists.push({
        id: 'content',
        name: orders.orderItemViewList[0].goodsName,
         hint:'项目'
      });
      lists.push({
        id: 'content',
        name: counts+'次',
         hint:'包含次数'
      });
      lists.push({
        id: 'content',
        name: '¥'+orders.orderItemViewList[0].price/100,
         hint:showTag
      });
      lists.push({
        id: 'content',
        name: '¥'+orders.orderItemViewList[0].originPrice/100,
         hint:showTag1
      });
      lists.push({
        id: 'content',
        name: orders.disCourseCard*1.0/10+'折',
         hint:'折扣'
      });
      lists.push({
        id: 'content',
        name: '¥'+orders.gross*orders.disCourseCard/10000,
         hint:'合计'
      });
      // lists.push({
      //   id: 'content',
      //   name: orders.ordersn,
      //    hint:'优惠券'
      // });
       lists.push({
        id: 'content',
        name: '¥'+orders.gross*orders.disCourseCard/10000,
         hint:'支付金额'
      });
       lists.push({
        id: 'content',
        name: '',
         hint:'支付方式'
      });
      that.setData({
        orderInfos:lists
      })
}

function getBalance(that,user){
  var balanceParam = {"status":"NORMAL","belongToPartyCode":user.defaultCustomerProfileCode,"belongToPartyType":"CUSTOMER_PROFILE"};
  netUtil.netUtil(con.GET_BALANCE,balanceParam,function(res){
    if(res.code==1){
        var balanceData = res.data;
          var balanceMoney = 0;
          for(var inw=0;inw<balanceData.length;inw++){
            if("DJZ_C"==balanceData[inw].accountType||"ZK_C"==balanceData[inw].accountType){
              balanceMoney+=(balanceData[inw].amount/100)
            }
          }
          that.setData({
            balance:balanceMoney
          })
    }
  });
}

function balancePay(that,user,orderinfo){
  var openId = wx.getStorageSync('openId');
  var realPay = orderinfo.gross*orderinfo.disCourseCard*0.01;
  if (that.data.isChooseBalance) {
                    if (that.data.balance*100<realPay) {
                      wx.showToast({
                        title: '您的余额不足此次支付，请充值',
                        icon: 'success',
                        duration: 2000
                      })
                        return;
                    }
                }
  var payMethodd = '';
  
  if(that.data.isChooseBalance){
    payMethodd='DJZ_ACCOUNT';
  }else{
    if(openId==null||openId==''){
      wx.showToast({
                        title: '请退出小程序重新进入',
                        icon: 'success',
                        duration: 2000
                      })
      return;
    }
    payMethodd='WECHAT_LITTLE_APP';
  }
  var confirmParam = {"gross":realPay,"orderItemViewList":[{"finalPrice":{"finalPrice":realPay,"priceMetaType":2,"sourceId":0},"goodsCode":orderinfo.orderItemViewList[0].goodsCode,"goodsMetaType":orderinfo.orderItemViewList[0].goodsMetaType,"goodsName":orderinfo.orderItemViewList[0].goodsName,
  "isGift":"0","originPrice":orderinfo.orderItemViewList[0].originPrice,"price":orderinfo.orderItemViewList[0].price,"quantity":orderinfo.orderItemViewList[0].quantity}],
  "comments":"",
  "accounts":[{"accountCode":user.defaultCustomerProfileCode+ "DJZ_C",
  "amount":realPay,
  "payMethod":payMethodd}],
  "bookingCode":"",
  "orderCode":orderinfo.code,
  "openId":openId};
  netUtil.netUtil(con.ORDER_CONFIRM,confirmParam,function(res){
    if(res.code==1){
      if(that.data.isChooseBalance){
                        wx.showModal({
              title: '提示',
              content: '您将使用余额支付',
              success: function(ress) {
                if (ress.confirm) {
                  console.log('用户点击确定')
                  payBalance(that,res.data,payMethodd,orderinfo);
                }else{
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }else{
            var payParams = JSON.parse(res.data.addition5);
            console.log('=====微信支付======');
            console.log(payParams);
            wx.requestPayment({
                'timeStamp': payParams.timeStamp,
              'nonceStr': payParams.nonceStr,
              'package': payParams.package,
              'signType': 'MD5',
              'paySign': payParams.paySign,
              'success':function(res){
                  wx.navigateBack({
                    delta: 2
                                  })
              },
              'fail':function(res){
            console.log(res)
                wx.navigateBack({
                  delta: 1
                })
              }
})
          }
    }
  });
}
function payBalance(that,confirm,payMethodd,orderinfo){
  var balancePayParam = {"comments":"","cashierPartyType":"SYSTEM","billCode":confirm.code,"accounts":[{"accountCode":user.defaultCustomerProfileCode+ "DJZ_C","amount":orderinfo.gross*orderinfo.disCourseCard*0.01,"payMethod":payMethodd}]};
  netUtil.netUtil(con.BALANCE_PAY,balancePayParam,function(res){
    if(res.code==1){
  wx.navigateBack({
            delta: 2
          }) 
    }else{
        wx.navigateBack({
            delta: 1
          })
    }
  });
}

