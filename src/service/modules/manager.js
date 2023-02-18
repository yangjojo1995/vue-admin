import request from '@/utils/request'
import sha256 from '@/utils/sha256'
// ======================== 项目管理（mock阶段） ========================
// 查询身份认证待审核列表
export const getAudit = async (params, config) => request.post('/backstage/audit/search', params, config)
// 审核身份认证申请
export const verifyAudit = async (data, config) => request.put('/backstage/audit/approve', data, { ...config })
// 查看申请详情
export const infoAudit = async (params, config) => request.get('/backstage/audit/info', { params }, config)
// 查询全部个人用户
export const allUserSearch = async (params, config) => request.post('/backstage/client-user/search/all', params, config)
// 查询普通用户列表
export const commonSearch = async (params, config) => request.post('/backstage/client-user/search/common', params, config)
// 查询投资经理列表
export const investmentSearch = async (params, config) => request.post('/backstage/invest-manager/search', params, config)
// 查询指导单位列表
export const observerSearch = async (params, config) => request.post('/backstage/observer/search', params, config)
// 查询普通用户详情
export const commonInfo = async (params, config) => request.get('/backstage/client-user/info/common', { params }, config)
// 查询指导单位详情
export const observerInfo = async (params, config) => request.get('/backstage/observer/info', { params }, config)
// 查询指导单位权限
export const resourceInfo = async (params, config) => request.get('/backstage/observer/info/resource', { params }, config)
// 更新指导单位权限
export const resourceUpdate = async (params, config) => request.post('/backstage/observer/update/resource', params, config)
// 查询投资经理详情
export const investInfo = async (params, config) => request.get('/backstage/invest-manager/info', { params }, config)
// 启用或禁用用户或用户身份
export const deleted = async (data, config) => request.put('/backstage/client-user/update/deleted', data, config)
// 查询投资机构列表
export const institutionSearch = async (params, config) => request.post('/backstage/invest-institution/search', params, config)
// 查询投资机构详情
export const institutionInfo = async (params, config) => request.get('/backstage/invest-institution/info', { params }, config)
// 查询企业列表
export const enterpriseSearch = async (params, config) => request.post('/backstage/enterprise/search', params, config)
// 查询企业详情
export const enterpriseInfo = async (params, config) => request.get('/backstage/enterprise/info', { params }, config)
// 查询企业用户-全部列表
export const allCompanySearch = async (params, config) => request.post('/backstage/client-user/search/all-company', params, config)
// 获取对应用户签名协议内容
export const content = async (params, config) => request.get('/backstage/pact/content', { params }, config)
// 创建投资机构
export const investCreate = async (params, config) => request.post('/backstage/invest-institution/create', params, config)
// 创建用户
export const saveUser = async (params, config) => request.post('/backstage/client-user/save', { ...params, password: sha256(params.password) }, config)
// 依据投资经理ID获取协助确权流程
export const investAssist = async (params, config) => request.get('/backstage/assist/info/by-invest-manager-id', { params }, config)
// 导出投资经理列表
export const exportInvest = async (params, config) => request.post('/backstage/invest-manager/export', params, config)
// 企业审核列表
export const enterpriseAudit = async (params, config) => request.post('/backstage/audit/enterprise', params, config)
