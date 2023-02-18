<template>
  <ym-dialog :title="title" width="720px" :visible.sync="currentVisible">
    <ym-form
      ref="form"
      :model="form"
      class="form"
      :rules="rules"
      label-width="100px"
    >
      <ym-form-item label="广告标题" prop="title">
        <ym-input
          v-model="form.title"
          :maxlength="25"
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="banner图片" prop="image">
        <div class="c-flexs">
          <ym-upload-circle
            v-model="form.image"
            :circularImage="false"
            :tCropWidth="343"
            :tCropHeight="124"
            :uploadWidth="216"
            :uploadHeight="82.6"
            :fixed="false"
            name="file"
            :dataSize="6"
            accept=".png,.jpg,.jpeg"
          ></ym-upload-circle>
          <span style="color:#919EAB;margin-left: 10px;">
            支持jpg/png/jpeg格式，最多不超过6M
          </span>
        </div>
      </ym-form-item>
      <ym-form-item label="内链类型" prop="internalLinkType">
        <ym-radio-group v-model="form.internalLinkType" @change="typeChange">
          <ym-radio
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.itemValue"
          >
            {{ item.itemName }}</ym-radio
          >
        </ym-radio-group>
      </ym-form-item>
      <ym-form-item
        v-if="form.internalLinkType !== 'none'"
        :label="labels"
        prop="internalLink"
      >
        <ym-select
          v-model="form.internalLink"
          v-if="form.internalLinkType === 'activity'"
          filterable
          remote
          :remote-method="remoteMethod"
          placeholder="请选择"
        >
          <ym-option
            v-for="item in linkOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
          </ym-option>
        </ym-select>
        <ym-select
          v-model="form.internalLink"
          v-if="form.internalLinkType === 'project'"
          filterable
          remote
          :remote-method="remoteMethod"
          placeholder="请选择"
        >
          <ym-option
            v-for="item in linkOptions"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="submits"
        >发布</ym-button
      >
    </div>
  </ym-dialog>
</template>

<script>
import DialogSingleForm from '@/mixins/DialogSingleForm'
export default {
  name: 'AdvDialog',
  mixins: [DialogSingleForm],
  props: {
    // 默认数据
    data: Object,
    domainName: String
  },
  data () {
    return {
      loading: false,
      form: { internalLinkType: '' },
      labels: '选择活动',
      linkOptions: [],
      typeOptions: [],
      rules: {
        title: [{ type: 'string', required: true, message: '请输入广告标题' }],
        image: [
          { required: true, message: '请选择banner图片', trigger: 'change' }
        ],
        internalLinkType: [
          { required: true, message: '请选择内链类型', trigger: 'change' }
        ]
      }
    }
  },
  async created () {
    this.typeOptions = await this.$service.app.dictSearch({
      dictCode: 'internal_link_type'
    })
    if (!this.form.internalLinkType) {
      this.$set(this.form, 'internalLinkType', this.typeOptions[0].itemValue)
    }
    if (this.form.internalLinkType === 'activity') {
      const result = await this.$service.activity.activitySearch({
        page: 1,
        id: this.form.id,
        statusList: ['apply', 'progress']
      })
      this.linkOptions = result.records
    } else if (this.form.internalLinkType === 'project') {
      const result = await this.$service.project.getProject({
        page: 1,
        id: this.form.id,
        status: 'publish'
      })
      this.linkOptions = result.records
    }
  },
  async mounted () {},
  methods: {
    async remoteMethod (val) {
      if (this.form.internalLinkType === 'activity') {
        const result = await this.$service.activity.activitySearch({
          page: 1,
          title: val,
          statusList: ['apply', 'progress']
        })
        this.linkOptions = result.records
      } else if (this.form.internalLinkType === 'project') {
        const result = await this.$service.project.getProject({
          page: 1,
          projectName: val,
          status: 'publish'
        })
        this.linkOptions = result.records
      }
    },
    // 类型改变
    typeChange (val) {
      this.$set(this.form, 'internalLink', null)
      if (val === 'activity') {
        this.labels = '选择活动'
      } else if (val === 'project') {
        this.labels = '选择项目'
      }
    },
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const params = { ...this.form }
            params.domainName = this.domainName
            await this.$service.notice.bannerCreate(params)
            this.$emit('submit-success')
          } else {
            return false
          }
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.c-flexs {
  display: flex;
  align-items: center;
}
.viewer-container {
  z-index: 99999;
}
</style>
