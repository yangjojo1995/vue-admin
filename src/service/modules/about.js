import request from '@/utils/request'

// 内容列表查询
export const contentSearch = async (params, config) => request.post('/backstage/content/search', params, config)
// 内容更新或新增
export const contentUpdate = async (params, config) => request.put('/backstage/content/update', params, config)
// 查看内容详情
export const contentInfo = async (params, config) => request.get('/backstage/content/info', { params }, config)
export default {
  contentSearch,
  contentUpdate,
  contentInfo
}
