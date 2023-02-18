<template>
  <div class="project">
    <div class="title" v-if="projectFinances">近三年财务状况</div>

    <template v-if="projectFinances && Object.keys(item1).length>0">
      <div class="des">单位：万元</div>
      <div class="table" >
        <div class="table-group">
          <div class="table-group-label flex-left">项目年度</div>
          <div class="table-group-label flex-center" style="flex-grow:1">{{item1.year}}</div>
          <div class="table-group-label flex-center" style="flex-grow:1">{{item2.year}}</div>
          <div class="table-group-label flex-center" style="flex-grow:1">{{item3.year}}</div>
        </div>
        <div class="table-group">
          <div class="table-group-label flex-left">资产总额</div>
          <div class="table-group-value flex-center">{{item1.totalAssets || 0 }}</div>
          <div class="table-group-value flex-center">{{item2.totalAssets || 0 }}</div>
          <div class="table-group-value flex-center">{{item3.totalAssets || 0 }}</div>
        </div>
        <div class="table-group">
          <div class="table-group-label flex-left">营业收入</div>
          <div class="table-group-value flex-center">{{item1.income || 0 }}</div>
          <div class="table-group-value flex-center">{{item2.income || 0 }}</div>
          <div class="table-group-value flex-center">{{item3.income || 0 }}</div>
        </div>
        <div class="table-group">
          <div class="table-group-label flex-left">净资产</div>
          <div class="table-group-value flex-center">{{item1.netAssets || 0 }}</div>
          <div class="table-group-value flex-center">{{item2.netAssets || 0 }}</div>
          <div class="table-group-value flex-center">{{item3.netAssets || 0 }}</div>
        </div>
        <div class="table-group">
          <div class="table-group-label flex-left">净利润</div>
          <div class="table-group-value flex-center">{{item1.netProfit || 0 }}</div>
          <div class="table-group-value flex-center">{{item2.netProfit || 0 }}</div>
          <div class="table-group-value flex-center">{{item3.netProfit || 0 }}</div>
        </div>
        <div class="table-group">
          <div class="table-group-label flex-left">负债</div>
          <div class="table-group-value flex-center">{{item1.debt || 0 }}</div>
          <div class="table-group-value flex-center">{{item2.debt || 0 }}</div>
          <div class="table-group-value flex-center">{{item3.debt || 0 }}</div>
        </div>
        <div class="table-group">
          <div class="table-group-label flex-left">资产负债率</div>
          <div class="table-group-value flex-center">{{item1.debtRatio || 0 }}%</div>
          <div class="table-group-value flex-center">{{item2.debtRatio || 0 }}%</div>
          <div class="table-group-value flex-center">{{item3.debtRatio || 0 }}%</div>
        </div>
        <div class="table-group">
          <div class="table-group-label flex-left">现金流量净额</div>
          <div class="table-group-value flex-center">{{item1.netCashFlow || 0 }}</div>
          <div class="table-group-value flex-center">{{item2.netCashFlow || 0 }}</div>
          <div class="table-group-value flex-center">{{item3.netCashFlow || 0 }}</div>
        </div>
      </div>
    </template>

    <div v-else>暂无财务数据</div>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    projectFinances: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    projectFinances: {
      handler: function (value) {
        if (Array.isArray(value) && value.length > 2) {
          this.item1 = value[0] || {}
          this.item2 = value[1] || {}
          this.item3 = value[2] || {}
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      item1: {},
      item2: {},
      item3: {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./project-css.scss";
  .des{
    width: 100%;
    text-align: right;
    margin: -12px 0 12px;
  }

</style>
