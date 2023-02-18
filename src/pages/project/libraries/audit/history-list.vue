<template>
  <div class="page">
    <div class="back">
      <span @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
    </div>
    <ym-form-filter-card :model.sync="filter" @model-change="updateRecordsByPage(1)">
      <!-- 审核时间是updatetime  变更时间是createtime -->
      <ym-form-item label="变更时间" :span="2">
        <ym-date-picker-range :start-date.sync="filter.beginCreateTime" :end-date.sync="filter.endCreateTime" ></ym-date-picker-range>
      </ym-form-item>

      <ym-form-item label="审核结果">
        <ym-select v-model="filter.status" clearable>
          <ym-option label="审核通过" value="pass"></ym-option>
          <ym-option label="审核不通过" value="refuse"></ym-option>
        </ym-select>
      </ym-form-item>

      <ym-form-item label="审核时间" :span="2">
        <ym-date-picker-range :start-date.sync="filter.beginUpdateCTime" :end-date.sync="filter.endUpdateTime" ></ym-date-picker-range>
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
      <!-- 审核时间是updatetime  变更时间是createtime -->
      <ym-table-column type="index" :index="startIndex" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="operate" label="变更操作" min-width="100px" disabled-toggle ></ym-table-column>

      <ym-table-column prop="createTime" label="变更时间" min-width="160px">
        <span slot-scope="{ row }">{{row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")}}</span>
      </ym-table-column>

      <ym-table-column prop="statusStr" label="审核结果" min-width="120px"></ym-table-column>

      <ym-table-column prop="updateTime" label="审核时间" min-width="160px">
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
import PageSingleList from '@/mixins/PageSingleList'
export default {
  name: 'project',
  mixins: [PageSingleList],
  data () {
    return {
      loadAfterCreated: false,
      id: '',
      filter: {
        beginCreateTime: '',
        endCreateTime: '',
        projectName: '',
        status: ''
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.updateRecordsByPage(1)
  },

  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      if (entity && entity.status) {
        entity.statusList = [entity.status]
      } else {
        entity.statusList = ['pass', 'refuse']
      }
      return this.$service.project.getAuditRecordList({
        ...paging,
        page: paging.page,
        ...entity,
        id: this.id,
        orders
      })
    },

    // 查看audit
    views (row) {
      this.$router.push({
        path: '/project/libraries/audit/history-detail',
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
<style lang="scss" scoped>
.back{
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-bottom: 16px;

    .back-span{
      cursor: d;
    }

    .btn-group{
      button{
        padding-left: 32px;
        padding-right: 32px;
      }
    }
  }
</style>
