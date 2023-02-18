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

      <template slot="header-right">
        <ym-button v-if="$auth('push')" type="primary" size="medium" @click="handleCreateItem()">推送消息</ym-button>
      </template>

      <ym-table-column type="selection" width="56px" align="center" reserve-selection></ym-table-column>

      <ym-table-column type="index" :index="startIndex" label="序号" width="56px" align="center"></ym-table-column>

      <ym-table-column prop="topic" label="消息主题" width="120px" sortable="custom"></ym-table-column>
      <ym-table-column prop="title" label="消息标题" min-width="100px" sortable="custom" disabled-toggle></ym-table-column>
      <ym-table-column prop="noticeCode" label="消息代码" min-width="100px" sortable="custom"></ym-table-column>

      <ym-table-column prop="state" label="状态" sortable="custom" width="100px">
        <template slot-scope="{ row }">
          <ym-link v-if="row.state === 0" type="info" size="mini">删除</ym-link>
          <ym-link v-else-if="row.state === 1" type="success" size="mini">可用</ym-link>
          <ym-link v-else-if="row.state === 2" type="danger" size="mini">停用</ym-link>
        </template>
      </ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" sortable="custom" width="160px">
        <span slot-scope="{ row }">{{ row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
      </ym-table-column>

      <ym-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="handleDetailItem(row)">查看</ym-link>
          <ym-link v-if="$auth('delete') && row.state !== 0" type="danger" @click="handleDeleteItem(row)">删除</ym-link>
        </template>
      </ym-table-column>

    </ym-table-list-card>

    <MessageDialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      @submit-success="updateRecords()">
    </MessageDialog>
    <MessageDetailDialog
      :visible.sync="messageDetaildialogVisible"
      :data="dialogData">
    </MessageDetailDialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PageSingleList from '@/mixins/PageSingleList'
import MessageDialog from './_components/MessageDialog'
import MessageDetailDialog from './_components/MessageDetailDialog'
export default {
  mixins: [PageSingleList],
  components: { MessageDialog, MessageDetailDialog },
  data () {
    return {
      filter: {
        topic: '',
        title: '',
        message: ''
      },

      dialogVisible: false,
      dialogData: null,

      messageDetaildialogVisible: false
    }
  },
  methods: {
    ...mapActions('user', ['updateMessageUnreadCount']),
    // 列表请求
    async requestService (paging, entity, orders) {
      await this.updateMessageUnreadCount()
      return this.$service.app.getMessagePage({
        ...paging,
        page: paging.page - 1,
        entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.dialogData = null
      this.dialogVisible = true
    },

    // 删除
    handleDeleteItem (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.deleteMessage({ noticeId: row.noticeId })
        this.$message.success('删除成功')
        await this.updateRecords()
      }).catch(() => {})
    },

    // 详情
    async handleDetailItem (row) {
      this.dialogData = row
      this.messageDetaildialogVisible = true
    }
  }
}
</script>
