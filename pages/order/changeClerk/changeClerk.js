// pages/order/changeClerk/changeClerk.js
var con = require('../../../utils/constant.js');
var netUtil = require('../../../utils/netUtil.js');
var clerklist=[];
Page({
  data:{
    list:[],
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
    var that = this;
    this.getClerkList();
  },
  onShow:function(){
    // var that = this;
    // this.selectedClerk();
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
    console.log("eeeee");
    this.setData({
      page: 1
    });
    this.getClerkList();
  },
  onReachBottom: function() {
    // loadMore
    console.log("dddddd");
    var that = this;
    this.setData({
      page: that.data.page + 1
    });
    this.getClerkList();
  },
  selectClerk: function(e){
    let that = this;
    console.log(e);
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.renderClerkInfo(that.data.list[e.currentTarget.id]);
    wx.navigateBack({
      delta: 1
    })
  
  },
  getClerkList: function(){
    var that = this;
    netUtil.netUtil(con.CLERK_LIST, {"isFilter":1,"companyCode":"","shopCode":con.getUserInfo().defaultShopCode ,"status":["NORMAL"],"page":that.data.page,"clerkCode":"","pageSize":that.data.pageSize}, function callBack(res){
      wx.stopPullDownRefresh();
      if(res.code == 1) {
        var datas = res.data;
        for(var ins=0;ins<datas.length;ins++){
          if(datas[ins].avatar==null||datas[ins].avatar==''){
            datas[ins].avatar='http://cdn-xcx.imeiyebang.com/xiaochengxu/images/07.png'
          }
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