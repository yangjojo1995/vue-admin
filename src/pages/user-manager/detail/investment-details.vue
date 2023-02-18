<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <div class="back">
        <span @click="toBack"
          ><i class="el-icon-arrow-left"></i>
          <span class="back-span">返回</span>
        </span>
        <!-- <div class="drawer-list">
          <ym-button size="mini" @click="recordDialog = true"
            >确权记录</ym-button
          >
          <ym-button size="mini" @click="sincerityDialog = true"
            >诚信指数</ym-button
          >
        </div> -->
      </div>
      <div class="avatar-list">
        <div class="covers">
          <img v-if="forms.avatar" :src="$assets(forms.avatar)" alt="头像" />
          <img v-else src="@/assets/images/global/user-avatar.png" alt="头像" />
          <div>
            <div class="avatar-user">
              {{ forms.name || "-" }}
              <span class="names" v-if="forms.clientUserInfo.realName">
                已实名</span
              ><span class="names" v-else> 未实名</span>
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
          账号信息
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
                {{ forms.clientUserInfo.account || "-" }}
              </td>
              <td class="td-label">绑定手机号</td>
              <td class="td-cotent">
                {{ forms.clientUserInfo.mobile || "-" }}
              </td>
            </tr>
            <tr>
              <td class="td-label">邀请人</td>
              <td class="td-cotent">
                {{ forms.clientUserInfo.inviter || "-" }}
              </td>
              <td class="td-label">绑定邮箱</td>
              <td class="td-cotent">{{ forms.clientUserInfo.email || "-" }}</td>
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
              <td class="td-label">所属机构</td>
              <td class="td-cotent">{{ forms.investInstitution || "-" }}</td>
              <td class="td-label">职位</td>
              <td class="td-cotent">{{ forms.position || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">联系电话</td>
              <td class="td-cotent">{{ forms.phone || "-" }}</td>
              <td class="td-label">联系邮箱</td>
              <td class="td-cotent">{{ forms.email || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">所属地区</td>
              <td class="td-cotent">
                {{ forms.belongProvinceStr || "-" }}{{ forms.belongCityStr }}
              </td>
              <td class="td-label"></td>
              <td class="td-cotent"></td>
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
              <td class="td-cotent">
                <span v-for="(item, index) in forms.focusAreasStr" :key="index"
                  >{{ item.cityIdStr }}
                  <span v-if="index !== forms.focusAreasStr.length - 1"
                    >，</span
                  >
                </span>
              </td>
              <td class="td-label">单笔投额</td>
              <td class="td-cotent" v-if="forms.investment">
                {{ forms.investment || "-" }}
              </td>
            </tr>
            <tr>
              <td class="td-label">投资领域</td>
              <td class="td-cotent">
                <span
                  v-for="(item, index) in forms.investFieldsStr"
                  :key="index"
                  >{{ item.itemName || "-" }}
                  <span v-if="index !== forms.investFieldsStr.length - 1"
                    >，</span
                  >
                </span>
              </td>
              <td class="td-label">投资轮次</td>
              <td class="td-cotent">
                <span
                  v-for="(item, index) in forms.investRoundsStr"
                  :key="index"
                  >{{ item.itemName || "-" }}
                  <span v-if="index !== forms.investRoundsStr.length - 1"
                    >，</span
                  >
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="msg-block">
        <div class="b-title">
          个人简介
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="msg-content" style="white-space: pre-wrap">{{ forms.summary || "-" }}</div>
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
    <el-drawer title="确权记录" :visible.sync="recordDialog" direction="rtl">
      <div slot="title" style="font-weight:bold">确权记录</div>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in recordActivities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :hide-timestamp="false"
        >
          <p>{{ activity.content }}</p>
          <div class="drawer-contetnt">
            <p v-for="(item, index) in activity.contents" :key="index">
              {{ item.label }}：{{ item.value }}
            </p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
    <el-drawer :visible.sync="sincerityDialog" direction="rtl">
      <div slot="title" style="font-weight:bold">诚信指数</div>
      <p class="sincerity">
        <span>实名认证确权成功</span> <span>2020-05-06 15:30:00</span>
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
      forms: { clientUserInfo: {} },
      recordDialog: false,
      sincerityDialog: false,
      dialogSign: false,
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
      const result = await this.$service.manager.investInfo({
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
            type: 'manager'
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
