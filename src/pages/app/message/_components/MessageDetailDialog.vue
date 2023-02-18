<template>
  <ym-dialog class="dialog" :visible.sync="currentVisible" width="680px">
    <template v-if="data">

      <ym-descriptions :title="data.title" :column="3" :label-style="{'white-space': 'nowrap'}" style="vertical-align: text-top;">
        <ym-descriptions-item label="消息主题">{{ data.topic }}</ym-descriptions-item>
        <ym-descriptions-item label="消息代码">{{ data.noticeCode }}</ym-descriptions-item>
        <ym-descriptions-item label="消息时间" >{{ data.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</ym-descriptions-item>
      </ym-descriptions>

      <ym-divider class="ym-mt-0 ym-mb-2"></ym-divider>

      <div style="white-space: pre-wrap;">{{ data.message }}</div>

      <div slot="footer" class="ym-text-center">
        <ym-button @click="currentVisible = false">关闭</ym-button>
      </div>
    </template>
  </ym-dialog>
</template>

<script>

export default {
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    currentVisible: {
      get () { return this.visible },
      set (value) { return this.$emit('update:visible', value) }
    },
    currentTitle () {
      if (!this.data) return ''
      return `【${this.data.topic}】${this.data.title}`
    }
  },
  async created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  &::v-deep {
    .el-dialog__header {
      padding: 0;
    }
  }
}
</style>
