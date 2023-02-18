<template>
  <div class="page">
    <ym-form-filter-card :model.sync="filter" @model-change="updateRecordsByPage(1)">
      <ym-form-item label="类型">
        <ym-select v-model="filter.bindType" clearable>
          <ym-option label="全部" value=""></ym-option>
          <ym-option label="项目" :value="0"></ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="对象">
        <ym-input :maxlength="100" v-model="filter.keyword" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="状态">
        <ym-select v-model="filter.enable" clearable>
          <ym-option label="全部" value=""></ym-option>
          <ym-option label="启用" :value="0"></ym-option>
          <ym-option label="关闭" :value="1"></ym-option>
        </ym-select>
      </ym-form-item>

    </ym-form-filter-card>

    <ym-table-list-card row-key="accountId" :loading="loading" :data="records" :current-page.sync="paging.page" :page-size.sync="paging.size" :total="total" @current-change="updateRecordsByPage" @size-change="updateRecordsByPage(1)" @sort-change="sortRecords">
      <ym-table-column type="index" :index="startIndex" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="bindTypeStr" label="类型" min-width="120px" disabled-toggle></ym-table-column>

      <ym-table-column prop="desc" label="对象" min-width="140px">
        <span slot-scope="{ row }">{{ row.desc || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="commentNum" label="点评数" min-width="120px">
        <span slot-scope="{ row }">{{ row.commentNum || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="score" label="评分" min-width="120px">
        <span slot-scope="{ row }">{{ row.score || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="status" label="状态" min-width="120px">
        <span slot-scope="{ row }">
          <el-switch :value="row.enable" @change=" val => { statusChange(val, row);}" :active-value="0" :inactive-value="1">
          </el-switch>
        </span>
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
      filter: {
        keyword: '',
        enable: '',
        bindType: ''
      }
    }
  },

  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.project.commentObjectSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 查看audit
    views (row) {
      this.$router.push({
        path: '/project/comment/object/detail',
        query: { id: row.bindId }
      })
    },
    // 状态修改
    async statusChange (value, row) {
      if (value === 1) {
        const h = this.$createElement
        // 状态先保持不变
        this.$msgbox({
          title: '确认提示',
          message: h('p', null, [
            h('p', { style: 'color: #000;font-size:16px;font-weight:bold' }, '确认关闭点评内容吗?'),
            h('p', { style: 'color: #666' }, '关闭后该点评，即此内容对所有人不可见')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async () => {
          const params = {
            bindId: row.bindId,
            enable: value
          }
          await this.$service.project.commentObjectOperate(params)
          row.enable = value
          this.$message.success('修改成功')
        })
      } else {
        const params = {
          bindId: row.bindId,
          enable: value
        }
        await this.$service.project.commentObjectOperate(params)
        row.enable = value
        this.$message.success('修改成功')
      }
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
