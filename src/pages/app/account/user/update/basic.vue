<template>
  <ym-form v-model="loading" ref="form" :model="form" class="form" :rules="rules" label-width="100px">
    <ym-form-item label="头像" prop="avatar" class="form-item-avatar">
      <ym-upload-image
        v-model="form.avatar"
        limit-ext=".png,.jpg,.jpeg"
        accept=".png,.jpg,.jpeg">
      </ym-upload-image>
    </ym-form-item>
    <ym-form-item label="姓名" prop="userName">
      <ym-input v-model="form.userName" placeholder="请输入姓名"></ym-input>
    </ym-form-item>
    <ym-form-item label="登录账号" prop="loginName">
      <ym-input v-model="form.loginName" :disabled="isEdit" placeholder="请输入账号"></ym-input>
    </ym-form-item>
    <ym-form-item label="手机号码" prop="phone">
      <ym-input v-model="form.phone" :maxlength="11" placeholder="请输入手机号码"></ym-input>
    </ym-form-item>
    <ym-form-item label="电子邮箱" prop="email">
      <ym-input v-model="form.email" :maxlength="200" placeholder="请输入电子邮箱"></ym-input>
    </ym-form-item>
    <ym-form-item label="所属角色" prop="roleIds">
      <ym-select v-model="form.roleIds" :disabled="isMy" multiple :data="roleList" placeholder="请选择角色">
        <ym-option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.roleName" :disabled="item.id === '101'">{{ item.roleName }}</ym-option>
      </ym-select>
    </ym-form-item>
    <ym-form-item label="所属机构" prop="groupIds">
      <ym-select-tree v-model="form.groupIds" :disabled="isMy" multiple :data="groupData" :props="groupProps" placeholder="请选择所属机构"></ym-select-tree>
    </ym-form-item>
    <ym-form-item class="ym-text-right">
      <ym-button :loading="submitLoading" @click="$router.back()">返回</ym-button>
      <ym-button type="primary" :loading="submitLoading" @click="handleSubmit()">保存</ym-button>
    </ym-form-item>
  </ym-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import storage from '@/utils/storage'
import copyText from '@/utils/copyText'
export default {
  data () {
    return {
      loading: false,
      submitLoading: false,
      form: {
        avatar: '',
        loginName: '',
        userName: '',
        phone: '',
        email: '',
        groupIds: [],
        roleIds: []
      },
      rules: {
        avatar: [
          { type: 'string', message: '请上传头像' }
        ],
        loginName: [
          { type: 'string', required: true, message: '请输入登录账户' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
        ],
        userName: [
          { type: 'string', required: true, message: '请输入姓名' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: '姓名不支持特殊字符',
            trigger: 'blur'
          }
        ],
        phone: [
          { type: 'string', pattern: /^1\d{10}$/, message: '请输入正确的手机号码' }
        ],
        email: [
          { min: 2, max: 200, message: '长度在 2 到 200 个字符' },
          { type: 'string', pattern: /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,5}$/, message: '请输入正确的邮箱' }
        ],
        roleIds: [
          { type: 'array', required: true, message: '请选择所属角色' }
        ]
      },

      groupData: [],
      groupProps: {
        value: 'id',
        label: 'groupName',
        disabled: 'disabled',
        children: 'children'
      },

      roleList: []
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    isMy () {
      return this.userInfo && this.userInfo.userId === this.$route.query.id
    },
    isEdit () {
      return !!this.$route.query.id
    }
  },
  async created () {
    this.loading = true

    const groupDataResult = await this.$service.app.getUserGroupTree()
    this.groupData = [groupDataResult]
    groupDataResult.disabled = true

    this.roleList = await this.$service.app.getUserRoleList({
      includeAdmin: this.isEdit ? 1 : 0
    })

    if (this.isEdit) {
      this.form = await this.$service.app.getUser({
        id: this.$route.query.id
      })
    } else if (this.$route.query.groupId && this.$route.query.groupId !== '101') {
      this.form.groupIds = [this.$route.query.groupId]
    }

    this.loading = false
  },
  methods: {
    ...mapActions('user', ['updateUserInfo']),
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
      this.submitLoading = true
      try {
        await this.validate()
        const result = await this.$service.app.saveUser(this.form)
        if (this.isMy) await this.updateUserInfo()
        this.recordHistoryGroupIds()

        this.$router.back()

        setTimeout(async () => {
          if (!this.form.id) {
            await this.$confirm(`账号：${result.loginName}<br />密码：${result.password}`, '创建用户成功', {
              confirmButtonText: '点击复制',
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            await copyText(`账号：${result.loginName}\n密码：${result.password}`)
            this.$message.success('复制成功')
          } else {
            this.$message.success('保存成功')
          }
        }, 500)
      } catch (error) {}
      this.submitLoading = false
    },
    // 记录上次点击离开（作用：在子列表添加账户，就返回子列表）
    recordHistoryGroupIds () {
      storage.setItem('historyGroupIds', this.form.groupIds[0])
    }
  }
}
</script>

<style lang='scss' scoped>
.form {
  padding: (40px - 24px);
  .form-item-avatar::v-deep {
    .el-form-item__label {
      width: 108px;
      height: 108px;
      line-height: 108px;
    }
  }
}

.form-avatar {
  display: inline-block;
  vertical-align: middle;
  width: 108px;
  height: 108px;
  line-height: 108px;
  border: 1px dashed $--ym-text-color-secondary;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 50%;
  cursor: pointer;
  &__inner {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    &__hover {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      z-index: 1;
      opacity: 0;
      color: rgb(255, 255, 255);
      background-color: #161c24;
      transition: $--ym-fade-transition;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      line-height: 32px;
      i {
        font-size: 24px;
      }
    }
    &__hover:hover {
      opacity: 0.72;
    }
  }
}
</style>
