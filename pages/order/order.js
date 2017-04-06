// pages/order/order.js
import timestampUtil  from  "../../utils/timestampUtil.js";
import con  from  '../../utils/constant.js';
import netUtil from '../../utils/netUtil.js';
let timeWeek;
let defaultShopCode = "";
var cuToken ;
console.log(con);
console.log(timestampUtil+"--------");
var app = getApp();
var step=30;//预约步长
Page({
  data:{
    time: [],
    openTime:{},
    projectTime:65,
    currentTime:null,
    clerkInfo: null,
    clerkList: [],
    sendOrderInfo: {
      startDate: null
    },
    // 存放店的开始营业时间和 结束营业时间串 
    shopOpenTime : [],
    defaultItemList:[],
    couseBean:null,
    selectedCrickSwiperShow: false,
    selectDateData:{
       dates:[
        //  {selected: true,date:"今天"},
         ]
    },
    comments: "",
    showSelectedProject: ""
  },
  setComments:function(dataText){
    this.setData({
        comments:dataText
    });
  },
  onLoad: function (options) {
    console.log('onLoad');
    this.onloadInit();
  },
  onShow:function(){
      if(con.getUserInfo()!=undefined){
          // 切店 或 重新登录 初始化
          if(defaultShopCode != con.getUserInfo().defaultShopCode||cuToken!=con.getUserInfo().currentToken){
              this.onloadInit();
          }
          // 未关联美容院提示
          if (    defaultShopCode == null 
               || defaultShopCode.length == 0){
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
        // return;
         }
      }else{
           wx.redirectTo({
              url: '../../pages/login/login'
           })
      }
     
       
     },

  // 加载初始化
  onloadInit: function(){
        let that = this;
        defaultShopCode = con.getUserInfo().defaultShopCode;
        cuToken=con.getUserInfo().currentToken;
         netUtil.netUtil(con.ORDER_DEFAULT,{"customerProlfileCode":con.getUserInfo().defaultCustomerProfileCode,"companyCode":con.getUserInfo().defaultCompanyCode,"shopCode":con.getUserInfo().defaultShopCode},function(res){
           console.log(res)
           if(res.code==1){
timeWeek = res.data.clerk.timeWeek;
              let shopOpenTime = [];
              let couseBean = res.data.couseBean;
              let defaultItemList = [];
                  defaultItemList.push(couseBean);
              shopOpenTime.push(res.data.clerk.startDate);
              shopOpenTime.push(res.data.clerk.endDate);
              that.renderClerkInfo(res.data.clerk);
              that.setData({
                  couseBean: couseBean,
                  defaultItemList : defaultItemList,
                  shopOpenTime:shopOpenTime
                });
                 // 设置展示项目   
              that.setShowSelectedProject(defaultItemList);  
              
              let useTimes = that.productUseTimes(0);
              // 渲染 天
              that.loadShowDay();
              // 渲染 时间格子
              that.loadShowTime(timestampUtil.getShortDate(),useTimes);
              // 设置默认项目
              // 不传参数 默认为this.data.defaultItemList
              that.setDurationAndProjects();
           }
         })
        // wx.request({
        //   url: con.ORDER_DEFAULT, data: { "body":{"customerProlfileCode":con.getUserInfo().defaultCustomerProfileCode,"companyCode":con.getUserInfo().defaultCompanyCode,"shopCode":con.getUserInfo().defaultShopCode},"head":{"digest":"2017-01-12T16:45:46.978+0800","operatorType":"CUSTOMER_LOGIN","operator":con.getUserInfo().code,"operatorLevel":"CUSTOMER ","appVersion":8,"appType":"ANDROID_Client_PHONE","token":con.getUserInfo().currentToken} }, 
        //   method: 'POST',
        //   dataType:'json', 
        //   success: function(res){   
        //     console.log("67776767----------------888888");  console.log(res);
        //     console.log(res.data.head.errCode); 
        //     if(res.data.head.errCode!=1000){
        //       wx.showToast({   
        //         title: res.data.body.errMsg, 
        //         icon: 'success',
        //         duration: 2000 }) 
        //     }else{
        //       timeWeek = res.data.body.clerk.timeWeek;
        //       let shopOpenTime = [];
        //       let couseBean = res.data.body.couseBean;
        //       let defaultItemList = [];
        //           defaultItemList.push(couseBean);
        //       shopOpenTime.push(res.data.body.clerk.startDate);
        //       shopOpenTime.push(res.data.body.clerk.endDate);
        //       that.renderClerkInfo(res.data.body.clerk);
        //       that.setData({
        //           couseBean: couseBean,
        //           defaultItemList : defaultItemList,
        //           shopOpenTime:shopOpenTime
        //         });
        //       // 设置展示项目   
        //       that.setShowSelectedProject(defaultItemList);  
              
        //       let useTimes = that.productUseTimes(0);
        //       // 渲染 天
        //       that.loadShowDay();
        //       // 渲染 时间格子
        //       that.loadShowTime(timestampUtil.getShortDate(),useTimes);
        //       // 设置默认项目
        //       // 不传参数 默认为this.data.defaultItemList
        //       that.setDurationAndProjects();

        //     }
        //   },
        //   fail: function() {
        //     // fail
        //     console.log("fail=======");
        //   },
        //   complete: function() {
        //     console.log("com------------");
        //     // complete
        //   }
        // });
  },
  // 展示一个美容师头像 名字 级别  入参 res.data.body.clerk
  renderClerkInfo: function(clerk){
     let  clerkInfo = {};
          clerkInfo.clerkCode = clerk.clerkCode;
          clerkInfo.averageRank1 = [];
          clerkInfo.averageRank0 = [];
          clerkInfo.crickName = clerk.objName;
          clerkInfo.averageRank1.length = Math.floor(clerk.averageRank) ;
          clerkInfo.averageRank0.length = (5-clerkInfo.averageRank1.length);
          // 头像不存在 则展示默认头像图片
          if(clerk.avatar == undefined || clerk.avatar =="" ){
            clerkInfo.avatarHave = false;
            clerkInfo.avatarNo = true;
          }else{
            // 存在则赋值
            clerkInfo.avatarHave = true;
            clerkInfo.avatarNo = false;
            clerkInfo.avatar = clerk.avatar;
          }

    this.setData({
        clerkInfo:clerkInfo
    });
    // 用 clerkInfo.clerkCode 请求到到 timeweek  设置timeweek  生产usetimes  渲染天天 和时间格子
    var that = this;
    netUtil.netUtil(con.CLERKORTIMEWEEK,{
                "code": that.data.clerkInfo.clerkCode
                },function callback(res){
                  if(res.code==1){
                     // 请求成功 
                   timeWeek = res.data.clerk.timeWeek;
                   let useTimes = that.productUseTimes(0);
                    // 渲染 天
                    that.loadShowDay();
                    // 渲染默认今天时间格子
                    that.loadShowTime(timestampUtil.getShortDate(),useTimes);
                    // 清空选中时间
                    that.clearSelectTime();
                  }
                })
    //  wx.request({
    //             url: con.CLERKORTIMEWEEK,
    //             data: {
    //             "body":{
    //             "code": that.data.clerkInfo.clerkCode
    //             },"head":{"digest":"2017-01-12T16:45:46.978+0800","operatorType":"CUSTOMER_LOGIN","operator":con.getUserInfo().code,"operatorLevel":"CUSTOMER","appVersion":8,"appType":"ANDROID_Client_PHONE","token":con.getUserInfo().currentToken}
    //             },
    //             method: 'POST', 
    //             dataType:'json',
    //             success: function(res){
    //                 console.log(res+"当前美容师timeweek");
    //               if(res.data.head.errCode!=1000){
    //                   wx.showToast({
    //                     title: res.data.body.errMsg,
    //                     icon: 'success',
    //                     duration: 2000
    //                   })
    //               }else{
    //                // 请求成功 
    //                timeWeek = res.data.body.clerk.timeWeek;
    //                let useTimes = that.productUseTimes(0);
    //                 // 渲染 天
    //                 that.loadShowDay();
    //                 // 渲染默认今天时间格子
    //                 that.loadShowTime(timestampUtil.getShortDate(),useTimes);
    //                 // 清空选中时间
    //                 that.clearSelectTime();
    //                 }
    //             },
    //             fail: function() {
    //               // fail
    //               console.log("fail=======");
    //             },
    //             complete: function() {
    //               console.log("complete------------");
    //               // complete
    //             }
    //           })
  },
  productUseTimes: function(index){
           let  todayUsed = timeWeek[index];
           
           if(index == 0){
              // 如果为今天 则现在时间点之前不可选 
               var useTimes=[{"beginTime":timestampUtil.getShortDate(),"endTime":new Date().getTime()}];
           }
         
           
           // 如果为今天以后的时间 赋值为空数组
           else{
               var useTimes = [];
           }
           // 如果第第0个 index 为0 则返回今天0点时间   为1则为明天0点 
             var  todayStemp = timestampUtil.addDays(timestampUtil.getShortDate(),index);
             // 拿到今天的 营业时间戳 shopStartTime0  shopEndTime0   shopStartTime1  shopEndTime1   push进去  
             console.log(this.shopOpenTime);  
             var  hou0  = parseInt(this.data.shopOpenTime[0].split("T")[1].split(":")[0]);
             var  minu0 = parseInt(this.data.shopOpenTime[0].split("T")[1].split(":")[1]);
             var  shopStartTime0     = timestampUtil.addHours(todayStemp,0);
             var  shopStartTimeHour0 = timestampUtil.addHours(todayStemp,hou0);
             var  shopEndTime0       = timestampUtil.addMinutes(shopStartTimeHour0,minu0);
                  useTimes.push({"beginTime":shopStartTime0,"endTime":shopEndTime0});

             var  hou1  = parseInt(this.data.shopOpenTime[1].split("T")[1].split(":")[0]);
             var  minu1 = parseInt(this.data.shopOpenTime[1].split("T")[1].split(":")[1]);
             var  shopStartTimeHour1  = timestampUtil.addHours(todayStemp,hou1);
             var  shopStartTime1      = timestampUtil.addMinutes(shopStartTimeHour1,minu1);
             var  shopEndTime1        = timestampUtil.addHours(todayStemp,24);
                  useTimes.push({"beginTime":shopStartTime1,"endTime":shopEndTime1});

         // 将选中日期的 被占用时间 push 进去
         for(let i = 0 ; i< todayUsed.length;i++){
             let  duration = todayUsed[i].duration;
             //  let  duration = 200;
             let  times = todayUsed[i].startTime.split(":");
             let  hours = parseInt(times[0]);
             let  minutes = parseInt(times[1]);
             var  todayUsedStemp = timestampUtil.addHours(todayStemp,hours);
             var  todayUsedStempStart = timestampUtil.addMinutes(todayUsedStemp,minutes);
             var  todayUsedStempEnd = timestampUtil.addMinutes(todayUsedStempStart,duration);
                  useTimes.push({"beginTime":todayUsedStempStart,"endTime":todayUsedStempEnd});
          }
    return useTimes;
  },
  // 渲染日期  7 天 
  loadShowDay:function(){
    //let date=bespeakUtil.getShortDate();
    let mdate=timestampUtil.getShortDate();
    let showDates=[];
    let _selectDateData={"dates":[]};
    for(let i=0;i<7;i++)
    {
      let day={};
      let show=timestampUtil.getDateFormat(mdate,"MM/dd")
      day["selected"]=false;
      switch(i)
      {
        case 0:
          show="今天";
          day["selected"]=true;
          break;
        case 1:
          show="明天";
          break;
        case 2:
          show="后天";
          break;
      }
      
      day["showdate"]=show;
      day["date"]=mdate;
      showDates[i]=day;
      mdate=timestampUtil.addDays(mdate,1);
    }
    _selectDateData.dates=showDates;
    this.setData({
       selectDateData:_selectDateData
    });
  },
  clearSelectTime:function(){
    let _openTime=this.data.openTime;
    for(let i=0;i<_openTime.length;i++)
    {
      _openTime[i]["selected"]=false;
    }
    this.setData({
      openTime:_openTime,
    });
  },
  loadShowTime:function(date2,useTimes){
    let date=date2;
    let time= new Array();
    let endDate=timestampUtil.addDays(date,1);//加一天
    date=timestampUtil.addHours(date,8);
    for(date;date<endDate;date=timestampUtil.addMinutes(date,step))
    {
            let index=time.length;
            time[index]={};
            time[index]["date"]=date;
            time[index]["show"]=timestampUtil.getDateFormat(date,"hh:mm");
            time[index]["selected"]=false;
            time[index]["used"]=false;

    }
    for(let i=0;i<time.length;i++)
    {
        for(let j=0;j<useTimes.length;j++)
        {
            if(time[i]["used"]!=true)
            {
            
              if(j==1)
              {
                console.log("error");
              }
                if( (time[i]["date"]<=useTimes[j]["beginTime"]
                     &&timestampUtil.addMinutes(time[i]["date"],step)>useTimes[j]["beginTime"])
                     ||(time[i]["date"]<useTimes[j]["endTime"]
                     &&useTimes[j]["beginTime"]<=time[i]["date"]))
                {
                    time[i]["used"]=true;
                }
                else
                {
                    time[i]["used"]=false;
                    
                }
            }
        }
    }
    this.setData({
        openTime:time,

      })
  },
  // 下拉选择美容师
  selectedCrick: function(e){
    console.log("选择美容师");
    wx.navigateTo({
      url: '../../pages/order/changeClerk/changeClerk'})
},
//----------------------
  
selectTime: function(e) {
   console.log(e);
   // e.currentTarget.dataset["date"] 为点击的时间点的时间戳
   let clickTimestamp = getSendDateFormat(e.currentTarget.dataset["date"]) ;
   let that = this;
   // 判断所选项目是否为空空
   if(that.data.showSelectedProject == ""){
       wx.showModal({
                title: '提示',
                content: '请选择预约项目',
                showCancel:false,
                success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                }
            })
         return;    
   }
   this.setData({
       projectTime: that.data.sendOrderInfo.duration
   });
   let starTime=e.currentTarget.dataset["date"];
   let stepMillisecond=this.data.projectTime*60*1000;
   let endTime=starTime+stepMillisecond;
   let times=this.data.openTime;
   let count=0;
    for(let i=0;i<times.length;i++)
    {
        if(times[i]["used"]==false)
        {
            if(times[i]["date"]>=starTime&&times[i]["date"]<endTime)
            {
                times[i]["selected"]=true;
                count=count+1;
            }
            else
            {
              times[i]["selected"]=false;
            }
        }
    }
    if(count==Math.ceil(this.data.projectTime/step))
    {
      this.setData({
        sendOrderInfo:{
            startDate: clickTimestamp,
            projects:  that.data.defaultItemList,
            duration:  that.data.sendOrderInfo.duration
       },
        openTime:times
      })
    }
    else
    {
            wx.showModal({
                title: '提示',
                content: '当前时间不可预约',
                showCancel:false,
                success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                }
            })
    }


    
  },
 selectDate: function(e){
      if( e.target.dataset.index ===undefined){return;}
      let selectDateIndex=e.target.dataset.index;
      //  console.log(e.target);
      let _selectDateData=this.data.selectDateData ;
      let _selectedDate=_selectDateData.dates[selectDateIndex]["date"];
     for(let i=0;i<7;i++){
        if(i == e.target.dataset["index"]){
              // 选中后 点亮
              _selectDateData.dates[i]["selected"] = true;
              // 创建选中日期  被占用时间数组
              var useTimes = this.productUseTimes(e.target.dataset["index"]);
              
             // 渲染 时间格子
             this.loadShowTime(_selectDateData.dates[i]["date"],useTimes);

        }else{
             _selectDateData.dates[i]["selected"] = false;
        }
     }
     this.setData({
        selectDateData:_selectDateData,
        selectedDate:_selectedDate
     });
  },
  // 接受一个 项目数组列表
  setDurationAndProjects: function(itemList){
    let  projectInfo = {};
          projectInfo.startDate = this.data.sendOrderInfo.startDate;
          projectInfo.duration = 0; 
          projectInfo.projects = [];
        
        // 如果不传 设置为默认的
        if(!itemList){
            itemList = this.data.defaultItemList;
            projectInfo.duration = itemList[0].duration; 
        }else{
            itemList = itemList;
            for(let i = 0; i< itemList.length; i++){
              if(
                  itemList[i].courseDuration ==undefined
                ||itemList[i].courseDuration == null
                ||itemList[i].courseDuration == ""
              ){
                projectInfo.duration += 30;
              }else{
                projectInfo.duration += itemList[i].courseDuration;
              }
             
            }
        }
        // 深度复制列表 
        projectInfo.projects = itemList.slice(0,itemList.length);
        this.setData({
                sendOrderInfo: projectInfo,
                defaultItemList: projectInfo.projects
           });
        // 设置展示项目   
        this.setShowSelectedProject(projectInfo.projects);  
        // 清空选中时间 
        this.clearSelectTime();

  },
  sendOrder: function(e){
           console.log(e);
          let that = this;
          let timeSelected    = false;
          
          let openTime = this.data.openTime;
          for(var i = 0; i< openTime.length; i++){
             if(openTime[i].selected ==true ){
               timeSelected = true;
             }
          }
          // 如果预约时间未选中 
          if(!timeSelected   ){
               wx.showModal({
                  title: '提示',
                  content: '请选择预约时间',
                  showCancel:false,
                  success: function(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                  }
               })
          // 如果预约项目未选中
          }else if(this.data.showSelectedProject == ""){
                wx.showModal({
                  title: '提示',
                  content: '请选择预约项目',
                  showCancel:false,
                  success: function(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                  }
                })
          }else{
            netUtil.netUtil(con.SEND_ORDER,{"customerProfileCode":con.getUserInfo().defaultCustomerProfileCode,"companyCode":con.getUserInfo().defaultCompanyCode,"shopCode":con.getUserInfo().defaultShopCode,
                "clerkCode": that.data.clerkInfo.clerkCode,
                "duration": that.data.sendOrderInfo.duration,// "项目 总时长",
                "startDate": that.data.sendOrderInfo.startDate,
                "comments": that.data.comments,
                "bookingSource": "app_c",
                "projects": that.data.sendOrderInfo.projects,//" 选中项目数组"
                },function callback(res){
                  if(res.code==1){
                    wx.showToast({
                        title: "预约成功",
                        icon: 'success',
                        duration: 2000
                      });
                     //清空选中项目 清空稍话
                     that.setData({
                       showSelectedProject: "",
                       comments: ""
                     });
                     //重新初始化
                     that.onloadInit();
                     
                     wx.navigateTo({
      url: '../../pages/myself/appointmentDetail/appointmentDetail?isHiddenCancle=true&appointCode='+res.data})
                  }
                })
      //        wx.request({
        
      //           url: con.SEND_ORDER,
      //           data: {
      //           "body":{"customerProfileCode":con.getUserInfo().defaultCustomerProfileCode,"companyCode":con.getUserInfo().defaultCompanyCode,"shopCode":con.getUserInfo().defaultShopCode,
      //           "clerkCode": that.data.clerkInfo.clerkCode,
      //           "duration": that.data.sendOrderInfo.duration,// "项目 总时长",
      //           "startDate": that.data.sendOrderInfo.startDate,
      //           "comments": that.data.comments,
      //           "bookingSource": "app_c",
      //           "projects": that.data.sendOrderInfo.projects,//" 选中项目数组"
      //           },"head":{"digest":"2017-01-12T16:45:46.978+0800","operatorType":"CUSTOMER_LOGIN","operator":con.getUserInfo().code,"operatorLevel":"CUSTOMER","appVersion":8,"appType":"ANDROID_Client_PHONE","token":con.getUserInfo().currentToken}
      //           },
      //           method: 'POST', 
      //           dataType:'json',
      //           success: function(res){
      //               console.log("67776767----------------888888");
      //               console.log(res);
                  
      //             if(res.data.head.errCode!=1000){
      //                 wx.showToast({
      //                   title: res.data.body.errMsg,
      //                   icon: 'success',
      //                   duration: 2000
      //                 })
      //             }else{
      //               wx.showToast({
      //                   title: "预约成功",
      //                   icon: 'success',
      //                   duration: 2000
      //                 });
      //                //清空选中项目 清空稍话
      //                that.setData({
      //                  showSelectedProject: "",
      //                  comments: ""
      //                });
      //                //重新初始化
      //                that.onloadInit();
                     
      //                wx.navigateTo({
      // url: '../../pages/myself/appointmentDetail/appointmentDetail?isHiddenCancle=true&appointCode='+res.data.body})  
      //               }

      //           },
      //           fail: function() {
      //             // fail
      //             console.log("fail=======");
      //           },
      //           complete: function() {
      //             console.log("complete------------");
      //             // complete
      //           }
      //         });
          }
  },
  selectClerkFormList:function(e){
    // 拿到clerkCode   
    // 隐藏 定位块块
    // 发请求  渲染当前美容师一周内容
    let clerkCode = e.currentTarget.dataset["clerkcode"];
    this.setData({
         selectedCrickSwiperShow: false
    });

  },
  setShowSelectedProject: function(projects){
     //sendOrderInfo.projects
     let showSelectedProject = "";
     for(var i = 0 ; i<projects.length; i++){
         showSelectedProject += projects[i].objName +",";
     }
     showSelectedProject = showSelectedProject.substring(0,showSelectedProject.length-1);
     this.setData({
       showSelectedProject: showSelectedProject
     });

  },

  shaoHua: function(){
    wx.navigateTo({
      url: '../../pages/order/giveInfo/giveInfo'})
  },

  navgatorToAppointmentProject: function(){
    var that = this;
      wx.navigateTo({
      url: '../../pages/chooseAppointmentProject/chooseAppointmentProject?fromList='+JSON.stringify(that.data.defaultItemList)})

  },
  onUnload:function(){
    // 页面关闭
  }
})
function getSendDateFormat(timeStemp){
  //   1484573400000
  let date = new Date(timeStemp);
  let  Y = date.getFullYear() + '-';
  let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let  D = date.getDate() + 'T';
  let  h = date.getHours() + ':';
  let  m = date.getMinutes() + ':';
  let  s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
  let final = Y + M + D + h + m + s +".000+0800" ;
  return final;

}

