// pages/myself/appointmentList/appointmentList.js
var con = require('../../../utils/constant.js');
var bespeakUtil = require('../../../utils/bespeakUtil.js');
var netUtil = require('../../../utils/netUtil.js');
Page({
  data:{
    scrollH: 0,
    progressColor: '#b39851',
    complateColor: '#000000',
    complateHidden: true,
    requestTypeList: ["S_INIT", "S_IN_SERVICE", "S_WAIT_SERVICE", "S_CONFIRMED"],
    page: 1,
    pageSize: 20,
    shouleRefresh: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // success
        var scrH = res.windowHeight - 40;
        that.setData({
          scrollH: scrH
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
    this.getAppointmentList();
  },
  onShow:function(){
    // 页面显示
    if(this.data.shouleRefresh == true) {
      this.setData({
        shouleRefresh: false,
        page: 1
      })
      this.getAppointmentList();
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    // refresh
    console.log("eeeee");
    this.setData({
      page: 1
    });
    this.getAppointmentList();
  },
  onReachBottom: function() {
    // loadMore
    console.log("dddddd");
    var that = this;
    this.setData({
      page: that.data.page + 1
    });
    this.getAppointmentList();
  },
  // 进行点击
  progressTap: function(e){
    this.setData({
      progressColor: '#b39851',
      complateColor: '#000000',
      complateHidden: true,
      requestTypeList: ["S_INIT", "S_IN_SERVICE", "S_WAIT_SERVICE", "S_CONFIRMED"],
      page: 1
    })
    this.getAppointmentList();
  },
  // 已结束点击
  complateTap: function(e){
    this.setData({
      progressColor: '#000000',
      complateColor: '#b39851',
      complateHidden: false,
      requestTypeList: ["S_END_SERVICE", "S_LOG_COMPLETED", "S_CANCELED"],
      page: 1
    }) 
    this.getAppointmentList();
  },
  getAppointmentList: function(){
    var userInfo = con.getUserInfo();
    var that = this;
    netUtil.netUtil(con.APPOINT_LIST,{"customerProfileCode":userInfo.defaultCustomerProfileCode,"status":that.data.requestTypeList,"page":that.data.page,"pageSize":that.data.pageSize},function callBack(res){
      wx.stopPullDownRefresh();
      if (res.code == 1) {
        var datas = res.data;
        for (var i=0; i<datas.length; i++) {
            datas[i].timeNow = bespeakUtil.getFormatDateTime(datas[i].startDate);
            if(datas[i].status == "S_CANCELED") {
              datas[i].complateString = "已取消";
            } else {
              datas[i].complateString = "已完成";
            }
            if(datas[i].status == "S_INIT" || datas[i].status == "S_CONFIRMED"){
              datas[i].isHiddenCancle = false;
            } else {
              datas[i].isHiddenCancle = true;
            }
            console.log(datas[i]);
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
