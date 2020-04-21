$(function () {

    var form = layui.form;

    // 设置添加的弹出层的索引
    var addIndex = null;
    // 设置编辑窗口的索引
    var editIndex = null;

    // 发送ajax请求，获取所有的分类
    renderHtml();
    function renderHtml() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 获取数据成功。
                // 调用template函数
                var strHtml = template('tpl-cateList', res);
                /**
                 * {
                 *      status: 0,
                 *      message: '所得税法法',
                 *      data: [{}, {}, {}]
                 * }
                 */
                // 把最终渲染的结果放到tbody中
                $('tbody').html(strHtml);
            }
            // 设置token
            // 这里不在需要设置token了。因为baseAPI里面已经写好了
        });
    }


    // 点击添加分类按钮，显示弹层
    $('#showAdd').click(function () {
        addIndex = layer.open({
            type: 1, // 层的类型，1表示页面层
            title: '添加文章类别', // 标题
            content: $('#tpl-add').html(), // 内容
            area: ['500px', '250px'], // 宽度高度
        });
    });

    // 当添加的表单提交的时候，发送ajax请求。完成添加分类
    // 事件代理或者叫做事件委托的方案来注册事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // console.log(1);
        // 获取表单的数据
        // ajax提交到接口
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                // 添加成功。
                // 1. 关闭弹层
                layer.close(addIndex);
                // 2. 从新渲染数据
                renderHtml();
            }
        });
    })


    // 删除分类
    $('body').on('click', '.deleteCate', function () {
        var that = $(this);
        layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 当前分类的id
            var id = that.attr('data-id');
            // 发送ajax请求，完成删除
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 如果删除成功，从新渲染页面
                    layer.msg('删除分类成功');
                    renderHtml();
                }
            });
            layer.close(index); // 关闭窗口
        });
    });

    // 点击编辑的时候，弹层
    $('body').on('click', '.editCate', function () {
        // 把当前分类的数据获取到
        // 使用h5提供属性dataset一次性的把标签上的data-xxx的数据全部拿到
        var shuju = this.dataset;
        // console.log(shuju); // DOMStringMap {id: "1", name: "最新", alias: "ZuiXin"}

        // 弹层
        editIndex = layer.open({
            type: 1, // 页面层
            title: '编辑分类',
            content: $('#tpl-edit').html(),
            area: ['500px', '250px'],
            // 等弹层出来之后，执行下面的success方法
            success: function () {
                // console.log(JSON.parse(JSON.stringify(shuju)));
                form.val('f1', JSON.parse(JSON.stringify(shuju)));
            }
        });
    });

    // 当编辑的表单提交的时候，发送ajax请求，完成编辑
    // $('#form-edit').submit(); // 直接注册不行，必须使用事件委托
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // console.log($(this).serialize()); // name=xxx&alias=16&id=1
        // var data = $(this).serialize().replace('id', 'Id');

        // console.log($(this).serializeArray());
        var data = $(this).serializeArray();
        data[2].name = 'Id';
        console.log(data);

        // console.log(data);
        $.post('/my/article/updatecate', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('更新分类成功');
            // 1. 从新渲染页面
            renderHtml();
            // 2. 关闭弹层
            layer.close(editIndex);
        });
    })
})