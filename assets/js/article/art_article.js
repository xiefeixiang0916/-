$(function () {

    // 加载分页模块
    var laypage = layui.laypage;
    // 加载表单模块
    var form = layui.form;

    // 模板引擎的过滤器函数，处理时间
    // template.defaults.imports.函数名 = function (形参) {
    //     return 一个值
    // }
    template.defaults.imports.formatDate = function (t) {
        // console.log(t);
        var d = new Date(t); // 根据传入的t，创建一个时间日期对象
        var year = d.getFullYear();
        var month = addZero(d.getMonth() + 1);
        var day = addZero(d.getDate());
        var hour = addZero(d.getHours());
        var minute = addZero(d.getMinutes());
        var second = addZero(d.getSeconds());
        return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    }

    // 补零函数
    function addZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 获取文章列表的请求参数
    var queryObj = {
        pagenum: 1, // 页码值，默认显示第1页
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 分类id
        state: '' // 文章状态，可选的值：已发布  草稿
    };

    // 完成搜索功能
    // 监听搜索区的表单 提交 事件。当表单提交的时候，获取下拉框的值。给请求参数赋值，从新渲染列表
    $('form').on('submit', function (e) {
        e.preventDefault();
        var searchParams = $(this).serializeArray();
        console.log(searchParams);
        // 重置获取文章列表时的请求参数
        queryObj.cate_id = searchParams[0].value;
        queryObj.state = searchParams[1].value;
        // 从新渲染列表
        renderArticleList();
    })

    // 获取文章列表，并渲染到页面中
    renderArticleList();

    function renderArticleList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: queryObj,
            success: function (res) {
                console.log(res);
                // 通过模板引擎渲染结果到页面
                var strHtml = template('tpl-list', res);
                $('tbody').html(strHtml);
                // 数据列表渲染成功，然后调用分页函数
                showPage(res.total);
            }
        });
    }

    // 定义分页的函数
    function showPage(c) {
        laypage.render({
            elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
            count: c, //数据总数，从服务端得到
            curr: queryObj.pagenum, // 默认显示第几页
            limit: 2, // 每页显示多少条
            layout: ['prev', 'page', 'next', 'limit', 'skip'],
            limits: [2, 3, 4, 5, 10],
            // jump是一个事件。（事件的特点是，不触发不会执行）
            // 点击页码的时候，jump事件会触发
            jump: function (obj, first) {
                // 参数obj，就是上面的基础参数（elem/count/curr/....）
                // console.log(first); // first开始是true，再次点击页面的时候是undefined
                //首次不执行
                // 重新设置请求参数，然后从新渲染页面
                if (!first) {
                    //do something
                    queryObj.pagenum = obj.curr;
                    queryObj.pagesize = obj.limit;
                    renderArticleList();
                }
            }
        });
    }


    // 获取分类，并渲染
    renderCategory();
    function renderCategory () {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                console.log('分类:', res);
                var strHtml = template('tpl-category', res);
                $('#category').html(strHtml);
                // 对于动态创建了select框，必须更新渲染
                form.render('select'); // 对页面中的select框从新渲染
            }
        });
    }


    // 删除文章
    $('body').on('click', '.deleteArt', function () {
        // layer.confirm('提示语', 可选的对象, function (index) {
        // index是当前询问框的标志（索引）
        //     // 点击确定后，触发的函数
        // layer.close(index);
        // });
        // 获取id
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗？', function (index) {
            // 发送请求，完成删除
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除成功');
                    // 从新渲染
                    renderArticleList();
                }
            });
            // 关闭弹层
            layer.close(index);
        });
    })



    // 点击编辑的时候，让页面跳转
    $('body').on('click', '.editArticle', function () {
        // 获取事件源上的data-id属性
        var id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?id=' + id;
    });
})