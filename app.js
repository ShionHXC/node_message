/**
 * Created by Administrator on 2017/9/20 0020.
 */
var express = require("express");
var app = express();
var db = require("./model/db.js");
var formidable = require('formidable');
app.set("view engine","ejs");
// 静态
app.use(express.static("./public"));


// 显示留言列表
app.get("/",function(req,res){
    res.render("index");
})

app.get("/getList",function(req,res){
    var pageSize = 4;
    var page = parseInt(req.query.page);
    db.getData("message_new",{},{"pageSize":pageSize,"page":page},function(err, result){
        if(err){
            res.json({"errCode" : 1,"errMsg" : "查询失败"});
            return;
        };
        db.getAllCount("message_new",function(count){
            var pageCount = Math.ceil(count/pageSize);
            res.json({
                "errCode":0,
                "errMsg" : "查询成功",
                "page" : page,
                "pageCount" : pageCount,
                "allCount" : count,
                "result" : result
            });
        })

    })
})

// 处理留言  post请求需要
app.post("/submit",function(req,res,next){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        // 写进数据库
        var name = fields.name;
        var message = fields.message;
        var json = {
            "name" : name,
            "message" : message,
            "date" : new Date()
        }
        db.insert("message_new",json,function(err,result){
            if(err){
                res.json({"errCode":1});
                return;
            }else{
                res.json({"errCode":0})
            }
        })
    });
});





app.listen(3000);