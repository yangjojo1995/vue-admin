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
      <ym-form-item label="状态">
        <ym-select v-model="filter.status" clearable>
          <ym-option
            v-for="item in statusOptions"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="创建时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="公司名称">
        <ym-input
          :maxlength="100"
          v-model="filter.companyName"
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
          >创建项目</ym-button
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
        prop="projectName"
        label="项目名称"
        min-width="150px"
        disabled-toggle
      >
        <div style="white-space: pre-wrap" slot-scope="{ row }" v-html="row.projectName"></div>
      </ym-table-column>
      <ym-table-column prop="companyName" label="公司全称" min-width="150px">
        <span slot-scope="{ row }">{{ row.companyName || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" min-width="130px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column prop="status" label="状态" min-width="120px">
        <span slot-scope="{ row }">
          {{ row.statusDict ? row.statusDict.itemName : "-" }}
        </span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link
            type="primary"
            @click="views(row)"
            >查看</ym-link
          >
           <ym-link
            v-if="row.statusDict.itemName === '已发布'"
            type="primary"
            @click="handleUpdateItem(row)"
            >编辑</ym-link
          >
           <ym-link
            type="primary"
            @click="exportSingle(row)"
            >导出</ym-link
          >
           <ym-link
            v-if="row.statusDict.itemName === '已发布'"
            type="primary"
            @click="handleStopItem(row)"
            >停止</ym-link
          >
        </template>
      </ym-table-column>
    </ym-table-list-card>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import Export from '@/mixins/Export'
import store from '@/store'
export default {
  name: 'project',
  mixins: [PageSingleList, Export],
  components: {},
  data () {
    return {
      filter: {
        beginCreateTime: '',
        endCreateTime: '',
        companyName: '',
        projectName: '',
        status: '',
        publisherName: store.state.user.userInfo.userName
      },
      apiUrl: '/backstage/project/export',
      industryOptions: [],
      statusOptions: [],
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
    this.statusOptions = await this.$service.app.dictSearch({
      dictCode: 'project_status'
    })
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.project.selfSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.$router.push({
        path: '/project/edit',
        query: { type: 'add' }
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/project/my/detail',
        query: { id: row.id }
      })
    },
    // 编辑
    handleUpdateItem (row) {
      this.$router.push({
        path: '/project/my/edit',
        query: { id: row.id }
      })
    },
    // 停止
    async handleStopItem (row) {
      await this.$confirm('是否停止项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.$service.project.updateProjectStatus({ id: row.id, status: 'stop' })
      await this.updateRecords()
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
