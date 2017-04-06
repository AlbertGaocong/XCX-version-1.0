// pages/myself/myself.js
var con = require('../../utils/constant.js');
import netUtil from '../../utils/netUtil.js';
var shopData;
var shopCode;
Page({
  data: {
    userInfo: {},
    bindInfo:con.getUserInfo(),
    configArray: [{
      name: '我的余额',
      tempID:0
    }, {
      name: '我的优惠券',
      tempID:1
    }],
    noBindMenuList:[{
      name: '我的二维码',
      cssName: "menu-item",
      iconUrl: "../../images/icon_meQRCode.png",
      url: 'qrCode/qrCode',
      opened: false,
    }],
    menuList: [
    //   {
    //   name: '健康',
    //   cssName: "menu-item menu-item-group-first",
    //   iconUrl: "../../images/project_banner.png",
    //   url: 'healthyList/healthyList',
    //   opened: false
    // }, 
    {
      name: '我的二维码',
      cssName: "menu-item menu-item-group-first",
      iconUrl: "../../images/icon_meQRCode.png",
      url: 'qrCode/qrCode',
      opened: false,
    }, {
      name: '疗程卡',
      cssName: "menu-item menu-item-group-first",
      iconUrl: "../../images/icon_personalCenterReatmentCard.png",
      url: 'courseCardList/courseCardList',
      opened: false
    }, {
      name: '账户记录',
      cssName: "menu-item",
      iconUrl: "../../images/icon_personalCenterAccountRecords.png",
      opened: false,
      url: 'accountList/accountList'
    }, {
      name: '我的预约',
      cssName: "menu-item menu-item-group-first",
      iconUrl: "../../images/icon_personalCenterAppointment.png",
      url: 'appointmentList/appointmentList',
      opened: false,
    }, {
      name: '划卡记录',
      cssName: "menu-item",
      iconUrl: "../../images/icon_personalCenterStampCardRecords.png",
      opened: false,
      url: 'consumeCard/consumeCard',
    }]
  },
  tapMenuItem: function (e) {
    var menuItem;
    var bindCode = this.data.bindInfo.defaultCompanyCode;
    if (bindCode == null || bindCode == "") {
      menuItem = this.data.noBindMenuList[parseInt(e.currentTarget.id)]
    } else {
      menuItem = this.data.menuList[parseInt(e.currentTarget.id)]
    }
    console.log(parseInt(e.currentTarget.id));
    if (menuItem.url) {
      wx.navigateTo({ url: menuItem.url })
    } else {
      var changeData = {}
      var opened = menuItem.opened
      var index = parseInt(e.currentTarget.id)

      // 展开操作
      if (opened === false) {
        var openedIndex = -1
        this.data.menuList.forEach(function (menu, i) {
          if (menu.opened === true) {
            openedIndex = i
          }
        })
        if (openedIndex > -1) {
          changeData['menuList[' + openedIndex + '].opened'] = false
        }
      }

      changeData['menuList[' + index + '].opened'] = !opened
      this.setData(changeData)
    }
  },
  couponList: function (e) {
    // if (e.currentTarget.id == 1) {
    //   wx.navigateTo({ url: "couponList/couponList" })
    // }
  },
  shopList:function(e){
    console.log('======zhudaweisdasjdkalsjd==========')
    console.log(shopData);
     if (con.getUserInfo().defaultShopCode == null || con.getUserInfo().defaultShopCode.length == 0){
        wx.showModal({
          title: '请关联美容院',
          content: '',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.switchTab({
                url:'../myself/myself'
              });
            }
        }
      })
        return;
     }
    if(shopData.shopCover==null || shopData.shopCover==''){
      shopData.shopCover= '../../images/icon_shop_default.png'
    }
    wx.navigateTo({url:"changeShopList/changeShopList?companyName="+shopData.companyName+"&shopName="+shopData.shopName+"&shopCover="+shopData.shopCover})
  },

  getUserInfo: function () {
    var infoCode = con.getUserInfo();
    var that = this;
    console.log(con.PERSONAL_INFO);
    netUtil.netUtil(con.PERSONAL_INFO,{ "loginAccountCode": infoCode.code },function callback(res){
      var datas = res.data;
          shopData = datas;
          if(datas.avatar==null||datas.avatar==""){
              datas.avatar='http://cdn-xcx.imeiyebang.com/xiaochengxu/images/07.png'
          }
          if(datas.userName==null){
              datas.userName="";
          }
          if(datas.shopName==null){
            datas.shopName="";
          }
          that.setData({
            userInfo: datas
          })
    })
    // wx.request({
    //   url: con.PERSONAL_INFO,
    //   data: {
    //     "body": { "loginAccountCode": infoCode.code }, "head": { "digest": "2017-01-12T17:24:16.858+0800", "operatorType": "CUSTOMER_LOGIN", "operator": infoCode.code, "operatorLevel": "CUSTOMER", "appVersion": 8, "appType": "ANDROID_Client_PHONE", "token": infoCode.currentToken }
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function (res) {
    //     // success
    //     if (res.data.head.errCode != 1000) {
    //       wx.showToast({
    //         title: res.data.body.errMsg,
    //         icon: 'success',
    //         duration: 2000
    //       })
    //     } else {
    //       var datas = res.data.body;
    //       shopData = datas;
    //       if(datas.avatar==null||datas.avatar==""){
    //           datas.avatar='http://cdn-xcx.imeiyebang.com/xiaochengxu/images/07.png'
    //       }
    //       if(datas.userName==null){
    //           datas.userName="";
    //       }
    //       if(datas.shopName==null){
    //         datas.shopName="";
    //       }
    //       that.setData({
    //         userInfo: datas
    //       })
    //     };
    //   },
    //   fail: function () {
    //     // fail
    //   },
    //   complete: function () {
    //     // complete
    //   }
    // })

  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // var infoCode = con.getUserInfo();
    shopCode = con.getUserInfo().defaultCompanyCode;
    this.getUserInfo();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.setData({
      bindInfo:con.getUserInfo()
    })
    if(con.getUserInfo()==undefined||con.getUserInfo()==''){
         wx.redirectTo({
        url: '../../pages/login/login'
      })
    }else{
this.getUserInfo();
    shopCode = con.getUserInfo().defaultCompanyCode;
    }
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  setting:function(){
      wx.navigateTo({
      url: '../../pages/myself/setting/setting'
    })
  }
})