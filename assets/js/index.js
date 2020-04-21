$(function () {

    // 1. 退出
    $('#logout').on('click', function () {
        // 1. 询问是否要退出
        //询问框

        layer.confirm('你确定要退出吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            // 点击确定，执行这个函数
            // alert(111);
            // 2. 用户点击了确定，删除token，同时跳转到login.html
            localStorage.removeItem('token');
            location.href = '/login.html';
        }, function () {
            // 点击取消，执行这个函数
            // alert(222); 
            // 点击取消，什么都不做
        });
  
    });


    // 2. 获取用户信息
    getUserInfo();

})

// 自定义的函数，放到入口函数外部
// 因为如果放到入口函数内部，其他位置则不能调用它
function getUserInfo () {
    // 1. 发送请求，获取用户信息
    $.ajax({
        url: '/my/userinfo',
        // ajax请求成功之后出发success
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // 2. 渲染页面
            renderHtml(res.data);
        },
        // // complete，在ajax请求完成之后触发（无论成功或失败都会触发）
        // complete: function (xhr) {
        //     // 可以保证，这里面的代码一定会执行
        //     // 判断，如果获取用户信息失败，说明该用户没有登录。那么需要跳转到login.html
        //     // console.log(xhr);
        //     if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
        //         // 说明用户没有登录
        //         location.href = '/login.html'
        //     }
        // },
        
    });
    
}

// 渲染页面的函数
function renderHtml (data) {
    // 1. 获取字体头像
    // 有昵称，用昵称；没有昵称，用账号
    // 给name赋值；值优先使用data.nickname。如果data.nickname为false，则使用 || 后面的值
    var name = data.nickname || data.username;
    // 获取第一个字母或中文
    var firstText = name.substr(0, 1).toUpperCase();  // substring()  slice()
    if (data.user_pic) {
        // 显示图片
        $('.person img').show().attr('src', data.user_pic);
        // 隐藏字体头像
        $('.text-avatar').hide();
    } else {
        // 隐藏图片
        $('.person img').hide();
        // 显示字体头像
        $('.text-avatar').css('display', 'inline-block').text(firstText);
    }
    // 设置欢迎语
    $('.welcome').html('欢迎你&nbsp;&nbsp;' + name);
}