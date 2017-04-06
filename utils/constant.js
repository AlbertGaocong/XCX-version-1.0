var Crypto = require('/cryptojs/cryptojs.js').Crypto;
//url相关
const BASE_URL = "https://xcx.imeiyebang.com/";
// const BASE_URL = "http://182.92.172.193:9000/";
//登录
const LOGIN_URL = BASE_URL + "client/loginAccount/login";
//获取首页分类列表
const CATEGORY = BASE_URL+"client/category/list";
//获取项目列表（限时优惠列表和项目列表）
const COUSECARD_LIST = BASE_URL+"client/card/courseCard/list";
const CLERK_LIST = BASE_URL+"client/clerk/list";
const ORDER_DEFAULT = BASE_URL+ "client/booking/getBookingDefault";
const SEND_ORDER = BASE_URL+ "client/booking/add";
// 获取选中美容师 timeweek
 const CLERKORTIMEWEEK = BASE_URL+ "client/clerk/clerkOrTimeWeek";


const OBJ_COUSECARD_LIST = BASE_URL+"client/card/objCourseCard/list";
// 预约列表
const APPOINT_LIST = BASE_URL+"client/clerk/booking/list"
// 预约详情
const APPOINT_DETAIL = BASE_URL+"client/booking/get"
// 预约
const APPOINT_CANCLE = BASE_URL+"client/booking/update"
const ACCOUNT_LIST = BASE_URL+"client/facades/order/list/ofCustomer";
const GIVEINFO_LIST = BASE_URL+"client/article/articleMag/list";
const COURSECARD_LOG = BASE_URL + "client/card/courseCardLog/list";
const PERSONAL_INFO = BASE_URL + "client/customers/info";

//获取项目详情
const PROJECT_DETAIL = BASE_URL+"client/cardBrand/getCardBrand";
//下单
const ADD_ORDER = BASE_URL+"client/orders/add";
//获取账户余额
const GET_BALANCE = BASE_URL+"client/account/listTotal";
//获取订单支付参数
const ORDER_CONFIRM = BASE_URL+"client/orders/confirm";
//余额支付
const BALANCE_PAY = BASE_URL+"client/bill/pay";
//预约选择项目-店内项目
const COURSE_CARD_LIST = BASE_URL+"client/booking/courseCard/list";
//预约选择项目-我的疗程卡
const OBJ_COURSE_CARD_LIST = BASE_URL+"client/card/objCourseCard/list"
const SHOP_LIST = BASE_URL + "client/company/shop/list";
const SHOP_SURE = BASE_URL + "client/customer/changeDefaultProfile";
const COMPANY_LIST = BASE_URL + "client/company/customersCompanList";
//发送验证码
const SENDSMS = BASE_URL + 'client/sms/sendSms';
//注册注册
const REGIST = BASE_URL+"client/loginAccount/regist";
//退出登录
const LOGINOUT=BASE_URL+"client/loginAccount/logout";
//切换美容师
const UPDATE_BEAUTICIAN =BASE_URL+ "client/clerk/clerkOrTimeWeek";
//获取openidopenid
const GET_OPEN_ID = BASE_URL+"client/customers/openid"
module.exports = {
    BASE_URL: BASE_URL,
    LOGIN_URL: LOGIN_URL,
    CATEGORY:CATEGORY,

    CLERK_LIST:CLERK_LIST,
    ORDER_DEFAULT:ORDER_DEFAULT,
    SEND_ORDER:SEND_ORDER,
    CLERKORTIMEWEEK:CLERKORTIMEWEEK,

    ACCOUNT_LIST,
    GIVEINFO_LIST,
    APPOINT_LIST,
    APPOINT_DETAIL,
    PERSONAL_INFO,
    APPOINT_CANCLE,

    COUSECARD_LIST:COUSECARD_LIST,
    OBJ_COUSECARD_LIST,
    getUserInfo:getUserInfo,

    PROJECT_DETAIL:PROJECT_DETAIL,

    COURSECARD_LOG,

    PROJECT_DETAIL:PROJECT_DETAIL,
    ADD_ORDER:ADD_ORDER,
    GET_BALANCE:GET_BALANCE,
    ORDER_CONFIRM:ORDER_CONFIRM,
    BALANCE_PAY:BALANCE_PAY,
    COURSE_CARD_LIST,
    OBJ_COURSE_CARD_LIST,
    COMPANY_LIST,
    SHOP_LIST,
    SHOP_SURE,
    SENDSMS,
    REGIST,
    LOGINOUT,
    Encrypt:Encrypt,
  Decrypt:Decrypt,
    UPDATE_BEAUTICIAN:UPDATE_BEAUTICIAN,
    GET_OPEN_ID

}

function getUserInfo(){
    var userInfo = wx.getStorageSync('userInfo');
    // var jia = Encrypt(JSON.stringify(userInfo));
    // console.log(jia);
    // console.log(Decrypt(jia));
    if(userInfo != null&&userInfo!=''){
        return userInfo;
    }else{
        return undefined;
    }
}

function Encrypt (word){
    var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
    var eb = Crypto.charenc.UTF8.stringToBytes(word);
    var kb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//KEY
    var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
    var ub = Crypto.AES.encrypt(eb,kb,{iv:vb,mode:mode,asBpytes:true});
    return ub;
	}
  function Decrypt (word){
    var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
    var eb = Crypto.util.base64ToBytes(word);
   var kb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//KEY
    var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
    var ub = Crypto.AES.decrypt(eb,kb,{asBpytes:true,mode:mode,iv:vb});
    return ub;
}


