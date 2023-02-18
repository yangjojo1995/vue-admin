<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="用户名称">
        <ym-input v-model="filter.realName" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="联系电话">
        <ym-input v-model="filter.mobile" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="注册日期">
        <ym-date-picker
          v-model="filter.registDate"
          type="date"
          placeholder="请选择"
        ></ym-date-picker>
      </ym-form-item>
      <ym-form-item label="邀请人">
        <ym-input v-model="filter.Invitee" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="性别">
        <ym-select v-model="filter.gender" placeholder="请选择" clearable>
          <ym-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="身份">
        <ym-select v-model="filter.identity" placeholder="请选择" clearable>
          <ym-option
            v-for="item in identityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </ym-option>
        </ym-select>
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
          >新增</ym-button
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
        prop="realName"
        label="用户名称"
        min-width="120px"
        sortable="custom"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.realName }}</span>
      </ym-table-column>
      <ym-table-column
        prop="account"
        label="账号"
        min-width="120px"
        sortable="custom"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.account }}</span>
      </ym-table-column>
      <ym-table-column
        prop="mobile"
        label="手机号"
        min-width="120px"
        sortable="custom"
      >
        <span slot-scope="{ row }">{{ row.mobile }}</span>
      </ym-table-column>
      <ym-table-column
        prop="email"
        label="邮箱"
        min-width="140px"
        sortable="custom"
      >
        <span slot-scope="{ row }">{{ row.email }}</span>
      </ym-table-column>
      <ym-table-column
        prop="identity"
        label="身份"
        sortable="custom"
        min-width="160px"
      >
        <span slot-scope="{ row }">{{
          row.identity | label(identityOptions)
        }}</span>
      </ym-table-column>
      <ym-table-column
        prop="createTime"
        label="注册时间"
        sortable="custom"
        min-width="160px"
      >
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column
        prop="updateTime"
        label="身份创建时间"
        sortable="custom"
        min-width="160px"
      >
        <span slot-scope="{ row }">{{
          row.updateTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
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
     <UserDialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      @submit-success="updateRecords()">
    </UserDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import UserDialog from '../_components/UserDialog'
export default {
  name: 'AllUser',
  mixins: [PageSingleList],
  components: { UserDialog },
  data () {
    return {
      filter: {
        realName: '',
        loginName: '',
        mobile: '',
        email: '',
        address: '',
        gender: undefined,
        createTime: undefined,
        updateTime: undefined,
        identity: undefined,
        registDate: undefined
      },
      identityOptions: [],
      genderOptions: [],

      dialogVisible: false,
      dialogData: null,

      userBindDialogVisible: false,
      UserBindRoleDialogVisible: false,
      currentOptions: [
        { label: '账号', value: 'account' },
        { label: '姓名', value: 'name' },
        { label: '手机号', value: 'account' },
        { label: '邮箱地址', value: 'account' }
      ],
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
      this.dialogVisible = true
    },
    // 打开导出弹窗
    openExport () {
      this.exportDialogVisible = true
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
