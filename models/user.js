/**
 * 用户模型
 */

var mongodb = require('./db');


module.exports = User;

function User(user) {
    this.name = user.name;
    this.password = user.password;
};

/**
 * 保存用户
 * @type {[type]}
 */
User.prototype.save = function save (callback) {
    // 要写入mongodb数据库的文档
    var user = {
        name : this.name,
        password : this.password,
    }
    mongodb(function (db) {
        // 读取users集合
        db.collection('users', function (err, collection) {            
            if(err){ 
                return callback(err);
            }
            // 为name属性添加索引
            collection.ensureIndex( 'name', {unique: true},function(arr){                
                if(err){
                    return  callback(err);
                }
                // 写入user文档
                collection.insert(user,{safe:true}, function (err,user){
                    callback(err,user);
                });
            });
            // 报错信息：Cannot use a writeConcern without a provided callback
            // 
            
        });
    });
}

/**
 * 获取用户信息
 * @param  {string}   username 用户名
 * @param  {Function} callback 回调函数
 * @return {[type]}            [description]
 */
User.get = function (username, callback) {
    mongodb(function ( db) {       
        if(err) {
            return callback(err);
        }

        //读取users集合
        db.collection('users', function (err,collection) {
            if(err){
                return callback(err);
            }

            //查找name属性为username的文档
            collection.findOne({name: username}, function (err,doc) {
                if(doc){
                    // 封装文档为User对象
                    var user = new User(doc);
                    callback(err, user);
                }else{
                    callback(err,null);
                }
            })
        })
    })
}

