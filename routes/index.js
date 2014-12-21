var express = require('express');
var router = express.Router();
var Post = require('../models/post');

//这里设置跟目录下的路由
/* GET home page. */
router.get('/', index);
router.get('/index', index);


function index (req,res) {

    res.render('index', { 
            title: '首页',
            postUser :'all'            
        });
    /*Post.get(null,1,function(err,posts){
        if(err){
            posts = [];
        }        
        res.render('index', { 
            title: '首页',
            postUser :'all',
            posts:posts
        });

    })*/
}



module.exports = router;
