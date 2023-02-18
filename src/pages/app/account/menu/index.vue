<template>
  <div class="page">

    <ym-table-list-card
      class="ym-table-list-card"
      row-key="id"
      :loading="loading"
      :data="records"
      :tree-props="{ children: 'children' }">

      <ym-table-column prop="label" label="名称" min-width="120px" disabled-toggle>
        <template slot-scope="{ row, treeNode }">
          <span v-if="(!treeNode || treeNode.level === 0) && (!row.children || !row.children.length)" style="display: inline-block; width: 24px;"></span>
          <span :title="row.label">{{ row.label }}</span>
          <ym-tag v-if="row.enable === 0"  class="tree-list-name-tag" type="danger" size="mini">隐藏</ym-tag>
        </template>
      </ym-table-column>
      <ym-table-column prop="icon" label="图标" width="60px" align="center">
        <ym-icon slot-scope="{ row }" :icon="row.icon"></ym-icon>
      </ym-table-column>
      <ym-table-column prop="type" label="类型" width="102px" align="center">
        <template slot-scope="{ row }">
          <ym-tag v-if="row.type === 'menu'" type="primary" size="mini">菜单</ym-tag>
          <ym-tag v-else-if="row.type === 'button'" type="success" size="mini">按钮</ym-tag>
        </template>
      </ym-table-column>
      <ym-table-column prop="href" label="节点路由" min-width="152px"></ym-table-column>
      <ym-table-column prop="className" label="选择器" min-width="152px" :toggle="false"></ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" width="120px" align="center" :toggle="false">
        <template slot-scope="{ row }">
          <div>{{ row.createTime | dateFormat('YYYY-MM-DD') }}</div>
          <div>{{ row.createTime | dateFormat('HH:mm:ss') }}</div>
        </template>
      </ym-table-column>
      <ym-table-column label="操作" width="220px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link v-show="row.type === 'menu'" type="primary" @click="showCreateMenuDialog(row)">添加</ym-link>
          <ym-link type="primary" @click="showEditMenuDialog(row)">编辑</ym-link>
          <ym-link type="primary" @click="handleMoveRole(row, 'up')">上移</ym-link>
          <ym-link type="primary" @click="handleMoveRole(row, 'down')">下移</ym-link>
          <ym-link type="danger" @click="handleRemoveMenu(row)">删除</ym-link>
        </template>
      </ym-table-column>

      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="showCreateMenuDialog()">添加</ym-button>
      </template>

    </ym-table-list-card>

    <MenuDialog
      :visible.sync="menuDialogVisible"
      :data="menuDialogData"
      :menu-data="records"
      :menu-props="{ children: 'children', value: 'id', label: 'label' }"
      @submit-success="submitSuccess()">
    </MenuDialog>
  </div>
</template>

<script>
import MenuDialog from './_components/MenuDialog'
import { mapActions } from 'vuex'

export default {
  components: { MenuDialog },
  data () {
    return {
      group: {},

      loading: false,
      records: [],

      menuDialogVisible: false,
      menuDialogData: null
    }
  },
  created () {
    this.updateData()
  },
  methods: {
    ...mapActions('user', ['updateAuth']),

    // 切换页面
    async updateData () {
      this.loading = true
      const result = await this.$service.app.getAuthTree()
      this.records = result
      this.loading = false
    },

    // 创建
    showCreateMenuDialog (data) {
      this.menuDialogData = {
        parentId: (data && data.id) || ''
      }
      this.menuDialogVisible = true
    },

    // 编辑
    showEditMenuDialog (data) {
      this.menuDialogData = data
      this.menuDialogVisible = true
    },
    // 移动
    async handleMoveRole (row, type) {
      await this.$service.app.orderAuthApi({
        id: row.id,
        type: type
      })
      await this.updateData()
      await this.submitSuccess()
    },
    // 删除
    handleRemoveMenu (row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.deleteAuth({ id: row.id })
        this.$message.success('删除成功')
        await this.updateData()
        await this.submitSuccess()
      }).catch(() => {})
    },

    async submitSuccess () {
      return Promise.all([
        this.updateData(),
        this.updateAuth()
      ])
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
