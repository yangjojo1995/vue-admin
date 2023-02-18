<template>
  <ym-dialog :title="title" width="720px" :visible.sync="currentVisible">
    <ym-form
      ref="form"
      :model="form"
      class="form"
      :rules="rules"
      label-width="100px"
    >
      <ym-form-item label="字典名称" prop="dictName">
        <ym-input v-model="form.dictName" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="字典编码" prop="dictCode">
        <ym-input v-model="form.dictCode" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="状态" prop="status">
        <ym-select
          v-model="form.status"
          filterable
          placeholder="请选择"
        >
          <ym-option
            v-for="item in statusOptions"
           :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
          >
          </ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="备注" prop="description">
        <ym-input
          v-model="form.description"
          type="textarea"
          :autosize="{ minRows: 4 }"
          maxlength="100"
          show-word-limit
          placeholder="请输入"
        ></ym-input>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="handleSubmit">{{
        isEdit ? "保存" : "添加"
      }}</ym-button>
    </div>
  </ym-dialog>
</template>

<script>
export default {
  props: {
    // 是否显示
    visible: Boolean,
    // 默认数据
    data: Object
  },
  data () {
    return {
      loading: false,
      form: {},
      rules: {
        dictName: [
          { type: 'string', required: true, message: '请输入字典名称' }
        ],
        dictCode: [
          { type: 'string', required: true, message: '请输入字典编码' }
        ]
      },
      statusOptions: [
        { itemName: '启用', itemValue: 1 },
        { itemName: '停用', itemValue: 0 }
      ]
    }
  },
  computed: {
    currentVisible: {
      get () {
        return this.visible
      },
      set (value) {
        return this.$emit('update:visible', value)
      }
    },
    isEdit () {
      return !!(this.data && this.data.id)
    },
    title () {
      return this.isEdit ? '编辑角色' : '添加角色'
    }
  },
  async mounted () {
    const result = await this.$service.app.getAuthTree()
    this.menuData = result
  },
  methods: {
    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        return this.$refs.form.validate(async valid => {
          if (!valid) return reject(valid)
          return resolve(this.form)
        })
      })
    },
    // 关闭
    handleClose () {
      this.currentVisible = false
    },
    // 提交
    async handleSubmit () {
      this.loading = true
      try {
        await this.validate()
        const form = { ...this.form }
        await this.$service.app.insertList(form)
        this.$message.success(`${this.isEdit ? '保存' : '添加'}成功`)
        this.handleClose()
        this.$emit('submit-success', form)
      } catch (error) {}
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  // padding: 24px;
  border: 1px solid rgba(145, 158, 171, 0.4);
  border-radius: 6px;
  overflow: hidden;
}
</style>
