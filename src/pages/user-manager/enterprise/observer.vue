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
      <ym-form-item label="创建时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="联系电话">
        <ym-input
          v-model="filter.phone"
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
        prop="shortName"
        min-width="120px"
        :toggle="false"
      >
        <span slot-scope="{ row }">{{ row.shortName || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        label="管理员"
        prop="realName"
        min-width="140px"
        :toggle="false"
      >
        <span slot-scope="{ row }">{{ row.realName || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="creditCode" label="统一信用代码" min-width="140px">
        <span slot-scope="{ row }">{{ row.creditCode || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        prop="contactPhone"
        label="联系电话"
        min-width="120px"
        :toggle="false"
      >
        <span slot-scope="{ row }">{{ row.contactPhone || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        prop="contactEmail"
        label="联系邮箱"
        min-width="140px"
        :toggle="false"
      >
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.contactEmail"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.contactEmail || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        prop="belongProvinceStr"
        label="所属地区"
        min-width="140px"
      >
        <span slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-end">
            <div slot="content">
              {{ row.belongProvinceStr || "-" }}{{ row.belongCityStr }}
            </div>
            <span class="ellipsis">
              {{ row.belongProvinceStr || "-" }}{{ row.belongCityStr }}
            </span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column
        label="所属行业"
        prop="belongIndustryStr"
        min-width="140px"
      >
        <span slot-scope="{ row }">
          {{ row.belongIndustryStr || "-" }}
        </span>
      </ym-table-column>
      <ym-table-column label="单位简介" prop="summary" min-width="140px">
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
        label="创建时间"
        prop="approveTime"
        min-width="160px"
        :toggle="false"
      >
        <span slot-scope="{ row }">{{
          row.approveTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="views(row)">查看</ym-link>
          <ym-link type="primary"  @click="handleOpenSetup(row)">设置</ym-link>
        </template>
      </ym-table-column>
    </ym-table-list-card>
    <!-- 导出选项 -->
    <ym-export-table
      :formData="{ ...filter, ...paging }"
      :exportDialogVisible="exportDialogVisible"
      :apiUrl="apiUrl"
      excelName="指导单位列表"
    ></ym-export-table>

    <el-dialog title="设置" :visible.sync="setupDialogVisible" width="600px">
      <el-form ref="setupForm" :model="setupForm" :rules="setupRules" >
        <el-form-item label="是否公开展示在指导单位列表" prop="displayable">
          <el-radio-group v-model="setupForm.displayable">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="0">不公开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否支持创建和开发项目" prop="support">
          <el-radio-group v-model="setupForm.support">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateSetupForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import Export from '@/mixins/Export'
export default {
  name: 'observer',
  mixins: [PageSingleList, Export],
  components: {},
  data () {
    return {
      filter: {
        name: '',
        phone: '',
        email: '',
        beginCreateTime: '',
        endCreateTime: '',
        creditCode: '',
        area: '',
        realName: ''
      },
      exportDialogVisible: false,
      excelName: '指导单位列表',
      apiUrl: '/backstage/observer/export',
      setupForm: {
        id: 0,
        displayable: 0, // 展示状态（0、不展示；1、展示）
        support: 0 // 是否支持创建和发布项目（0、不支持；1、支持）
      },
      setupRules: {
        displayable: [{ required: true, message: '请选择是否公开展示在指导单位列表', trigger: 'change' }],
        support: [{ required: true, message: '请选择是否支持创建和开发项目', trigger: 'change' }]
      },
      setupDialogVisible: false // 编辑权限弹窗
    }
  },
  async created () {},
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.manager.observerSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/user-manager/detail/observer-details',
        query: { id: row.id }
      })
    },
    // 打开设置
    async handleOpenSetup (row) {
      const data = await this.$service.manager.resourceInfo({ id: row.id })
      this.setupForm = data
      this.setupDialogVisible = true
    },
    // 校验设置表单
    validateSetupForm () {
      this.$refs.setupForm.validate((valid) => {
        if (valid) {
          this.submitSetupForm()
        } else {
          return false
        }
      })
    },
    // 提交设置表单
    async submitSetupForm () {
      const data = await this.$service.manager.resourceUpdate(this.setupForm)
      if (data) {
        this.$message.success('设置权限成功')
      } else {
        this.$message.info('设置权限失败，请稍后再试')
      }
      this.setupDialogVisible = false
    },
    // 打开导出弹窗
    openExport () {
      this.exportDialogVisible = true
    },
    // 导出
    updateExport () {}
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
