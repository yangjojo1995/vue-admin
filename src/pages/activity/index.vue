<template>
  <div class="page">
    <ym-form-filter-card
      :model.sync="filter"
      @model-change="updateRecordsByPage(1)"
    >
      <ym-form-item label="活动名称">
        <ym-input
          :maxlength="100"
          v-model="filter.title"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="发起人">
        <ym-input
          :maxlength="100"
          v-model="filter.publisherName"
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
      <ym-form-item label="主办方">
        <ym-input
          :maxlength="100"
          v-model="filter.organizer"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="创建时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginCreateTime"
          :end-date.sync="filter.endCreateTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="活动开始时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginBeginTime"
          :end-date.sync="filter.endBeginTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="活动结束时间" :span="2">
        <ym-date-picker-range
          :start-date.sync="filter.beginEndTime"
          :end-date.sync="filter.endEndTime"
        ></ym-date-picker-range>
      </ym-form-item>
      <ym-form-item label="发布方式">
        <ym-select v-model="filter.publishType" clearable>
          <ym-option
            v-for="item in typeOptions"
            :key="item.itemValue"
            :label="item.itemName"
            :value="item.itemValue"
          >
          </ym-option>
        </ym-select>
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
          >创建活动</ym-button
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
        label="活动名称"
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
        prop="publishTypeDict"
        label="发布方式"
        min-width="120px"
      >
        <span slot-scope="{ row }">{{
          row.publishTypeDict ? row.publishTypeDict.itemName : "-"
        }}</span>
      </ym-table-column>
      <ym-table-column prop="publisherInfo" label="发布人" min-width="120px">
        <span slot-scope="{ row }">{{
          row.publisherInfo ? row.publisherInfo.name : "-"
        }}</span>
      </ym-table-column>
      <ym-table-column prop="organizer" label="主办方" min-width="120px">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.organizer"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.organizer || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column prop="address" label="活动地址" min-width="140px">
        <span slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.address"
            placement="top-end"
          >
            <span class="ellipsis">{{ row.address || "-" }}</span>
          </el-tooltip>
        </span>
      </ym-table-column>
      <ym-table-column prop="beginTime" label="活动开始时间" min-width="120px">
        <span slot-scope="{ row }">{{
          row.beginTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column prop="endTime" label="活动结束时间" min-width="120px">
        <span slot-scope="{ row }">{{
          row.endTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column prop="view" label="查看次数" min-width="120px">
        <span slot-scope="{ row }">{{ row.view || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="applyNum" label="报名人数" min-width="120px">
        <span slot-scope="{ row }">{{ row.applyNum || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="signInNum" label="签到人数" min-width="120px">
        <span slot-scope="{ row }">{{ row.signInNum || "-" }}</span>
      </ym-table-column>
      <ym-table-column prop="status" label="状态" min-width="120px">
        <span slot-scope="{ row }">
          {{ row.statusDict ? row.statusDict.itemName : "-" }}
        </span>
      </ym-table-column>

      <ym-table-column prop="createTime" label="创建时间" min-width="130px">
        <span slot-scope="{ row }">{{
          row.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </ym-table-column>
      <ym-table-column label="操作" min-width="120px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link type="primary" @click="views(row)">查看</ym-link>
          <ym-link
            v-if="
              row.statusDict.itemName === '预发布' ||
                (row.statusDict.itemName === '报名中' &&
                  row.publishTypeDict.itemName === '官方发布') ||
                row.statusDict.itemName === '待确认'
            "
            type="primary"
            @click="handleUpdateItem(row)"
            >编辑</ym-link
          >
          <ym-link
            v-if="
              row.statusDict.itemName !== '已下架' &&
                row.statusDict.itemName !== '已结束' &&
                row.statusDict.itemName !== '预发布'
            "
            type="primary"
            @click="endActivity(row)"
            >结束</ym-link
          >
          <ym-link
            v-if="
              row.statusDict.itemName !== '已下架' &&
                row.statusDict.itemName !== '预发布'
            "
            type="primary"
            @click="offActivity(row)"
            >下架</ym-link
          >
        </template>
      </ym-table-column>
    </ym-table-list-card>
    <!-- 询问弹窗 -->
    <endDialog
      :visible.sync="dialogEnd"
      title="告知用户结束原因"
      placeholder="请输入15字内的结束原因"
      @submit-success="examine"
    >
    </endDialog>
    <!-- 询问弹窗 -->
    <endDialog
      :visible.sync="dialogOff"
      title="告知用户下架原因"
      placeholder="请输入15字内的下架原因"
      @submit-success="offExamine"
    >
    </endDialog>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
import endDialog from './_components/endDialog.vue'
export default {
  name: 'activity',
  mixins: [PageSingleList],
  components: { endDialog },
  data () {
    return {
      filter: {
        title: '',
        beginCreateTime: '',
        endCreateTime: '',
        organizer: '',
        publisherName: '',
        status: '',
        beginBeginTime: '',
        endBeginTime: '',
        beginEndTime: '',
        endEndTime: '',
        publishType: ''
      },
      dialogVisible: false,
      dialogData: null,
      dialogEnd: false,
      dialogOff: false,
      userBindDialogVisible: false,
      UserBindRoleDialogVisible: false,
      tempId: '',
      statusOptions: [],
      typeOptions: []
    }
  },
  async created () {
    this.statusOptions = await this.$service.app.dictSearch({
      dictCode: 'activity_status'
    })
    this.typeOptions = await this.$service.app.dictSearch({
      dictCode: 'publish_type'
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
      return this.$service.activity.activitySearch({
        ...paging,
        page: paging.page,
        ...entity,
        orders
      })
    },

    // 添加
    handleCreateItem () {
      this.$router.push({
        path: '/activity/edit',
        query: { type: 'add' }
      })
    },
    // 查看
    views (row) {
      this.$router.push({
        path: '/activity/view',
        query: { id: row.id }
      })
    },
    // 编辑
    handleUpdateItem (row) {
      this.$router.push({
        path: '/activity/edit',
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
            status: 'end',
            id: row.id
          }
          await this.$service.activity.activityUpdate(params)
          this.$message.success('操作成功')
          this.updateRecordsByPage(1)
        })
        .catch(() => {})
    },
    // 结束
    endActivity (row) {
      this.tempId = row.id
      this.dialogEnd = true
    },
    // 下架
    offActivity (row) {
      this.tempId = row.id
      this.dialogOff = true
    },
    async examine (form) {
      const params = {
        status: 'end',
        reason: form.reason,
        id: this.tempId
      }
      await this.$service.activity.activityStatus(params)
      this.tempId = ''
      this.dialogEnd = false
      this.updateRecordsByPage(1)
      this.$message.success('操作成功')
    },
    async offExamine (form) {
      const params = {
        status: 'down',
        downReason: form.reason,
        id: this.tempId
      }
      await this.$service.activity.activityStatus(params)
      this.tempId = ''
      this.dialogOff = false
      this.updateRecordsByPage(1)
      this.$message.success('操作成功')
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
