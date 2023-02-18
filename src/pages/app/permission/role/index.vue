<template>
  <div class="page">
    <ym-form-filter-card :model.sync="filter" @model-change="updateRecordsByPage(1)">
      <ym-form-item label="角色名称">
        <ym-input v-model="filter.roleName" placeholder="请输入"></ym-input>
      </ym-form-item>
    </ym-form-filter-card>

    <ym-table-list-card
      row-key="roleId"
      :loading="loading"
      :data="records"
      :current-page.sync="paging.page"
      :page-size.sync="paging.size"
      :total="total"
      @current-change="updateRecordsByPage"
      @size-change="updateRecordsByPage(1)"
      @sort-change="sortRecords">

      <template slot="header-right">
        <ym-button v-if="$auth('create')" type="primary" size="medium" @click="handleCreateItem()">添加</ym-button>
      </template>

      <ym-table-column prop="roleName" label="角色名称" min-width="200px" disabled-toggle></ym-table-column>
      <ym-table-column prop="state" label="状态" sortable="custom" min-width="200px" align="center">
        <template slot-scope="{ row }">
          <ym-link v-if="row.state === 0" type="info" size="mini">删除</ym-link>
          <ym-link v-else-if="row.state === 1" type="success" size="mini">可用</ym-link>
          <ym-link v-else-if="row.state === 2" type="danger" size="mini">停用</ym-link>
        </template>
      </ym-table-column>

      <ym-table-column label="操作" min-width="200px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link v-if="$auth('update')" type="primary" @click="handleUpdateItem(row)">编辑</ym-link>
          <ym-link v-if="$auth('bindAuth')" type="primary" @click="handleItemBindRole(row)">绑定权限</ym-link>
          <ym-link v-if="$auth('enable') && row.state === 2" type="primary" @click="handleEnableItem(row)">启用</ym-link>
          <ym-link v-if="$auth('disable') && row.state === 1" type="danger" @click="handleDisableItem(row)">停用</ym-link>
          <ym-link v-if="$auth('delete') && row.state !== 0" type="danger" @click="handleDeleteItem(row)">删除</ym-link>
          <ym-link v-if="$auth('recover') && row.state === 0" type="primary" @click="handleRecoverItem(row)">恢复</ym-link>
        </template>
      </ym-table-column>

    </ym-table-list-card>

    <RoleDialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      @submit-success="updateRecords()">
    </RoleDialog>
    <RoleBindAuthDialog
      :visible.sync="roleBindAuthDialogVisible"
      :data="dialogData"
      @submit-success="updateRecords()">
    </RoleBindAuthDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import RoleDialog from './_components/RoleDialog'
import RoleBindAuthDialog from './_components/RoleBindAuthDialog'
export default {
  mixins: [PageSingleList],
  components: { RoleDialog, RoleBindAuthDialog },
  data () {
    return {
      filter: {
        roleName: ''
      },

      dialogVisible: false,
      dialogData: null,

      roleBindAuthDialogVisible: false
    }
  },
  async created () {
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.app.getRolePage({
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

    // 编辑
    handleUpdateItem (row) {
      this.dialogData = row
      this.dialogVisible = true
    },

    // 启用
    handleEnableItem (rows, clearSelection) {
      if (!Array.isArray(rows)) rows = [rows]
      this.$confirm('是否启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.updateRoleState({ ids: rows.map(row => row.roleId), state: 1 })
        this.$message.success('启用成功')
        clearSelection && clearSelection()
        await this.updateRecords()
      }).catch(() => {})
    },

    // 停用
    handleDisableItem (rows, clearSelection) {
      if (!Array.isArray(rows)) rows = [rows]
      this.$confirm('是否停用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.updateRoleState({ ids: rows.map(row => row.roleId), state: 2 })
        this.$message.success('停用成功')
        clearSelection && clearSelection()
        await this.updateRecords()
      }).catch(() => {})
    },

    // 恢复
    handleRecoverItem (rows, clearSelection) {
      if (!Array.isArray(rows)) rows = [rows]
      this.$confirm('是否恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.updateRoleState({ ids: rows.map(row => row.roleId), state: 1 })
        this.$message.success('恢复成功')
        clearSelection && clearSelection()
        await this.updateRecords()
      }).catch(() => {})
    },

    // 删除
    handleDeleteItem (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.deleteRole({ roleId: row.roleId })
        this.$message.success('删除成功')
        await this.updateRecords()
      }).catch(() => {})
    },
    // 绑定权限
    handleItemBindRole (row) {
      this.dialogData = row
      this.roleBindAuthDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

.el-tag {
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
}

.ym-table-list-card ::v-deep {
  td[class*="column_1 "] .cell {
    display: flex;
    // flex-wrap: wrap;
    .el-table__indent,
    .el-table__placeholder {
      flex-shrink: 0;
      flex-grow: 0;
    }
    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.tree-list-name-tag {
  margin-left: 8px;
  vertical-align: middle;
}
</style>
