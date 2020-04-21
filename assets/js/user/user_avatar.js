$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    const options = {
        // 纵横比(宽高比)
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview',
        // 去掉剪裁区的虚线
        // guides: false
    }

    // 1.3 创建裁剪区域
    // 调用插件给出的方法，创建剪裁区，并实现预览效果
    $image.cropper(options)

    // 2. 选择图片
    $('#chooseImage').on('click', function () {
        $('#file').click();
    });

    // 3. 更换剪裁图片
    // 当文件域的内容改变的时候，获取选择的图片
    $('#file').change(function () {
        // console.dir(this.files);
        if (this.files.length <= 0) {
            return layer.msg('请选择图片');
        }
        // 获取文件对象
        var fileObj = this.files[0];
        // 得到选择的图片的临时的url
        // URL 是 JS 内置对象
        // - create 创建
        var url = URL.createObjectURL(fileObj);
        // console.log(url);
        // 设置剪裁区的图片的src为url
        // $image.attr('src', url);
        // 更换剪裁区的图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', url)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 4. 确定上传单机事件
    $('#sureUpload').click(function () {
        // 开始剪裁图片
        // $image.cropper('方法名', {方法的参数});
        var canvas = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        });
        // xxx是base64格式的图片，是一个字符串
        var xxx = canvas.toDataURL();
        // console.log(xxx);
        // 发送ajax请求，更换头像
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {avatar: xxx},
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 如果成功了。重新渲染头像
                layer.msg('更改头像成功');
                window.parent.getUserInfo();
            }
        });
    });
})