<template>
  <div class="page">

    <ym-table-list-card
      class="ym-table-list-card"
      ref="table"
      row-key="id"
      :loading="loading"
      :height="460"
      :data="records"
      :current-page.sync="params.page"
      :page-size.sync="params.size"
      :total="total"
      :show-search="true"
      :search.sync="params.loginName"
      search-placeholder="请输入账号搜索"
      @search="handleSearch"
      @sort-change="sortRecords"
      @size-change="updateRecordsByPage(1)"
      @current-change="updateRecordsByPage">

      <ym-table-column type="index" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="avatar" label="图片" width="84px" align="center" :toggle="false">
        <ym-image class="avatar" slot-scope="{ row }" :src="$assets(row.avatar)" alt=""></ym-image>
      </ym-table-column>
      <ym-table-column prop="loginName" label="账号" min-width="120px"></ym-table-column>
      <ym-table-column prop="userName" label="姓名" min-width="120px" disabled-toggle></ym-table-column>
      <ym-table-column prop="groupObject" label="机构" min-width="200px" :toggle="false">
        <template slot-scope="{ row }">
          <el-tag class="el-tag" v-for="item in row.groupObject" :key="item.id" size="mini" type="info">{{ item.groupName }}</el-tag>
        </template>
      </ym-table-column>
      <ym-table-column prop="roleObject" label="角色" min-width="120px">
        <template slot-scope="{ row }">
          <el-tag class="el-tag" v-for="item in row.roleObject" :key="item.id" size="mini" type="info">{{ item.roleName }}</el-tag>
        </template>
      </ym-table-column>
      <ym-table-column prop="phone" label="手机号" width="120px"></ym-table-column>
      <ym-table-column prop="email" label="电子邮箱" width="120px" :toggle="false"></ym-table-column>
      <ym-table-column prop="status" label="状态" width="102px" align="center">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" :disabled="isAdmin(row) || isMy(row)" @change="handleLockUser(row)"></el-switch>
        </template>
      </ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" width="120px" align="center" :toggle="false">
        <template slot-scope="{ row }">
          <div>{{ row.createTime | dateFormat('YYYY-MM-DD') }}</div>
          <div>{{ row.createTime | dateFormat('HH:mm:ss') }}</div>
        </template>
      </ym-table-column>
      <ym-table-column label="操作" width="102px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" :disabled="isAdmin(row)" @click="$router.push({ path: 'user/update/basic', query: { id: row.id } })">编辑</ym-link>
          <ym-link type="danger" :disabled="isAdmin(row) || isMy(row)" @click="handleRemoveUser(row)">删除</ym-link>
        </template>
      </ym-table-column>

      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="$router.push({ path: 'user/update/basic', query: { groupId: params.groupId } })">添加用户</ym-button>
      </template>

      <template slot="aside">
        <ym-tree class="ym-tree" :data="[groupTreeRoot]" node-key="id" highlight-current :props="groupTreeProps" :expand-on-click-node="false" default-expand-all>
          <div class="custom-tree-node" :class="{ 'is-active': params.groupId === data.id }" slot-scope="{ node, data }" @click="handleGroupTreeNodeClick(data)">
            <div class="custom-tree-node__text">{{ node.label }}</div>
            <div class="custom-tree-node__dropdown" @click.stop>
              <el-dropdown trigger="click" placement="bottom">
                <i class="ym-icon ym-icon-gengduo" aria-hidden="true"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="showEditGroupDialog(data)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="handleMoveRole(data, 'up')">上移</el-dropdown-item>
                  <el-dropdown-item @click.native="handleMoveRole(data, 'down')">下移</el-dropdown-item>
                  <el-dropdown-item divided @click.native="handleRemoveGroup(data)">
                    <span class="ym-text-danger">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </ym-tree>
      </template>
    </ym-table-list-card>

    <GroupDialog
      :visible.sync="groupDialogVisible"
      :data="groupDialogData"
      :group-root-id="groupTreeRoot.id"
      :group-data="[groupTreeRoot]"
      :group-props="groupTreeProps"
      @submit-success="updateGroupTree()">
    </GroupDialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import GroupDialog from './_components/GroupDialog'
