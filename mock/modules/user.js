module.exports = [
  // 登录
  {
    url: '/business/backstage/admin/login',
    type: 'post',
    response (config) {
      return {
        code: 200,
        msg: '成功',
        data: 'token'
      }
    }
  },
  // 获取当前用户信息
  {
    url: '/business/backstage/admin/query/licence',
    type: 'get',
    response: config => {
      return {
        code: 200,
        msg: 'ok',
        data: {
          userId: '1',
          loginName: 'admin',
          token: 'token',
          userName: '管理员',
          phone: '13412345678',
          groupName: '蚁米'
        }
      }
    }
  },
  // 获取菜单
  {
    url: '/business/backstage/menu/list',
    type: 'get',
    response: config => {
      return {
        code: 200,
        msg: 'ok',
        data: []
      }
    }
  },
  // 获取菜单
  {
    url: '/business/backstage/menu/user/button',
    type: 'get',
    response: config => {
      return {
        code: 200,
        msg: 'ok',
        data: []
      }
    }
  }
]
