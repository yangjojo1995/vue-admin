<template>
  <div class="page">

    <ym-table-list-card
      class="ym-table-list-card"
      row-key="id"
      :loading="loading"
      :data="records"
      :tree-props="{ children: 'children' }"
      default-expand-all>

      <ym-table-column prop="groupName" label="名称" min-width="120px" disabled-toggle>
        <template slot-scope="{ row, treeNode }">
          <span v-if="(!treeNode || treeNode.level === 0) && (!row.children || !row.children.length)" style="display: inline-block; width: 24px;"></span>
          <span :title="row.groupName">{{ row.groupName }}</span>
        </template>
      </ym-table-column>
      <ym-table-column prop="roleObject" label="角色" min-width="160px">
        <template slot-scope="{ row }">
          <el-tag v-for="(item) in row.roleObject" :key="item.id" type="info" size="small">{{ item.roleName }}</el-tag>
        </template>
      </ym-table-column>
      <ym-table-column prop="tag" label="机构类型" min-width="120px">
        <template slot-scope="{ row }">
          <el-tag size="small" type="primary">{{ row.tag }}</el-tag>
        </template>
      </ym-table-column>
      <ym-table-column prop="groupDesc" label="描述" min-width="120px"></ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" width="120px" align="center" :toggle="false">
        <template slot-scope="{ row }">
          <div>{{ row.createTime | dateFormat('YYYY-MM-DD') }}</div>
          <div>{{ row.createTime | dateFormat('HH:mm:ss') }}</div>
        </template>
      </ym-table-column>
      <ym-table-column label="操作" width="152px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="showCreateGroupDialog(row)">添加</ym-link>
          <ym-link type="primary" @click="showEditGroupDialog(row)">编辑</ym-link>
          <ym-link type="danger" :disabled="row.id === '101'" @click="handleRemoveGroup(row)">删除</ym-link>
        </template>
      </ym-table-column>

      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="showCreateGroupDialog()">添加机构</ym-button>
      </template>

    </ym-table-list-card>

    <GroupDialog
      :visible.sync="groupDialogVisible"
      :data="groupDialogData"
      :group-root-id="group.id"
      :group-data="records"
      :group-props="{ children: 'children', value: 'id', label: 'groupName' }"
      @submit-success="updateData()">
    </GroupDialog>
  </div>
</template>

<script>
import GroupDialog from './_components/GroupDialog'

export default {
  components: { GroupDialog },
  data () {
    return {
      group: {},

      loading: false,
      records: [],

      groupDialogVisible: false,
      groupDialogData: null
    }
  },
  created () {
    this.updateData()
  },
  methods: {

    // 切换页面
    async updateData () {
      this.loading = true
      const result = await this.$service.app.getUserGroupTree()
      this.group = result
      this.records = [result]
      this.loading = false
    },

    // 创建
    showCreateGroupDialog (data) {
      this.groupDialogData = {
        parentId: (data && data.id) || (this.records.length === 1 ? this.records[0].id : null)
      }
      this.groupDialogVisible = true
    },

    // 编辑
    showEditGroupDialog (data) {
      this.groupDialogData = data
      this.groupDialogVisible = true
    },

    // 移除组
    handleRemoveGroup (row) {
      this.$confirm('此操作将永久删除该机构, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.deleteUserGroup({ id: row.id })
        this.$message.success('删除成功')
        this.updateData()
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

.el-tag {
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
}

.ym-table-list-card ::v-deep {
  td[class*="column_2 "] .cell{
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
</style>