import storage from '@/utils/storage'

export default {
  components: { GroupDialog },
  data () {
    return {

      loading: false,
      params: {
        page: 1,
        size: 10,
        orderField: 'createTime',
        ascend: false,

        groupId: '0',
        userName: '',
        loginName: ''
      },
      total: 0,
      records: [],

      groupTreeRoot: {},
      groupTreeChildren: [],
      groupTreeProps: {
        label: 'groupName',
        value: 'id',
        children: 'children'
      },

      groupDialogVisible: false,
      groupDialogData: null
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  async created () {
    await this.updateGroupTree()
    this.getRecordHistoryGroupIds()
    await this.updateRecordsByPage(1)
  },
  methods: {

    isAdmin (row) {
      return row.id === '101'
    },

    isMy (row) {
      return this.userInfo.userId === row.id
    },

    // 刷新列表
    async updateRecords () {
      this.loading = true
      try {
        const result = await this.$service.app.getUserPage(this.params)
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

    // 启用禁用用户
    async handleLockUser (row) {
      const status = row.status
      const msg = status === 0 ? '确定要禁用该用户吗？' : '确定要启用该用户吗？'
      return this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            row.status = status
            await this.$service.app.lockUser({
              id: row.id,
              status: row.status
            })
          } else {
            row.status = row.status === 0 ? 1 : 0
          }
        }
      })
    },

    // 删除用户
    handleRemoveUser (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.deleteUser({ id: row.id })
        this.$message.success('删除成功')
        await this.updateRecords()
      }).catch(() => {})
    },

    // 更新角色树
    async updateGroupTree () {
      this.loading = true
      const groupTree = await this.$service.app.getUserGroupTree()
      this.groupTreeRoot = groupTree
      this.groupTreeChildren = groupTree.children
      this.params.groupId = groupTree.id
      this.loading = false
      // this.handleGroupTreeNodeClick(groupTree)
    },

    // 选择角色节点
    async handleGroupTreeNodeClick (data) {
      this.$refs.table.closeAside()
      this.params.groupId = data.id
      await this.updateRecordsByPage(1)
    },

    // 编辑角色
    showEditGroupDialog (data) {
      this.groupDialogData = data
      this.groupDialogVisible = true
      this.$refs.table.closeAside()
    },

    // 移除角色
    handleRemoveGroup (data) {
      this.$confirm('此操作将永久删除该机构, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$service.app.deleteUserGroup({ id: data.id })
        this.$message.success('删除成功')
        await this.updateGroupTree()
      }).catch(() => {})
    },

    // 移动角色
    async handleMoveRole (row, type) {
      await this.$service.app.orderUserGroup({
        id: row.id,
        type: type
      })
      await this.updateGroupTree()
    },
    // 获取上次离开是否有操作记录，有记录返回
    getRecordHistoryGroupIds () {
      if (storage.getItem('historyGroupIds')) {
        this.params.groupId = storage.getItem('historyGroupIds')
        storage.setItem('historyGroupIds', undefined)
      }
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

.ym-tree {
  padding: 16px 0;
  border-top-left-radius: $--ym-card-border-radius;
  border-bottom-left-radius: $--ym-card-border-radius;

  &::v-deep {
    > .el-tree-node {
      border-radius: 6px;
    }
    .el-tree-node.is-focusable {
      .el-tree-node__content {
        background: none;
      }
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .custom-tree-node__text {
      overflow: hidden;
      font-weight: 500;
    }
    .custom-tree-node__dropdown {
      flex-shrink: 0;
      flex-grow: 0;
      width: 20px;
      text-align: center;
    }
    &.is-active {
      color: $--ym-color-primary;
      font-weight: bold;
    }
  }
}

.el-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}
</style>
