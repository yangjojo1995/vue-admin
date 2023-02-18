<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="字典名称">
        <ym-input v-model="filter.dictName" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="字典编码">
        <ym-input v-model="filter.dictCode" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="字典状态">
        <ym-select v-model="filter.status" clearable>
          <ym-option
            v-for="item in industryOptions"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="创建时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.createTime"
          :end-date.sync="filter.updateTime"
        ></ym-date-picker-range>
      </ym-form-item>
    </ym-form-filter-card>

    <ym-table-list-card
      row-key="id"
      :loading="loading"
      :data="records"
      :current-page.sync="paging.page"
      :page-size.sync="paging.size"
      :total="total"
      :enableFilterColumn="false"
      @current-change="updateRecordsByPage"
      @size-change="updateRecordsByPage(1)"
      @sort-change="sortRecords"
      @expand-change="expandChange"
    >
      <template slot="header-right">
        <ym-button type="primary" size="medium" @click="handleCreateItem()"
          >新增</ym-button
        >
      </template>
      <ym-table-column type="expand">
        <template>
          <ym-table-list-card
            inner
            row-key="id"
            :enableFilterColumn="false"
            :loading="loading"
            :data="dictData"
          >
            <ym-table-column
              prop="itemName"
              label="字典名称"
              min-width="140px"
              disabled-toggle
            >
              <span slot-scope="{ row }">{{ row.itemName }}</span>
            </ym-table-column>
            <ym-table-column
              prop="itemValue"
              label="字典编码"
              min-width="140px"
              disabled-toggle
            >
              <span slot-scope="{ row }">{{ row.itemValue }}</span>
            </ym-table-column>
            <ym-table-column
              prop="status"
              label="状态"
              min-width="140px"
              disabled-toggle
            >
              <span slot-scope="{ row }">{{
                row.status | label(statusOptions)
              }}</span>
            </ym-table-column>
            <ym-table-column
              prop="description"
              label="备注"
              min-width="140px"
              disabled-toggle
            >
              <span slot-scope="{ row }">{{ row.description }}</span>
            </ym-table-column>
            <ym-table-column
              prop="createTime"
              label="创建时间"
              min-width="140px"
              disabled-toggle
            >
              <span slot-scope="{ row }">{{
                row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
              }}</span>
            </ym-table-column>
          </ym-table-list-card>
        </template>
      </ym-table-column>
      <ym-table-column
        prop="dictName"
        label="字典名称"
        min-width="140px"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.dictName }}</span>
      </ym-table-column>
      <ym-table-column
        prop="dictCode"
        label="字典编码"
        min-width="140px"
        disabled-toggle
      >
        <span slot-scope="{ row }">{{ row.dictCode }}</span>
      </ym-table-column>
      <ym-table-column
        prop="status"
        label="状态"
        min-width="140px"
      >
        <span slot-scope="{ row }">{{
         row.status | label(statusOptions)
        }}</span>
      </ym-table-column>
      <ym-table-column
        prop="createTime"
        label="创建时间"
        sortable="custom"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <!-- v-if="$auth('update')" -->
          <ym-link type="primary" @click="modify(row)">修改</ym-link>
          <ym-link type="primary" @click="del(row)">删除</ym-link>
        </template>
      </ym-table-column>

      <template slot="selected-tool" slot-scope="{ selection, clearSelection }">
        <ym-button
          size="small"
          @click="handleEnableItem(selection, clearSelection)"
          >批量启用</ym-button
        >
        <ym-button
          size="small"
          @click="handleDisableItem(selection, clearSelection)"
          >批量停用</ym-button
        >
      </template>
    </ym-table-list-card>
    <!-- 新增弹窗 -->
    <addDialog
      :visible.sync="dialogVisible"
      title="添加字典类型"
      @submit-success="updateRecords()"
    >
    </addDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import addDialog from './add.vue'
export default {
  name: 'dict',
  mixins: [PageSingleList],
  components: { addDialog },
  data () {
    return {
      filter: {
        dictName: '',
        dictCode: '',
        status: '',
        createTime: '',
        updateTime: ''
      },
      dialogVisible: false,
      dialogData: null,
      dictData: [],
      userBindDialogVisible: false,
      UserBindRoleDialogVisible: false,
      industryOptions: [
        { itemName: '启用', itemValue: 1 },
        { itemName: '停用', itemValue: 0 }
      ],
      statusOptions: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 }
      ]
    }
  },
  async created () {
    // this.industryOptions = await this.$service.app.getDictionaryOptions(
    //   'industry'
    // )
  },
  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.app.dictList({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.dialogVisible = true
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
        query: { id: row.id }
      })
    },
    // 删除
    del (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await this.$service.app.deleteDict({ id: row.id })
          this.$message.success('删除成功')
          await this.updateData()
        })
        .catch(() => {})
    },
    // 展开
    async expandChange (row) {
      const result = await this.$service.app.dictSearch({
        dictCode: row.dictCode
      })
      this.$set(this, 'dictData', result)
      this.records = this.records.slice(0)
    }
  }
}
</script>
<style lang="scss" scoped></style>
