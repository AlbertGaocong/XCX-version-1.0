// pages/myself/consumeCard/consumeCard.js
var con = require('../../../utils/constant.js');
var bespeakUtil = require('../../../utils/bespeakUtil.js');
var netUtil = require('../../../utils/netUtil.js');
Page({
  data:{
    list:[],
    page:1,
    size:10
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // wx.request({
    //   url: con.COURSECARD_LOG,
    //   data: {
    //     "body":{"apiType":"BY_CUSTOM","objCourseCardCode":"","status":["NORMAL","CANCELED"],"page":that.data.page,"pageSize":that.data.size,"customCode":userInfo.defaultCustomerProfileCode,"operateTypes":"CONSUME_CARD","shopCode":userInfo.shopCode},"head":{"digest":"2017-01-10T16:07:52.444+0800","operatorType":"CUSTOMER_LOGIN","operator":"LOGINACCOUNT201608171645010272203","operatorLevel":"CUSTOMER","appVersion":8,"appType":"ANDROID_Client_PHONE","token":userInfo.currentToken}
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   dataType:'json',
    //   // header: {}, // 设置请求的 header
    //   success: function(res){
    //     // success
    //     // console.log(res);
    //     console.log("++++++" + res);
    //     if(res.data.head.errCode!=1000){
    //         wx.showToast({
    //           title: res.data.body.errMsg,
    //           icon: 'success',
    //           duration: 2000
    //         })
    //     } else {

    //       var datas = res.data.body;
    //       for (var i=0; i<datas.length; i++) {
    //         datas[i].timeNow = bespeakUtil.getFormatDateTime(datas[i].useDate);
    //       }
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
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    // refresh
    this.setData({
      page: 1
    });
    this.getConsumeCardList();
  },
  onReachBottom: function() {
    // loadMore
    var that = this;
    this.setData({
      page: that.data.page + 1
    });
    this.getConsumeCardList();
  },
  onReady:function(){
    // 页面渲染完成
    this.getConsumeCardList();
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
  getConsumeCardList: function(){
    var userInfo = con.getUserInfo();
    var that = this;
    netUtil.netUtil(con.COURSECARD_LOG, {"apiType":"BY_CUSTOM","objCourseCardCode":"","status":["NORMAL","CANCELED"],"page":that.data.page,"pageSize":that.data.size,"customCode":userInfo.defaultCustomerProfileCode,"operateTypes":"CONSUME_CARD","shopCode":userInfo.shopCode}, function callBack(res){
      wx.stopPullDownRefresh();
      if(res.code == 1) {
          var datas = res.data;
          for (var i=0; i<datas.length; i++) {
            datas[i].timeNow = bespeakUtil.getFormatDateTime(datas[i].useDate);
          }
          var concatList = datas;
          if (that.data.page > 1) {
            concatList = that.data.list.concat(datas);
          }
          that.setData({
            list:concatList
          })
      } else {
          var nowPage = (that.data.page - 1) <= 0 ? 1 : that.data.page - 1;
          that.setData({
            page: nowPage
          })
      }
    });
  }
})