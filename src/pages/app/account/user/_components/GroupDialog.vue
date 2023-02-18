<template>
  <ym-dialog :title="title" width="720px" :visible.sync="currentVisible">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px">
      <ym-form-item v-if="!isEdit || form.parentId" label="附属机构" prop="parentId">
        <ym-select-tree v-model="form.parentId" clearable :disabled="isEdit" :data="currentGroupData" :props="currentGroupProps" placeholder="请选择附属机构"></ym-select-tree>
      </ym-form-item>
      <ym-form-item label="机构名称" prop="groupName">
        <ym-input v-model="form.groupName" placeholder="请输入机构名称"></ym-input>
      </ym-form-item>
      <ym-form-item label="机构类型" prop="tag">
        <ym-select v-model="form.tag" placeholder="请选择机构类型" clearable>
          <ym-option v-for="item in tagOptions" :key="item.itemValue" :label="item.itemName" :value="item.itemValue"></ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item v-if="!isEdit || form.parentId" label="所属角色" prop="roleIds">
        <ym-select v-model="form.roleIds" :disabled="isEdit && (!form.parentId || form.parentId === '0')" multiple clearable placeholder="请选择所属角色">
          <ym-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="机构描述" prop="groupDesc">
        <ym-input v-model="form.groupDesc" type="textarea" :autosize="{ minRows: 4 }" maxlength="200" show-word-limit placeholder="请输入机构描述"></ym-input>
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
  groupName: '',
  tag: '',
  groupDesc: '',
  parentId: null,
  roleIds: []
}

export default {
  props: {
    // 是否显示
    visible: Boolean,
    // 默认数据
    data: Object,
    // 角色根ID
    groupRootId: [String, Number],
    // 角色数据
    groupData: Array,
    // 角色数据选项
    groupProps: Object
  },
  data () {
    return {
      loading: false,
      form: cloneDeep(defaultForm),
      rules: {
        groupName: [
          { type: 'string', required: true, message: '请输入机构名称' },
          { type: 'string', max: 20, message: '最多可输入20个字' }
        ],
        parentId: [
          { type: 'string', required: true, message: '请选择附属机构' }
        ],
        roleIds: [
          { type: 'array', message: '角色数据格式错误' }
        ],
        groupDesc: [
          { type: 'string', max: 200, message: '最多可输入200个字' }
        ]
      },

      defaultGroupData: [],
      defaultGroupProps: {
        value: 'id',
        label: 'groupName',
        children: 'children'
      },

      currentGroupData: [],
      currentGroupProps: this.groupProps || this.defaultGroupProps,

      roleOptions: [],
      tagOptions: []
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
      return this.isEdit ? '编辑机构' : '添加机构'
    }
  },
  watch: {
    async currentVisible () {
      if (this.currentVisible) {
        this.handleShow()
      }
    }
  },
  async mounted () {
  },
  methods: {
    async handleShow () {
      this.form = Object.assign(cloneDeep(defaultForm), this.data)
      this.currentGroupData = this.groupData || this.defaultGroupData
      if (this.$refs.form) {
        this.$nextTick(this.$refs.form.clearValidate)
      }
      const roleList = await this.$service.app.getUserRoleList({ includeAdmin: 0 })
      this.roleOptions = roleList.map(item => {
        return {
          label: item.roleName,
          value: item.id
        }
      })

      this.tagOptions = await this.$service.app.dictSearch({
        dictCode: 'org_type'
      })
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
        const form = {
          ...this.form,
          parentId: this.form.parentId || this.groupRootId
        }
        await this.validate()
        await this.$service.app.saveUserGroup(form)
        this.$message.success(`${this.isEdit ? '保存' : '添加'}成功`)
        this.handleClose()
        this.$emit('submit-success', form)
      } catch (error) {}
      this.loading = false
    }
  }
}
</script>
