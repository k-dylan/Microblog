var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('express');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash  = require('connect-flash');
var util = require('util');
//增加日志记录功能
var fs = require('fs');
var accessLogFile = fs.createWriteStream('log/access.log',{flags : 'a'});
var errorLogfile  = fs.createWriteStream('log/error.log',{flags:'a'});



var index = require('./routes/index');
var users = require('./routes/users');
var post = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//注册静态视图助手
app.locals.host = '/';  //网址
app.locals.util = util;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(flash());
app.use(logger({stream:accessLogFile}));  // 写入日志到文件
// app.use(logger('dev'));  // 日志输出到控制台

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({ 
    secret: settings.cookieSecret, 
    store: new MongoStore({ 
        db: settings.db 
    })  
})); 


/**
 * 注册视图助手（user,post, error,success）路由
 * 用于模板显示
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
app.use(function (req,res, next) {

    res.locals.user = req.session.user;
    res.locals.post = req.session.post;

    var error = req.flash('error');
    res.locals.error = error.length ? error : null;

    var success = req.flash('success');
    res.locals.success = success.length ? success :null;
    next();
});


//这两个中间件定义的都是一个路由
//作用一般就是便于区分各个文件夹
app.use('/', index);
app.use('/users', users);
app.use('/post', post);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        // 写入错误日志
        var meta = '[' + new Date() + ']' +req.url+'\n';
        errorLogfile.write(meta + err.stack + '\n');
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    // 写入错误日志
    var meta = '[' + new Date() + ']' +req.url+'\n';
    errorLogfile.write(meta + err.stack + '\n');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
 


module.exports = app;

// 如果不是从别的文件引用则启动
if (!module.parent) { 
    app.set('port', process.env.PORT || 3000);
    var server = app.listen(app.get('port'), function() {
        debug('Express server listening on port ' + server.address().port);
    });
} 



