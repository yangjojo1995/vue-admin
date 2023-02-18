<template>
  <ym-dialog :visible.sync="currentVisible" :title="title" :width="width">
    <div class="msg-block">
      <div class="b-title">
        BP公开权限
      </div>
      <div>
        <ym-radio-group v-model="form.showAll" @change="typeChange">
          <ym-radio
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.itemValue"
          >
            {{ item.itemName }}</ym-radio
          >
        </ym-radio-group>
      </div>
    </div>
    <div class="msg-block">
      <div class="b-title">
        已授权用户
      </div>
      <div>
        <div v-loading="loading" class="table-list-card__body">
          <ym-table ref="table" row-key="id" :data="records">
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
              prop="type"
              disabled-toggle
              label="身份"
              min-width="120px"
            >
              <div slot-scope="{ row }">
                {{ row.type || "-" }}
              </div>
            </ym-table-column>
            <ym-table-column
              prop="remark"
              disabled-toggle
              label="权限来源"
              min-width="120px"
            >
              <div slot-scope="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.remark"
                  placement="top-end"
                >
                  <span class="ellipsis">{{ row.remark || "-" }}</span>
                </el-tooltip>
              </div>
            </ym-table-column>
            <ym-table-column label="操作" min-width="120px" fixed="right">
              <template slot-scope="{ row,$index }">
                <ym-link v-if="row.remark!=='创建者' && row.remark!== '确权人'" type="primary" @click="remove(row,$index)">移除</ym-link>

              </template>
            </ym-table-column>
          </ym-table>
        </div>
      </div>
    </div>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">取消</ym-button>
      <ym-button type="primary" :loading="loading" @click="submits"
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
      },
      typeOptions: [
        { itemValue: 1, itemName: '所有投资人可查看' },
        { itemValue: 0, itemName: '已授权用户可查看' }
      ],
      remoteLoading: false,
      userList: []
    }
  },
  computed: {},
  async created () {
    const result = await this.$service.mine.searchBpMember({
      bpId: this.bpData.id
    })
    if (result) {
      this.records = result.records
    }
    this.form = this.bpData
  },
  methods: {
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$emit('submit-success', this.form)
      } finally {
        this.loading = false
      }
    },
    // 移除
    async remove (row, index) {
      const params = {
        id: row.id,
        bpId: this.bpData.id
      }
      await this.$service.mine.removeBp(params)
      this.records.splice(index, 1)
      this.$message.success('移除成功')
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
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 18px;
  }
}
</style>
