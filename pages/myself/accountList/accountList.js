// pages/myself/accountList/accountList.js
// import bespeakUtil from "../../../utils/bespeakUtil.js";
var con = require('../../../utils/constant.js');
var bespeakUtil = require('../../../utils/bespeakUtil.js');
var netUtil = require('../../../utils/netUtil.js');
Page({
  data:{
    list: [],
    page: 1,
    pageSize: 20,
    scrollH: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData({
          scrollH: res.windowHeight
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
    this.getAccountList();
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
  onPullDownRefresh: function() {
    // Do something when pull down.
    // refresh
    this.setData({
      page: 1
    });
    this.getAccountList();
  },
  onReachBottom: function() {
    // loadMore
    var that = this;
    this.setData({
      page: that.data.page + 1
    });
    this.getAccountList();
  },
  getAccountList: function(){
    // 获取数据
    var userInfo = con.getUserInfo();
    var that = this;
    netUtil.netUtil(con.ACCOUNT_LIST,{"payStatus":["PAYED"],"consumerPartyType":"CUSTOMER_PROFILE","consumerPartyCode":userInfo.defaultCustomerProfileCode,"pageSize":that.data.pageSize,"page":that.data.page},function callBack(res){
      wx.stopPullDownRefresh();
      if (res.code == 1) {
        var datas = res.data;
        for (var i=0; i<datas.length; i++) {
          datas[i].timeNow = bespeakUtil.getFormatDateTime(datas[i].createdAt);
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
  },
})