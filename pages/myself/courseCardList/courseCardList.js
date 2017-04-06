// pages/myself/courseCardList/courseCardList.js
var con = require('../../../utils/constant.js');
var bespeakUtil = require('../../../utils/bespeakUtil.js');
var netUtil = require('../../../utils/netUtil.js');

Page({
  data: {
    listArray: [],
    page: 1,
    size: 20
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    // refresh
    console.log("eeeee");
    this.setData({
      page: 1
    });
    this.getCourseCardList();
  },
  onReachBottom: function() {
    // loadMore
    console.log("dddddd");
    var that = this;
    this.setData({
      page: that.data.page + 1
    });
    this.getCourseCardList();
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
    this.getCourseCardList();
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //请求
  getCourseCardList: function () {
    var userInfo = con.getUserInfo();
    var that = this;
    console.log(con.OBJ_COUSECARD_LIST);
    netUtil.netUtil(con.OBJ_COUSECARD_LIST,{"twoLeType":["CIKA","SHIXIAOKA","TAOPARENT"],"belongToPartyType":"CUSTOMER_PROFILE","status":["NORMAL","LOCKED","COLLECTED"],"pageSize":that.data.size,"courseCardType":["LIAOCHENGKA","TAOKA"],"apiType":"BY_CUSTOMER_OF_TAOPARENT","page":that.data.page,"belongToPartyCode":userInfo.defaultCustomerProfileCode},function callBack(res){
      wx.stopPullDownRefresh();
      if (res.code == 1) {
        var datas = res.data;
        for (var i = 0; i < datas.length; i++) {
          if (datas[i].availableDate != null && datas[i].availableDate != "") {
            datas[i].availableDate = bespeakUtil.getFormatDateTime(datas[i].availableDate);
          }

          if (datas[i].expiredDate != null && datas[i].expiredDate != "") {
            datas[i].expiredDate = bespeakUtil.getFormatDateTime(datas[i].expiredDate);
          }

          if (datas[i].delayToDate != null && datas[i].delayToDate != "") {
            datas[i].delayToDate = bespeakUtil.getFormatDateTime(datas[i].delayToDate);
          }

          if (datas[i].lockStartDate != null && datas[i].lockStartDate != "") {
            datas[i].lockStartDate = bespeakUtil.getFormatDateTime(datas[i].lockStartDate);
          }

          if (datas[i].lockEndDate != null && datas[i].lockEndDate != "") {
            datas[i].lockEndDate = bespeakUtil.getFormatDateTime(datas[i].lockEndDate);
          }
//二级名称转换
          datas[i].thrLevType = bespeakUtil.getCardTypeName(datas[i].thrLevType);
        }
        var concatList = datas;
        if (that.data.page > 1) {
          concatList = that.data.listArray.concat(datas);
        }
        that.setData({
          listArray:concatList
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