<template>
  <ym-dialog
    :title="title"
    width="60vw"
    top="5vh"
    :visible.sync="currentVisible"
  >
    <div>
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
      </ym-form-filter-card>

      <ym-table-list-card
        row-key="accountId"
        :loading="loading"
        :data="records"
        height="45vh"
        :current-page.sync="paging.page"
        :page-size.sync="paging.size"
        :total="total"
        :enableFilterColumn="false"
        @current-change="updateRecordsByPage"
        @size-change="updateRecordsByPage(1)"
        @sort-change="sortRecords"
      >
        <ym-table-column
          prop="userName"
          label="用户名称"
          min-width="120px"
          disabled-toggle
        >
          <span slot-scope="{ row }">{{
            row.realName ? row.realName : (row.userName || '-')
          }}</span>
        </ym-table-column>
        <ym-table-column prop="mobile" label="手机号" min-width="120px">
          <span slot-scope="{ row }">{{ row.mobile || '-' }}</span>
        </ym-table-column>
        <ym-table-column prop="email" label="邮箱" min-width="140px">
          <span slot-scope="{ row }">{{ row.email || '-' }}</span>
        </ym-table-column>
        <ym-table-column prop="account" label="账号" min-width="160px">
          <span slot-scope="{ row }">{{ row.account || '-' }}</span>
        </ym-table-column>
        <ym-table-column label="操作" min-width="120px" fixed="right">
          <template slot-scope="{ row }">
            <ym-link type="primary" @click="submits(row)">选择</ym-link>
          </template>
        </ym-table-column>
      </ym-table-list-card>
    </div>
    <!-- <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
    </div> -->
  </ym-dialog>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import DialogSingleForm from '@/mixins/DialogSingleForm'
export default {
  name: 'SearchUserDialog',
  mixins: [PageSingleList, DialogSingleForm],
  data () {
    return {
      title: '查询用户',
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
    // 提交
    async submits (row) {
      this.$emit('submit-success', row)
    }
  }
}
</script>
<style lang="scss" scoped>
.contents {
  overflow-y: scroll;
  height: 60vh;
}
</style>
