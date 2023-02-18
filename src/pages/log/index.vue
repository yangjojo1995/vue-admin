<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="操作人姓名">
        <ym-input
          :maxlength="100"
          v-model="filter.userName"
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
      <ym-table-column
        type="index"
        :index="startIndex"
        label="序号"
        width="56px"
        align="center"
      ></ym-table-column>
      <ym-table-column
        prop="userName"
        disabled-toggle
        label="操作人姓名"
        min-width="100px"
      >
        <div slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.userName"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.userName || "-" }}</span>
          </el-tooltip>
        </div>
      </ym-table-column>
      <ym-table-column prop="operationType" label="操作内容" min-width="100px">
        <span slot-scope="{ row }"
          >{{ row.operationType }}{{ row.operationModule }}</span
        >
      </ym-table-column>
      <ym-table-column prop="publisherInfo" label="变更前" min-width="140px">
        <div slot-scope="{ row }">
          <div class="change-list" v-if="row.modifyJson.length > 0">
            <p v-for="(item, index) in row.modifyJson" :key="index">
              {{ item.fieldAlias }}:{{ item.oldValue }}
            </p>
          </div>
          <div v-else>-</div>
        </div>
      </ym-table-column>
      <ym-table-column prop="publisherInfo" label="变更后" min-width="140px">
        <div slot-scope="{ row }">
          <div class="change-list" v-if="row.modifyJson.length > 0">
            <p v-for="(item, index) in row.modifyJson" :key="index">
              {{ item.fieldAlias }}:{{ item.newValue }}
            </p>
          </div>
          <div v-else>-</div>
        </div>
      </ym-table-column>
      <ym-table-column prop="operationIp" label="IP地址" min-width="100px">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.operationIp"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.operationIp || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column prop="region" label="操作环境" min-width="100px">
        <span slot-scope="{ row }">{{ row.region || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="操作时间" min-width="120px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
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
  name: 'log',
  mixins: [PageSingleList],
  components: {},
  data () {
    return {
      filter: {
        userName: ''
      },
      dialogVisible: false,
      dialogData: null,
      dialogEnd: false,
      userBindDialogVisible: false,
      UserBindRoleDialogVisible: false,
      tempId: '',
      statusOptions: [],
      typeOptions: []
    }
  },
  async created () {},
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
      return this.$service.app.operationList({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.$router.push({
        path: '/activity/edit',
        query: { type: 'add' }
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/activity/view',
        query: { id: row.id }
      })
    },
    // 编辑
    handleUpdateItem (row) {
      this.$router.push({
        path: '/activity/edit',
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
            status: 'end',
            id: row.id
          }
          await this.$service.activity.activityUpdate(params)
          this.$message.success('操作成功')
          this.updateRecordsByPage(1)
        })
        .catch(() => {})
    },
    // 结束
    endActivity (row) {
      this.tempId = row.id
      this.dialogEnd = true
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
.change-list p {
  margin: 0;
}
</style>
