<template>
  <div class="page">

    <ym-table-list-card
      class="ym-table-list-card"
      ref="table"
      row-key="id"
      :loading="loading"
      :data="records"
      :current-page.sync="params.page"
      :page-size.sync="params.size"
      :total="total"
      @sort-change="sortRecords"
      @size-change="updateRecordsByPage(1)"
      @current-change="updateRecordsByPage">

      <ym-table-column type="index" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="roleName" label="名称" min-width="120px" disabled-toggle></ym-table-column>
      <ym-table-column prop="roleDesc" label="描述" min-width="256px"></ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" width="120px" align="center" :toggle="false">
        <template slot-scope="{ row }">
          <div>{{ row.createTime | dateFormat('YYYY-MM-DD') }}</div>
          <div>{{ row.createTime | dateFormat('HH:mm:ss') }}</div>
        </template>
      </ym-table-column>
      <ym-table-column label="操作" width="102px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" :disabled="row.id === '101'" @click="showEditRoleDialog(row)">编辑</ym-link>
          <ym-link type="danger" :disabled="row.id === '101'" @click="handleRemoveRole(row)">删除</ym-link>
        </template>
      </ym-table-column>

      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="showEditRoleDialog()">添加角色</ym-button>
      </template>

    </ym-table-list-card>

    <RoleDialog
      :visible.sync="roleDialogVisible"
      :data="roleDialogData"
      @submit-success="updateRecords()">
    </RoleDialog>
  </div>
</template>

<script>
import RoleDialog from './_components/RoleDialog'
export default {
  components: { RoleDialog },
  data () {
    return {

      loading: false,
      params: {
        page: 1,
        size: 10,
        orderField: 'createTime',
        ascend: false
      },
      total: 0,
      records: [],

      roleDialogVisible: false,
      roleDialogData: null
    }
  },
  created () {
    this.updateRecordsByPage(1)
  },
  methods: {
    // 刷新列表
    async updateRecords () {
      this.loading = true
      try {
        const result = await this.$service.app.getUserRolePage(this.params)
        this.total = result.total
        this.records = result.records || result.list
      } catch (error) {}
      this.loading = false
    },
    // 跳转列表
    async updateRecordsByPage (page) {
      this.params.page = page
      return this.updateRecords()
    },
    // 排序
    async sortRecords ({ prop, order }) {
      this.params.orderField = order ? prop : undefined
      this.params.ascend = order === 'descending' ? false : (order === 'ascending' ? true : undefined)
      return this.updateRecords()
    },

    // 搜索
    async handleSearch () {
      this.updateRecordsByPage(1)
    },

    // 编辑角色
    showEditRoleDialog (data) {
      this.roleDialogData = data
      this.roleDialogVisible = true
    },

    // 删除角色
    handleRemoveRole (row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.deleteUserRole({ id: row.id })
        this.$message.success('删除成功')
        await this.updateRecords()
      }).catch(() => {})
    }

  }
}
</script>

<style lang="scss" scoped>
.avatar {
  display: block;
  width: 64px;
  height: 64px;
}
</style>
