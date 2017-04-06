var bespeakUtil = {
  getShortDate:function()
{
    var date=new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
,
addDays: function(date,days)
{
    var n =date.getTime() + days * 24 * 60 * 60 * 1000;
    return new Date(n);
}
,
addMinutes:function(date,minutes)
{
    var n =date.getTime() + minutes*60*1000;
    return new Date(n);
}
,
getTime:function (date)
{
    var minute=date.getMinutes();
    if(minute<10)
    {
        minute="0"+minute;
    }
    var hour=date.getHours();
    if(hour<10)
    {
        hour="0"+hour;
    }
    return hour+":"+minute;
},
getFormatDateTime:function (dateString) {
    if (dateString != null && dateString.length > 24){
      var begin = dateString.substring(0,10);
      var end = dateString.substring(11,19);
      return begin + "  " + end;
    } else {
      return "";
    }
  },
  getCardTypeName:function (typeString) {
      if (typeString == "MONTH") {
          return "月卡";
      } else if (typeString == "QUARTER") {
          return "季卡";
      } else if (typeString == "HALFYEAR") {
          return "半年卡";
      } else {
          return "NODATA";
      }

  },
  getTimeDate: function(dateString){
    var date = new Date();
    if(dateString.length == 0){
        return date;
    }
    var newstr = dateString.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    return date;
  },
  getDayDifference: function(dateTime) {
      var date1 = new Date();
      var date2 = date1.getTime()-dateTime.getTime();  //时间差的毫秒数
      var days = Math.floor(date2/(24*3600*1000));
      if (days == 0) {
        return "今天";
    } else if (days == 1) {
        return "昨天";
    } else if (days == 2) {
        return "前天";
    } else if (days == -1) {
        return "明天";
    } else if (days == -2) {
        return "后天";
    }
    return "";
  }
};
module.exports = bespeakUtil