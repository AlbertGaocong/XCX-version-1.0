// pages/chooseAppointmentProject/chooseAppointmentProject.js
var con = require('../../utils/constant.js');
var netUtil = require('../../utils/netUtil.js');
var user = {};
var selectedDatas;
Page({
  data:{
    myCardDatas:[],
    shopProjectDatas:[],
    isChooseMyCard:true,
    chooseCount:0,
    allHeight:0
  },
  onLoad:function(options){
    if(options.fromList!=null&&options.fromList!=''){
      selectedDatas = JSON.parse(options.fromList);
      for(let index=0;index<selectedDatas.length;index++){
        selectedDatas[index].courseDuration=selectedDatas[index].duration;
      }
    }
    
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
    var that = this;
    if(selectedDatas==null||selectedDatas==''){
        selectedDatas = new Array();
    }
    wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData({
          allHeight:res.windowHeight
        })
      }
    })
   
    user = con.getUserInfo();
    getShopProject(that);
    getMycardList(that);
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
  onfinishClick:function(){
    if(selectedDatas.length==0){
            wx.showToast({
        title: '还没有选择项目',
        icon: 'success',
        duration: 2000
      })
      return;
    }
     var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setDurationAndProjects(selectedDatas);
    wx.navigateBack({
      delta: 1
    })
  },
  chooseMycard:function(){
    if(!this.data.isChooseMyCard){
       this.setData({
          isChooseMyCard:!this.data.isChooseMyCard
       })
    }
  },
  chooseShop:function(){
     if(this.data.isChooseMyCard){
    this.setData({
          isChooseMyCard:!this.data.isChooseMyCard 
       }) 
    }
  },
  shopProjectClick:function(e){
    console.log(e)
    var param = e.currentTarget.id;
    var params = param.split("-");
    console.log(params[0]+"========"+ params[1])
    var indexs = params[0];
    var inds = params[1];
    if(selectedDatas.length>=3&&!this.data.shopProjectDatas[inds].subjects[indexs].isChoose){
        wx.showToast({
              title: '最多可以预约3个项目',
              icon: 'success',
              duration: 2000
            })
       
      }else{
        
         if(!this.data.shopProjectDatas[inds].subjects[indexs].isChoose){
           let choosedItem = this.data.shopProjectDatas[inds].subjects[indexs];
          //  var chooseBean = {};
          //  chooseBean.duration=choosedItem.courseDuration;
          //  chooseBean.code=choosedItem.code;
          //  chooseBean.objName=choosedItem.objName;
           choosedItem.type=2;
        selectedDatas.push(choosedItem);
      }else{
        for(let ins=0;ins<selectedDatas.length;ins++)         {   
            if(selectedDatas[ins].code==this.data.shopProjectDatas[inds].subjects[indexs].code){
                selectedDatas.splice(ins,ins+1);
            }

          }
      }
      this.data.shopProjectDatas[inds].subjects[indexs].isChoose=!this.data.shopProjectDatas[inds].subjects[indexs].isChoose;
        this.setData({
          shopProjectDatas:this.data.shopProjectDatas
        })
      }
      console.log(selectedDatas.length);
      console.log(selectedDatas)
      this.setData({
        chooseCount:selectedDatas.length
      })
  }

  
  ,
  mycardClick:function(e){
    var ind = e.currentTarget.id; 
      if(selectedDatas.length>=3&&!this.data.myCardDatas[ind].isChoose){
        wx.showToast({
              title: '最多可以预约3个项目',
              icon: 'success',
              duration: 2000
            })
       
      }else{
        
         if(!this.data.myCardDatas[ind].isChoose){
          let choosedItem = this.data.myCardDatas[ind];
          //  var chooseBean = {};chooseBean.duration=choosedItem.courseDuration;
          //  chooseBean.code=choosedItem.code;
          //  chooseBean.objName=choosedItem.objName;
           choosedItem.type=1;
        selectedDatas.push(choosedItem);
      }else{
        for(let ins=0;ins<selectedDatas.length;ins++)         {   
            if(selectedDatas[ins].code==this.data.myCardDatas[ind].code){
                selectedDatas.splice(ins,ins+1);
            }

          }
      }
      this.data.myCardDatas[ind].isChoose=!this.data.myCardDatas[ind].isChoose;
        this.setData({
          myCardDatas:this.data.myCardDatas
        })
      }
      console.log(selectedDatas.length);
      console.log(selectedDatas)
       this.setData({
        chooseCount:selectedDatas.length
      })
  }
})

function getMycardList(that){
  var myCardListParam = {
    "twoLeType":["CIKA"],                     "belongToPartyType":"CUSTOMER_PROFILE","status":["NORMAL"],
    "pageSize":9999,
    "courseCardType":["LIAOCHENGKA"],"apiType":"BY_CUSTOMER_OF_TAOSUB",
    "page":1,"belongToPartyCode":user.defaultCustomerProfileCode};
  netUtil.netUtil(con.OBJ_COURSE_CARD_LIST,myCardListParam,function(res){
    if(res.code==1){
        var myDatas = res.data;
          for(let myin=0;myin<myDatas.length;myin++){
            for(let froin=0;froin<selectedDatas.length;froin++){
              if(myDatas[myin].code==selectedDatas[froin].code){
                myDatas[myin].isChoose=true;
              }
            }
          }
          
          that.setData({
            myCardDatas:myDatas,
            chooseCount:selectedDatas.length
          })
    }
  });
}

function getShopProject(that){
  var shopProjectListParam = {
    "categoryStatus":["NORMAL"],"belongToPartyType":"COMPANY",
    "status":["IN_DELIVERING"],"cardMetaType":2,
    "apiType":"TWO_LEV",
    "twoLevType":["CIKA"],"courseCardType":"LIAOCHENGKA",
    "page":"1","belongToPartyCode":user.defaultCompanyCode};
    netUtil.netUtil(con.COURSE_CARD_LIST,shopProjectListParam,function(res){
      if(res.code==1){
        var shopDatas = res.data;
             for(let ind=0;ind<shopDatas.length;ind++){
               for(let ins=0;ins<shopDatas[ind].subjects.length;ins++){
            for(let froin=0;froin<selectedDatas.length;froin++){
              if(shopDatas[ind].subjects[ins].code==selectedDatas[froin].code){
                shopDatas[ind].subjects[ins].isChoose=true;
              }
            }
          }
             }
          that.setData({
            shopProjectDatas:shopDatas,
            chooseCount:selectedDatas.length
          })
      }
    });
}

