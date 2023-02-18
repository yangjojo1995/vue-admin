<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="内容标题">
        <ym-input
          :maxlength="100"
          v-model="filter.title"
          placeholder="请输入"
        ></ym-input>
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
      <!-- <template slot="header-right">
        <ym-button type="primary" size="medium" @click="handleCreateItem()"
          >创建内容</ym-button
        >
      </template> -->
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
        label="内容标题"
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
      <ym-table-column prop="operator" label="更新人" min-width="120px">
        <span slot-scope="{ row }">{{ row.operator || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="更新时间" min-width="120px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="handleUpdateItem(row)">编辑</ym-link>
        </template>
      </ym-table-column>
    </ym-table-list-card>
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
  async created () {},
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.about.contentSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/notice/view',
        query: { id: row.id }
      })
    },
    // 创建
    handleCreateItem () {
      this.$router.push({
        path: '/about/edit'
      })
    },
    // 编辑
    handleUpdateItem (row) {
      this.$router.push({
        path: '/about/edit',
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
