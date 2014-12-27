/**
 * 数据库连接
 */

var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

// module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}),{safe: true});



var mongo = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}),{safe: true});
var cacheDb = null;

function connect (fn){

	if(!cacheDb){
		mongo.open(function (err, db) {
			if(err){
				return console.log(err);
			}
			cacheDb = db;
			fn(db);
		});
	}else{
		fn(cacheDb);
	}
	
}



module.exports = connect;




