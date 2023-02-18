<template>
  <ym-dialog :title="title" width="600px" :visible.sync="currentVisible">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="150px">
      <ym-form-item label="审核结果" prop="status">
        <ym-radio-group v-model="form.status" @change="handleChange">
          <ym-radio v-for="(item, index) in typeOptions" :key="index" :label="item.itemValue">
            {{ item.itemName }}</ym-radio>
        </ym-radio-group>
      </ym-form-item>
      <ym-form-item class="long-label" v-if="form.status === 'accept'" key="0" label="是否公开展示在指导单位列表" prop="displayable">
        <ym-radio-group v-model="form.displayable">
          <ym-radio v-for="(item, index) in openOptions1" :key="index" :label="item.itemValue">
            {{ item.itemName }}</ym-radio>
        </ym-radio-group>
      </ym-form-item>
      <!-- <ym-form-item
        class="long-label"
        v-if="form.status === 'accept'"
        key="1"
        label="是否支持创建和发布项目"
        prop="support"
      >
        <ym-radio-group v-model="form.support">
          <ym-radio
            v-for="(item, index) in openOptions2"
            :key="index"
            :label="item.itemValue"
          >
            {{ item.itemName }}</ym-radio
          >
        </ym-radio-group>
      </ym-form-item> -->
      <ym-form-item v-if="form.status === 'refuse'" key="2" prop="reason" label="不通过理由">
        <ym-input type="textarea" rows="4" v-trim v-model="form.reason" placeholder=""></ym-input>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="submits">确定</ym-button>
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
    data: Object
  },
  data () {
    return {
      loading: false,
      form: {},
      labels: '选择活动',
      linkOptions: [],
      typeOptions: [
        { itemValue: 'accept', itemName: '审核通过' },
        { itemValue: 'refuse', itemName: '审核不通过' }
      ],
      openOptions1: [
        { itemValue: 1, itemName: '公开' },
        { itemValue: 0, itemName: '不公开' }
      ],
      openOptions2: [
        { itemValue: 1, itemName: '支持' },
        { itemValue: 0, itemName: '不支持' }
      ],
      rules: {
        status: [{ required: true, message: '请选择审核结果' }],
        reason: [
          { required: true, message: '请输入不通过理由' },
          { min: 2, max: 100, message: '请输入2~100字' }
        ],
        displayable: [
          { required: true, message: '请选择展示状态', trigger: 'change' }
        ]
      }
    }
  },
  async created () {
    this.form.status = 'accept'
  },
  async mounted () { },
  methods: {
    handleChange (val) {
      this.$forceUpdate()
    },
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const params = { ...this.form }
            params.id = this.$route.query.id
            await this.$service.manager.verifyAudit(params)
            this.$emit('submit-success')
          } else {
            return false
          }
        })
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
</style>
