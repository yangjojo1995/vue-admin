<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="机构名称">
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
      <ym-form-item label="创建时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="管理员">
        <ym-input
          v-model="filter.realName"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
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
      <ym-form-item label="统一信用代码">
        <ym-input
          v-model="filter.creditCode"
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
          >导出</ym-button
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
        min-width="140px"
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
        min-width="120px"
        prop="shortName"
      >
        <span slot-scope="{ row }">{{ row.shortName || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        label="联系电话"
        :toggle="false"
        min-width="120px"
        prop="contactPhone"
      >
        <span slot-scope="{ row }">{{ row.contactPhone || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        label="联系邮箱"
        :toggle="false"
        min-width="140px"
        prop="contactEmail"
      >
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.contactEmail"
            placement="top-end"
          >
            <span class="ellipsis"> {{ row.contactEmail || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column label="管理员" min-width="120px" prop="realName">
        <span slot-scope="{ row }">{{
          row.realName || row.userName || "-"
        }}</span>
      </ym-table-column>
      <ym-table-column label="统一信用代码" min-width="140px" prop="creditCode">
        <span slot-scope="{ row }">{{ row.creditCode || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="所属地区" min-width="140px" prop="location">
        <span slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-end">
            <div slot="content">
              {{ row.location ? row.location.province : ""
              }}{{ row.location ? row.location.city : "" }}
            </div>
            <span class="ellipsis">
              {{ row.location ? row.location.province : "-"
              }}{{ row.location ? row.location.city : "-" }}
            </span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column label="关注地区" min-width="140px" prop="focusAreas">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.focusAreas"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.focusAreas || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column label="投资领域" min-width="150px" prop="investFields">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.investFields"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.investFields || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column label="投资轮次" min-width="140px" prop="investRounds">
        <span slot-scope="{ row }">{{ row.investRounds || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="单笔投额" min-width="140px" prop="investment">
        <span slot-scope="{ row }" v-if="row.investment">{{
          row.investment || "-"
        }}</span>
      </ym-table-column>
      <ym-table-column label="单位简介" min-width="140px" prop="introduction">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.introduction"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.introduction || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        prop="approveTime"
        :toggle="false"
        label="创建时间"
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
    <!-- 导出选项 -->
    <!-- <ym-export-table
      :formData="{ ...filter, ...paging }"
      :exportDialogVisible="exportDialogVisible"
      :apiUrl="apiUrl"
      excelName="投资机构列表"
      @cancelExport="cancelExport"
    ></ym-export-table> -->
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import Export from '@/mixins/Export'
export default {
  name: 'InvestmentInstitutions',
  mixins: [PageSingleList, Export],
  components: {},
  data () {
    return {
      filter: {
        name: '',
        realName: '',
        phone: '',
        email: '',
        beginCreateTime: '',
        endCreateTime: '',
        area: '',
        creditCode: ''
      },
      exportDialogVisible: false,
      excelName: '投资机构列表',
      apiUrl: '/backstage/invest-institution/export'
    }
  },
  async created () {},
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.manager.institutionSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/user-manager/detail/institution-details',
        query: { id: row.id }
      })
    },
    // 打开导出弹窗
    async openExport () {
      this.exportDialogVisible = true
    },
    cancelExport () {
      this.exportDialogVisible = false
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
