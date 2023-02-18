<template>
  <ym-dialog :title="title" width="720px" :visible.sync="currentVisible">
    <ym-form
      ref="form"
      :model="form"
      class="form"
      :rules="rules"
      label-width="100px"
    >
      <ym-form-item label="身份" prop="identity">
        <ym-radio-group v-model="form.identity" @change="radioChange">
            <ym-radio v-for="(item, index) in industryOptions" :key="index" :label="item.itemValue">
              {{ item.itemName }}</ym-radio
            >
        </ym-radio-group>
      </ym-form-item>
      <ym-form-item
        label="用户名称"
        prop="name"
      >
        <ym-select
          v-model="form.name"
          filterable
          v-el-select-loadmore="loadmore"
          remote
          @focus="selChange"
          :remote-method="remoteMethod"
          placeholder="请输入用户名称"
        >
          <ym-option
            v-for="item in linkOptions"
            :key="item.rid"
            :label="item.name"
            :value="item.rid"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
    </ym-form>
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
    data: Object
  },
  data () {
    return {
      loading: false,
      form: { },
      tempName: '',
      linkOptions: [],
      industryOptions: [],
      total: '',
      rules: {
        name: [{ required: true, message: '请选择用户', trigger: 'change' }]
      },
      page: 1
    }
  },
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  async created () {
    this.industryOptions = [{ itemValue: 4, itemName: '指导单位' }, { itemValue: 2, itemName: '投资机构' }, { itemValue: 1, itemName: '投资经理' }]
  },
  async mounted () {
  },
  methods: {
    async remoteMethod (val) {
      this.tempName = val
      this.page = 1
      let result = []
      this.linkOptions = []
      if (val) {
        result = await this.$service.confirmation.representativeList({
          page: this.page,
          name: val,
          roleType: this.form.identity
        })
      }
      this.total = result.total
      this.linkOptions = result.records
    },
    async loadmore () {
      if (parseInt(this.total / 10) >= this.page) {
        this.page++
        const result = await this.$service.confirmation.representativeList({
          page: this.page,
          name: this.tempName,
          roleType: this.form.identity
        })
        this.linkOptions = this.linkOptions.concat(result.records)
      }
    },
    selChange () {
      this.linkOptions = []
    },
    radioChange () {
      this.linkOptions = []
    },
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const params = { rids: [this.form.name] }
            await this.$service.confirmation.assistInsert(params)
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
