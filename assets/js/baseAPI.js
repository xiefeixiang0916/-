
// 后续，如果哪个页面需要发送ajax请求，则必须加载baseAPI.js
$.ajaxPrefilter(function (option) {
    // option 就是每次ajax请求时的配置对象

    // console.log(option);
    // 配置url，统一加上根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url;

    // z请求的url，如果是以  /my/ 开头的，则需要进行下面两项配置
    if (option.url.indexOf('/my/') !== -1) {
        // 配置complete
        // complete，当ajax请求完成之后触发（无论ajax请求成功还是失败都会触发）
        option.complete = function (xhr) {
            // console.log('xhr=', xhr);
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                // 清除假token
                localStorage.removeItem('token');
                // 说明用户没有登录
                location.href = '/login.html'
            }
        }
        // 配置headers
        option.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    
});