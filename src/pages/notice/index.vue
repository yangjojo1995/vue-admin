<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="公告标题">
        <ym-input
          :maxlength="100"
          v-model="filter.title"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="创建人">
        <ym-input
          :maxlength="100"
          v-model="filter.creator"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="发布时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
    </ym-form-filter-card>

    <ym-table-list-card
      row-key="accountId"
      :loading="loading"
      :data="records"
      :current-page.sync="paging.page"
      :page-size.sync="paging.size"
      :total="total"
      @current-change="updateRecordsByPage"
      @size-change="updateRecordsByPage(1)"
      @sort-change="sortRecords"
    >
      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="handleCreateItem()"
          >创建公告</ym-button
        >
      </template>

      <ym-table-column
        type="index"
        :index="startIndex"
        label="序号"
        width="56px"
        align="center"
      ></ym-table-column>
      <ym-table-column
        prop="title"
        disabled-toggle
        label="公告标题"
        min-width="180px"
      >
        <div slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.title"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.title || "-" }}</span>
          </el-tooltip>
        </div>
      </ym-table-column>
      <ym-table-column prop="creatorName" label="创建人" min-width="120px">
        <span slot-scope="{ row }">{{ row.creatorName || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="发布时间" min-width="120px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="views(row)">查看</ym-link>
          <ym-link type="primary" @click="handleUpdateItem(row)"
          >编辑</ym-link
        >
          <ym-link type="danger" @click="delActivity(row)">删除</ym-link>
        </template>
      </ym-table-column>
    </ym-table-list-card>
    <!-- 询问弹窗 -->
    <endDialog
      :visible.sync="dialogEnd"
      title="告知用户结束原因"
      @submit-success="examine"
    >
    </endDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
export default {
  name: 'notice',
  mixins: [PageSingleList],
  data () {
    return {
      filter: {
        title: '',
        beginCreateTime: '',
        endCreateTime: '',
        creator: ''
      }
    }
  },
  async created () {
  },
  activated () {
    // 编辑后返回列表刷新
    if (this.$route.query.type === 'new') {
      this.updateRecordsByPage(1)
      this.$router.push({ query: {} })
    }
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.notice.announcementSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.$router.push({
        path: '/notice/edit',
        query: { type: 'add' }
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/notice/view',
        query: { id: row.id }
      })
    },
    // 编辑
    handleUpdateItem (row) {
      this.$router.push({
        path: '/notice/edit',
        query: { id: row.id }
      })
    },
    // 删除
    delActivity (row) {
      this.$confirm('确定删除此条数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          const params = {
            id: row.id
          }
          await this.$service.notice.announcementDelete(params)
          this.$message.success('操作成功')
          this.updateRecordsByPage(1)
        })
        .catch(() => {})
    },
    async examine (form) {
      const params = {
        status: 'end',
        reason: form.reason,
        id: this.tempId
      }
      await this.$service.activity.activityStatus(params)
      this.tempId = ''
      this.dialogEnd = false
      this.updateRecordsByPage(1)
      this.$message.success('操作成功')
    }
  }
}
</script>
<style>
.ellipsis {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
