<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="项目名称">
        <ym-input :maxlength="100" v-model="filter.projectName" placeholder="请输入"></ym-input>
      </ym-form-item>

      <ym-form-item label="状态">
        <ym-select v-model="filter.status" clearable>
          <ym-option label="待审核" value="check"></ym-option>
          <ym-option label="审核不通过" value="refuse"></ym-option>
          <ym-option label="已撤销" value="revoke"></ym-option>
        </ym-select>
      </ym-form-item>

      <ym-form-item label="最后更新时间" :span="2"  style="transform: translateX(12px);">
        <ym-date-picker-range :start-date.sync="filter.beginCreateTime" :end-date.sync="filter.endCreateTime" ></ym-date-picker-range>
      </ym-form-item>

      <ym-form-item label="公司名称">
        <ym-input :maxlength="100" v-model="filter.companyName" placeholder="请输入"></ym-input>
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

      <ym-table-column type="index" :index="startIndex" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="projectName" label="项目名称" min-width="160px" disabled-toggle ></ym-table-column>
      <ym-table-column prop="companyName" label="公司全称" min-width="120px" disabled-toggle ></ym-table-column>

      <ym-table-column prop="orgName" label="审核单位" min-width="140px">
        <span slot-scope="{ row }">{{ row.orgName || "-" }}</span>
      </ym-table-column>

      <ym-table-column prop="publisher" label="项目发布方" min-width="120px">
        <span slot-scope="{ row }">{{ row.publisher || "-" }}</span>
      </ym-table-column>

      <ym-table-column prop="statusStr" label="状态" min-width="120px">
        <span slot-scope="{ row }">
          {{ row.statusDict.itemName }}
        </span>
      </ym-table-column>

      <ym-table-column prop="updateTime" label="最后更新时间" min-width="140px">
        <span slot-scope="{ row }">{{row.updateTime | dateFormat("YYYY-MM-DD HH:mm:ss")}}</span>
      </ym-table-column>

      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="views(row)">查看</ym-link>
          <ym-link type="primary" @click="exportSingle(row)">导出</ym-link>
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
        status: ''
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
        path: '/project/libraries/audit/view-detail',
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
