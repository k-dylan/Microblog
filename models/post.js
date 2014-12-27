/**
 * 微博模型
 */

var mongodb = require('./db');

function Post(username,post,time){
    this.user = username;
    this.post = post;
    if(time) {
        this.time = time;
    }else{
        this.time = new Date();
    }
}

module.exports = Post;


Post.prototype.save = function save (callback){
    // 存入Mongodb的文档
    var post = {
        user : this.user,
        post : this.post,
        time : this.time
    };

    mongodb(function (db) {

        // 读取posts 集合
        db.collection('posts', function (err,collection){
            if(err){
                return callback(err);
            }

            // 为user属性添加索引
            collection.ensureIndex('user',function(err){
                if(err){
                    return callback(err);
                }
                // 写入 post 文档
                collection.insert(post, {safe:true}, function (err,post){
                    callback(err,post);
                });
            });
        });
    });
}

/**
 * 获取微博信息   
 * 默认每页显示12条    
 */
Post.get = function (username,page,callback) {
    mongodb(function (db) {
        if(err){            
            return callback(err);
        }
        // 读取posts集合
        db.collection('posts', function (err,collection) {
            if(err){
                return callback(err);
            }
            // 查找user属性为username的文档，如果username是null则匹配全部
            var query = {};
            if(username) {
                query.user = username;
            }
            //微博总数
            var number = 0;
            var find = collection.find(query);

            find.count(function(err,num){
                if(err){
                    callback(err);
                }
                number = Math.ceil(num / 12);
                find.sort({time:-1}).skip((page-1)*12).limit(12).toArray(function(err,docs) {
                    if(err){
                        callback(err);
                    }
                    callback(null, docs,number);
                });
            });
            
        });
    });
}
