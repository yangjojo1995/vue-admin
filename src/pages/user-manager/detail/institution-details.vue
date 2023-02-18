<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <div class="back">
        <span @click="toBack"><i class="el-icon-arrow-left"></i>
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
          <img v-if="forms.logo" :src="$assets(forms.logo)" alt="" />
          <img v-else src="@/assets/images/global/user-avatar.png" alt="" />
          <div>
            <div class="avatar-user">{{ forms.fullName || "-" }}</div>
            <div>
              管理员：<el-link v-if="forms.realName" type="primary" @click="goTo(forms)">{{ forms.realName }}</el-link>
              <el-link v-else-if="forms.userName" type="primary" @click="goTo(forms)">{{ forms.userName }}</el-link><span v-else>未设置</span>
            </div>
          </div>
        </div>
        <div class="avatar-status">
          <span>状态：</span>
          <el-switch :value="forms.deleted" @change="
              val => {
                statusChange(val, forms.id);
              }
            " :active-value="0" :inactive-value="1">
          </el-switch>
        </div>
      </div>
      <div class="msg-block">
        <div class="b-title">
          基本信息
        </div>
        <table cellspacing="0" cellpadding="0" align="center" class="transverse-table">
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
                    : (forms.nature || "-")
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
        <table cellspacing="0" cellpadding="0" align="center" class="transverse-table">
          <tbody>
            <tr>
              <td class="td-label">关注地区</td>
              <td class="td-cotent">
                <span v-for="(item, index) in forms.focusAreas" :key="index">{{ item.province || "-" }}{{ item.city }}
                  <span v-if="index !== forms.focusAreas.length - 1">，</span>
                </span>
              </td>
              <td class="td-label">单笔投额</td>
              <td class="td-cotent">{{ forms.investment || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">投资领域</td>
              <td class="td-cotent">
                <span v-for="(item, index) in forms.investFieldsStr" :key="index">{{ item.itemName }}
                  <span v-if="index !== forms.investFieldsStr.length - 1">，</span>
                </span>
              </td>
              <td class="td-label">所属地区</td>
              <td class="td-cotent">
                {{ forms.location.address || "-" }}
              </td>
            </tr>
            <tr>
              <td class="td-label">投资轮次</td>
              <td class="td-cotent">
                <span v-for="(item, index) in forms.investRoundsStr" :key="index">{{ item.itemName || "-" }}
                  <span v-if="index !== forms.investRoundsStr.length - 1">，</span>
                </span>
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
        <table cellspacing="0" cellpadding="0" align="center" class="transverse-table">
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
        <table cellspacing="0" cellpadding="0" align="center" class="transverse-table">
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
              <el-image style="width: 100px; height: 100px" :src="$assets(forms.businessLicense)" :preview-src-list="[$assets(forms.businessLicense)]">
              </el-image>
            </div>
          </ym-col>
        </ym-row>
      </div>
      <div class="msg-block" v-if="forms.stampImage">
        <div class="b-title">
          营业执照或申请表（签章）
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="upload-img">
              <el-image style="width: 100px; height: 100px;margin-right:10px" v-for="(item, index) in forms.stampImage" :key="index" :src="$assets(item)" :preview-src-list="tempImage">
              </el-image>
            </div>
          </ym-col>
        </ym-row>
      </div>
      <div class="msg-block" v-if="forms.signature">
        <div class="b-title">
          自我承诺
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="mb-10">
              <span>签名文件</span>
              <ym-link type="primary" @click="dialogSign = true">《投盟公约》</ym-link>
            </div>
            <div class="upload-img">
              <el-image style="width: 100px; height: 100px" :src="$assets(forms.signature)" :preview-src-list="[$assets(forms.signature)]">
              </el-image>
            </div>
          </ym-col>
        </ym-row>
      </div>
    </ym-card>
    <!-- 文件弹窗 -->
    <signDialog v-if="dialogSign" :visible.sync="dialogSign" :id="forms.id" title="签名文件" @submit-success="dialogSign = false">
    </signDialog>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="accountDialog" direction="rtl" :before-close="handleClose">
      <div slot="title" style="font-weight:bold">子账号信息</div>
      <p class="sincerity">
        <span>账号：www222</span> <span>办事员</span>
        <span>加入时间：2022</span>
      </p>
    </el-drawer>
    <el-drawer :visible.sync="sincerityDialog" direction="rtl" :before-close="handleClose">
      <div slot="title" style="font-weight:bold">诚信指数</div>
      <p class="sincerity">
        <span>实名认证确权成功</span> <span>2020-05-06 14:32:22</span>
        <span>+100</span>
      </p>
    </el-drawer>
  </div>
</template>

<script>
import signDialog from '../_components/dialog/signDialog.vue'
export default {
  components: { signDialog },
  data () {
    return {
      forms: { location: {} },
      accountDialog: false,
      sincerityDialog: false,
      dialogSign: false,
      tempImage: [],
      recordActivities: [
        {
          content: '发起认证确权',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-circle-check',
          contents: [
            { label: '发起人', value: '方法' },
            { label: '发起时间', value: '方法' },
            { label: '上链编号', value: '方法' },
            { label: '存证区块', value: '方法' }
          ]
        },
        {
          content: '协助确权',
          size: 'large',
          color: '#0bbd87',
          icon: 'el-icon-circle-close',
          contents: [
            { label: '确权人', value: '方法' },
            { label: '确权时间', value: '方法' },
            { label: '上链编号', value: '方法' },
            { label: '存证区块', value: '方法' }
          ]
        }
      ],
      sincerityActivities: [
        {
          content: '发起认证确权',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-circle-check',
          contents: [
            { label: '发起人', value: '方法' },
            { label: '发起时间', value: '方法' },
            { label: '上链编号', value: '方法' },
            { label: '存证区块', value: '方法' }
          ]
        },
        {
          content: '协助确权',
          size: 'large',
          color: '#0bbd87',
          icon: 'el-icon-circle-close',
          contents: [
            { label: '确权人', value: '方法' },
            { label: '确权时间', value: '方法' },
            { label: '上链编号', value: '方法' },
            { label: '存证区块', value: '方法' }
          ]
        }
      ]
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
      const result = await this.$service.manager.institutionInfo({
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
            type: 'institution'
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_css/details.scss";
</style>
