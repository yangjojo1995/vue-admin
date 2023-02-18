import request from '@/utils/request'

// ======================== 项目管理（mock阶段） ========================
// 查询项目列表
export const getProject = async (params, config) => request.post('/backstage/dict-item/info', params, config)
// 查询项目详情
export const getProjectDetails = async (params, config) => request.get('/backstage/project/info', { params }, config)
// 创建项目详情
export const insertProjectDetails = async (params, config) => request.post('/backstage/project/insert', params, config)
// 编辑项目详情
export const updateProjectDetails = async (params, config) => request.post('/backstage/project/update', params, config)
// 编辑项目状态
export const stausProjectDetails = async (params, config) => request.post('/backstage/project/update/status', params, config)
export default {
  getProject,
  getProjectDetails,
  insertProjectDetails,
  updateProjectDetails,
  stausProjectDetails
}
