import request from '@/utils/request'

// ======================== 项目管理（mock阶段） ========================
// 查询项目列表
export const getProject = async (params, config) => request.post('/backstage/project/search', params, config)
// 查询项目详情
export const getProjectDetails = async (params, config) => request.get('/backstage/project/info', { params }, config)
// 创建项目详情
export const insertProjectDetails = async (params, config) => request.post('/backstage/project/insert', params, config)
// 编辑项目详情
export const updateProjectDetails = async (params, config) => request.put('/backstage/project/update', params, config)
// 编辑项目状态
export const stausProjectDetails = async (params, config) => request.put('/backstage/project/update/status', params, config)
// 发布人列表
export const publisher = async (params, config) => request.post('/backstage/client-user/search/publisher', params, config)
// 预览BP
export const getBp = async (params, config) => request.get('/backstage/project/get-bp', { params }, config)

// 预览BP，根据BP的ID获取BP
export const infoBp = async (params, config) => request.get('/backstage/project/info/bp', { params }, config)
// 项目草稿列表
export const draftSearch = async (params, config) => request.post('/backstage/project/search/draft', params, config)
// 项目草稿详情
export const draftInfo = async (params, config) => request.get('/backstage/project/info/draft', { params }, config)
// 获取项目公司最近三年的财务数据
export const financeList = async (params, config) => request.get('/backstage/project/list/finance', { params }, config)
// 保存草稿
export const draftSave = async (params, config) => request.post('/backstage/project/save/draft', params, config)
// 修改项目状态，如果要停止项目，则 status 传 ‘stop’ 字符串
export const updateProjectStatus = async (params, config) => request.put('/backstage/project/update/status', params, config)
// 根据项目ID获取最新BP基本信息（不论是否已确权）
export const confirmedLatestBp = async (params, config) => request.get('/backstage/project/info/latest-bp-base', { params }, config)
// 我的项目列表（推荐单位）
export const selfSearch = async (params, config) => request.post('/backstage/project/search/self', params, config)
// 获取推荐单位列表
export const recommendUnitSearch = async (params, config) => request.post('/backstage/recommend-unit/search', params, config)
// 项目审核详情
export const projectAuditDetail = async (params, config) => request.get('/backstage/project/audit/detail', { params }, config)
// 批量项目审核
export const auditUpdate = async (params, config) => request.post('/backstage/project/audit/update', params, config)

// 项目审核列表
export const getAuditList = async (params, config) => request.post('/backstage/project/audit/search', params, config)
// 项目审核操作
export const updateAudit = async (params, config) => request.post('/backstage/project/audit/update', { projectAudits: [params] }, config)
// 审核阶段的项目详情
export const getAuditDetail = async (params, config) => request.get('/backstage/project/audit/detail', { params }, config)
// 在库项目审核查看历史变更记录
export const getAuditRecordList = async (params, config) => request.post('/backstage/project/audit/search/record', params, config)
// 根据项目id获取bp详情
export const getBpInfo = async (params, config) => request.get('/backstage/project/info/bp', { params }, config)
// 点评列表
export const commentSearch = async (params, config) => request.post('/backstage/comment/search', params, config)
// 点评操作
export const commentOperate = async (params, config) => request.post('/backstage/comment/operate', params, config)
// 点评对象操作
export const commentObjectOperate = async (params, config) => request.post('/backstage/comment/bind-object-operate', params, config)
// 点评对象列表
export const commentObjectSearch = async (params, config) => request.post('/backstage/comment/bind-object-search', params, config)
// 点评详情
export const commentContentDetail = async (params, config) => request.get('/backstage/comment/info', { params }, config)
// 点评对象详情
export const commentObjectDetail = async (params, config) => request.get('/backstage/comment/bind-object-info', { params }, config)

export const commentLikesList = async (params, config) => request.post('/backstage/comment/likes-search', params, config)

export const getDictList = async (params, config) => request.get('/backstage/dict-item/list', { params }, config)
export const updateDictDesc = async (params, config) => request.post('/backstage/project/save/complete/degree/item', params, config)
