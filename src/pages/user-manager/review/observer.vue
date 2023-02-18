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
        <div class="avatar-left">
          <img v-if="forms.avatar" :src="$assets(forms.avatar)" alt="" />
          <img v-else src="@/assets/images/global/user-avatar.png" alt="" />
          <div>
            <div class="avatar-user">{{ forms.fullName || "-" }}</div>
          </div>
        </div>
        <div class="avatar-status" v-if="forms.status === '待审核'">
          <ym-button
            size="mini"
            type="success"
            @click="openDialog()"
            >审核</ym-button
          >
        </div>
      </div>
      <div class="msg-content" v-if="forms.status === '审核不通过'">
        <p style="color:#FF4842">审核不通过</p>
        <p>原因：{{ forms.reason || "-" }}</p>
      </div>
      <div class="msg-block">
        <div class="b-title">
          申请人信息
        </div>
        <table
          cellspacing="0"
          cellpadding="0"
          align="center"
          class="transverse-table"
        >
          <tbody>
            <tr>
              <td class="td-label">申请人</td>
              <td class="td-cotent">
                <ym-link type="primary" @click="goTo()">{{
                  forms.userName || "-"
                }}</ym-link>
              </td>
              <td class="td-label">申请时间</td>
              <td class="td-cotent">
                {{ forms.createTime | dateFormat("YYYY-MM-DD HH:mm:ss") }}
              </td>
            </tr>
            <tr>
              <td class="td-label">申请状态</td>
              <td class="td-cotent">
                {{ forms.status }}
              </td>
              <td class="td-label">申请身份</td>
              <td class="td-cotent">指导单位</td>
            </tr>
          </tbody>
        </table>
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
                {{ forms.belongProvince || "-" }}{{ forms.belongCity
                }}{{ forms.belongDistrict }}
              </td>
              <td class="td-label">所属行业</td>
              <td class="td-cotent">
                {{ forms.belongIndustry | labels(industryOptions) }}
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
      <div class="msg-block"  v-if="forms.businessLicense">
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
            <div class="signs">
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
     <conDialog
      v-if="dialogShow"
      :visible.sync="dialogShow"
      title="审核"
      @submit-success="examine"
    >
    </conDialog>
    <!-- 文件弹窗 -->
    <signDialog
      :visible.sync="dialogSign"
      v-if="dialogSign"
      :id="forms.id"
      title="签名文件"
      @submit-success="dialogSign = false"
    >
    </signDialog>
  </div>
</template>

<script>
import promptDialog from '../_components/dialog/promptDialog.vue'
import signDialog from '../_components/dialog/signDialog.vue'
import conDialog from '../_components/conDialog.vue'
export default {
  components: { promptDialog, signDialog, conDialog },
  data () {
    return {
      activeNames: ['1'],
      forms: {},
      dialogShow: '',
      dialogPro: false,
      dialogSign: false,
      noPass: false,
      statusTemp: '',
      promptTitle: '',
      industryOptions: []
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
      const result = await this.$service.manager.infoAudit({
        id: id
      })
      if (result) {
        this.forms = result
      }
    },
    // 审核弹窗
    openDialog () {
      this.dialogShow = true
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
    // 审核
    async examine (form) {
      /*  const params = {
        id: this.id,
        status: this.statusTemp,
        reason: form.reason
      }
      await this.$service.manager.verifyAudit(params) */
      this.$message.success('操作成功')
      this.dialogPro = false
      this.dialogShow = false
      this.$router.back()
      // this.forms.status = '审核不通过'
      // this.loadData(this.id)
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 查看
    goTo () {
      if (this.forms.investManagerId) {
        this.$router.push({
          path: '/user-manager/detail/investment-details',
          query: { id: this.forms.investManagerId }
        })
      } else if (this.forms.userId) {
        this.$router.push({
          path: '/user-manager/detail/ordinary-details',
          query: { id: this.forms.userId }
        })
      }
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
