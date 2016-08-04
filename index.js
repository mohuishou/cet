var express = require('express');
var cet = require('./cet');
var app = express();
var bodyParser = require('body-parser');

var date=new Date();
Y = date.getFullYear() + '-';
M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
D = date.getDay() + ' ';
h = date.getHours() + ':';
m = date.getMinutes() + ':';
s = date.getSeconds();
var time=Y+M+D+h+m+s;

var success=function (r,info,data) {
    var return_data={
        "status":200,
        "info":info,
        "data":data
    };
    r.json(return_data);
    console.log("INFO:[time: "+time+"]"+info);
    return true;
};

var error =function (r,info) {
    var return_data={
        "status":500,
        "info":info
    };
    r.json(return_data);

    //控制台输出错误信息

    console.log("INFO:[time: "+time+"]"+info);
    return false;
};
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/gradeNoId',function (req,res) {
    //姓名验证
    if(!req.body.name){
        return error(res,"姓名必须！");
    }
    var name=req.body.name;
    if(name.length<2||name.length>4){
        return error(res,"姓名长度参数错误！");
    }

    //学校验证
    if(!req.body.school){
        return error(res,"学校必须！");
    }
    var school=req.body.school;

    //类型验证
    if(!req.body.type){
        return error(res,"考试等级必须！");
    }
    var type=req.body.type;
    if(type!=1&&type!=2){
        return error(res,"考试类型参数错误！");
    }

    cet.getGradeNoId(name,school,type,function (e,g) {
        if(e){
            return error(res,e);
        }
        return success(res,"成绩获取成功！",g);
    });
});

/**
 * 有准考证号获取成绩
 */
app.post('/grade', function (req, res) {
    console.log(req.body);

    //姓名验证
    if(!req.body.name){
        return error(res,"姓名必须！");
    }
    var name=req.body.name;
    if(name.length<2||name.length>4){
        return error(res,"姓名长度参数错误！");
    }

    //准考证号验证
    if(!req.body.id){
        return error(res,'准考证号必须！');
    }
    var id= req.body.id;
    if(id.length!=15){
        return error(res,"准考证号参数错误！");
    }

    cet.getGrade(name,id,function (e,g) {
        if(e){
            return error(res,e);
        }

        return success(res,"成绩获取成功！",g);
    });

});



var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
