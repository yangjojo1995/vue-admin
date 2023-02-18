<template>
  <ym-card>
    <div slot="header">
      <h3>项目完整度评分权重设置</h3>
      <h5>前置条件：栏目总分为100%，每个字段占该栏目总数的1份，计算结果采用四舍五入，取小数点后两位。</h5>
    </div>
    <ym-form ref="setting" label-width="120px">
      <ym-form-item :label="item.itemName" v-for="item,index in list" :key="index">
        <ym-input class="w360" placeholder="请输入" v-model="item.description">
          <div slot="append">%</div>
        </ym-input>
      </ym-form-item>
      <ym-form-item>
        <ym-button type="primary" @click="submitHandle">确定</ym-button>
      </ym-form-item>
    </ym-form>
  </ym-card>

</template>
<script>
export default ({
  data () {
    return {
      list: [

      ],
      rule: {

      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    submitHandle () {
      const bool = this.list.some(item => {
        if (!/^[0-9]{1,2}.?\d{0,2}$/.test(item.description) || item.description * 1 > 100) {
          this.$message.error(`${item.itemName}权重最多为100，最多只能两位小数`)
          return true
        }
      })
      if (!bool) {
        this.submit()
      }
    },
    async submit () {
      await this.$service.project.updateDictDesc({
        itemDtoList: this.list
      })
      this.$message.success('保存成功')
    },
    async getList () {
      const result = await this.$service.project.getDictList({
        dictCode: 'project_complete_degree'
      })
      console.log(result)
      this.list = result
    }
  }
})
</script>
<style scoped>
.w360 {
  width: 360px;
}
</style>
