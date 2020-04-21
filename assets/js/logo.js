$(function(){
    $('.login a').click(function(){
       $('.login').hide().next().show();
    });
    $('.reg a').click(function(e){
        $('.reg').hide().prev().show();
    });
    let form = layui.form;
    form.verify({
        // pwd:[/^\S{6,12}$/,'不能有空格，密码必须是6-12位'],
        // repwd:[/^\S{6,12}$/,'两次输入的不一致'],
        // pwdvalue :$('.val1').val(),
        // repwdvalue : $('.reval1').val(),
        // a:function(){
        //     if(pwdvalue!=repwdvalue){
        //         alert('两次输入的不一致');
        //     }
        //    return a;
        // }
     pwd:function(value){
         var reg = /^\S{6,16}$/;
         if(!reg.test(value)) {
           return '密码必须是6-16位，不能有空格';
        }
     },
     repwd:function(value){
         if($('.val1').val().trim()!==value){
             return '两次输入的不同';
         }
     }
    })
    $('.reg form').submit(function(e){
        e.preventDefault();
        let data = $(this).serialize();
        $.ajax({
            type:'POST',
            url:'http://www.liulongbin.top:3007/api/reguser',
            data:data,
            success:function(res){
                layer.msg(res.message);
                if(res.status==0){
                    $('.reg').hide().prev().show();
                }
            }
        })
     
    })
   $('.login form').submit(function(e){
         e.preventDefault();
         let data = $(this).serialize();
         $.ajax({
             type:'POST',
             url:'http://www.liulongbin.top:3007/api/login',
             data:data,
             success:function(res){
                layer.msg(res.message);
                if(res.status==0){
                    let token = res.token;
                    // console.log(res);
                    localStorage.setItem('tokenval',token);
                    location.href='/index.html'
                }
             }
         })
   }) 
    
    
})