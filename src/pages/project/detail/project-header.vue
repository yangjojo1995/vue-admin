<template>
  <!-- 项目头信息 -->
  <div class="header" v-if="projectBase.id">
    <div class="header-content">
      <div class="header-content-image">
        <el-image :src="$assets(projectBase.image)"
            :preview-src-list="[$assets(projectBase.image)]">
        </el-image>
      </div>
      <div class="header-content-info">
        <div class="info-title flex-left">
          <div class="info-title-text">
            <span>{{projectBase.projectName}}</span>
            <slot name="header"></slot>
          </div>
        </div>
        <div class="info-property flex-left">
          <div class="info-property-item" v-if="projectBase.industryDict">所属行业：{{projectBase.industryDict.itemName}}</div>
          <div class="info-property-item interval" v-if="projectBase.assessedValue">项目估值：{{projectBase.assessedValue}}</div>
          <div class="info-property-item interval" v-if="projectBase.investRoundDict">轮次：{{projectBase.investRoundDict.itemName}}</div>
          <div class="info-property-item interval" v-if="projectBase.orgName">指定推荐单位：{{projectBase.orgName}}</div>
        </div>
        <div class="info-description" v-if="projectAudit && projectAudit.reason">
          审核批注：{{projectAudit.reason}}
        </div>
        <div class="info-description" v-else-if="projectBase && projectBase.comment">
          审核批注：{{projectBase.comment}}
        </div>
        <div class="info-description">
          项目描述：{{projectBase.description}}
        </div>
      </div>
    </div>

    <div class="header-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    projectBase: {
      type: Object,
      default: () => ({})
    },
    projectAudit: {
      type: Object,
      default: () => ({})
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
      flex-grow: 1;
      .info-title{
        .info-title-text{
          font-size: 16px;
          color: #333333;
          margin-right: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
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
          margin: 8px 24px 8px 0;
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
