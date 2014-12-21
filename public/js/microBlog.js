// 全局js



$(function () {
    setNav();   
});



// 导航背景
function setNav (){
    var url = window.location.href;
    /*    
    // 用jquery    
    var list = $('.nav-list a');

    for(var i = list.length-1; i>=0; i--){        
        if(url.match(list[i].getAttribute('href'))){
            $(list[i]).parent().addClass('active');
            return false;
        }
    }
    */
    // 不用jquery
    var b = document.getElementsByClassName('nav-list')[0];

    var list =b.getElementsByTagName('a');

    for(var i = list.length-1; i>=0; i--){        
        if(url.match(list[i].getAttribute('href'))){
            list[i].parentNode.setAttribute('class','active');
            return false;
        }
    }
}

(function (){
    var checkUser = false,
        theckPass = false;
       
    //表单验证
    $('#username').blur(function () {
        var patrn=/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;
        var username = this.value;
        if(!username.match(patrn)){
            $(this).next().addClass('state-error').text('用户名必须大于2个字符并且不能超过20个字符，且只能包含数字、字母、下划线、中文');
            checkUser = false;
            return false;
        }
        var state = $(this).next();
        $.getJSON('/users/check/'+this.value, function (data) {
            if(data.error === 0) {
                state.removeClass('state-error').text('可以注册');
                checkUser = true;
            }else{
                state.addClass('state-error').text('用户名已被注册');
                checkUser = false;
            }
        })
    });

    // 验证密码
    $('#password').blur(function(){
        var pass = this.value;
        if(pass.length < 6 || pass.length > 20){
            $(this).next().addClass('state-error').text('密码必须大于6个字符且小于20个字符');
        }else{
            $(this).next().removeClass('state-error').text('密码正确');
        }
    });

    $('#password2').blur(function(){
        var pass = this.value;
        if(pass === $('#password').val()){            
            $(this).next().removeClass('state-error').text('密码正确');
            theckPass = true;
            setMd5(pass);           
        }else{
            $(this).next().addClass('state-error').text('两次密码不一致');
            theckPass = false;
        }
    });

    // 注册按钮
    $('#goreg').click(function(){
        $(this).focus();
        if(!checkUser){
            alert('用户名不对啦！');
            $('#username').focus();
            return false;
        }
        if(!theckPass){
            alert('密码不对啦！');
            $('#password').focus();
            return false;
        }
    });

})()



function addScript(url,id,callback){
    var sc = document.createElement('script');   
    sc.setAttribute('src',url);
    document.documentElement.appendChild(sc);
}

/**
 * 设置密码的MD5值
 * @param {[type]} pass [description]
 */
function setMd5(pass){
    if(typeof hex_md5 == 'undefined'){
        $.getScript('/js/md5.js',function(res,status){
            if(status == 'success'){
                loadMd5 = true;
                $('#pass').val(hex_md5(pass));
            }
        });
    }else {
        $('#pass').val(hex_md5(pass));
    }
}

