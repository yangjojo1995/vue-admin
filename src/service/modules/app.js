import CONFIG from '@/config'
import request from '@/utils/request'
import unTree from '@/utils/unTree'
// import memoize from '@/utils/memoize'
import sha256 from '@/utils/sha256'
// import { pageServiceToListService, listServiceToTreeService } from '../utils'
// import cloneDeep from '@/utils/cloneDeep'
// import dictionary from '@/dictionary'

// ================================================================================

// 系统初始化
export const appInit = (params, config) => request.post('/backstage/admin/init/manager', { ...params, password: sha256(params.password) }, config)
// 获取系统信息
export const getAppInfoStatus = async (params, config) => request.get('/backstage/admin/init/status', { params, ...config })

// 上传文件
export const uploadFile = async (params, config) => {
  return request.post(CONFIG.UPLOAD_FILE_URL || '/document/upload', params, { ...config, formData: true })
}

// ================================================================================

// 登录
export const loginByPasswd = async (params, config) => request.post('/backstage/admin/login', { ...params, password: sha256(params.password) }, config)
// 查询当前账户信息
export const getMyInfo = async (params, config) => request.get('/backstage/admin/query/licence', params, config)
// 查询当前账户权限
export const getMyAuthList = async (params, config) => unTree(await request.get('/backstage/menu/list', { params, ...config }), 'children')
// 查询当前账户权限
export const getMyButtonAuthList = async (params, config) => request.get('/backstage/menu/user/button', { params, ...config })
// 获取当前账户消息数量
export const getMyMessageCount = async (params, config) => 0
// 获取当前账户消息数量
export const updateMyPasswd = async (params, config) => request.put('/backstage/user/modify/password', { ...params, oldPassword: sha256(params.oldPassword), newPassword: sha256(params.newPassword) }, config)

// ================================================================================

// 获取用户列表（分页）
export const getUserPage = (data, config) => request.post('/backstage/user/list', data, config)
// 获取用户
export const getUser = (params, config) => request.get('/backstage/user/info', { params, ...config })
// 新增、修改用户
export const saveUser = (data, config) => request.post('/backstage/user/insert_update', data, config)
// 启用禁用用户
export const lockUser = (data, config) => request.put('/backstage/user/lock', data, { ...config })
// 删除用户
export const deleteUser = (params, config) => request.delete('/backstage/user/delete', { params, ...config })
// 重置密码用户
export const resetUserPassword = (data, config) => request.put('/backstage/admin/reset/password', data, { ...config })

// ================================================================================

// 获取用户组（树）
export const getUserGroupTree = (params, config) => request.get('/backstage/group/list', { params, ...config })
// 新增、修改用户组
export const saveUserGroup = (data, config) => request.post('/backstage/group/insert_update', data, config)
// 机构上移下移
export const orderUserGroup = (data, config) => request.put('/backstage/group/order', data, config)
// 删除用户组
export const deleteUserGroup = (params, config) => request.delete('/backstage/group/delete', { params, ...config })

// ================================================================================

// 获取角色列表（分页）
export const getUserRolePage = (data, config) => request.post('/backstage/role/list', data, config)
// 获取角色列表
export const getUserRoleList = (params, config) => request.get('/backstage/role/all', { params, ...config })
// 获取角色列表（包含管理员）
export const getUserRoleIncludeAdminList = (params, config) => request.get('/backstage/role/all-include-admin', { params, ...config })
// 新增、修改角色
export const saveUserRole = (data, config) => request.post('/backstage/role/insert_update', data, config)
// 删除角色
export const deleteUserRole = (params, config) => request.delete('/backstage/role/delete', { params, ...config })

// ================================================================================

// 获取菜单
export const getAuthTree = (params, config) => request.get('/backstage/menu/sys/list', { params, ...config })
// 新增、编辑菜单、按钮
export const saveAuth = (data, config) => request.post('/backstage/menu/insert_update', data, config)
// 删除菜列表
export const deleteAuth = (params, config) => request.delete('/backstage/menu/delete', { params, ...config })
// 获取菜列表
export const getAuthApiList = (params, config) => request.get('/backstage/menu/api-list', { params, ...config })
// 菜单上移下移
export const orderAuthApi = (data, config) => request.put('/backstage/menu/order', data, config)

// ================================================================================
// 获取字典项
export const dictSearch = (params, config) => request.get('/backstage/dict-item/list', { params, ...config })
// 根据ID查询字典
export const dictInfo = (params, config) => request.get('/backstage/dict/info', { params, ...config })
// 获取字典列表
export const dictList = (params, config) => request.post('/backstage/dict/search', params, config)
// 添加字典
export const insertList = (params, config) => request.post('/backstage/dict/insert', params, config)
// 删除字典项
export const deleteDict = (params, config) => request.delete('/backstage/dict/delete', { params, ...config })

// 根据级别查询行政区域列表

export const cityLevel = (params, config) => request.get('/public/region/list/level', { params, ...config })
// 根据级别查询行政区域列表

export const cityId = (params, config) => request.get('/public/region/list/parent-id', { params, ...config })
// 获取用户操作日志列表
export const operationList = (params, config) => request.post('/backstage/log/operation-list', params, config)
// 上传 bp文件
export const uploadBpFile = async (params, config) => {
  return request.post('/backstage/project/upload/bp', params, { ...config, formData: true })
}
