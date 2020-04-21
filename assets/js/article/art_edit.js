$(function () {
    var form = layui.form;
    
    // 1. 获取分类，通过模板引擎渲染，更新渲染
    // 获取所有的分类，并渲染
    renderCategory();
    function renderCategory() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log('分类:', res);
                var strHtml = template('tpl-category', res);
                $('#category').html(strHtml);
                // 对于动态创建了select框，必须更新渲染
                form.render('select'); // 对页面中的select框从新渲染
            }
        });
    }
    // 2. 初始化富文本编辑器
    initEditor();

    // 3. 剪裁区，显示
    // 处理封面图片
    // 图片处理 1 ：显示剪裁窗口（初始化剪裁插件）
    var $image = $('#image');
    
    var option = {
        // 纵横比，宽高比
        aspectRatio: 400 / 280,
        // 指定预览的盒子
        preview: '.img-preview',
        // 默认剪裁区的大小
        autoCropArea: 1
    }


    // 图片处理 2 ：点击按钮的时候，应该能够切换图片
    // 点击按钮，相当于点击了文件域，所以能够显示选择图片的窗口
    $('#chooseImage').click(function () {
        $('#file').click();
    });
    // 如果检测到文件域的内容改变了。则 销毁剪裁区 --> 更换图片 --> 重新生成剪裁区
    $('#file').change(function () {
        // 找到图片的图片（文件对象）
        var fileObj = this.files[0];
        // 生成一个临时的url
        var url = URL.createObjectURL(fileObj);
        // console.log(url);
        // 销毁剪裁区 --> 更换图片 --> 重新生成剪裁区
        $image.cropper('destroy').attr('src', url).cropper(option);
    });


    // -----------------------------------  前面是复制过来的 -------------------

    // 获取地址栏的id
    // 方案一
    // var id = location.search;
    // console.log(id); // ?id=69

    // 方案二
    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    // console.log(id); // 69

    // ajax请求当前这篇文章的详细信息
    $.ajax({
        url: '/my/article/' + id,
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取文章失败');
            }
            // 获取当前文章信息成功，把数据渲染到表单中
            // form.val(表单, 对象数据);
            form.val('f1', res.data);
            // 图片的url
            var picUrl = 'http://www.liulongbin.top:3007' + res.data.cover_img;
            // console.log(picUrl);
            
            $image.cropper('destroy').attr('src', picUrl).cropper(option);
        }
    });
    // 给表单赋值


    // 后面点击发布和存为草稿和添加文章是一样的了
    // 定义一个变量，表示文章的状态
    var s = '';
    // 给发布和存为草稿分别注册一个单击事件
    $('button:contains("发布")').click(function () {
        s = '已发布';
    });
    $('button:contains("存为草稿")').click(function () {
        s = '草稿';
    });

    // 当表单提交的时候，表示要发布文章或存为草稿
    $('form').on('submit', function (e) {
        e.preventDefault();
        // 使用FormData收集表单数据
        var fd = new FormData(this);
        // 一定要检查一下，表单各项是否有name属性
        // 表单各项name属性值，是否和接口要求的参数一致
        // 经过检查，fd，包含title、cate_id、content
        // 自己追加状态
        fd.append('state', s);
        // 自己追加id
        fd.append('Id', id);

        // 图片处理 3 ：实现剪裁，获取到图片
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) {
             // 到此为止，图片剪裁工作做完了，得到一个二进制的图片，是形参 blob
             // 向fd中追加图片
             fd.append('cover_img', blob);
             // fd中已经包含5个值了，能够满足接口的要求了。所以下面发送ajax请求
             $.ajax({
                 type: 'POST',
                 url: '/my/article/edit',
                 data: fd,
                 // 数据是FormData对象，所以必须指定下面两项
                 processData: false,
                 contentType: false,
                 success: function (res) {
                     if (res.status !== 0) {
                         return layer.msg(res.message);
                     }
                     // 成功了
                     layer.msg(s + '成功');
                     // 跳转到列表页
                     location.href = '/article/art_article.html';
                 }
             });
        });
    });
})