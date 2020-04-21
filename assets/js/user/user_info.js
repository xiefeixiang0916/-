// 加载layui的form模块
var form = layui.form;

$(function () { 

    // 表单提交的时候，获取表单各项的值。提交给接口
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 获取输入框的信息
        var data = $(this).serialize();
        // 收集到了四项值；id、username、nickname、email
        // console.log(data);
        $.post('/my/userinfo', data, function (res) {
            console.log(res);
            // 修改失败，给出提示，终止程序执行
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // 如果成功了。从新获取用户信息，并渲染首页
            // window是当前子页面的窗口
            // parent 表示父窗口，即index.html
            window.parent.getUserInfo();
        });
    });

    // 给重置，注册事件
    $('button[type=reset]').click(function (e) {
        e.preventDefault(); // 不要清空
        initUserInfo(); // 重新为表单赋值
    });

    // 打开基本资料页面后，首先就要获取用户的基本信息
    // 并且把用户的信息，设置为input的value值
    initUserInfo();
});

function initUserInfo () {
    // 发送ajax请求
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res);
            // $('input[name="username"]').val(res.data.username);
            // $('input[name="nickname"]').val(res.data.nickname);
            // $('input[name="email"]').val(res.data.email);
            // 使用layui的form模块，快速为表单赋值
            form.val('f1', res.data);
        }
    });
}