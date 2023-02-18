<template>
  <div class="page">
    <ym-form-filter-card :model.sync="filter" @model-change="updateRecordsByPage(1)">
      <ym-form-item label="项目名称">
        <ym-input :maxlength="100" v-model="filter.projectName" placeholder="请输入"></ym-input>
      </ym-form-item>

      <ym-form-item label="公司名称">
        <ym-input :maxlength="100" v-model="filter.companyName" placeholder="请输入"></ym-input>
      </ym-form-item>

      <ym-form-item label="提交时间" :span="2">
        <ym-date-picker-range :start-date.sync="filter.beginCreateTime" :end-date.sync="filter.endCreateTime"></ym-date-picker-range>
      </ym-form-item>

    </ym-form-filter-card>

    <ym-table-list-card row-key="accountId" :loading="loading" :data="records" :current-page.sync="paging.page" :page-size.sync="paging.size" :total="total" @current-change="updateRecordsByPage" @size-change="updateRecordsByPage(1)" @sort-change="sortRecords">

      <ym-table-column type="index" :index="startIndex" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="projectName" label="项目名称" min-width="160px" disabled-toggle >
        <div style="white-space: pre-wrap" slot-scope="{ row }" v-html="row.projectName"></div>
      </ym-table-column>
      <ym-table-column prop="companyName" label="公司全称" min-width="120px" disabled-toggle ></ym-table-column>

      <ym-table-column prop="orgName" label="推荐单位" min-width="140px">
        <span slot-scope="{ row }">{{ row.orgName || "-" }}</span>
      </ym-table-column>

      <ym-table-column prop="publisherName" label="项目发布方" min-width="120px">
        <span slot-scope="{ row }">{{ row.publisherName || "-" }}</span>
      </ym-table-column>

      <ym-table-column prop="createTime" label="提交时间" min-width="140px">
        <span slot-scope="{ row }">{{row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")}}</span>
      </ym-table-column>
      <ym-table-column prop="dataIntegrity" label="资料完整度" min-width="120px">
        <span slot-scope="{ row }">{{ row.completeDegree? row.completeDegree+'%' : "-" }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="audit(row)">审核</ym-link>
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
      apiUrl: '/backstage/project/export',
      filter: {
        beginCreateTime: '',
        endCreateTime: '',
        projectName: '',
        companyName: ''
      }
    }
  },
  mounted () {
    this.$parent.getTotal()
  },

  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.project.getAuditList({
        ...paging,
        page: paging.page,
        ...entity,
        statusList: ['c_check'],
        orders
      })
    },

    // 前往审核
    audit (row) {
      this.$router.push({
        path: '/project/libraries/audit/audit-detail',
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
