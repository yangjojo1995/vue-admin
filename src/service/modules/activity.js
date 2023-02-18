import request from '@/utils/request'

// ======================== 项目管理（mock阶段） ========================
// 查看活动列表
export const activitySearch = async (params, config) => request.post('/backstage/activity/search', params, config)
// 查看活动详情
export const activityInfo = async (params, config) => request.get('/backstage/activity/info', { params }, config)
// 生成活动二维码
export const qrCode = async (params, config) => request.post('/backstage/activity/create/qr-code', params, config)
// 创建活动
export const activityCreate = async (params, config) => request.post('/backstage/activity/create', params, config)
// 编辑活动
export const activityUpdate = async (params, config) => request.put('/backstage/activity/update', params, config)
// 修改活动状态（结束项目）
export const activityStatus = async (params, config) => request.put('/backstage/activity/update/status', params, config)
// 报名记录
export const activityApply = async (params, config) => request.post('/backstage/activity-apply/search', params, config)
// 签到记录
export const activitySign = async (params, config) => request.post('/backstage/activity-sign-in/search', params, config)
export default {
  activitySearch,
  activityInfo,
  qrCode,
  activityCreate,
  activityStatus,
  activityApply,
  activitySign,
  activityUpdate
}
