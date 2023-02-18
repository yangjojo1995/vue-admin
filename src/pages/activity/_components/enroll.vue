<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-row>
        <ym-col :span="8">
          <ym-form-item label="操作人" label-width="80px" style="width:100%">
            <ym-input
              :maxlength="100"
              v-model="filter.operatorName"
              placeholder="请输入"
            ></ym-input>
          </ym-form-item>
        </ym-col>
        <ym-col :span="8">
          <ym-form-item label="联系电话" label-width="80px" style="width:100%">
            <ym-input
              :maxlength="100"
              v-model="filter.mobile"
              placeholder="请输入"
            ></ym-input>
          </ym-form-item>
        </ym-col>
        <ym-col :span="8">
          <ym-form-item label="机构类型" label-width="80px" style="width:100%">
            <ym-select v-model="filter.institutionType" clearable>
              <ym-option
                v-for="item in institutionOptions"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              >
              </ym-option>
            </ym-select>
          </ym-form-item>
        </ym-col>
      </ym-row>
      <ym-row>
        <ym-col :span="8">
          <ym-form-item label="职位" label-width="80px" style="width:100%">
            <ym-input
              :maxlength="100"
              v-model="filter.position"
              placeholder="请输入"
            ></ym-input>
          </ym-form-item>
        </ym-col>
        <ym-col :span="8">
          <ym-form-item label="机构名称" label-width="80px" style="width:100%">
            <ym-input
              :maxlength="100"
              v-model="filter.institutionName"
              placeholder="请输入"
            ></ym-input>
          </ym-form-item>
        </ym-col>
        <ym-col :span="8">
          <ym-form-item label="报名姓名" label-width="80px" style="width:100%">
            <ym-input
              :maxlength="100"
              v-model="filter.participantName"
              placeholder="请输入"
            ></ym-input>
          </ym-form-item>
        </ym-col>
      </ym-row>
      <ym-row>
        <ym-col :span="16">
          <ym-form-item label="报名时间" label-width="80px" style="width:100%">
            <ym-date-picker-range
              :start-date.sync="filter.beginCreateTime"
              :end-date.sync="filter.endCreateTime"
            ></ym-date-picker-range>
          </ym-form-item>
        </ym-col>
      </ym-row>
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
        prop="userInfo"
        label="报名操作人"
        min-width="130px"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{
          row.operatorInfo ? row.operatorInfo.name : "-"
        }}</span>
      </ym-table-column>
      <ym-table-column
        prop="participantName"
        label="填写姓名"
        min-width="100px"
      >
        <div slot-scope="{ row }">
          <span>{{ row.participantName || "-" }}</span>
        </div>
      </ym-table-column>
      <ym-table-column prop="mobile" label="填写电话" min-width="120px">
        <span slot-scope="{ row }">{{ row.mobile || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="position" label="填写职位" min-width="120px">
        <div slot-scope="{ row }">
          {{ row.position || "-" }}
        </div>
      </ym-table-column>
      <ym-table-column prop="participantNum" label="填写人数" min-width="100px">
        <span slot-scope="{ row }">{{ row.participantNum || "-" }}</span>
      </ym-table-column>
      <ym-table-column
        prop="institutionName"
        label="填写机构"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{ row.institutionName || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="status" label="填写机构类型" min-width="120px">
        <span slot-scope="{ row }">
          {{ row.institutionTypeDict ? row.institutionTypeDict.itemName : "-" }}
        </span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="报名时间" min-width="120px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
    </ym-table-list-card>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import Export from '@/mixins/Export'
export default {
  name: 'enroll',
  mixins: [PageSingleList, Export],
  components: {},
  props: {
    id: {
    }
  },
  data () {
    return {
      filter: {
        activityId: '',
        operatorName: '',
        mobile: '',
        institutionType: '',
        institutionName: '',
        position: '',
        beginCreateTime: '',
        endCreateTime: '',
        participantName: ''
      },
      excelName: '报名记录',
      apiUrl: '/backstage/activity-apply/export',
      institutionOptions: []
    }
  },
  async created () {
    this.institutionOptions = await this.$service.app.dictSearch({
      dictCode: 'activity_institution_type'
    })
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      entity.activityId = this.filter.activityId = this.id
      return this.$service.activity.activityApply({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.$router.push({
        path: '/activity/edit',
        query: { type: 'add' }
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/activity/view',
        query: { id: row.id }
      })
    },
    // 编辑
    handleUpdateItem (row) {
      this.$router.push({
        path: '/activity/edit',
        query: { id: row.id }
      })
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
.el-drawer__wrapper::v-deep {
  padding: 10px;
}
.el-drawer__body::v-deep {
  padding: 10px;
}
</style>
