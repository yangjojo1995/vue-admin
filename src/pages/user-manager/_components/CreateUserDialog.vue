<template>
  <ym-dialog :title="titles" width="720px" :visible.sync="currentVisible">
    <ym-form
      ref="form"
      :model="form"
      class="form"
      :rules="rules"
      label-width="100px"
    >
    <ym-form-item label="用户名称" prop="userName">
        <ym-input
         :maxlength="20"
          v-model="form.userName"
          placeholder="请输入用户名称"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="账号" prop="account">
        <ym-input
          v-model="form.account"
          placeholder="4~20个字母、数字、下划线或减号，以字母开头"
        ></ym-input>
      </ym-form-item>
      <ym-form-item label="密码" prop="password">
        <ym-input
          v-model="form.password"
          type="text"
          placeholder="8-16位，至少包含字母/数字/符号2种组合"
        ><div style="cursor: pointer;" slot="append" @click="random">随机生成</div> </ym-input>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-center">
      <ym-button style="width:300px" type="primary" :loading="loading" @click="submits">提交</ym-button>
      <div style="color:#919EAB;margin-top: 5px;">提示：提交前请记住账号、密码</div>
    </div>
  </ym-dialog>
</template>

<script>
import DialogSingleForm from '@/mixins/DialogSingleForm'
export default {
  name: 'CreateUserDialog',
  mixins: [DialogSingleForm],
  props: {
  },
  data () {
    return {
      loading: false,
      form: { // 表单值
        account: '',
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名称' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'change' },
          { min: 4, max: 20, pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{4,20})$/, message: '4~20个字母、数字、下划线或减号，以字母开头', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '8-16位，至少包含字母/数字/符号2种组合', pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,16}$/, trigger: 'blur' }
        ]
      },
      titles: '创建个人用户账号'
    }
  },
  async mounted () {

  },
  methods: {
    // 提交
    async submits () {
      this.loading = true
      try {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('submit-success', this.form)
          } else {
            return false
          }
        })
      } finally {
        this.loading = false
      }
    },
    // 随机生成密码
    random () {
      const pas = this.randomRange(8, 16)
      this.$set(this.form, 'password', pas)
    },
    randomRange (min, max) {
      let returnStr = ''
      const range = (max ? Math.round(Math.random() * (max - min)) + min : min)
      const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()'

      for (let i = 0; i < range; i++) {
        const index = Math.round(Math.random() * (charStr.length - 1))
        returnStr += charStr.substring(index, index + 1)
      }
      return returnStr
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
