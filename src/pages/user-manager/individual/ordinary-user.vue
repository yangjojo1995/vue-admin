<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="用户名称">
        <ym-input
          v-model="filter.userName"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="手机号">
        <ym-input
          v-model="filter.phone"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="注册时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="邮箱">
        <ym-input
          v-model="filter.email"
          :maxlength="100"
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
      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="exportExcel()"
          >导出</ym-button>
      </template>
      <ym-table-column
        type="index"
        :index="startIndex"
        label="序号"
        width="56px"
        align="center"
      ></ym-table-column>
      <ym-table-column
        prop="userName"
        label="用户名称"
        min-width="120px"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{
          row.realName ? row.realName : (row.userName|| '-')
        }}</span>
      </ym-table-column>
      <ym-table-column prop="mobile" label="绑定手机号" min-width="120px">
        <span slot-scope="{ row }">{{ row.mobile|| '-' }}</span>
      </ym-table-column>
      <ym-table-column prop="email" label="绑定邮箱" min-width="140px">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.email"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.email|| '-' }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
       <ym-table-column prop="account" label="账号" :toggle="false" min-width="120px">
        <span slot-scope="{ row }">{{ row.account|| '-' }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="注册时间" min-width="160px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="views(row)">查看</ym-link>
        </template>
      </ym-table-column>
    </ym-table-list-card>
    <!-- 导出选项 -->
    <ym-export-table
      :formData="{ ...filter, ...paging }"
      :exportDialogVisible="exportDialogVisible"
      :apiUrl="apiUrl"
      excelName="普通用戶列表"
      @cancelExport="cancelExport"
    ></ym-export-table>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import Export from '@/mixins/Export'
export default {
  name: 'OrdinaryUser',
  mixins: [PageSingleList, Export],
  components: {},
  data () {
    return {
      filter: {
        userName: '',
        phone: '',
        email: '',
        beginCreateTime: undefined,
        endCreateTime: undefined
      },
      exportDialogVisible: false,
      excelName: '普通用户列表',
      apiUrl: '/backstage/client-user/export'
    }
  },
  async created () {},
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.manager.commonSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 打开导出弹窗
    async openExport () {
      this.exportDialogVisible = true
    },
    cancelExport () {
      this.exportDialogVisible = false
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/user-manager/detail/ordinary-details',
        query: { id: row.id }
      })
    }
  }
}
</script>
