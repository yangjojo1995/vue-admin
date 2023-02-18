<template>
  <div class="org-panel" :class="{'fold': foldFlag}">
    <div class="org-panel-close" @click="panelClose">
      <i class="ym-icon ym-icon-guanbi"></i>
    </div>
    <div class="org-panel-head flex-start">
      <div class="org-panel-head-left">
        <div class="org-panel-head-logo">
          <img :src="$assets(panelData.logo)" />
        </div>
        <div class="org-panel-head-name">{{panelData.shortName}}</div>
      </div>
      <div class="org-panel-head-right" @click="goDetail(panelData.id)">
        <span>详情</span>
        <i class="ym-icon ym-icon-right"></i>
      </div>
    </div>
    <div class="org-panel-info">
      <div class="org-panel-group">
        <div class="org-panel-group-title">投资偏好</div>
        <div class="org-panel-group-item">
          <div class="org-panel-group-item-label">关注地区</div>
          <div class="org-panel-group-item-value">{{panelData.focusAreas || '-'}}</div>
        </div>
        <div class="org-panel-group-item">
          <div class="org-panel-group-item-label">投资领域</div>
          <div class="org-panel-group-item-value">{{panelData.investFields || '-'}}</div>
        </div>
        <div class="org-panel-group-item">
          <div class="org-panel-group-item-label">投资轮次</div>
          <div class="org-panel-group-item-value">{{panelData.investRounds || '-'}}</div>
        </div>
        <div class="org-panel-group-item">
          <div class="org-panel-group-item-label">单笔投额</div>
          <div class="org-panel-group-item-value">{{panelData.investment || '-'}}</div>
        </div>
      </div>
      <div class="org-panel-group">
        <div class="org-panel-group-title">基本信息</div>
        <div class="org-panel-group-item">
          <div class="org-panel-group-item-label">联系电话</div>
          <div class="org-panel-group-item-value">{{panelData.contactPhone}}</div>
        </div>
        <div class="org-panel-group-item">
          <div class="org-panel-group-item-label">邮箱地址</div>
          <div class="org-panel-group-item-value">{{panelData.contactEmail}}</div>
        </div>
        <div class="org-panel-group-item">
          <div class="org-panel-group-item-label">单位名称</div>
          <div class="org-panel-group-item-value">{{panelData.fullName || '-'}}</div>
        </div>
        <div class="org-panel-group-item" v-if="panelData.location">
          <div class="org-panel-group-item-label">所属地区</div>
          <div class="org-panel-group-item-value">{{panelData.location.province + panelData.location.city}}</div>
        </div>
        <div class="org-panel-group-item" style="align-items: flex-start;">
          <div class="org-panel-group-item-label">单位简介</div>
          <div class="org-panel-group-item-value" style="white-space: pre-wrap;">{{panelData.introduction || '暂无简介'}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const wx = window.wx
export default {
  props: {
    panelData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      foldFlag: true // 收起面板
    }
  },
  methods: {
    panelClose (e) {
      setTimeout(() => {
        this.foldFlag = true
      }, 100)
    },
    panelExpand (panelExpand) {
      this.foldFlag = false
    },
    goDetail (id) {
      if (wx) {
        wx.miniProgram.navigateTo({
          url: `./detail?id=${id}`
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.org-panel.fold {
  height: 0px;
}

.org-panel {
  height: 332px;
  position: absolute;
  bottom: 0;
  background: #fff;
  width: 100%;
  z-index: 10000;
  box-sizing: border-box;
  transition: all 0.6s ease;
  box-shadow: 0 -2px 12px 0 rgb(0 0 0 / 10%);
  overflow: hidden;
  border-radius: 15px 15px 0 0;

  .org-panel-close {
    color: #999;
    text-align: right;
    margin-right: 13px;
    margin-top: 12px;
  }

  .org-panel-head {
    padding: 4px 12px 12px;
    .org-panel-head-left {
      display: flex;
      align-items: center;
    }
    .org-panel-head-right {
      display: flex;
      align-items: center;
      span {
        font-size: 13px;
        line-height: 1;
        margin-right: 3px;
      }
      .ym-icon-right {
        font-size: 12px;
        margin-top: 2px;
      }
    }
    .org-panel-head-logo {
      flex: 0 0 48px;
      height: 48px;
      border-radius: 48px;
      overflow: hidden;
      background: #f2f2f2;

      img {
        width: 48px;
        height: 48px;
        border-radius: 48px;
        object-fit: contain;
      }
    }

    .org-panel-head-name {
      font-size: 15px;
      font-weight: bold;
      margin-left: 12px;
    }
  }

  .org-panel-info {
    overflow-y: auto;
    height: 260px;
    padding: 0 16px;
  }

  .org-panel-group {
    width: 100%;
    overflow: hidden;
    position: relative;

    &::before {
      width: 100%;
      content: "";
      height: 1px;
      background: #f2f2f2;
      position: absolute;
    }

    .org-panel-group-title {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      margin: 12px 0;
    }

    .org-panel-group-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      margin: 12px 0;

      .org-panel-group-item-label {
        min-width: 80px;
        color: #999999;
        font-size: 13px;
      }
      .org-panel-group-item-value {
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.flex-start {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
