<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="单位名称">
        <ym-input :maxlength="100" v-model="filter.fullName" placeholder="请输入"></ym-input>
      </ym-form-item>
       <ym-form-item label="状态">
        <ym-select v-model="filter.status" placeholder="请选择" clearable>
          <ym-option
            v-for="item in statusOptions"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          ></ym-option>
        </ym-select>
      </ym-form-item>
       <ym-form-item label="入驻身份">
        <ym-select v-model="filter.type" placeholder="请选择" clearable>
          <ym-option
            v-for="item in identityOptions"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="联系电话">
        <ym-input :maxlength="100" v-model="filter.phone" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="联系邮箱">
        <ym-input :maxlength="100" v-model="filter.email" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="申请日期" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="用户名称">
        <ym-input :maxlength="100" v-model="filter.userName" placeholder="请输入"></ym-input>
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
      <ym-table-column prop="fullName" label="申请单位全称" min-width="140px">
         <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.fullName"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.fullName || '-' }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
       <ym-table-column prop="phone" label="联系电话" min-width="120px">
        <span slot-scope="{ row }">{{ row.phone || '-'}}</span>
      </ym-table-column>
       <ym-table-column
        prop="email"
        label="联系邮箱"
        min-width="140px"
      >
        <span slot-scope="{ row }">{{ row.email || '-' }}</span>
      </ym-table-column>
        <ym-table-column
        prop="type"
        label="申请身份"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{
          row.type | labels(identityOptions)
        }}</span>
      </ym-table-column>
      <ym-table-column
        prop="userName"
        label="申请用户名称"
        min-width="120px"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.userName|| '-' }}</span>
      </ym-table-column>
      <ym-table-column
        prop="status"
        label="状态"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{
          row.status | labels(statusOptions)
        }}</span>
      </ym-table-column>
      <ym-table-column
        prop="createTime"
        label="申请时间"
        min-width="160px"
      >
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <!-- v-if="$auth('update')" -->
          <ym-link type="primary" @click="handleUpdateItem(row)">查看</ym-link>
        </template>
      </ym-table-column>
    </ym-table-list-card>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'

export default {
  name: 'review',
  mixins: [PageSingleList],
  components: {},
  data () {
    return {
      filter: {
        fullName: '',
        phone: '',
        email: '',
        type: '',
        status: '',
        userName: '',
        beginCreateTime: undefined,
        endCreateTime: undefined
      },
      identityOptions: [],
      statusOptions: []
    }
  },
  async created () {
    this.statusOptions = await this.$service.app.dictSearch({
      dictCode: 'audit_status'
    })
    this.identityOptions = await this.$service.app.dictSearch({
      dictCode: 'company_type'
    })
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.manager.getAudit({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 查看
    handleUpdateItem (row) {
      // 类型跳转判断
      if (row.type === 'institution') {
        this.$router.push({
          path: '/user-manager/review/institution',
          query: { id: row.id }
        })
      } else if (row.type === 'enterprise') {
        this.$router.push({
          path: '/user-manager/review/enterprise',
          query: { id: row.id }
        })
      } else if (row.type === 'observer') {
        this.$router.push({
          path: '/user-manager/review/observer',
          query: { id: row.id }
        })
      }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.ellipsis {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
