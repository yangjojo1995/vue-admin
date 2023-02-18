<template>
  <div class="page">

    <ym-table-list-card
      row-key="controlId"
      :loading="loading"
      :data="records"
      :tree-props="{ children: 'children' }"
      default-expand-all
      @current-change="updateRecordsByPage"
      @size-change="updateRecordsByPage(1)"
      @sort-change="sortRecords">

      <template slot="header-right">
        <ym-button v-if="$auth('create')" type="primary" size="medium" @click="handleCreateItem()">添加</ym-button>
      </template>

      <ym-table-column prop="controlName" label="名称" min-width="240px" disabled-toggle></ym-table-column>
      <ym-table-column prop="controlUri" label="资源" min-width="240px"></ym-table-column>
      <ym-table-column prop="weights" label="排序" sortable="custom" min-width="100px"></ym-table-column>
      <ym-table-column prop="controlCode" label="类型" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.controlCode | label(controlCodeOptions) }}</span>
        </template>
      </ym-table-column>
      <ym-table-column prop="state" label="状态" sortable="custom" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <ym-link v-if="row.state === 0" type="info" size="mini">删除</ym-link>
          <ym-link v-else-if="row.state === 1" type="success" size="mini">可用</ym-link>
          <ym-link v-else-if="row.state === 2" type="danger" size="mini">停用</ym-link>
        </template>
      </ym-table-column>

      <ym-table-column label="操作" min-width="180px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link v-if="$auth('create')" type="primary" @click="handleCreateItem(row)">添加</ym-link>
          <ym-link v-if="$auth('update')" type="primary" @click="handleUpdateItem(row)">编辑</ym-link>
          <ym-link v-if="$auth('enable') && row.state === 2" type="primary" @click="handleEnableItem(row)">启用</ym-link>
          <ym-link v-if="$auth('disable') && row.state === 1" type="danger" @click="handleDisableItem(row)">停用</ym-link>
          <ym-link v-if="$auth('delete') && row.state !== 0" type="danger" @click="handleDeleteItem(row)">删除</ym-link>
          <ym-link v-if="$auth('recover') && row.state === 0" type="primary" @click="handleRecoverItem(row)">恢复</ym-link>
        </template>
      </ym-table-column>

    </ym-table-list-card>

    <AuthDialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      :parent="dialogParent"
      @submit-success="updateRecords()">
    </AuthDialog>
  </div>
</template>

<script>
import tree from '@/utils/tree'
import PageSingleList from '@/mixins/PageSingleList'
import AuthDialog from './_components/AuthDialog'
export default {
  mixins: [PageSingleList],
  components: { AuthDialog },
  data () {
    return {
      refreshToTop: false,
      filter: {},

      dialogVisible: false,
      dialogData: null,
      dialogParent: null,

      controlCodeOptions: [
        { label: '页面', value: 1 },
        { label: '按钮', value: 2 },
        { label: '接口', value: 3 },
        { label: '其他', value: 4 }
      ]
    }
  },
  async created () {
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      const list = await this.$service.app.getAuthList({
        entity,
        orders
      })
      const listTree = tree(list, 'fatherId', 'controlId')
      return { total: listTree.length, records: listTree }
    },

    // 添加
    handleCreateItem (row) {
      this.dialogParent = row || null
      this.dialogData = null
      this.dialogVisible = true
    },

    // 编辑
    handleUpdateItem (row) {
      this.dialogParent = null
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
        await this.$service.app.updateAuthState({ ids: rows.map(row => row.controlId), state: 1 })
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
        await this.$service.app.updateAuthState({ ids: rows.map(row => row.controlId), state: 2 })
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
        await this.$service.app.updateAuthState({ ids: rows.map(row => row.controlId), state: 1 })
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
        await this.$service.app.deleteAuth({ controlId: row.controlId })
        this.$message.success('删除成功')
        await this.updateRecords()
      }).catch(() => {})
    },

    // 绑定机构
    handleItemBindBranch (row) {
      this.dialogData = row
      this.userBindDialogVisible = true
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
