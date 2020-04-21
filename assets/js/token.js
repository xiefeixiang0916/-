// 如果登录了。则会有token保存。如果没有登录，没有token
// console.log(typeof localStorage.getItem('token'))

// 判断，如果没有token。就让跳转到登录页
if (!localStorage.getItem('token')) {
    // console.log(2222)
    location.href = '/login.html';
}