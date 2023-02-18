import request from '@/utils/request'

// ======================== 项目管理（mock阶段） ========================
// BP确权人列表
export const assistSearch = async (params, config) => request.post('/backstage/bp/assist-member/search', params, config)
// BP确权人详情
export const assistInfo = async (params, config) => request.get('/backstage/bp/assist-member/info', { params }, config)
// 更新BP确权人
export const assistUpdate = async (params, config) => request.put('/backstage/bp/assist-member/update', params, config)
// 新增BP确权人
export const assistInsert = async (params, config) => request.post('/backstage/bp/assist-member/insert', params, config)
// 详情中，确权信息列表
export const memberSearch = async (params, config) => request.post('/backstage/bp/assist-member/assist-search', params, config)
// 详情中，确权信息列表
export const representativeList = async (params, config) => request.post('/backstage/client-user/representative-list', params, config)

export default {
  assistSearch,
  assistInfo,
  assistUpdate,
  assistInsert,
  memberSearch,
  representativeList
}
