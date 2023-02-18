/**
 * 用户登录信息路由守卫
 */
export default [
  // 全部页面都需要登录
  { path: '/', auth: true },
  { path: '/app/init', auth: false },
  { path: '/example/large-screen-demo/demo_1', auth: false }

  // 后申明规则会覆盖前规则（下面例子是，全部页面都要登录，但是/test除外）
  // { path: '/', auth: true }
  // { path: '/test', auth: false }

  // 支持校验，auto 规则是 async-validator 对用户信息对象校验的规则（下面例子是必须要登录且用户id必须是1, 2, 3其中之一）
  // { path: '/test', auth: { userId: { type: 'enum', enmu: [1, 2, 3] } } }

]

/**
 * 左侧菜单配置
 */
export const menu = [
  {
    icon: 'zhanshou',
    label: '用户管理',
    children: [
      { label: '待审核', href: '/user-manager/review' },
      { label: '全部用户', href: '/user-manager' }
    ]
  },
  {
    icon: 'zhanshou',
    label: '业务管理',
    children: [
      { label: '项目管理', href: '/project' },
      { label: '活动管理', href: '' }
    ]
  },
  {
    icon: 'zhanshou',
    label: '系统管理',
    children: [
      { label: '公告管理', href: '/user-manager/review' },
      { label: '广告管理', href: '' },
      { label: '员工管理', href: '/role/employee' },
      { label: '操作日志', href: '' }
    ]
  }, {
    icon: 'zhanshou',
    label: '3.0权限',
    children: [
      { label: '用户管理', href: '/app/account/user' },
      { label: '机构管理', href: '/app/account/branch' },
      { label: '角色管理', href: '/app/permission/role' },
      { label: '权限管理', href: '/app/permission/auth' }
    ]
  }
]
