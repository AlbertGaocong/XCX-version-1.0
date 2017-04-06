// pages/myself/appointmentDetail/appointmentDetail.js
var con = require('../../../utils/constant.js');
var bespeakUtil = require('../../../utils/bespeakUtil.js');
var netUtil = require('../../../utils/netUtil.js');
Page({
  data:{
    appointCode: "",
    isHiddenCancle: false,
    dataModel: {},
    imageData: ["http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png", "http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png","http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png","http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png","http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png"]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var hidden = false;
    if(options.isHiddenCancle == "false"){
      hidden = false;
    }  else if(options.isHiddenCancle == "true"){
      hidden = true;
    }
    this.setData({
      appointCode: options.appointCode,
      isHiddenCancle: hidden
    })
    this.getAppointDetail();
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
  getAppointDetail: function(){
    var userInfo = con.getUserInfo();
    var that = this;
    netUtil.netUtil(con.APPOINT_DETAIL,{"code":that.data.appointCode},function callBack(res){
      if (res.code == 1) {
        var data = res.data;
        console.log(data);
        if(data.cover==null||data.cover==""){
          data.cover="http://cdn-xcx.imeiyebang.com/xiaochengxu/images/07.png"
          }
        var timeDateString = bespeakUtil.getFormatDateTime(data.startDate);
        var timeDate = bespeakUtil.getTimeDate(timeDateString);
        var dayDif = bespeakUtil.getDayDifference(timeDate);
        if (dayDif == "") {
          data.time = timeDateString.substring(0,17);
        } else {
          data.time = dayDif + timeDateString.substring(12,17);
        }
        that.data.imageData =  ["http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png", "http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png","http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png","http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png","http://cdn-xcx.imeiyebang.com/xiaochengxu/images/EmptyHeart.png"];
        var starNum = Math.round(parseFloat(data.averageRank));
        console.log(starNum);
        for (var i=0; i<starNum; i++) {
          that.data.imageData[i] = "http://cdn-xcx.imeiyebang.com/xiaochengxu/images/SolidHeart.png";
        }
        that.setData({
          dataModel:data,
          imageData: that.data.imageData
        })
      } else {
        // false
      }
    });
  },
  cancleAppoint: function(e){
    var userInfo = con.getUserInfo();
    var that = this;
    netUtil.netUtil(con.APPOINT_CANCLE, {"act":"CANCEL","code":that.data.dataModel.code},function callBack(res){
      if (res.code == 1) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          shouleRefresh: true
        });
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      } else {
        // false
      }
    });
  }
})