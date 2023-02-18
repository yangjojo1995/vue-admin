<template>
  <div class="page">
    <ym-form-filter-card :model.sync="filter" @model-change="updateRecordsByPage(1)">
      <ym-form-item label="项目名称">
        <ym-input :maxlength="100" v-model="filter.projectName" placeholder="请输入"></ym-input>
      </ym-form-item>

      <ym-form-item label="状态">
        <ym-select v-model="filter.status" clearable>
          <ym-option label="全部" value=""></ym-option>
          <ym-option label="已发布" value="publish"></ym-option>
          <ym-option label="已停止" value="stop"></ym-option>
        </ym-select>
      </ym-form-item>

      <ym-form-item label="最后更新时间" :span="2" style="transform: translateX(12px);">
        <ym-date-picker-range :start-date.sync="filter.beginCreateTime" :end-date.sync="filter.endCreateTime"></ym-date-picker-range>
      </ym-form-item>

      <ym-form-item label="公司名称">
        <ym-input :maxlength="100" v-model="filter.companyName" placeholder="请输入"></ym-input>
      </ym-form-item>

    </ym-form-filter-card>

    <ym-table-list-card row-key="accountId" :loading="loading" :data="records" :current-page.sync="paging.page" :page-size.sync="paging.size" :total="total" @current-change="updateRecordsByPage" @size-change="updateRecordsByPage(1)" @sort-change="sortRecords">
      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="exportExcel()">导出</ym-button>
      </template>
      <ym-table-column type="index" :index="startIndex" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="projectName" label="项目名称" min-width="160px" disabled-toggle>
        <div style="white-space: pre-wrap" slot-scope="{ row }" v-html="row.projectName"></div>
      </ym-table-column>
      <ym-table-column prop="companyName" label="公司全称" min-width="120px" disabled-toggle></ym-table-column>

      <ym-table-column prop="orgName" label="推荐单位" min-width="140px">
        <span slot-scope="{ row }">{{ row.orgName || "-" }}</span>
      </ym-table-column>

      <!-- <ym-table-column prop="publisher" label="项目发布方" min-width="120px">
        <span slot-scope="{ row }">{{ row.publisher || "-" }}</span>
      </ym-table-column> -->

      <ym-table-column prop="statusStr" label="状态" min-width="120px">
        <span slot-scope="{ row }">
          {{ row.statusDict.itemName }}
        </span>
      </ym-table-column>
      <ym-table-column prop="dataIntegrity" label="资料完整度" min-width="120px">
        <span slot-scope="{ row }">{{ row.completeDegree? row.completeDegree+'%' : "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="updateTime" label="最后更新时间" min-width="140px">
        <span slot-scope="{ row }">{{row.updateTime | dateFormat("YYYY-MM-DD HH:mm:ss")}}</span>
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
import Export from '@/mixins/Export'
import PageSingleList from '@/mixins/PageSingleList'
export default {
  name: 'project',
  mixins: [PageSingleList, Export],
  data () {
    return {
      apiUrl: '/backstage/project/search/export',
      filter: {
        beginCreateTime: '',
        endCreateTime: '',
        projectName: '',
        status: '',
        companyName: '',
        excelName: '已审核项目列表',
        apiUrl: '/project/search/export'
      }
    }
  },

  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.project.getProject({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 查看audit
    views (row) {
      this.$router.push({
        path: '/project/libraries/view/view-detail',
        query: { id: row.id }
      })
    }
  }
}
</script>
<style>
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
