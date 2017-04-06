// pages/index/index.js
var con = require('../../utils/constant.js');
var netUtil = require('../../utils/netUtil.js');
//获取应用实例
var app = getApp()
var cuToken;
var arrays = new Array();
var companyCode;
var isXianshiyouhui;
Page({
  data:{
        array:[],
        courseList:[],
        courseShowList:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log("indexonLoad")
    if(con.getUserInfo()!=undefined){
      cuToken=con.getUserInfo().currentToken;
      companyCode = con.getUserInfo().defaultCompanyCode;
    }
      

  },
  onReady:function(){
    // 页面渲染完成
    console.log("indexonReady")
    
     var that = this;
     if(con.getUserInfo()!=undefined){
             getCategry(that);
             getCourseCardList(that);
     }
     
    // goLogin(that);
  },
  onShow:function(){
    
   
   console.log("indexonShow")
   if(con.getUserInfo()==undefined){
          wx.redirectTo({
        url: '../../pages/login/login'
      })
     } else {
        var shopCode = con.getUserInfo().defaultShopCode;
    if (shopCode == null || shopCode.length == 0){
       var that = this;
       that.setData({
          array:[],
           courseList:[],
        courseShowList:[],
        })
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

       var that = this;
      if((con.getUserInfo()!=undefined&&cuToken!=con.getUserInfo().currentToken)||(con.getUserInfo()!=undefined&&companyCode!=con.getUserInfo().defaultCompanyCode)){
        arrays = [];
       this.setData({
          array:arrays,
           courseList:[],
        courseShowList:[]
        })
            cuToken=con.getUserInfo().currentToken;
            companyCode = con.getUserInfo().defaultCompanyCode;
              getCategry(that);
              getCourseCardList(that);
      }
     }
    
  },
  onHide:function(){
    // 页面隐藏
    console.log("indexonHide")
  },
  onUnload:function(){
    // 页面关闭
    console.log("indexonUnload")
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    // refresh
    var that = this;
    getCategry(that);
    getCourseCardList(that);
  },
  lookmore:function(){
    wx.navigateTo({
      url: '../../pages/projectList/projectList?projectType=1'
    })
  }
})

/**
 * 获取首页分类列表
 */
function getCategry(that) {
  var categryParam = {
    "status":["NORMAL","COLLECTED","USED"],"belongToPartyCode":companyCode,"belongToPartyType":"CUSTOMER_PROFILE"};
 netUtil.netUtil(con.CATEGORY,categryParam,function(res){
   if(res.code==1){
arrays.length=0;
          console.log(res.data);
          var data = res.data;
           console.log(data.length+"==");
           let childArray = new Array();
          for(let index=0;index<Math.ceil(data.length);index++){
            childArray.push(data[index]);
            if(childArray.length==8){
              arrays.push(childArray);
              childArray = new Array();
            }
            
          }
          if (0 != childArray.length) {
                 arrays.push(childArray);
        }
        that.setData({
          array:arrays
        })
   }
   
 });
}

/**
 * 获取首页限时优惠列表
 */
function getCourseCardList(that) {
  var listParams = {
    "categoryStatus":["NORMAL"],"belongToPartyType":"COMPANY",
    "status":["IN_DELIVERING"],"categoryCode":"",
    "pageSize":10,"courseCardType":"XIANSHIYOUHUI","apiType":"COURSE_TYPE",
    "synClient":true,
    "page":1,
    "belongToPartyCode":companyCode};
  netUtil.netUtil(con.COUSECARD_LIST,listParams,function(res){
    wx.stopPullDownRefresh();
    if(res.code==1){
        console.log(res.data);
          var datas = res.data;
          for(let inw=0;inw<datas.length;inw++){
            if(datas[inw].cover==null||datas[inw].cover==""){
              datas[inw].cover='../../images/icon_default_youhui.png'
            }
          }
            var data3 = datas.slice(0,3);
          that.setData({
            courseShowList:data3
          })
          that.setData({
            courseList:datas
          })
    }
  });
}

/**
 * 登录
 */
// function goLogin(that){
//   console.log('dddddddddddddddddddd');
//   var loginparams = {"isNotAuto":1,"password":"123456","mobile":"13269532539"};
//   netUtil.netUtil(con.LOGIN_URL,loginparams,function(res,netCode){
//     console.log(res.userName+"hahahahaha====="+netCode)
//   })
// }
// function goLogin(that) {
//     console.log('dddddddddddddddddddd');
//   wx.request({
//       url: con.LOGIN_URL,
//       data: {
//        "body":{"isNotAuto":1,"password":"123456","mobile":"15210533960"},"head":{"digest":"2017-01-10T13:24:17.620+0800","operatorType":"CUSTOMER_LOGIN","operatorLevel":"CUSTOMER","appVersion":8,"appType":"ANDROID_Client_PHONE"}
//       },
//       method: 'POST', 
//       dataType:'json',
//       header: {
        
//       }, // 设置请求的 header
//       success: function(res){
//          console.log('fffffffffff');
//         console.log(res.data.head.errCode);
//         if(res.data.head.errCode!=1000){
//             wx.showToast({
//               title: res.data.body.errMsg,
//               icon: 'success',
//               duration: 2000
//             })
//         }else{
//           var loginInfro = res;
//           console.log(res.data);
//           wx.setStorage({
//             key: 'userInfo',
//             data: res.data.body,
//             success: function(res){
//               // success
//               // cuToken=loginInfro.data.body.currentToken;
//              getCategry(that);
//              getCourseCardList(that);
//             },
//             fail: function() {
//               // fail
//                console.log('llllllllllllllllll');
//             },
//             complete: function() {
//               // complete
//                console.log('22222222222222');
//             }
//           })
//         }
//       },
//       fail: function(e) {
//         // fail
//           console.log('333333333333333'+e.errMsg);
//       },
//       complete: function() {
//         // complete
//          console.log('4444444444444444444');
//       }
//     })
// }
