import request from '@/utils/request'

// ======================== 项目管理（mock阶段） ========================
// 公告列表
export const announcementSearch = async (params, config) => request.post('/backstage/announcement/search', params, config)
// 查看公告详情
export const announcementInfo = async (params, config) => request.get('/backstage/announcement/info', { params }, config)
// 删除公告
export const announcementDelete = (params, config) => request.delete('/backstage/announcement/delete', { params, ...config })
// 创建公告
export const announcementCreate = async (params, config) => request.post('/backstage/announcement/create', params, config)
// 编辑公告
export const announcementUpdate = async (params, config) => request.put('/backstage/announcement/update', params, config)
// 广告列表
export const bannerSearch = async (params, config) => request.post('/backstage/banner/search', params, config)
// 创建/修改广告
export const bannerCreate = async (params, config) => request.post('/backstage/banner/create', params, config)
// 删除广告
export const bannerDelete = (params, config) => request.delete('/backstage/banner/delete', { params, ...config })
