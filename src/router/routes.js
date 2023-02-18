export default [

  // 此文件可以实现自定义路由绑定
  // 可以在此处添加自定义路由
  // 例：{ path: '/demo', component: () => import('@/views/demo'), meta: { title: 'demo' } }

  // 应用框架默认的全局页面。
  // 如果需要修改，可重新定义路由，路由不可以删除，原则上必须有以下路由。

  { path: '/403', redirect: '/app/error/403' }, // 403页面，没有权限的时候会跳到该页面
  { path: '/404', redirect: '/app/error/404' }, // 404页面，当路由不存在时跳转到该页面
  { path: '/500', redirect: '/app/error/500' }, // 500页面，服务器出错的时候跳转到该页面

  { path: '/init', redirect: '/app/init' }, // 登录页面
  { path: '/login', redirect: '/app/login' }, // 登录页面

  { path: '/my', redirect: '/app/my' }, // 个人信息页
  { path: '/my/password', redirect: '/app/my/password' }, // 个人修改密码页
  { path: '/my/message', redirect: '/app/message/my' }, // 我的消息页

  { path: '/**', redirect: '/404' }
]
