
module.exports = [
  // 系统初始化
  {
    url: '/business/backstage/admin/init/status',
    type: 'get',
    response (config) {
      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // 系统初始化
  {
    url: '/business/backstage/admin/init/manager',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: null,
        message: 'ok'
      }
    }
  }
]
