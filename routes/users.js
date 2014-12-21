var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var Post = require('../models/post');
var util = require('util');

router.get('/reg', checkNotLogin);
router.get('/reg', reg);

router.post('/reg', checkNotLogin);
router.post('/reg', doReg);

router.get('/login', checkNotLogin);
router.get('/login', login);

router.post('/login', checkNotLogin);
router.post('/login', doLogin);

router.get('/logout', checkLogin);
router.get('/logout', logOut);

router.get('/u/:user',showUser);
router.get('/u/:user/:page',showUser);
//验证用户名是否存在
router.get('/check/:user', checkUser);
/**
 * 显示用户注册页
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function reg (req,res){
    // 创建一个验证码
    var random = getHash(new Date().getTime().toString());
    req.session.formHash = random;   

    res.render('reg',{
        title : '用户注册',
        random : random
    });
}

function checkUser(req,res){
    // 检查用户名是否存在
    User.get(req.params.user, function (err, user) {
        var result = {};
        if(user){
            result.error = 1;                      
        }else{
            result.error = 0;            
        }

        res.json(result);
    });
}

// 响应用户注册
function doReg (req,res) {

    //验证验证码是否正确
    if(req.body['formhash'] != req.session.formHash){
        req.flash('error','参数错误，请刷新页面重试！');
        return res.redirect('/users/reg');
    }else{
        req.session.formHash = null;
    }

    //验证密码是否一样
    if(req.body['password'] != req.body['password2']){
        req.flash('error', '两次密码不一样');
        return res.redirect('/users/reg');
    }

    //生成口令的散列值
    var password = getHash(req.body.password);

    var newUser = new User({
        name : req.body.username,
        password : password,        
    });

    // 检查用户名是否存在
    User.get(newUser.name, function (err, user) {

        if(user){            
            err = '用户名已存在';
        }
        if(err) {
            req.flash('error', err);
            return res.redirect('/users/reg');
        }

        // 如果不存在则添加用户
        newUser.save(function (err) {           
            if(err){
                console.log(util.inspect(err));
                req.flash('error',err);
                return res.redirect('/users/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/users/u/'+newUser.name);
        })
    })
}

/**
 * 显示登陆界面
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function login (req,res) {
    res.render('login',{
        title:'用户登录',
    });
}

/**
 * 接受登陆信息
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function doLogin(req,res) {
    if(req.body['username'].length <= 0 || req.body['password'].length <= 0){
        req.flash('error','用户名或密码为空！');
        return res.redirect('/users/login');
    }

    // 生成密码的散列值   
    var password = getHash(req.body.password);

    var username = req.body.username;
    User.get(username,function (err,user) {
        if(!user) {
            req.flash('error','用户不存在');
            return res.redirect('/users/login');
        }
        if(user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/users/login');
        }
        req.session.user = user;
        req.flash('success','登陆成功!');
        return res.redirect('/users/u/'+user.name);
    })
}

/**
 * 退出登录
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function logOut (req,res) {
    req.session.user = null;
    req.flash('success', '退出成功');
    return res.redirect('/index');
}

/**
 * 用户个人首页
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function showUser (req,res) {
    User.get(req.params.user, function(err, user) {
        if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/index');
        }
        //var page = req.params.page ? req.params.page : 1;
        res.render('user',{
                title : user.name,
                postUser : user.name                
            })
        /*Post.get(user.name,page,function(err,posts) {
            if(err){
                req.flash('error',err);
                return  res.redirect('/');
            }
            res.render('user',{
                title : user.name,
                postUser : user.name                
            })
        })*/
    })
}

/**
 * 判断用户是否已经登陆
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function checkLogin (req,res,next){
    if(!req.session.user){
        req.flash('error','未登陆');
        return res.redirect('/users/login');
    }
    next();
}
function checkNotLogin (req,res,next){
    if(req.session.user){
        req.flash('error','已登陆');
        return res.redirect('/index');
    }
    next();    
}


/**
 * 生成字符串的散列值
 * @return {[type]} [description]
 */
function getHash(str) {
    var md5 = crypto.createHash('md5');
    return md5.update(str).digest('base64');
}
module.exports = router;
 