<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="用户名称">
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
      <ym-form-item label="联系邮箱">
        <ym-input
          v-model="filter.email"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="所属机构">
        <ym-input
          v-model="filter.investInstitution"
          :maxlength="100"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="确权时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginAssistedTime"
          :end-date.sync="filter.endAssistedTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="注册时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
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
        label="用户名称"
        prop="name"
        min-width="100px"
        disabled-toggle
      >
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.name"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.name || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        label="所属地区"
        prop="belongProvinceStr"
        min-width="120px"
      >
        <span slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-end">
            <div slot="content">
              {{ row.belongProvinceStr }}{{ row.belongCityStr }}
            </div>
            <span class="ellipsis">
              {{ row.belongProvinceStr || "-" }}{{ row.belongCityStr }}
            </span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column label="关注地区" prop="focusAreas" min-width="120px">
        <span slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-end">
            <div slot="content">{{ row.focusAreas }}</div>
            <span class="ellipsis">
              {{ row.focusAreas || "-" }}
            </span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        label="投资领域"
        prop="investFieldsStr"
        min-width="140px"
      >
        <span slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-end">
            <div slot="content">
              <span v-for="(item, index) in row.investFieldsStr" :key="index"
                >{{ item.itemName || "-" }}
                <span v-if="index !== row.investFieldsStr.length - 1">，</span>
              </span>
            </div>
            <span class="ellipsis">
              <span v-for="(item, index) in row.investFieldsStr" :key="index"
                >{{ item.itemName || "-" }}
                <span v-if="index !== row.investFieldsStr.length - 1">，</span>
              </span>
            </span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        prop="investRoundsStr"
        label="投资轮次"
        min-width="140px"
      >
        <span slot-scope="{ row }">
          <span v-for="(item, index) in row.investRoundsStr" :key="index"
            >{{ item.itemName || "-" }}
            <span v-if="index !== row.investRoundsStr.length - 1">，</span>
          </span>
        </span>
      </ym-table-column>
      <ym-table-column label="单笔投额" prop="investment" min-width="100px">
        <span slot-scope="{ row }" v-if="row.investment">{{
          row.investment || "-"
        }}</span>
      </ym-table-column>
      <ym-table-column label="联系电话" prop="phone" min-width="140px">
        <span slot-scope="{ row }">{{ row.phone || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="联系邮箱" prop="email" min-width="140px">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.email"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.email || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        :toggle="false"
        label="账号"
        prop="account"
        min-width="140px"
      >
        <span slot-scope="{ row }">{{ row.account || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        label="所属机构"
        prop="investInstitution"
        min-width="140px"
      >
        <span slot-scope="{ row }">{{ row.investInstitution || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="职位" prop="position" min-width="140px">
        <span slot-scope="{ row }">{{ row.position || "-" }}</span>
      </ym-table-column>
      <ym-table-column label="个人简介" prop="summary" min-width="140px">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.summary"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.summary || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        :toggle="false"
        label="确权时间"
        prop="assistTime"
        min-width="160px"
      >
        <span slot-scope="{ row }">{{
          row.assistTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column
        :toggle="false"
        label="注册时间"
        prop="createTime"
        min-width="160px"
      >
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
      excelName="投资经理列表"
      @cancelExport="cancelExport"
    ></ym-export-table>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import Export from '@/mixins/Export'
export default {
  name: 'InvestmentManager',
  mixins: [PageSingleList, Export],
  components: {},
  data () {
    return {
      filter: {
        name: '',
        phone: '',
        email: '',
        beginAssistedTime: '',
        endAssistedTime: '',
        beginCreateTime: '',
        endCreateTime: '',
        area: '',
        investInstitution: ''
      },
      exportDialogVisible: false,
      excelName: '投资经理列表',
      apiUrl: '/backstage/invest-manager/export'
    }
  },
  async created () {},
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.manager.investmentSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/user-manager/detail/investment-details',
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
