// pages/projectDetail/projectDetail.js
var con = require('../../utils/constant.js');
var netUtil = require('../../utils/netUtil.js');
var bespeakUtil = require('../../utils/bespeakUtil.js');
var code = '';
var user = {};
var isXianshiyouhui;

Page({
  data:{
    detailData:{},
    allHeight:0,
    timeHidden:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    code = options.id;
  },
  onReady:function(){
    // 页面渲染完成
    user = con.getUserInfo();
    var that = this;
    getProjectDetail(user,that,code);
    wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData({
          allHeight:res.windowHeight
        })
      }
    })
   
  },
  makeOrder:function(){
    var thats = this;
    if(this.data.detailData!=null){
        addOrder(thats,user,this.data.detailData);
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
  }
})
/**
 * 获取详情
 */
function getProjectDetail(user,that,code) {
  var detailParam = {"code":code,"cardMetaType":2};
  netUtil.netUtil(con.PROJECT_DETAIL,detailParam,function(res){
    if(res.code==1){
        var detailDatas = res.data;
        detailDatas.timeNow = bespeakUtil.getFormatDateTime(detailDatas.endDate);
          if(detailDatas.cover==null||detailDatas.cover==""){        detailDatas.cover='../../images/icon_default_youhui.png'
            }
            if('XIANSHIYOUHUI'==detailDatas.courseCardType){
              isXianshiyouhui=true;
              that.setData({
                timeHidden:false
              })
              detailDatas.marketPrice= detailDatas.price*0.01;
                  if(detailDatas.gender == 2) {
                    detailDatas.fanwei="(仅限女嘉宾使用)";
            } else if(detailDatas.gender == 1){
              detailDatas.fanwei="(仅限男嘉宾使用)";
            } else {
              detailDatas.fanwei="(全部通用)";
            }
            }else{
              isXianshiyouhui=false;
              detailDatas.marketPrice= detailDatas.price*0.01*detailDatas.times;
               that.setData({
                timeHidden:true
              })
               detailDatas.fanwei="";
            }



          that.setData({
            detailData:detailDatas
          })
    }
  });
  
}


function addOrder(that,user,order){
  var addOrderParam = {"items":[{"goodsCategoryCode":order.categoryCode,"goodsCode":order.code,"goodsMetaType":"COURSE","isGift":"0","quantity":"1"}],"cashierPartyType":"SYSTEM","businessSubjectCode":"BS1001","consumerPartyType":"CUSTOMER_PROFILE","currencyCode":"RMB","providerPartyCode":user.defaultShopCode,"consumerPartyCode":user.defaultCustomerProfileCode,"serviceOfferType":"1","providerPartyType":"SHOP","cashierPartyCode":user.defaultShopCode};
  netUtil.netUtil(con.ADD_ORDER,addOrderParam,function(res){
    if(res.code==1){
        var orderInfo = res.data;
            console.log(that.data.times+"----")
         if(orderInfo!=null){
              wx.navigateTo({
                  url: '../../pages/makeOrder/makeOrder?order='+con.Encrypt(JSON.stringify(res.data))+'&count='+that.data.detailData.times+'&isXianshi='+isXianshiyouhui
          })
    }
    }
  });
 
}