<template>
  <div>
    <ym-tabs class="tabs" v-model="filter.domainName">
      <ym-tab-pane
        v-for="tab in tabsList"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name">
      </ym-tab-pane>
    </ym-tabs>
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="广告标题">
        <ym-input
          :maxlength="100"
          v-model="filter.title"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="内链类型">
        <ym-select v-model="filter.internalLinkType" clearable>
          <ym-option
            v-for="item in statusOptions"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="内链标题">
        <ym-input
          :maxlength="100"
          v-model="filter.internalLinkTitle"
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
          >创建广告</ym-button
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
        prop="title"
        disabled-toggle
        label="标题"
        min-width="120px"
      >
        <div slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.title"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.title || "-" }}</span>
          </el-tooltip>
        </div>
      </ym-table-column>
      <ym-table-column
        prop="internalLinkTypeStr"
        label="内链类型"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{ row.internalLinkTypeStr }}</span>
      </ym-table-column>
      <ym-table-column prop="publisherInfo" label="内链标题" min-width="120px">
        <span slot-scope="{ row }">{{ row.internalLinkTitle || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="creatorName" label="创建人" min-width="120px">
        <span slot-scope="{ row }">{{ row.creatorName || "-"}}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" min-width="130px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="handleUpdateItem(row)">修改</ym-link>
          <ym-link type="danger" @click="delActivity(row)">删除</ym-link>
        </template>
      </ym-table-column>
    </ym-table-list-card>
    <!-- 编辑弹窗 -->
    <AdvDialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :data="dialogData"
      :domainName="filter.domainName"
      @submit-success="examine()"
    >
    </AdvDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import AdvDialog from './_components/AdvDialog.vue'
export default {
  name: 'activity',
  mixins: [PageSingleList],
  components: { AdvDialog },
  data () {
    return {
      filter: {
        title: '',
        internalLinkType: '',
        internalLinkTitle: '',
        domainName: 'web'
      },
      dialogVisible: false,
      dialogData: {},
      tempId: '',
      statusOptions: [],
      typeOptions: [],
      tabValue: 1,
      tabsList: [{ label: '移动端', name: 'web' }, { label: 'PC端', name: 'pc' }]
    }
  },
  async created () {
    this.statusOptions = await this.$service.app.dictSearch({
      dictCode: 'internal_link_type'
    })
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
      return this.$service.notice.bannerSearch({
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
    handleUpdateItem (row) {
      this.dialogVisible = true
      this.dialogData = row
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
.tabs::v-deep {
  .el-tabs__nav {
    margin-bottom: 15px;
  }

  .el-tabs__content {
    overflow: initial;
  }
  th.el-table__cell > .cell {
    display: flex;
    align-items: center;
  }
}
</style>
