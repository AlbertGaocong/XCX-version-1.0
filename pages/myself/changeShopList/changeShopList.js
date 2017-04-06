// pages/myself/changeShopList/changeShopList.js
var con = require('../../../utils/constant.js');
var netUtil = require('../../../utils/netUtil.js');
Page({
  data: {

    list: []

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    var userInfo = con.getUserInfo();
    var that = this;
    console.log("*****" +userInfo);
    netUtil.netUtil(con.COMPANY_LIST,{ "loginAccountCode": userInfo.code },function callback(res){
      if(res.code==1){
        var datas = res.data;
          // for (var i=0; i<datas.length; i++) {
          //   if(datas[i].cover==null||datas[i].cover==""){
          //     datas[i].cover="../../images/icon_default_youhui.png"
          //   }
          //   if(projectType == "0"){
          //     // 分类项目列表
          //     datas[i].projectTypeName = "办卡";
          //   } else if(projectType == "1"){
          //     // 热门推荐
          //     datas[i].projectTypeName = "活动";
          //   }
          // }
          that.setData({
            list: datas,
            shopName: options.shopName,
            companyName: options.companyName,
            shopCover: options.shopCover
          })
      }
    })
    // wx.request({
    //   url: con.COMPANY_LIST,
    //   data: {
    //     "body": { "loginAccountCode": userInfo.code }, "head": { "digest": "2017-01-10T16:07:52.444+0800", "operatorType": "CUSTOMER_LOGIN", "operator": "LOGINACCOUNT201608171645010272203", "operatorLevel": "CUSTOMER", "appVersion": 8, "appType": "ANDROID_Client_PHONE", "token": userInfo.currentToken }
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   dataType: 'json',
    //   // header: {}, // 设置请求的 header
    //   success: function (res) {
    //     // success
    //     // console.log(res);
    //     console.log("++++++" + res);
    //     if (res.data.head.errCode != 1000) {
    //       wx.showToast({
    //         title: res.data.body.errMsg,
    //         icon: 'success',
    //         duration: 2000
    //       })
    //     } else {
    //       var datas = res.data.body;
    //       // for (var i=0; i<datas.length; i++) {
    //       //   if(datas[i].cover==null||datas[i].cover==""){
    //       //     datas[i].cover="../../images/icon_default_youhui.png"
    //       //   }
    //       //   if(projectType == "0"){
    //       //     // 分类项目列表
    //       //     datas[i].projectTypeName = "办卡";
    //       //   } else if(projectType == "1"){
    //       //     // 热门推荐
    //       //     datas[i].projectTypeName = "活动";
    //       //   }
    //       // }
    //       that.setData({
    //         list: datas,
    //         shopName: options.shopName,
    //         companyName: options.companyName,
    //         shopCover: options.shopCover
    //       })
    //     }
    //   },
    //   fail: function () {
    //     // fail
    //   },
    //   complete: function () {
    //     // complete
    //   }
    // })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})