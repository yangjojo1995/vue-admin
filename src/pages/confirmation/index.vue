<template>
  <div class="page">
    <div class="tips" v-if="Showtips">
      <div class="tips-left">
        <i class="el-icon-info" style="color:#fa0;font-size: 16px;"></i>
        <span>项目确权人是为项目提供确权的用户，确权后的项目会增加项目的信任度。</span>
      </div>
      <i
        class="el-icon-close"
        @click="Showtips = false"
        style="font-size:16px;cursor: pointer;"
      ></i>
    </div>
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="用户名称">
        <ym-input
          :maxlength="100"
          v-model="filter.name"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="身份类型">
        <ym-select v-model="filter.roleType" clearable>
          <ym-option
            v-for="item in industryOptions"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
       <ym-form-item label="新增时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.beginEndTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="操作人">
        <ym-input
          :maxlength="100"
          v-model="filter.createByStr"
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
          >新增确权人</ym-button
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
        prop="name"
        disabled-toggle
        label="用户名称"
        min-width="120px"
      >
        <div slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.name"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.name || "-" }}</span>
          </el-tooltip>
        </div>
      </ym-table-column>
      <ym-table-column
        prop="roleTypeStr"
        disabled-toggle
        label="身份"
        min-width="120px"
      >
        <div slot-scope="{ row }">
          {{ row.roleTypeStr || "-" }}
        </div>
      </ym-table-column>
      <ym-table-column
        prop="assistNumber"
        label="已确权项目数"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{ row.assistNumber }}</span>
      </ym-table-column>
      <ym-table-column prop="enableStr" label="状态" min-width="120px">
        <span slot-scope="{ row }">{{ row.enableStr || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createByStr" label="操作管理员" min-width="120px">
        <span slot-scope="{ row }">{{ row.createByStr || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="新增时间" min-width="130px">
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
    <!-- 编辑弹窗 -->
    <conDialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      title="新增确权人"
      :data="dialogData"
      @submit-success="examine()"
    >
    </conDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import conDialog from './_components/conDialog.vue'
export default {
  name: 'confirmation',
  mixins: [PageSingleList],
  components: { conDialog },
  data () {
    return {
      filter: {
        name: '',
        beginCreateTime: '',
        beginEndTime: '',
        roleType: '',
        createByStr: ''
      },
      Showtips: true,
      dialogVisible: false,
      dialogData: {},
      tempId: '',
      industryOptions: [],
      typeOptions: []
    }
  },
  async created () {
    this.industryOptions = [{ itemValue: 2, itemName: '投资机构' }, { itemValue: 1, itemName: '投资经理' }, { itemValue: 4, itemName: '指导单位' }]
  },
  activated () {
    // 编辑后返回列表刷新
    if (this.$route.query.type === 'new') {
      this.updateRecordsByPage(1)
      this.$router.push({ query: {} })
    }
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.confirmation.assistSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.dialogVisible = true
      this.dialogData = {}
    },
    // 编辑
    views (row) {
      this.$router.push({
        path: '/confirmation/details',
        query: { id: row.id }
      })
    },
    // 删除
    delActivity (row) {
      this.$confirm('确定删除此条数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          const params = {
            id: row.id
          }
          await this.$service.notice.bannerDelete(params)
          this.$message.success('删除成功')
          this.updateRecordsByPage(1)
        })
        .catch(() => {})
    },
    async examine (form) {
      this.dialogVisible = false
      this.updateRecordsByPage(1)
      this.$message.success('操作成功')
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
.tips {
  padding: 4px 10px;
  background: #fffbe6;
  margin-bottom: 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  .tips-left {
    align-items: center;
    display: flex;
  }
  span {
    margin-left: 5px;
  }
}
</style>
