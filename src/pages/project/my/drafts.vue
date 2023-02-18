<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="项目名称">
        <ym-input
          :maxlength="100"
          v-model="filter.projectName"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="创建时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
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
      <ym-table-column
        prop="projectName"
        label="项目名称"
        min-width="180px"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.projectName || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" min-width="120px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link
            type="primary"
            @click="handleUpdateItem(row)"
            >编辑</ym-link
          >
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
  components: {},
  data () {
    return {
      filter: {
        beginCreateTime: '',
        endCreateTime: '',
        projectName: ''
      },
      industryOptions: [],
      dialogVisible: false,
      dialogData: null,
      userBindDialogVisible: false,
      UserBindRoleDialogVisible: false
    }
  },
  async created () {
    this.industryOptions = await this.$service.app.dictSearch({
      dictCode: 'industry_type'
    })
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.project.draftSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/project/view',
        query: { id: row.id }
      })
    },
    // 编辑
    handleUpdateItem (row) {
      this.$router.push({
        path: '/project/edit',
        query: { id: row.id, entry: 'drafts' }
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
