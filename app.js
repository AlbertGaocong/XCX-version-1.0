//app.js
var netUtil=require('/utils/netUtil.js')
App({
  onLaunch: function () {
      netUtil.getOpenId();
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
 
})