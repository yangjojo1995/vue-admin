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
      <ym-form-item label="邀请人">
        <ym-input
          v-model="filter.inviter"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
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
      <ym-table-column prop="phone" label="绑定手机号" min-width="120px">
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
      <ym-table-column prop="type" label="身份" min-width="160px">
        <span slot-scope="{ row }">{{
          row.type || '-'
        }}</span>
      </ym-table-column>
      <ym-table-column prop="inviterName" label="邀请人" min-width="160px">
        <span slot-scope="{ row }">{{ row.inviterName|| '-' }}</span>
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
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
export default {
  name: 'AllUser',
  mixins: [PageSingleList],
  data () {
    return {
      filter: {
        userName: '',
        phone: '',
        email: '',
        inviter: '',
        beginCreateTime: undefined,
        endCreateTime: undefined
      },
      identityOptions: [],
      genderOptions: [],

      dialogVisible: false,
      dialogData: null,

      userBindDialogVisible: false,
      UserBindRoleDialogVisible: false,
      checkSel: '',
      exportDialogVisible: false
    }
  },
  async created () {},
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.manager.allUserSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 打开导出弹窗
    openExport () {
      this.exportDialogVisible = true
    },
    // 查看
    views (row) {
      if (row.type === '普通用户') {
        this.$router.push({
          path: '/user-manager/detail/ordinary-details',
          query: { id: row.id, type: 'all' }
        })
      } else if (row.type === '投资经理') {
        this.$router.push({
          path: '/user-manager/detail/investment-details',
          query: { id: row.representativeId, type: 'all' }
        })
      }
    }
  }
}
</script>
