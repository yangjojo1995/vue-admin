<template>
  <el-date-picker
    ref="datePicker"
    v-model="currentValue"
    :readonly="readonly"
    :disabled="disabled"
    :editable="editable"
    :clearable="clearable"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :type="type"
    :format="format"
    :value-format="valueFormat"
    :align="align"
    :picker-options="currentPickerOptions">
  </el-date-picker>
</template>

<script>
export default {
  props: {
    value: {
      type: Array
    },
    startDate: {
      type: [String, Number]
    },
    endDate: {
      type: [String, Number]
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String
    },
    rangeSeparator: {
      type: String,
      default: '至'
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    },
    type: {
      type: String,
      default: 'datetimerange',
      validator (value) {
        return ['datetimerange', 'daterange', 'monthrange'].indexOf(value) !== -1
      }
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    align: {
      type: String,
      default: 'center'
    },
    pickerOptions: {
      type: Object
    },
    disabledRange: {
      type: Array
    }
  },
  data () {
    return {
      currentValue: this.value || [],
      currentPickerOptions: this.pickerOptions || {}
    }
  },
  watch: {
    value: { deep: true, handler: 'updateValue' },
    startDate: 'updateValue',
    endDate: 'updateValue',
    currentValue: 'emitValue',
    disabledRange: { deep: true, handler: 'updateCurrentPickerOptions' }
  },
  created () {
    this.updateValue()
    this.updateCurrentPickerOptions()
  },
  methods: {
    listCompare (list1, list2) {
      if (Array.isArray(list1) && Array.isArray(list2)) {
        if (list1.length !== list2.length) return false
        return !list1.some((val, i) => val !== list2[i])
      }
      return list1 === list2
    },
    updateCurrentPickerOptions () {
      if (this.pickerOptions) {
        this.currentPickerOptions = Object.assign({}, this.pickerOptions)
        return
      }
      const pickerOptions = {}
      if (Array.isArray(this.disabledRange)) {
        const [start, end] = this.disabledRange
        pickerOptions.disabledDate = (date) => {
          const dateValue = date.getTime()
          const startPass = start ? dateValue >= start : true
          const endPass = end ? dateValue <= end : true
          return startPass && endPass
        }
      }
      this.currentPickerOptions = pickerOptions
    },
    updateValue () {
      if (this.runing) return
      this.runing = true
      this.$nextTick(() => {
        let currentValue = [this.startDate, this.endDate]
        if (Array.isArray(this.value)) currentValue = [...this.value]
        if (!currentValue[0] || !currentValue[1]) currentValue = []
        if (!this.listCompare(this.currentValue, currentValue)) {
          this.currentValue = currentValue
        }
        this.runing = false
      })
    },
    emitValue () {
      const currentValue = this.currentValue || []
      let hasUpdate = false
      if (this.startDate !== currentValue[0]) {
        hasUpdate = true
        this.$emit('update:start-date', currentValue[0])
      }
      if (this.endDate !== currentValue[1]) {
        hasUpdate = true
        this.$emit('update:end-date', currentValue[1])
      }
      if (!this.listCompare(this.currentValue, this.value)) {
        hasUpdate = true
      }
      if (hasUpdate) {
        this.$emit('input', currentValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding: 36px;
  border-bottom: 1px solid $--ym-color-grey-5;
  &:last-child {
    border-bottom: 0;
  }
  &__avatar {
    flex-grow: 0;
    flex-shrink: 0;
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 14px;
  }
  &__container {
    width: 100%;
  }
}
.comment-item-info {
  &__name {
    font-size: 14px;
    font-weight: 500;
    color: #212B36;
    line-height: 22px;
    margin-bottom: 6px;
  }
  &__time {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    margin-bottom: 6px;
  }
  &__attrs {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
    margin-bottom: 6px;
    .comment-item-attr {
      margin-right: 18px;
    }
  }
  &__content {
    font-size: 14px;
    font-weight: 400;
    color: #212B36;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
  }
}

.comment-item-attr {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
  &__value {
    color: #999999;
  }
}
</style>
