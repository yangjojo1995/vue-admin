<template>
  <div class="page">
    <ym-form-filter-card :model.sync="filter" @model-change="updateRecordsByPage(1)">
      <ym-form-item label="消息主题">
        <ym-input v-model="filter.topic" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="消息标题">
        <ym-input v-model="filter.title" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="消息内容">
        <ym-input v-model="filter.message" placeholder="请输入"></ym-input>
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
      @sort-change="sortRecords">

      <ym-table-column prop="state" label="" width="50px" align="center">
        <el-tag slot-scope="{ row }" v-if="row.state !== 11" type="warning" size="mini">未读</el-tag>
      </ym-table-column>

      <ym-table-column prop="topic" label="消息主题" width="120px" sortable="custom"></ym-table-column>
      <ym-table-column prop="title" label="消息标题" min-width="200px" sortable="custom" disabled-toggle></ym-table-column>
      <ym-table-column prop="noticeCode" label="消息代码" min-width="120px" sortable="custom" :toggle="false"></ym-table-column>

      <ym-table-column prop="createTime" label="创建时间" sortable="custom" width="160px">
        <span slot-scope="{ row }">{{ row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
      </ym-table-column>

      <ym-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="handleDetailItem(row)">查看</ym-link>
        </template>
      </ym-table-column>

    </ym-table-list-card>

    <MessageDetailDialog
      :visible.sync="dialogVisible"
      :data="dialogData">
    </MessageDetailDialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PageSingleList from '@/mixins/PageSingleList'
import MessageDetailDialog from './_components/MessageDetailDialog'
export default {
  mixins: [PageSingleList],
  components: { MessageDetailDialog },
  data () {
    return {
      filter: {
        topic: '',
        title: '',
        message: ''
      },

      dialogVisible: false,
      dialogData: null

    }
  },
  methods: {
    ...mapActions('user', ['updateMessageUnreadCount']),
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.app.getMyMessageList({
        ...paging,
        page: paging.page - 1,
        entity,
        orders
      })
    },

    // 详情
    async handleDetailItem (row) {
      await this.$service.app.readMyMessage({
        noticeId: row.noticeId
      })
      await this.updateMessageUnreadCount()
      this.dialogData = row
      this.dialogVisible = true
      await this.updateRecords()
    }

  }
}
</script>
