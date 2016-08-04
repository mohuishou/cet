//无准考证查询
var decoder = require('ling-cet-decoder');
var request = require('request');
var http=require('http');
var cheerio = require('cheerio');
var cet={};
cet.ticket='';
cet.grade={};

var rnd=function (start, end){
    return Math.floor(Math.random() * (end - start) + start);
}

/**
 * 获取准考证号
 * @param name 姓名
 * @param school 学校
 * @param cetType 类型/4级=1/6级=2
 * @param callback 回调
 */
cet.getTicket=function (name,school,cetType,callback) {
  //随机ip
  var ip=rnd(0,255)+"."+rnd(0,255)+"."+rnd(0,255)+"."+rnd(0,255);
  request.post({
    url: 'http://find.cet.99sushe.com/search',
    encoding: null,
    headers: {
      'Referer':'http://find.cet.99sushe.com',
      "X-Forwarded-For":ip
  },
    body: decoder.getEncryptReqBody(cetType, school, name)
  }, function (err, req, bodyBuf) {
    if (err) {
      throw new Error(err);
    }
    var ticket = decoder.decryptResBody(bodyBuf);
    if(ticket){
      try{
          console.log("准考证号获取成功！"+ticket);
        callback(null,ticket);
        return false;
      }catch (err){
        callback(err);
        return false;
      }
    }else {
      callback("获取准考证号失败");
      return false;
    }
  });
};


/**
 * 有准考证获取成绩
 * @param name 姓名
 * @param ticket 学号
 * @param callback 回调函数
 */
cet.getGrade=function(name,ticket,callback){
  //即将传递的参数
  var param='zkzh='+ticket+'&xm='+name;
  var ip=rnd(0,255)+"."+rnd(0,255)+"."+rnd(0,255)+"."+rnd(0,255);
  request.post({
    url:"http://www.chsi.com.cn/cet/query?"+encodeURI(param),
    headers: {
      'Referer':'http://www.chsi.com.cn/cet/',
      'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36',
      "X-Forwarded-For":ip
    }
  },function (err, req, body) {
    if (err) {
      throw new Error(err);
    }

    //从返回的数据中抓取值
    $=cheerio.load(body);
    var info=[];
    var grade_arr=[];
    var $cet_info=$(".cetTable td");

    //检测是否获得数据
    if(!$cet_info.text()){
        console.log(body);
      callback("获取成绩失败！请检测您输入的信息是否有误！");
      return false;
    }

    $cet_info.each(function (i,e) {
      var text=$(this).text();
        if(i==5){
          var grade_str=text;
          grade_arr=grade_str.match(/[\d]+/gi);
        }else {
          info[i]=text;
        }
    });

    //数据格式化
    var data={
      "name":info[0],
      "college":info[1],
      "type":info[2],
      "id":info[3],
      "time":info[4],
      "grade":{
        "all":grade_arr[0],
        "listen":grade_arr[1],
        "read":grade_arr[2],
        "write":grade_arr[3]
      }
    };

    // console.log(data);

    try{
      callback(null,data);
    }catch (e){
      callback(e);
    }

  });
};

/**
 * 无准考证获取成绩
 * @param name
 * @param school
 * @param cetType
 * @param callback
 */
cet.getGradeNoId=function(name,school,cetType,callback){
  this.getTicket(name,school,cetType,function (e,t) {
    if(e){
      console.log(e);
      callback(e);
      return false;
    }
    cet.getGrade(name,t,function (e,grade) {
      if(e){
          console.log(e);
          callback(e);
          return false;
      }
      try{
        callback(null,grade);
      }catch (e){
        callback(e);
      }
    });
  });
};

module.exports = cet;
