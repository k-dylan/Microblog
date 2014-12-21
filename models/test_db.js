/**
 * 
 */

var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;




var mongodb = new Db(settings.db,new Server(settings.host, Connection.DEFAULT_PORT,{}));

mongodb.open(function(err, db){
    if(err){
        console.log(err);
        return;
    }

    db.collection('posts' ,function (err, collection) {
        // 写入 post 文档
        for (var i = 0; i < 10000; i++) {
            var post = {
                user : 'dylan'+i,
                post : '这是测试微博'+i,
                time : new Date()
            }
            collection.insert(post, function (err,post){});
        };        

    });
});





