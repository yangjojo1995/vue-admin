<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="单位名称">
        <ym-input
          v-model="filter.name"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="联系电话">
        <ym-input
          v-model="filter.phone"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="创建日期" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="联系邮箱">
        <ym-input
          v-model="filter.email"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="所属地区">
        <ym-input
          v-model="filter.area"
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
        <ym-button type="primary" size="medium" @click="handleCreateItem()"
          >创建投资机构</ym-button
        >
      </template>
      <ym-table-column
        type="index"
        :index="startIndex"
        label="序号"
        width="56px"
        align="center"
      ></ym-table-column>
      <ym-table-column
        label="单位全称"
        prop="fullName"
        min-width="120px"
        disabled-toggle
      >
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.fullName"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.fullName || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        label="单位简称"
        :toggle="false"
        prop="shortName"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{ row.shortName || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        label="统一社会信用代码"
        prop="creditCode"
        min-width="140px"
      >
        <span slot-scope="{ row }">{{ row.creditCode || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="身份" prop="type" min-width="140px">
        <span slot-scope="{ row }">{{ row.type || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        label="管理员"
        :toggle="false"
        prop="realName"
        min-width="140px"
      >
        <span slot-scope="{ row }">{{ row.realName || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="联系电话" prop="contactPhone" min-width="130px">
        <span slot-scope="{ row }">{{ row.contactPhone || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="联系邮箱" prop="contactEmail" min-width="140px">
        <span slot-scope="{ row }">{{ row.contactEmail || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="province" label="所属地区" min-width="120px">
        <span slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-end">
            <div slot="content">{{ row.province }}{{ row.city }}</div>
            <span class="ellipsis">
              {{ row.province || "-" }}{{ row.city }}
            </span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        prop="approveTime"
        :toggle="false"
        label="创建日期"
        min-width="160px"
      >
        <span slot-scope="{ row }">{{
          row.approveTime | dateFormat("YYYY-MM-DD HH:mm:ss")
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
  components: {},
  data () {
    return {
      filter: {
        phone: '',
        email: '',
        area: '',
        beginCreateTime: '',
        endCreateTime: '',
        name: ''
      },
      exportDialogVisible: false
    }
  },
  async created () {},
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.manager.allCompanySearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 查看
    views (row) {
      if (row.type === '投资机构') {
        this.$router.push({
          path: '/user-manager/detail/institution-details',
          query: { id: row.id, type: 'all' }
        })
      } else if (row.type === '企业') {
        this.$router.push({
          path: '/user-manager/detail/enterprise-details',
          query: { id: row.id, type: 'all' }
        })
      } else if (row.type === '指导单位') {
        this.$router.push({
          path: '/user-manager/detail/observer-details',
          query: { id: row.id, type: 'all' }
        })
      }
    },
    // 创建投资机构
    handleCreateItem () {
      this.$router.push({
        path: '/user-manager/creat-enterprise'
      })
    },
    // 打开导出弹窗
    openExport () {
      this.exportDialogVisible = true
    }
  }
}
</script>
