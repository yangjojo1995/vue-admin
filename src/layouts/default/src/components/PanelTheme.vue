<template>
  <div class="panel-theme">
    <div class="panel-theme__header">设置</div>
    <div class="panel-theme__body">
      <!-- <div class="subbox">
        <div class="subbox__title">模式</div>
        <div class="flexbox-2">
          <div
            v-for="item in themeOptions"
            :key="item.name"
            class="flexbox-item mode-box"
            :class="{
              [`mode-box__${item.name}`]: item.name,
              [item.class]: item.class,
              'is-active': item.name === theme
            }"
            @click="handleSetTheme(item.name)">
            <ym-icon :icon="item.icon"></ym-icon>
          </div>
        </div>
      </div> -->
      <div class="subbox">
        <div class="subbox__title">主题</div>
        <div class="flexbox-3">
          <div
            v-for="(color) in colors"
            :key="color"
            class="flexbox-item color-box"
            :class="{ 'is-active': color === themeColor }"
            :style="`--color: ${color}`"
            @click="setThemeColor(color)">
          </div>
        </div>
      </div>
      <div class="subbox">
        <div class="subbox__title">伸展</div>
        <div class="stretch-box" :class="{ [`is-${containerStretch}`]: containerStretch }" @click="toggleContainerStretch()">
          <div class="stretch-box__inner">
            <i class="el-icon el-icon-arrow-left"></i>
            <i class="el-icon el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      themeOptions: [
        { name: 'default', class: 'mode-box__1', icon: 'taiyang' },
        { name: 'dark', class: 'mode-box__2', icon: 'taiyang' }
      ],
      colors: this.$CONFIG.THEME_COLORS
    }
  },
  computed: {
    ...mapState('app', ['theme', 'themeColor', 'containerStretch'])
  },
  methods: {
    ...mapActions('app', ['setTheme', 'setThemeColor', 'setContainerStretch']),
    async handleSetTheme (theme) {
      if (theme === 'dark') {
        return this.$message.warning('制作中')
      }
      return this.setTheme(theme)
    },
    async toggleContainerStretch () {
      await this.setContainerStretch(this.containerStretch === 'fluid' ? '' : 'fluid')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-theme {
  display: block;
  width: 100%;
  .panel-theme__header {
    padding: 16px 8px 16px 20px;
    border-bottom: 1px solid $--ym-color-grey-4;
    font-size: 18px;
    font-weight: bold;
  }
  .panel-theme__body {
    padding: 40px 20px;
  }
}

.subbox {
  margin-bottom: 20px;
  &__title {
    color: $--ym-text-color-primary;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.57143;
    margin-bottom: 20px;
  }
}

.flexbox-2 {
  $row: 2;
  box-sizing: border-box;
  display: flex;
  margin-left: 0;
  flex-wrap: wrap;
  .flexbox-item {
    display: inline-block;
    box-sizing: border-box;
    width: calc((100% - (20px * (#{$row} - 1))) / #{$row});
    flex-basis: calc((100% - (20px * (#{$row} - 1))) / #{$row});
    max-width: calc((100% - (20px * (#{$row} - 1))) / #{$row});
    flex-grow: 1;
    flex-shrink: 1;
    margin-right: 20px;
    margin-bottom: 20px;
    &:nth-child(#{$row}n) {
      margin-right: 0;
    }
  }
}

.flexbox-3 {
  $row: 3;
  box-sizing: border-box;
  display: flex;
  margin-left: 0;
  flex-wrap: wrap;
  .flexbox-item {
    display: inline-block;
    box-sizing: border-box;
    width: calc((100% - (20px * (#{$row} - 1))) / #{$row});
    flex-basis: calc((100% - (12px * (#{$row} - 1))) / #{$row});
    max-width: calc((100% - (12px * (#{$row} - 1))) / #{$row});
    flex-grow: 1;
    flex-shrink: 1;
    margin-right: 12px;
    margin-bottom: 12px;
    &:nth-child(#{$row}n) {
      margin-right: 0;
    }
  }
}

.mode-box {
  width: 100%;
  height: 88px;
  border-radius: 8px;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border: solid 1px $--ym-color-grey-3;
  transition: box-shadow 0.3s;
  &.mode-box__1 {
    font-size: 24px;
    color: $--ym-color-primary;
  }
  &.mode-box__2 {
    font-size: 24px;
    color: #919eab;
    background-color: #161c24;
  }
  &.is-active {
    border: none;
    box-shadow: rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 12px 24px 0px;
  }
}

.color-box {
  width: 100%;
  height: 48px;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  box-sizing: border-box;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border: solid 1px $--ym-color-grey-3;
  border-radius: 8px;
  transition: border-color 0.3s;
  &::after {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    // background-color: $--ym-color-primary;
    background-color: var(--color);
    transition: transform 0.3s;
  }

  &.is-active {
    // border-color: $--ym-color-primary;
    border-color: var(--color);
    border-width: 2px;
    box-shadow: rgb(145 158 171 / 32%) 0px 0px 2px 0px, rgb(145 158 171 / 32%) 0px 6px 12px 0px;
    &::after {
      transform: scale(1.4);
    }
  }
}

.stretch-box {
  color: #212b36;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 8px;
  box-shadow: none;
  background-image: none;
  padding: 20px;
  background-color: #f4f6f8;
  cursor: pointer;
  &__inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    height: 40px;
    border-radius: 8px;
    color: #637381;
    background-color: #ffffff;
    transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    box-shadow: rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 12px 24px 0px;
    box-sizing: border-box;
    i.el-icon-arrow-left,
    i.el-icon-arrow-right {
      display: inline-block;
      transform: rotate(180deg);
    }
  }
  &.is-fluid {
    .stretch-box__inner {
      width: 100%;
      i.el-icon-arrow-left,
      i.el-icon-arrow-right {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
