// pages/projectList/projectList.js
//如果用到登录相关信息，用wx.getstorage 取相关数据
var con = require('../../utils/constant.js'); 
var netUtil = require('../../utils/netUtil.js');
var projectType = "0"; // “0”是项目 “1”是推荐
var titleNav = "";
Page({
  data:{
    list:[],
    page: 1,
    size: 20,
    hasMore:true,
    hasRefesh:false,
    dataProjectType: "",
    catagotyCode: "",
    scrollH: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = con.getUserInfo();
    var that = this;
    // 这里需要传参
    projectType = options.projectType;
    this.setData({
      dataProjectType: projectType,
      catagotyCode: options.catagotyCode
    })
    if (projectType == "0") {
      titleNav = options.categary + "·全部";
    } else if (projectType == "1") {
      titleNav = "限时优惠";
    }
    wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData ({
          scrollH: res.windowHeight
        })
      }
    })
    wx.setNavigationBarTitle({
      title: titleNav,
      success: function(res) {
        // success
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
    if (projectType == "0") {
      this.getProjectList();
    } else if (projectType == "1") {
      this.getProjectHotList();
    }
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
    console.log("eeeee");
    this.refesh();
  },
  onReachBottom: function() {
    // loadMore
    console.log("dddddd");
    this.loadMore();
  },
  getProjectList:function(){
    var userInfo = con.getUserInfo();
    var that = this;
    netUtil.netUtil(con.COUSECARD_LIST,{"categoryStatus":"NORMAL","belongToPartyType":"COMPANY","status":["IN_DELIVERING"],"categoryCode":that.data.catagotyCode,"pageSize":that.data.size,"twoLevType":["CIKA"],"courseCardType":"LIAOCHENGKA","apiType":"TWO_LEV","synClient":"1","page":that.data.page,"belongToPartyCode":userInfo.defaultCompanyCode}
      ,function(res){
        wx.stopPullDownRefresh();
        if (res.code == 1) {
          console.log("++++++" + res);
          var datas = res.data;
          for (var i=0; i<datas.length; i++) {
            if(datas[i].cover==null||datas[i].cover==""){
              datas[i].cover="http://cdn-xcx.imeiyebang.com/xiaochengxu/images/icon_default_youhui.png"
            }
            // 分类项目列表
            datas[i].projectTypeName = "办卡";
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
  getProjectHotList:function(){
    var userInfo = con.getUserInfo();
    var that = this;
    netUtil.netUtil(con.COUSECARD_LIST,{"apiType":"COURSE_TYPE","belongToPartyType":"COMPANY","status":["IN_DELIVERING"],"pageSize":that.data.size,"twoLevType":["CIKA"],"courseCardType":"XIANSHIYOUHUI","synClient":"1","page":that.data.page,"belongToPartyCode":userInfo.defaultCompanyCode}
      ,function (res){
        wx.stopPullDownRefresh();
        if(res.code == 1) {
          var datas = res.data;
          for (var i=0; i<datas.length; i++) {
            if(datas[i].cover==null||datas[i].cover==""){
              datas[i].cover="http://cdn-xcx.imeiyebang.com/xiaochengxu/images/icon_default_youhui.png"
            }
            // 分类项目列表
            datas[i].projectTypeName = "活动";
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
  loadMore: function(){
    var that = this;
    this.setData({
      page: that.data.page + 1
    })
    if (projectType == "0") {
      this.getProjectList();
    } else if (projectType == "1") {
      this.getProjectHotList();
    }
  },
  refesh: function() {
    this.setData({
      page: 1
    })
    if (projectType == "0") {
      this.getProjectList();
    } else if (projectType == "1") {
      this.getProjectHotList();
    }
  }
})