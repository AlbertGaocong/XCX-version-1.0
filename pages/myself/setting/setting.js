// pages/myself/setting/setting.jsi;
import netutil from '../../../utils/netUtil.js';
import con from '../../../utils/constant.js';
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options)
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
  logout:function(){
    var that = this;
    loginOut(that);
  }
})
function loginOut(that){
  var logoutParam ={"token":con.getUserInfo().currentToken,"mobile":con.getUserInfo().mobile};
  netutil.netUtil(con.LOGINOUT,logoutParam,function(res){
    wx.clearStorage({
      key: 'userInfo',
      success: function(res){
        // success
          wx.redirectTo({
              url: '../../../pages/login/login'
            })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
     
  })
}