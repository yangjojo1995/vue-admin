<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <div class="back">
        <span @click="toBack"
          ><i class="el-icon-arrow-left"></i>
          <span class="back-span">返回</span>
        </span>
        <!-- <div class="drawer-list">
          <ym-button size="mini" @click="sincerityDialog = true"
            >诚信指数</ym-button
          >
          <ym-button size="mini" @click="accountDialog = true">子账号信息</ym-button>
        </div> -->
      </div>
      <div class="avatar-list">
        <div class="avatar-left">
          <img v-if="forms.avatar" :src="$assets(forms.avatar)" alt="" />
          <img v-else src="@/assets/images/global/user-avatar.png" alt="" />
          <div>
            <div class="avatar-user">{{ forms.fullName || "-" }}</div>
            <div>
              管理员：<el-link
                v-if="forms.realName"
                type="primary"
                @click="goTo(forms)"
                >{{ forms.realName }}</el-link
              ><el-link
                v-else-if="forms.userName"
                type="primary"
                @click="goTo(forms)"
                >{{ forms.userName }}</el-link
              ><span v-else>未设置</span>
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
              <td class="td-label">统一社会信用代码</td>
              <td class="td-cotent">{{ forms.creditCode || "-" }}</td>
              <td class="td-label">单位简称</td>
              <td class="td-cotent">{{ forms.shortName || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">所属地区</td>
              <td class="td-cotent">
                {{ forms.belongProvinceStr || "-" }}{{ forms.belongCityStr }}
              </td>
              <td class="td-label">所属行业</td>
              <td class="td-cotent">
                {{ forms.belongIndustryStr || "-" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="msg-block">
        <div class="b-title">
          单位联系人
        </div>
        <table
          cellspacing="0"
          cellpadding="0"
          align="center"
          class="transverse-table"
        >
          <tbody>
            <tr>
              <td class="td-label">姓名</td>
              <td class="td-cotent">{{ forms.contactName || "-" }}</td>
              <td class="td-label">通讯地址</td>
              <td class="td-cotent">{{ forms.address || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">职务</td>
              <td class="td-cotent">{{ forms.position || "-" }}</td>
              <td class="td-label">联系邮箱</td>
              <td class="td-cotent">{{ forms.contactEmail || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">联系电话</td>
              <td class="td-cotent">{{ forms.contactPhone || "-" }}</td>
              <td class="td-label"></td>
              <td class="td-cotent"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="msg-block">
        <div class="b-title">
          单位简介
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="msg-content" style="white-space: pre-wrap">{{ forms.summary || "-" }}</div>
          </ym-col>
        </ym-row>
      </div>
      <div class="msg-block" v-if="forms.businessLicense">
        <div class="b-title">
          营业执照
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="upload-img">
              <el-image
                style="width: 100px; height: 100px"
                :src="$assets(forms.businessLicense)"
                :preview-src-list="[$assets(forms.businessLicense)]"
              >
              </el-image>
            </div>
          </ym-col>
        </ym-row>
      </div>
      <div class="msg-block">
        <div class="b-title">
          自我承诺
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="mb-10">
              <span>签名文件</span>
              <ym-link type="primary" @click="dialogSign = true"
                >《投盟公约》</ym-link
              >
            </div>
            <div class="upload-img">
              <el-image
                style="width: 100px; height: 100px"
                :src="$assets(forms.signatureUrl)"
                :preview-src-list="[$assets(forms.signatureUrl)]"
              >
              </el-image>
            </div>
          </ym-col>
        </ym-row>
      </div>
    </ym-card>
    <!-- 询问弹窗 -->
    <promptDialog
      :visible.sync="dialogPro"
      :title="promptTitle"
      @submit-success="examine"
    >
    </promptDialog>
    <!-- 文件弹窗 -->
    <signDialog
      :visible.sync="dialogSign"
      v-if="dialogSign"
      :id="forms.id"
      title="签名文件"
      @submit-success="dialogSign = false"
    >
    </signDialog>
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="accountDialog"
      direction="rtl"
      :before-close="handleClose"
    >
      <div slot="title" style="font-weight:bold">子账号信息</div>
      <p class="sincerity">
        <span>账号：www222</span> <span>办事员</span>
        <span>加入时间：2022</span>
      </p>
    </el-drawer>
    <el-drawer
      :visible.sync="sincerityDialog"
      direction="rtl"
      :before-close="handleClose"
    >
      <div slot="title" style="font-weight:bold">诚信指数</div>
      <p class="sincerity">
        <span>实名认证确权成功</span> <span>2020-05-06 14:32:22</span>
        <span>+100</span>
      </p>
    </el-drawer>
  </div>
</template>

<script>
import promptDialog from '../_components/dialog/promptDialog.vue'
import signDialog from '../_components/dialog/signDialog.vue'
export default {
  components: { promptDialog, signDialog },
  data () {
    return {
      activeNames: ['1'],
      forms: {},
      promptTitle: '',
      dialogPro: false,
      dialogSign: false,
      noPass: false,
      statusTemp: '',
      industryOptions: [],
      accountDialog: false,
      sincerityDialog: false
    }
  },
  async created () {
    this.industryOptions = await this.$service.app.dictSearch({
      dictCode: 'industry_type'
    })
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    }
  },
  methods: {
    // 加载数据
    async loadData (id) {
      const result = await this.$service.manager.observerInfo({
        id: id
      })
      if (result) {
        this.forms = result
      }
    },
    // 查看
    goTo (form) {
      if (form.investManagerId) {
        this.$router.push({
          path: '/user-manager/detail/investment-details',
          query: { id: form.investManagerId }
        })
      } else if (form.userId) {
        this.$router.push({
          path: '/user-manager/detail/ordinary-details',
          query: { id: form.userId }
        })
      }
    },
    // 审核操作
    openReviewDialog (type) {
      if (type === 'accept') {
        this.$confirm('确认审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async () => {
          const params = {
            id: this.id,
            status: type
          }
          await this.$service.manager.verifyAudit(params)
          this.$message.success('操作成功')
          this.$router.push('/user-manager/review')
        })
      } else if (type === 'refuse') {
        this.promptTitle = '审核不通过原因'
        this.statusTemp = type
        this.dialogPro = true
      }
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
            type: 'observer'
          }
          await this.$service.manager.deleted(params)
          value === 0 ? (this.forms.deleted = 0) : (this.forms.deleted = 1)
          this.$message.success('修改成功')
        } finally {
          this.loading = false
        }
      })
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 关闭弹窗
    closePrompt () {
      this.dialogPro = false
    },
    // 个人详情
    toLink (id) {
      this.$router.push({
        path: '/user-manager/detail/ordinary-details',
        query: { id: id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_css/details.scss";
</style>
