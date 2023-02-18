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
          <img v-if="forms.logo" :src="$assets(forms.logo)" alt="" />
          <img v-else src="@/assets/images/global/user-avatar.png" alt="" />
          <div>
            <div class="avatar-user">{{ forms.fullName || "-" }}</div>
          </div>
        </div>
        <div class="avatar-status" v-if="forms.status === '待审核'">
          <ym-button
            size="mini"
            type="success"
            @click="openReviewDialog('accept')"
            >审核通过</ym-button
          >
          <ym-button
            size="mini"
            type="danger"
            @click="openReviewDialog('refuse')"
            >审核不通过</ym-button
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
              <td class="td-cotent">投资机构</td>
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
              <td class="td-label">单位性质</td>
              <td class="td-cotent">
                {{
                  forms.nature === "其他"
                    ? forms.detailNature
                    : forms.nature || "-"
                }}
              </td>
              <td class="td-label">业务规模</td>
              <td class="td-cotent">{{ forms.businessScale || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">从业人员数量</td>
              <td class="td-cotent">{{ forms.practitionerNum || "-" }}人</td>
              <td class="td-label">成立日期</td>
              <td class="td-cotent">
                {{ forms.foundTime | dateFormat("YYYY-MM-DD") }}
              </td>
            </tr>
            <tr>
              <td class="td-label">注册资本金</td>
              <td class="td-cotent">
                {{ forms.registeredCapital || "-" }}万元
              </td>
              <td class="td-label">单位地址</td>
              <td class="td-cotent">{{ forms.address || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="msg-block">
        <div class="b-title">
          投资偏好
        </div>
        <table
          cellspacing="0"
          cellpadding="0"
          align="center"
          class="transverse-table"
        >
          <tbody>
            <tr>
              <td class="td-label">关注地区</td>
              <td class="td-cotent">{{ forms.focusAreas || "-" }}</td>
              <td class="td-label">单笔投额</td>
              <td class="td-cotent">{{ forms.investment || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">投资领域</td>
              <td class="td-cotent">{{ forms.investFields || "-" }}</td>
              <td class="td-label">投资轮次</td>
              <td class="td-cotent">
                <span v-if="forms.investRounds">{{
                  forms.investRounds || "-"
                }}</span>
              </td>
            </tr>
            <tr>
              <td class="td-label">所属地区</td>
              <td class="td-cotent">
                {{ forms.location.address || "-" }}
              </td>
              <td class="td-label"></td>
              <td class="td-cotent"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="msg-block">
        <div class="b-title">
          法定代表人
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
              <td class="td-cotent">
                {{ forms.legalRepresentativeName || "-" }}
              </td>
              <td class="td-label">职务</td>
              <td class="td-cotent">
                {{ forms.legalRepresentativePosition || "-" }}
              </td>
            </tr>
            <tr>
              <td class="td-label">联系电话</td>
              <td class="td-cotent">
                {{ forms.legalRepresentativePhone || "-" }}
              </td>
              <td class="td-label"></td>
              <td class="td-cotent"></td>
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
              <td class="td-cotent">{{ forms.contactAddress || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">职务</td>
              <td class="td-cotent">{{ forms.contactPosition || "-" }}</td>
              <td class="td-label">电子邮箱</td>
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
            <div class="msg-content" style="white-space: pre-wrap">{{ forms.introduction || "-" }}</div>
          </ym-col>
        </ym-row>
      </div>
      <div class="msg-block">
        <div class="b-title">
          荣誉奖励
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="msg-content" style="white-space: pre-wrap">{{ forms.honor || "-" }}</div>
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
          营业执照或申请表（签章）
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="upload-img">
              <el-image
                style="width: 100px; height: 100px;margin-right:10px"
                v-for="(item, index) in forms.stampImage"
                :key="index"
                :src="$assets(item)"
                :preview-src-list="tempImage"
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
                :src="$assets(forms.signature)"
                :preview-src-list="[$assets(forms.signature)]"
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
      tempImage: [],
      statusOptions: []
    }
  },
  async created () {
    this.statusOptions = await this.$service.app.dictSearch({
      dictCode: 'auth_status'
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
        if (this.forms.stampImage) {
          this.forms.stampImage.map(item => {
            this.tempImage.push(this.$assets(item))
          })
        }
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
    // 审核
    async examine (form) {
      const params = {
        id: this.id,
        status: this.statusTemp,
        reason: form.reason
      }
      await this.$service.manager.verifyAudit(params)
      this.$message.success('操作成功')
      this.dialogPro = false
      this.forms.status = '审核不通过'
      this.loadData(this.id)
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
        path: '/user-manager/detail/institution-details',
        query: { id: id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_css/details.scss";
</style>
