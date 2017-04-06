// pages/myself/chooseShop/chooseShop.js
var con = require('../../../utils/constant.js');
var netUtil = require('../../../utils/netUtil.js');
Page({
  data: {
    list: [],
    companyCode: '',
    customerProfileCode: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.data.companyCode = options.id;
    // this.data.customerProfileCode = options.id.customerProfileCode;
    // console.log("9999999"+code);
    var that = this;
    var userInfo = con.getUserInfo();
    netUtil.netUtil(con.SHOP_LIST,{ "companyCode": this.data.companyCode, "status": ["NORMAL"] },function callback(res){
      if(res.code==1){
         var datas = res.data;
          that.setData({
            list: datas,
            companyCode: options.id,
            customerProfileCode: options.defaultCode
          })
      }
    })
    // wx.request({
    //   url: con.SHOP_LIST,
    //   data: {
    //     "body": { "companyCode": this.data.companyCode, "status": ["NORMAL"] }, "head": { "digest": "2017-01-10T16:07:52.444+0800", "operatorType": "CUSTOMER_LOGIN", "operator": "LOGINACCOUNT201608171645010272203", "operatorLevel": "CUSTOMER", "appVersion": 8, "appType": "ANDROID_Client_PHONE", "token": userInfo.currentToken }
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
    //       that.setData({
    //         list: datas,
    //         companyCode: options.id,
    //         customerProfileCode: options.defaultCode
    //       })
    //     }
    //   }
    // })
  },
  saveInfo: function (e) {
    var that = this;
    var index = e.currentTarget.id;
    var customerCode = that.data.customerProfileCode;
    var companyCode = that.data.companyCode;
    var shopCode = that.data.list[index].code;

    var info = con.getUserInfo();

    ///////调取接口保存当前店和院院///////
    netUtil.netUtil(con.SHOP_SURE,{ "companyCode": companyCode, "customerProfileCode": info.defaultCustomerProfileCode, "loginAccountCode": info.code, "shopCode": shopCode },function callback(res){
      if(res.code==1){
      info.defaultShopCode = shopCode;
          info.defaultCompanyCode = companyCode;
          info.defaultCustomerProfileCode = customerCode;
            console.log(index, res.data);
          wx.setStorage({
            key: 'userInfo',
            data: info,
            success: function () {
              // success
              // cuToken = loginInfro.data.body.currentToken;
              // getCategry(that);
              // getCourseCardList(that);
            },
            fail: function () {
              // fail
              console.log('llllllllllllllllll');
            },
            complete: function () {
              // complete
              console.log('22222222222222');
            }
          })



          wx.navigateBack({
            delta: 2, // 回退前 delta(默认为1) 页面
            success: function (res) {

            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
          }
    })
    // wx.request({
    //   url: con.SHOP_SURE,
    //   data: {
    //     "body": { "companyCode": companyCode, "customerProfileCode": info.defaultCustomerProfileCode, "loginAccountCode": info.code, "shopCode": shopCode }, "head": { "digest": "2017-01-10T16:07:52.444+0800", "operatorType": "CUSTOMER_LOGIN", "operator": "LOGINACCOUNT201608171645010272203", "operatorLevel": "CUSTOMER", "appVersion": 8, "appType": "ANDROID_Client_PHONE", "token": info.currentToken }
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
    //       info.defaultShopCode = shopCode;
    //       info.defaultCompanyCode = companyCode;
    //       info.defaultCustomerProfileCode = customerCode;
    //         console.log(index, res.data.body);
    //       wx.setStorage({
    //         key: 'userInfo',
    //         data: info,
    //         success: function () {
    //           // success
    //           // cuToken = loginInfro.data.body.currentToken;
    //           // getCategry(that);
    //           // getCourseCardList(that);
    //         },
    //         fail: function () {
    //           // fail
    //           console.log('llllllllllllllllll');
    //         },
    //         complete: function () {
    //           // complete
    //           console.log('22222222222222');
    //         }
    //       })



    //       wx.navigateBack({
    //         delta: 2, // 回退前 delta(默认为1) 页面
    //         success: function (res) {

    //         },
    //         fail: function () {
    //           // fail
    //         },
    //         complete: function () {
    //           // complete
    //         }
    //       })
    //     }
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