<template>
  <ym-dialog :title="title" width="720px" :visible.sync="currentVisible">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px">
      <ym-form-item label="角色名称" prop="roleName">
        <ym-input v-model="form.roleName" placeholder="请输入角色名称"></ym-input>
      </ym-form-item>
      <ym-form-item label="角色描述" prop="roleDesc">
        <ym-input v-model="form.roleDesc" type="textarea" :autosize="{ minRows: 4 }" maxlength="100" show-word-limit placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="菜单配置" prop="resourceIds">
        <div class="tree-box">
          <el-tree
            ref="tree"
            :data="menuData"
            node-key="id"
            :expand-on-click-node="false"
            show-checkbox
            check-on-click-node
            :props="menuProps">
          </el-tree>
        </div>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="handleSubmit">{{ isEdit ? '保存' : '添加'}}</ym-button>
    </div>
  </ym-dialog>
</template>

<script>
import cloneDeep from '@/utils/cloneDeep'

const defaultForm = {
  id: null,
  roleName: '',
  roleDesc: '',
  indeterminate: [],
  resourceIds: []
}

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
      form: cloneDeep(defaultForm),
      rules: {
        roleName: [
          { type: 'string', required: true, message: '请输入角色名称' },
          { type: 'string', max: 20, message: '最多可输入20个字' }
        ],
        roleDesc: [
          { type: 'string', required: true, message: '请输入角色描述' },
          { type: 'string', max: 100, message: '最多可输入100个字' }
        ]
      },

      menuData: [],
      menuProps: {
        children: 'children',
        value: 'id',
        label: 'label'
      }
    }
  },
  computed: {
    currentVisible: {
      get () { return this.visible },
      set (value) { return this.$emit('update:visible', value) }
    },
    isEdit () {
      return !!(this.data && this.data.id)
    },
    title () {
      return this.isEdit ? '编辑角色' : '添加角色'
    }
  },
  watch: {
    async currentVisible () {
      if (this.currentVisible) {
        this.$nextTick(() => {
          this.handleShow()
        })
      }
    }
  },
  async mounted () {
    const result = await this.$service.app.getAuthTree()
    this.menuData = result
  },
  methods: {
    async handleShow () {
      // this.form.indeterminate
      if (this.$refs.tree && this.form.resourceIds) this.$refs.tree.setCheckedKeys(this.form.resourceIds)
      this.form = Object.assign(cloneDeep(defaultForm), this.data)
      this.form.resourceIds = this.form.resourceIds || []
      this.form.indeterminate = this.form.indeterminate || []
      for (const key of this.form.indeterminate) {
        const index = this.form.resourceIds.indexOf(key)
        if (index >= 0) this.form.resourceIds.splice(index, 1)
      }
      if (this.$refs.tree && this.form.resourceIds) this.$refs.tree.setCheckedKeys(this.form.resourceIds)
      if (this.$refs.form) {
        this.$nextTick(this.$refs.form.clearValidate)
      }
    },
    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        return this.$refs.form.validate(async (valid) => {
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
        if (this.$refs.tree && form.resourceIds) {
          const checkedKeys = this.$refs.tree.getCheckedKeys()
          const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
          form.resourceIds = [...halfCheckedKeys, ...checkedKeys]
          form.indeterminate = [...halfCheckedKeys]
        }

        await this.$service.app.saveUserRole(form)
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
