<template>
  <div class="detail">

    <!-- 项目头信息 -->
    <ym-card class="ym-mb-3">
      <project-header :projectBase="item.projectBase" :projectAudit="item.projectAudit">
        <template v-slot:header>
          <slot name="header"></slot>
        </template>
        <template v-slot:footer>
          <ym-button v-if="item.projectBusinessPlan && item.projectBusinessPlan.bpUrl" type="primary" round size="medium" @click="previewBp(item.projectBusinessPlan.bpUrl)">查看BP</ym-button>
          <slot name="footer"></slot>
        </template>
      </project-header>
    </ym-card>

    <ym-card class="ym-mb-3">
      <el-tabs value="first">
        <el-tab-pane label="项目信息" name="first">
          <!-- 基本信息 企业信息 联系人信息 -->
          <project-info :projectBase="item.projectBase" :projectCompany="item.projectCompany"></project-info>

          <!-- 产品和服务信息 -->
          <project-product :projectProduct="item.projectProduct"></project-product>

          <!-- 团队成员信息 -->
          <project-members :projectMembers="item.projectMembers"></project-members>
        </el-tab-pane>

        <el-tab-pane label="财务状况" name="second">
          <!-- 财务状况 -->
          <project-finance :projectFinances="item.projectFinances"></project-finance>
        </el-tab-pane>

      </el-tabs>
    </ym-card>
  </div>
</template>

<script>
import projectInfo from './project-info'
import projectFinance from './project-finance'
import projectProduct from './project-product'
import projectMembers from './project-members'
import projectHeader from './project-header'
export default {
  components: {
    projectHeader, projectInfo, projectFinance, projectProduct, projectMembers
  },
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    projectBase: function () {
      return this.item.projectBase
    }
  },
  watch: {
    detail: {
      handler (item) {
        if (Object.keys(item).length > 0) {
          this.item = JSON.parse(JSON.stringify(this.detail))
          // !!item.projectBase.id && this.loadData(item.projectBase.id)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      item: {}
      // bpUrl: ''
    }
  },
  methods: {
    async loadData (id) {
      const bpPdfResult = await this.$service.project.getBpInfo({
        id: id
      })
      if (bpPdfResult) {
        this.bpUrl = this.$assets(bpPdfResult.bpUrl)
      }
    },

    // 预览BP
    async previewBp (url) {
      window.open(this.$assets(url))
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  margin-top: 0;

  .header-content{
    width: 100%;
    display: flex;

    .header-content-image{
      width: 100px;
      height: 100px;
      background: transparent;
      margin-right: 28px;
      flex: 100px 0 0;

      img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .header-content-info{
      .info-title{
        .info-title-text{
          font-size: 16px;
          color: #333333;
          margin-right: 12px;
          font-weight: bold;
          white-space: pre;
        }
        .info-title-tag{
          width: 54px;
          height: 24px;
          background: rgba(77,179,85,0.1000);
          border-radius: 15px;
          border: 1px solid rgba(77,179,85,0.3000);
          font-size: 12px;
          color: $--ym-color-primary;
          line-height: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: default;
        }
      }

      .info-property{
        .info-property-item {
          flex-wrap: nowrap;
          margin: 16px 24px 16px 0;
        }
      }
    }

  }

  .header-footer{
    margin-top: 16px;
    margin-bottom: -8px;
    padding-top: 16px;
    border-top: 1px solid #E3E5E8;

    button{
      padding-left: 32px;
      padding-right: 32px;
    }
  }
}

.flex-left{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.flex-center{
  display: flex;
  align-items: center;
  justify-content: center;
}

.interval{
  position: relative;

  &::after{
    content: '';
    width: 1px;
    height: 14px;
    border-right: 1px solid #d7d9dd;
    position: absolute;
    top: 4px;
    left: -12px;
  }
}
</style>
