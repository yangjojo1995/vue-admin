<template>
  <ym-input
    v-bind="$attrs"
    :value="currentValue"
    type="text"
    :readonly="readonly"
    :placeholder="placeholder"
    @input="hInput"
    @chang="hChang"
    @blur="hBlur"
    @focus="hFocus">
    <slot name="append" slot="append"></slot>
  </ym-input>
</template>

<script>

export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    nullValue: {
      default: ''
    },
    min: {
      type: [Number, String]
    },
    max: {
      type: [Number, String]
    },
    step: {
      type: Number
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number
    },
    readonly: {
      type: Boolean
    },
    placeholder: {
      type: String
    }
  },
  data () {
    return {
      currentValue: this.hString(this.value),
      currentNumber: this.hNumber(this.value)
    }
  },
  watch: {
    value () {
      this.currentValue = this.hString(this.value)
      this.currentNumber = this.hNumber(this.currentValue)
    }
  },
  methods: {
    hInput (value) {
      this.currentValue = value
      this.currentNumber = this.hNumber(value)
      if (this.currentValue === this.hString(this.currentNumber)) {
        this.$emit('input', this.currentNumber)
      }
    },
    hBlur (event) {
      this.currentValue = this.hString(this.currentNumber)
      this.hInput(this.currentValue)
      this.$emit('blur', event)
    },
    hFocus (event) {
      this.$emit('focus', event)
    },
    hChang (event) {
      this.$emit('chang', event)
    },
    hString (value = this.currentNumber) {
      const number = parseFloat(value)
      if (isNaN(number)) return ''
      return String(number)
    },
    hNumber (value = this.currentValue) {
      if (!value) return this.nullValue

      let number = parseFloat(value)

      if (isNaN(number)) return this.nullValue

      if (typeof this.min === 'number' && number < this.min) {
        number = this.min
      }
      if (typeof this.max === 'number' && number > this.max) {
        number = this.max
      }

      let precision = this.precision
      if (typeof this.precision !== 'undefined') {
        precision = this.precision
      } else if (this.stepStrictly) {
        if (this.step >= 1) {
          precision = 0
        } else if (String(this.step).indexOf('.') >= 0) {
          precision = String(this.step).split('.').pop().length
        }
      }

      if (typeof precision === 'number') {
        number = Math.floor(number * Math.pow(10, precision)) / Math.pow(10, precision)
      }

      return number
    }
  }
}
</script>
