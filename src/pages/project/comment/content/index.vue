<template>
  <div class="page">
    <ym-form-filter-card :model.sync="filter" @model-change="updateRecordsByPage(1)">
      <ym-form-item label="点评人">
        <ym-input :maxlength="100" v-model="filter.createByName" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="对象">
        <ym-input :maxlength="100" v-model="filter.bindDesc" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="内容">
        <ym-input :maxlength="100" v-model="filter.keyword" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="时间" :span="2">
        <ym-date-picker-range :start-date.sync="filter.beginTime" :end-date.sync="filter.endTime"></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="状态">
        <!-- 启用状态启用状态0启用1禁用-->
        <ym-select v-model="filter.enable" clearable>
          <ym-option label="全部" value=""></ym-option>
          <ym-option label="启用" :value="0"></ym-option>
          <ym-option label="关闭" :value="1"></ym-option>

        </ym-select>
      </ym-form-item>

    </ym-form-filter-card>

    <ym-table-list-card row-key="accountId" :loading="loading" :data="records" :current-page.sync="paging.page" :page-size.sync="paging.size" :total="total" @current-change="updateRecordsByPage" @size-change="updateRecordsByPage(1)" @sort-change="sortRecords">
      <ym-table-column type="index" :index="startIndex" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="createByName" label="点评人" min-width="160px" disabled-toggle></ym-table-column>
      <ym-table-column prop="bindTypeStr" label="类型" min-width="120px" disabled-toggle></ym-table-column>
      <ym-table-column prop="orgName" label="对象" min-width="140px">
        <span slot-scope="{ row }">{{ row.bindObject.desc || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="createTime" label="时间" min-width="140px">
        <div slot-scope="{ row }">
          <div> {{row.createTime | dateFormat("YYYY-MM-DD")}}</div>
          <div> {{row.createTime | dateFormat(" HH:mm:ss")}}</div>
        </div>
      </ym-table-column>

      <ym-table-column prop="content" label="内容" min-width="200px">
        <div slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" :content="row.content" placement="top-end">
            <span class="ellipsis">{{ row.content || "-" }}</span>
          </el-tooltip>
        </div>
      </ym-table-column>
      <ym-table-column prop="likes" label="点赞" min-width="120px">
        <span slot-scope="{ row }">{{ row.likes || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="enable" label="状态" min-width="120px">
        <span slot-scope="{ row }">
          <el-switch :value="row.enable" @change=" val => { statusChange(val, row);}" :active-value="0" :inactive-value="1">
          </el-switch>
        </span>
      </ym-table-column>
      <ym-table-column label="操作" width="120px">
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
        beginTime: '',
        keyword: '',
        endTime: '',
        createByName: '',
        bindDesc: '',
        enable: '' // 0启用 1禁用
      }
    }
  },

  methods: {
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.project.commentSearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 查看audit
    views (row) {
      this.$router.push({
        path: '/project/comment/content/detail',
        query: { id: row.id }
      })
    },
    // 状态修改
    async statusChange (value, row) {
      console.log(value)
      if (value === 1) {
        const h = this.$createElement
        // 状态先保持不变
        // value === 1 ? (row.enable = 1) : (row.enable = 0)

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
          this.switchValue = value

          const params = {
            commentId: row.id,
            enable: value
          }
          await this.$service.project.commentOperate(params)
          row.enable = value
          this.$message.success('修改成功')
        })
      } else {
        const params = {
          commentId: row.id,
          enable: value
        }
        await this.$service.project.commentOperate(params)
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
