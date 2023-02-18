<script>
import Cascader from '../../Cascader/src/Cascader.vue'
import service from '../utils/service'

export default {
  extends: Cascader,
  props: {
    valueType: {
      type: String,
      default: 'code'
    },
    level: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      defaultProps: {
        label: 'label',
        value: 'value',
        children: 'children',
        lazy: true,
        lazyLoad: this.valueType === 'code' ? this.lazyLoad.bind(this) : this.lazyLoad2.bind(this)
      }
    }
  },
  computed: {
    currentProps () {
      return this.props || this.defaultProps
    }
  },
  methods: {
    async lazyLoad (node, resolve) {
      const { value, level } = node

      const list = await service.getListByCode(value)
      const result = list.map(item => {
        return {
          value: item.code,
          label: item.name,
          leaf: this.level === level || false
        }
      })

      return resolve(result)
    },
    async lazyLoad2 (node, resolve) {
      const { path, level } = node

      const list = await service.getListByNamePath(path)

      const result = list.map(item => {
        return {
          value: item.name,
          label: item.name,
          leaf: this.level === level || false
        }
      })

      return resolve(result)
    }
  }
}
</script>
