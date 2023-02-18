<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="角色名称">
        <ym-input v-model="filter.roleName" placeholder="请输入"></ym-input>
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
        <!-- v-if="$auth('create')" -->
        <ym-button
          type="primary"
          size="medium"
          @click="handleCreateItem()"
          >新建角色</ym-button
        >
      </template>

      <ym-table-column
        type="selection"
        width="56px"
        align="center"
        reserve-selection
      ></ym-table-column>

      <ym-table-column
        type="index"
        :index="startIndex"
        label="序号"
        width="56px"
        align="center"
      ></ym-table-column>
      <ym-table-column
        prop="roleName"
        label="角色名称"
        min-width="120px"
        sortable="custom"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.roleName }}</span>
      </ym-table-column>
      <ym-table-column
        prop="account"
        label="角色描述"
        min-width="120px"
        sortable="custom"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.account }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link
            v-if="$auth('update')"
            type="primary"
            @click="handleUpdateItem(row)"
            >查看</ym-link
          >
        </template>
      </ym-table-column>

      <template slot="selected-tool" slot-scope="{ selection, clearSelection }">
        <ym-button
          size="small"
          @click="handleEnableItem(selection, clearSelection)"
          >批量启用</ym-button
        >
        <ym-button
          size="small"
          @click="handleDisableItem(selection, clearSelection)"
          >批量停用</ym-button
        >
      </template>
    </ym-table-list-card>
     <roleDialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :formData="dialogData"
      @submit-success="updateRecords()">
    </roleDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import roleDialog from './_components/roleDialog'
export default {
  name: 'AllUser',
  mixins: [PageSingleList],
  components: { roleDialog },
  data () {
    return {
      filter: {
        roleName: ''
      },
      identityOptions: [],
      genderOptions: [],

      dialogVisible: false,
      dialogData: null,
      dialogTitle: '',
      userBindDialogVisible: false,
      UserBindRoleDialogVisible: false,
      checkSel: '',
      exportDialogVisible: false
    }
  },
  async created () {
    this.genderOptions = await this.$service.app.getDictionaryOptions('性别')
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.app.getUserPage({
        ...paging,
        page: paging.page - 1,
        entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.dialogData = null
      this.dialogTitle = '新建角色'
      this.dialogVisible = true
    },
    // 打开导出弹窗
    openExport () {
      this.exportDialogVisible = true
    },
    // 编辑
    handleUpdateItem (row) {
      this.dialogData = row
      this.dialogTitle = '编辑角色'
      this.dialogVisible = true
    },

    // 启用
    handleEnableItem (rows, clearSelection) {
      if (!Array.isArray(rows)) rows = [rows]
      this.$confirm('是否启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await this.$service.app.updateUserState({
            ids: rows.map(row => row.accountId),
            state: 1
          })
          this.$message.success('启用成功')
          clearSelection && clearSelection()
          await this.updateRecords()
        })
        .catch(() => {})
    },

    // 停用
    handleDisableItem (rows, clearSelection) {
      if (!Array.isArray(rows)) rows = [rows]
      this.$confirm('是否停用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await this.$service.app.updateUserState({
            ids: rows.map(row => row.accountId),
            state: 2
          })
          this.$message.success('停用成功')
          clearSelection && clearSelection()
          await this.updateRecords()
        })
        .catch(() => {})
    },

    // 恢复
    handleRecoverItem (rows, clearSelection) {
      if (!Array.isArray(rows)) rows = [rows]
      this.$confirm('是否恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await this.$service.app.updateUserState({
            ids: rows.map(row => row.accountId),
            state: 2
          })
          this.$message.success('恢复成功')
          clearSelection && clearSelection()
          await this.updateRecords()
        })
        .catch(() => {})
    },

    // 删除
    handleDeleteItem (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await this.$service.app.deleteUser({ accountId: row.accountId })
          this.$message.success('删除成功')
          await this.updateRecords()
        })
        .catch(() => {})
    },

    // 绑定机构
    handleItemBindBranch (row) {
      this.dialogData = row
      this.userBindDialogVisible = true
    },

    // 绑定角色
    handleItemBindRole (row) {
      this.dialogData = row
      this.UserBindRoleDialogVisible = true
    }
  }
}
</script>
