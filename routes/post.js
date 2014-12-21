var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var User = require('../models/user');


router.get('/:user/:page',isUser);
router.get('/:user/:page',getPost);
router.get('/:user',isUser);
router.get('/:user',getPost);


function getPost(req,res){
    var page = req.params.page ? req.params.page : 1;
    var user = req.params.user != 'all' ? req.params.user : null;
    var result = {};
    Post.get(user,page,function(err,posts,num) {
        if(err){
            result.error = 1;
            result.msg  = '发现异常，请重试！';
        }else{
            result.error = 0;
            result.page = num; 
            result.data = posts;
        }
        res.json(result);
    });
}


function isUser(req,res,next){
    if(req.params.user != 'all'){
        User.get(req.params.user,function (err, user){
            if(!user){                
                res.json({
                    error : 1,
                    msg  : '没有该用户！'
                });
            }else{
               next(); 
            }            
        });
    }else{
        next();
    }    
}


/**
 * 发表微博
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
router.post('/',function (req,res) {
    if(!req.session.user){
        req.flash('error','请先登录');
        return res.redirect('/users/login');
    }
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err){
        if(err){
            req.flash('error', err);
            return res.redirect('/index');
        }
        req.flash('success','发表成功');
        res.redirect('/users/u/'+currentUser.name);
    });
})




module.exports = router;