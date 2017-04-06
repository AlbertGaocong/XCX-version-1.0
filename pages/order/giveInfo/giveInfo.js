// pages/order/giveInfo/giveInfo.js
var con = require('../../../utils/constant.js');
var netUtil = require('../../../utils/netUtil.js');
Page({
  data:{
    scrollH: 0,
    textAreaH: 0,
    bottomH: 0,
    list: [],
    giveInfoText: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData({
          scrollH: res.windowHeight * 0.6,
          textAreaH: res.windowHeight *  0.25,
          bottomH: res.windowHeight * 0.1
        })
      }
    })
    that.getGiveInfoList();
  },
  onReady:function(){
    // 页面渲染完成
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
  // 完成按钮点击
  complateButtonClick: function(){
    var that = this;
     var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        console.log(that.data.giveInfoText);
        prevPage.setComments(that.data.giveInfoText)
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  }
  ,
  bindinput: function(e){
    this.setData({
      giveInfoText: e.detail.value
    })
  }
  ,
  giveInfoTap: function(e){
    // parseInt
    var index = e.currentTarget.id;
    console.log(e);
    var textNow = this.data.giveInfoText + this.data.list[index].content;
    console.log(textNow);
    this.setData({
      giveInfoText: textNow
    })
  }
  ,
  getGiveInfoList: function(){
    var that = this;
    var userInfo = con.getUserInfo(); 
    netUtil.netUtil(con.GIVEINFO_LIST,{"articleTypeCode":"ARTICLETYPE299912310000003"}, function callBack(res){
       if(res.code == 1) {
          var datas = res.data;
          that.setData({
            list:datas
          })
       }
    })
    // wx.request({
    //   url: con.GIVEINFO_LIST,
    //   data: {
    //     "body":{"articleTypeCode":"ARTICLETYPE299912310000003"},"head":{"digest":"2017-01-10T16:07:52.444+0800","operatorType":"CUSTOMER_LOGIN","operator":"LOGINACCOUNT201608171645010272203","operatorLevel":"CUSTOMER","appVersion":8,"appType":"ANDROID_Client_PHONE","token":userInfo.currentToken}
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function(res){
    //     // success
    //     console.log("++++++" + res);
    //     if(res.data.head.errCode!=1000){
    //         wx.showToast({
    //           title: res.data.body.errMsg,
    //           icon: 'success',
    //           duration: 2000
    //         })
    //     } else {
    //       var datas = res.data.body;
    //       that.setData({
    //         list:datas
    //       })
    //     }
    //   },
    //   fail: function() {
    //     // fail
    //   },
    //   complete: function() {
    //     // complete
    //   }
    // })
  }
})