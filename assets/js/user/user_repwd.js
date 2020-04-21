$(function () {
    var form = layui.form;

    // 使用表单验证功能
    form.verify({
        // key: value 
        // 验证规则: 数组 或者 函数

        len: [/^[\S]{6,12}$/, '密码长度必须6~12位'], //{6,12} 不是 {6, 12}

        // 新密码和原密码不能相同
        diff: function (value) {
            // value 表示我们填写的新密码
            // 获取原密码
            var old = $('input[name="oldPwd"]').val();
            if (old === value) {
                return '新旧密码不能一样';
            }
        },

        // 两次新密码必须一样
        same: function (value) {
            // 获取新密码
            var newPwd = $('input[name="newPwd"]').val();
            if (newPwd !== value) {
                return '两次密码不一致';
            }
        }
    });

    // 表单提交的时候。完成ajax请求
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.post('/my/updatepwd', $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('更新密码成功');
            $('.layui-form')[0].reset(); // 重置表单
        });
    });
})