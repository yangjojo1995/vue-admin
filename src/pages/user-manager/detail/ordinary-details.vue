<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <div class="back">
        <span @click="toBack"
          ><i class="el-icon-arrow-left"></i>
          <span class="back-span">返回</span>
        </span>
      </div>
      <div class="avatar-list">
        <div class="covers">
          <img v-if="forms.image" :src="$assets(forms.image)" alt="头像" />
          <img v-else src="@/assets/images/global/user-avatar.png" alt="头像" />
          <div>
            <div class="avatar-user">
              <span v-if="forms.realName"
                >{{ forms.realName }}<span class="names">已实名</span></span
              ><span v-else
                >{{ forms.userName }}<span class="names">未实名</span></span
              >
            </div>
          </div>
        </div>
        <div class="avatar-status">
          <span>状态：</span>
          <el-switch
            :value="forms.deleted"
            @change="
              val => {
                statusChange(val, forms.id);
              }
            "
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
        </div>
      </div>
      <div class="msg-block">
        <div class="b-title">
          基本信息
        </div>
        <table
          cellspacing="0"
          cellpadding="0"
          align="center"
          class="transverse-table"
        >
          <tbody>
            <tr>
              <td class="td-label">账号</td>
              <td class="td-cotent">
                {{ forms.account ? forms.account : "未设置" }}
              </td>
              <td class="td-label">绑定手机号</td>
              <td class="td-cotent">{{ forms.mobile|| "-"}}</td>
            </tr>
            <tr>
              <td class="td-label">邀请人</td>
              <td class="td-cotent">{{ forms.inviter|| "-" }}</td>
              <td class="td-label">绑定邮箱</td>
              <td class="td-cotent">{{ forms.email || "-"}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ym-card>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      id: '',
      forms: {}
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    }
  },
  methods: {
    // 加载数据
    async loadData (id) {
      const result = await this.$service.manager.commonInfo({
        id: id
      })
      if (result) {
        this.forms = result
      }
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 状态修改
    async statusChange (value, id) {
      // 状态先保持不变
      value === 0 ? (this.forms.deleted = 1) : (this.forms.deleted = 0)
      this.$confirm(value === 0 ? '是否启用？' : '是否禁用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        try {
          this.loading = true
          const params = {
            id: id,
            deleted: value,
            type: 'common'
          }
          await this.$service.manager.deleted(params)
          value === 0 ? (this.forms.deleted = 0) : (this.forms.deleted = 1)
          this.$message.success('修改成功')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_css/details.scss";
</style>
