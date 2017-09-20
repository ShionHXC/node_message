/**
 * Created by Administrator on 2017/9/20 0020.
 */
var db_address = "mongodb://localhost:27017/huangxc";

var MongoClient = require("mongodb").MongoClient;

function _connectDB(callback){
    MongoClient.connect(db_address,function(err, db){
        if(err){
            console.log("数据库连接失败");
            return;
        }
        callback(db)
    })
}

exports.insert = function(collectionName, json, callback){
    _connectDB(function(db){
        db.collection(collectionName).insertOne(json, function (err, result) {
            if(err){
                console.log("数据库插入失败");
                db.close();
                return;
            }
            callback(err, result);
            db.close();
        })
    })
}

exports.getData = function(collectionName, json, C, D){
    if(arguments.length === 3){
        var page = 1;
        var callback = C;
    }
    if(arguments.length === 4){
        var page = C.page;
        var pageSize = C.pageSize;
        var callback = D;
    }
    var result = []
    _connectDB(function(db){
        db.collection(collectionName).find(json).limit(pageSize).skip((page-1) * pageSize).sort({"date":-1}).each(function(err, doc){
            if(err){
                console.log("查询有误！");
                db.close();
                return;
            }
            if(doc != null){
                result.push(doc);
            }else{
                // 遍历结束
                db.close();
                callback(err, result);
            }
        })
    })
}

exports.getAllCount = function(collectionName,callback){
    _connectDB(function(db){
        db.collection(collectionName).count({}).then(function(count){
            callback(count);
            db.close();
        })
    })
}

// 删除留言
exports.delMeg = function(collectionName,json,callback){
    _connectDB(function(db){
        db.collection(collectionName).deleteMany(json,function(err, result){
            if(err){
                console.log("删除失败");
                db.close();
                return;
            }
            db.close();
            callback(err, result);
        })
    })
}