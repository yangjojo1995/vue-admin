<template>
  <ym-dialog :title="title" width="720px" :visible.sync="currentVisible">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px">
      <ym-form-item label="类型" prop="type">
        <ym-radio-group v-model="form.type" :disabled="isEdit">
          <ym-radio label="menu">菜单</ym-radio>
          <ym-radio label="button">按钮</ym-radio>
        </ym-radio-group>
      </ym-form-item>
      <ym-form-item label="标识" prop="signId">
        <ym-input v-model="form.signId" placeholder="请输入名称"></ym-input>
      </ym-form-item>
      <ym-form-item label="名称" prop="label">
        <ym-input v-model="form.label" placeholder="请输入名称"></ym-input>
      </ym-form-item>
      <ym-form-item v-if="isMenu" label="路由节点" prop="href">
        <ym-input v-model="form.href" placeholder="请输入路由节点"></ym-input>
      </ym-form-item>
      <ym-form-item v-if="isMenu" label="图标" prop="icon">
        <el-select v-model="form.icon" popper-class="icon-select-popper-1627558110754" clearable placeholder="请输入图标">
          <el-option v-for="item in iconfontGlyphs" :key="item.font_class" :label="item.font_class" :value="item.font_class">
            <ym-icon :icon="item.font_class"></ym-icon>
          </el-option>
        </el-select>
      </ym-form-item>
      <ym-form-item v-if="isElement" label="选择器" prop="className">
        <ym-input v-model="form.className" placeholder="请输入选择器"></ym-input>
      </ym-form-item>
      <ym-form-item label="上级菜单" prop="parentId">
        <ym-select-tree v-model="form.parentId" clearable :show-all-levels="false" :disabled="isEdit" :data="menuData" :props="menuProps" placeholder="请选择上级菜单"></ym-select-tree>
      </ym-form-item>
      <ym-form-item label="数据权限" prop="apiIds">
        <el-select v-model="form.apiIds" clearable multiple filterable placeholder="请选择数据权限">
          <el-option v-for="item in apiList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
import iconfont from '@/../public/icon/iconfont.json'

const defaultForm = {
  id: null,
  label: '',
  signId: '',
  icon: '',
  href: '',
  type: 'menu',
  className: '',
  enable: 1,
  parentId: '',
  apiIds: []
}

export default {
  props: {
    // 是否显示
    visible: Boolean,
    // 默认数据
    data: Object,
    // 菜单数据
    menuData: Array,
    // 菜单选项
    menuProps: Object
  },
  data () {
    return {
      loading: false,
      form: cloneDeep(defaultForm),
      rules: {
        label: [
          { type: 'string', required: true, message: '请输入名称' },
          { type: 'string', max: 20, message: '最多可输入20个字' }
        ],
        signId: [
          { type: 'string', max: 200, message: '最多可输入200个字' }
        ],
        icon: [
          { type: 'string', max: 20, message: '最多可输入20个字' }
        ],
        href: [
          { type: 'string', required: true, message: '请输入路由节点' },
          { type: 'string', max: 200, message: '最多可输入200个字' }
        ],
        type: [
          { type: 'string', required: true, message: '请选择类型' }
        ],
        className: [
          { type: 'string', max: 200, message: '最多可输入200个字' }
        ]
      },

      typeOptions: [
        { label: '菜单', value: 'menu' },
        { label: '按钮', value: 'button' }
      ],

      iconfontGlyphs: iconfont.glyphs,
      apiList: []
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
      return this.isEdit ? `编辑${this.typeName}` : `添加${this.typeName}`
    },
    typeName () {
      const option = this.typeOptions.find(item => this.form.type === item.value)
      return (option && option.label) || ''
    },
    isMenu () {
      return this.form.type === 'menu'
    },
    isElement () {
      return this.form.type === 'button'
    }
  },
  watch: {
    async currentVisible () {
      if (this.currentVisible) {
        this.handleShow()
      }
    },
    'form.type' () {
      if (this.$refs.form) {
        this.$nextTick(this.$refs.form.clearValidate)
      }
    }
  },
  async mounted () {
    await this.updateApiList()
  },
  methods: {
    async handleShow () {
      this.form = Object.assign(cloneDeep(defaultForm), this.data || {})
      if (this.$refs.form) {
        this.$nextTick(this.$refs.form.clearValidate)
      }
    },
    // 更新api节点
    async updateApiList () {
      this.apiList = await this.$service.app.getAuthApiList()
      return this.apiList
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
      const form = { ...this.form }
      form.parentId = form.parentId || '0'
      try {
        await this.validate()
        if (this.isMenu) {
          delete form.className
        } else if (this.isElement) {
          delete form.icon
          delete form.href
        }
        await this.$service.app.saveAuth(form)
        this.$message.success(`${this.isEdit ? '保存' : '添加'}成功`)
        this.handleClose()
        this.$emit('submit-success', this.form)
      } catch (error) {}
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.icon-select-popper-1627558110754 {
  width: 1px;
  .el-select-dropdown__list {
    // width: 1px;
    display: block;
    overflow: hidden;
    padding: 6px;
  }
  .el-select-dropdown__item {
    display: inline-block;
    width: 32px;
    height: 32px;
    padding: 0;
    line-height: 32px;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.icon-button {
  margin-right: 10px;
  margin-bottom: 10px;
  width: 32px;
  height: 32px;
  padding: 0;
  + .icon-button {
    margin-left: 0;
  }
}

</style>
