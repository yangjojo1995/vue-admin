<template>
  <ym-dialog :visible.sync="currentVisible" :title="title" :width="width">
    <div class="msg-block">
      <div class="b-title">
        <span class="l-title">已邀请确权人</span>
        <span class="r-title">状态：{{bpData.confirmed==1?'已确权':'待确权'}}</span>
      </div>
      <div>
        <div v-loading="loading" class="table-list-card__body">
          <ym-table ref="table" row-key="id" :data="records">
            <ym-table-column
              prop="representativeIdStr"
              disabled-toggle
              label="用户名称"
              min-width="140px"
            >
              <div slot-scope="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.representativeIdStr"
                  placement="top-end"
                >
                  <span class="ellipsis">{{ row.representativeIdStr || "-" }}</span>
                </el-tooltip>
              </div>
            </ym-table-column>
            <ym-table-column
              prop="status"
              disabled-toggle
              label="状态"
              min-width="120px"
            >
              <div slot-scope="{ row }">
                <span v-if="row.status==='assisting'">确权中</span>
                <span v-else-if="row.status==='assisted'">已确权</span>
                <span v-else>已撤销</span>
              </div>
            </ym-table-column>
            <ym-table-column
              prop="updateTime"
              label="确权时间"
              min-width="130px"
            >
              <span slot-scope="{ row }">{{
                row.updateTime | dateFormat("YYYY-MM-DD HH:mm:ss")
              }}</span>
            </ym-table-column>
            <ym-table-column label="操作" min-width="120px" fixed="right">
              <template slot-scope="{ row,$index }"  v-if="row.status==='assisting'">
                <ym-link type="primary" @click="delPeople(row,$index)">撤销</ym-link>
              </template>
            </ym-table-column>
          </ym-table>
        </div>
      </div>
    </div>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">取消</ym-button>
      <ym-button type="primary" :loading="loading" @click="handleClose"
        >确认</ym-button
      >
    </div>
  </ym-dialog>
</template>

<script>
import DialogSingleForm from '@/mixins/DialogSingleForm'

export default {
  mixins: [DialogSingleForm],
  props: {
    title: {
      type: String,
      default: ''
    },
    bpData: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      types: '',
      records: [],
      form: {
        reason: ''
      },
      rules: {
        reason: [
          { type: 'string', required: true, message: '请输入提前结束原因' },
          { min: 1, max: 15, message: '请输入1~15字' }
        ]
      },
      typeOptions: [
        { itemValue: '0', itemName: '平台所有投资人可查看、下载' },
        { itemValue: '1', itemName: '向我申请授权后可查看、下载' }
      ],
      remoteLoading: false,
      userList: []
    }
  },
  computed: {},
  async created () {
    if (this.bpData.id) {
      this.loadData()
    }
  },
  methods: {
    // 加载数据
    async loadData () {
      const result = await this.$service.mine.searchMember({
        bpId: this.bpData.id
      })
      if (result) {
        this.records = result
      }
    },
    // 移除确权人
    async delPeople (row, index) {
      await this.$service.mine.revokeBpMember({
        id: row.id
      })
      this.records[index].status = 'revoke'
      this.$message.success('撤销成功')
    },
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$emit('submit-success', this.form)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.msg-block {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
  .b-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
     margin-bottom: 18px;
    .l-title {
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>
