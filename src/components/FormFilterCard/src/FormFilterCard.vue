<template>
  <ym-form class="form-filter-card" :class="{ 'is-show': show }" @submit.native.prevent>
    <ym-button v-if="showSwitch" class="form-filter-card__switch" type="text" @click="show = !show">
      <i class="ym-icon ym-icon-shouqizhankai" aria-hidden="true"></i>
    </ym-button>
    <slot></slot>
  </ym-form>
</template>

<script>
import cloneDeep from '@/utils/cloneDeep'
import debounce from '@/utils/debounce'
export default {
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    open: {
      type: Boolean,
      default: false
    },
    showSwitch: {
      type: Boolean,
      default: true
    },
    watchExclude: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: this.open || false,
      isResetForm: false
    }
  },
  watch: {
    open (val) {
      this.show = val
    },
    show (val) {
      this.$emit('show', val)
    }
  },
  created () {
    this._defaultmodel = cloneDeep(this.model)
    this.watchModel = debounce(this.watchModel.bind(this), 200)
    if (!this.unwatch) this.unwatch = {}
    for (const key of Object.keys(this.model)) {
      this.unwatch[key] = this.$watch(`model.${key}`, this.watchModelField.bind(this, key))
    }
  },
  mounted () {
    for (const slot of this.$slots.default) {
      const instance = slot.componentInstance
      if (instance) {
        const span = instance.$attrs.span && Number(instance.$attrs.span)
        const el = instance.$el
        if (span) {
          el.classList.add(`form-filter-card__item--${span}`)
        }
      }
    }
  },
  beforeDestroy () {
    for (const key of Object.keys(this.unwatch)) {
      this.unwatch[key]()
      delete this.unwatch[key]
    }
  },
  methods: {
    // 重置表单
    async resetForm () {
      const model = cloneDeep(this._defaultmodel)
      this.isResetForm = true
      this.setModel(model)
    },
    // 监听 model 字段
    watchModelField (key, value, olbValue) {
      const keys = this.watchExclude.split(',')
      if (keys.includes(key)) return
      return this.watchModel()
    },
    // 监听 model
    watchModel () {
      if (this.isResetForm) {
        this.isResetForm = false
      } else {
        this.setModel(this.model)
      }
    },
    // 设置 model
    setModel (model) {
      this.$emit('update:model', model)
      this.$emit('model-change', model)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-filter-card {
  width: 100%;
  box-shadow: $--ym-box-shadow-base;
  border-radius: $--ym-card-border-radius;
  box-sizing: border-box;
  margin-bottom: 24px;
  padding: 24px 24px 0;

  min-height: (48px + (24px * 2));
  height: (48px + (24px * 2));
  overflow: hidden;
  transition: $--ym-all-transition;

  position: relative;
  padding-right: 24px + (40px + 24px);

  &.is-show {
    height: auto;
  }

  &::v-deep {
    .el-form-item {
      width: 25%;
      display: inline-block;

      @media screen and (max-width: 1599px) {
        width: 33.333333%;
      }
      @media screen and (max-width: 1199px) {
        width: 50%;
      }
      @media screen and (max-width: 1023px) {
        width: 100%;
      }
      &.form-filter-card__item--2 {
        width: (25% * 2);
        @media screen and (max-width: 1599px) {
          width: (33.333333% * 2);
        }
        @media screen and (max-width: 1199px) {
          width: (50% * 2);
        }
        @media screen and (max-width: 1023px) {
          width: 100%;
        }
      }
    }
    .el-form-item__label {
      width: 100px;
      padding-right: 16px;
      overflow: hidden;
    }
    .el-form-item__content {
      margin-left: 100px;
    }
    > .el-button {
      position: absolute;
      margin-left: 24px;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }

    .el-select,
    .el-date-editor {
      width: 100%;
    }
    .el-input-group {
      vertical-align: middle;
    }
  }

  .form-filter-card__switch {
    position: absolute;
    right: 24px;
    top: 24px;
    margin: 0;
    color: $--ym-text-color-regular;
    i {
      transform: rotate(0deg);
      transition: transform 0.6s;
      transition: none;
    }
    &:hover {
      transform: scale(1.1);
      color: $--ym-color-primary;
    }
    &:active {
      transform: scale(1);
    }
  }
  &.is-show .form-filter-card__switch {
    transform: rotate(180deg);
  }
  @media screen and (max-width: 767px) {
    padding-right: 24px;
    .form-filter-card__switch {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      margin-bottom: 24px;
      outline: none;
    }
  }

}

</style>
