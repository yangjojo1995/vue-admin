<template>
  <ym-dialog
    :title="title"
    width="50vw"
    :visible.sync="currentVisible"
    top="30px"
  >
    <div class="selects">
      <div class="sel-left">
        <div class="sel-block">
          <span class="labels">身份</span>
          <ym-radio-group v-model="form.roleType">
            <ym-radio
             @click.native.prevent="radioChange(item.itemValue)"
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.itemValue"
            >
              {{ item.itemName }}</ym-radio
            >
          </ym-radio-group>
        </div>
        <div class="sel-block">
          <span class="labels">用户名称</span>
          <ym-input v-model="name" filterable placeholder="请输入用户名称">
          </ym-input>
        </div>
        <div class="sel-list" v-if="peopleList.length > 0">
          <el-checkbox-group
            v-model="selList"
            @change="handleChecked"
            :max="10"
          >
            <el-checkbox
              v-for="(item, index) in peopleList"
              :label="item.rid"
              :key="index"
              :checked="selectIds.includes(item.rid) == 'true'"
              ><span style="word-break: break-all;white-space: normal;">{{
                `${item.name}(${item.roleTypeStr})`
              }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="sel-line"></div>
      <div class="sel-right">
        <div class="sel-right-title">
          <span class="title-left">已选内容</span>
          <span class="title-right">（最多选择10位确权人）</span>
        </div>
        <div class="tags">
          <el-tag
            v-for="(tag, index) in tags"
            :key="index"
            closable
            @close="tagClose(tag)"
          >
            <div class="ellipsis">
              <el-tooltip
                class="item"
                effect="light"
                :content="tag.name"
                placement="top"
              >
                <span>{{ tag.name }}</span>
              </el-tooltip>
            </div>
          </el-tag>
        </div>
      </div>
    </div>

    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="submits"
        >确定</ym-button
      >
    </div>
  </ym-dialog>
</template>

<script>
import DialogSingleForm from '@/mixins/DialogSingleForm'
export default {
  name: 'AdvDialog',
  mixins: [DialogSingleForm],
  props: {
    // 默认数据
    data: Object,
    bpList: []
  },
  data () {
    return {
      loading: false,
      form: { },
      name: '',
      selList: [],
      peopleList: [],
      labels: '选择活动',
      linkOptions: [],
      typeOptions: [],
      tags: [],
      dataList: [] // 历史备份数据
    }
  },
  watch: {
    async name (val) {
      // if (val) {
      const result = await this.$service.mine.searchAssistMemberNoPage({
        roleType: this.form.roleType,
        enable: 0,
        name: val
      })
      this.peopleList = result
      // }
    },
    'form.roleType': async function (val, oldVal) {
      const result = await this.$service.mine.searchAssistMemberNoPage({
        roleType: val,
        enable: 0,
        name: this.name
      })
      this.peopleList = result
    }
  },
  computed: {
    selectIds () {
      if (this.tags && this.tags.length > 0) {
        const arr = []
        this.tags.every(item => arr.push(item.rid))
        return arr
      } else {
        return []
      }
    }
  },
  created () {
    // if (this.bpList.length > 0) {
    //   const arr = []
    //   this.bpList.map(item => {
    //     arr.push({
    //       name: item.representativeIdStr,
    //       roleTypeStr: item.roleTypeStr,
    //       rid: item.representativeId
    //     })
    //   })
    // }
    this.typeOptions = [
      { itemValue: '4', itemName: '指导单位' },
      { itemValue: '2', itemName: '投资机构' },
      { itemValue: '1', itemName: '投资经理' }
    ]
  },
  async mounted () {
    const result = await this.$service.mine.searchAssistMemberNoPage({
      roleType: '',
      enable: 0,
      name: this.name
    })
    const arr = []
    const slectArr = []
    this.bpList.forEach(item => {
      result.some(obj => {
        if (item.representativeId === obj.rid) {
          slectArr.push(obj.rid)
          arr.push(obj)
        }
      })
    })
    this.tags = arr
    this.selList = slectArr
    this.peopleList = result
    this.dataList = JSON.parse(JSON.stringify(result))
  },
  methods: {
    handleClose () {
      this.tags = []
      this.selList = []
      this.$emit('update:visible', false)
    },
    // 选中
    handleChecked (val) {
      const arr = []
      val.forEach(item => {
        let data = {}
        this.dataList.some(obj => {
          if (item === obj.rid) {
            data = obj
            arr.push(data)
            return true
          }
        })
      })
      this.tags = arr
    },
    tagClose (tag) {
      const index = this.tags.indexOf(tag)
      this.tags.splice(index, 1)
      this.selList.splice(index, 1)
    },
    radioChange (val) {
      if (val === this.form.roleType) {
        this.$set(this.form, 'roleType', '')
      } else {
        this.$set(this.form, 'roleType', val)
      }
    },
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$emit('submit-success', this.tags)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.c-flexs {
  display: flex;
  align-items: center;
}
.selects {
  display: flex;
  justify-content: space-between;
  height: calc(70vh - 130px);
  .sel-block {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    .labels {
      width: 80px;
    }
  }
  .sel-list {
    height: calc(70vh - 200px);
    overflow-y: auto;
    &::v-deep .el-checkbox {
      width: 100%;
      display: flex;
      margin-bottom: 5px;
    }
    &::v-deep .el-checkbox__label {
      width: 100%;
    }
  }
  .sel-left {
    width: 49%;
  }
  .sel-right {
    width: 49%;
    .tags {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
    }
    &::v-deep .el-tag {
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: fit-content;
      max-width: 100%;
      margin-bottom: 10px;
    }
    .sel-right-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .title-left {
        color: #666666;
      }
      .title-right {
        color: #b2b2b2;
      }
    }
  }
  .sel-line {
    width: 1px;
    background: #e9e9e9;
    height: 100%;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    /*文字超出宽度则显示ellipsis省略号*/
    text-overflow: ellipsis;
    width: 100%;
  }
}
</style>
