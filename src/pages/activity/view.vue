<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <div class="back">
        <span @click="toBack"
          ><i class="el-icon-arrow-left"></i>
          <span class="back-span">返回</span>
        </span>
        <div class="drawer-list">
          <ym-button size="mini" @click="enrollDialog = true"
            >报名记录</ym-button
          >
          <ym-button size="mini" @click="signDialog = true">签到记录</ym-button>
          <ym-button size="mini" v-if="forms.statusDict&&forms.statusDict.itemName!=='预发布'" @click="qrDialog = true">二维码</ym-button>
        </div>
      </div>
      <div class="avatar-list">
        <div class="covers">
          <el-image
            v-if="forms.image"
            style="width: 180px; height: 180px;margin-right: 21px;"
            fit="contain"
            :src="$assets(forms.image)"
            :preview-src-list="[$assets(forms.image)]"
          >
          </el-image>
          <img v-else src="@/assets/images/global/project-default.png" alt="头像" />
          <div>
            <div class="avatar-user">{{ forms.title || "-" }}</div>
            <div>地址：{{ forms.address || "-" }}</div>
            <div v-if="forms.beginTime">
              时间：{{ forms.beginTime | dateFormat("YYYY-MM-DD HH:mm:ss") }} ~
              <span v-if="new Date(forms.beginTime).toDateString() === new Date(forms.endTime).toDateString()">{{ forms.endTime | dateFormat("HH:mm:ss") }}</span>
              <span v-else-if="new Date(forms.beginTime).getYear()===new Date(forms.endTime).getYear()">{{ forms.endTime | dateFormat("MM-DD HH:mm:ss") }}</span>
              <span v-else>{{ forms.endTime | dateFormat("YYYY-MM-DD HH:mm:ss") }}</span>
            </div>
            <div v-if="forms.director">指导单位：{{ forms.director || "-" }}</div>
            <div>主办方：{{ forms.organizer || "-" }}</div>
            <div v-if="forms.undertaker">承办方：{{ forms.undertaker || "-" }}</div>
            <div v-if="forms.supporter">支持单位：{{ forms.supporter || "-" }}</div>
            <div class="publiser" v-if="forms.publisherInfo">
              发布人：
              <img
                class="publiser-img"
                v-if="forms.publisherInfo && forms.publisherInfo.avatar"
                :src="$assets(forms.publisherInfo.avatar)"
                alt="头像"
              />
              <img
                style="width:30px;height:30px"
                v-else
                src="@/assets/images/global/user-avatar.png"
                alt="头像"
              />
              {{ forms.publisherInfo ? forms.publisherInfo.name : "" }}
            </div>
            <div>
              状态：{{ forms.statusDict ? forms.statusDict.itemName : "-" }}
            </div>
            <div v-if="forms.reason">
              提前结束原因：{{ forms.reason || "-" }}
            </div>
            <div v-if="forms.downReason">
              下架原因：{{ forms.downReason || "-" }}
            </div>
          </div>
        </div>
      </div>
      <div class="msg-block">
        <div class="b-title">
          活动介绍
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="msg-content">
              <div style="white-space: pre-wrap" v-html="forms.content"></div>
              <div class="act-content" v-if="forms.pictures">
                <img
                  v-for="(item, index) in forms.pictures"
                  :key="index"
                  :src="$assets(item)"
                  alt=""
                />
              </div>
            </div>
          </ym-col>
        </ym-row>
      </div>
    </ym-card>
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="enrollDialog"
      size="50%"
      direction="rtl"
    >
      <div slot="title" style="font-weight:bold;font-size:18px">报名记录</div>
      <enroll :id="forms.id"></enroll>
    </el-drawer>
    <el-drawer
      :visible.sync="signDialog"
      size="50%"
      direction="rtl"
    >
      <div slot="title" style="font-weight:bold;font-size:18px">签到记录</div>
      <sign :id="forms.id"></sign>
    </el-drawer>
    <ym-dialog :visible.sync="qrDialog" width="500px">
      <div class="qr-title" slot="title">
        {{forms.title}}
      </div>
      <div class="qr-code">
        <el-image :src="qrcode" :preview-src-list="[qrcode]"> </el-image>
      </div>
    </ym-dialog>
  </div>
</template>

<script>
import enroll from './_components/enroll.vue' // 报名记录
import sign from './_components/sign.vue' // 签到记录
export default {
  components: { enroll, sign },
  data () {
    return {
      id: '',
      forms: {},
      qrcode: '',
      signDialog: false,
      enrollDialog: false,
      qrDialog: false,
      qrTitle: '活动二维码'
    }
  },
  async created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    }
  },
  methods: {
    // 加载数据
    async loadData (id) {
      const result = await this.$service.activity.activityInfo({
        id: id
      })
      if (result) {
        this.forms = result
        const temp = await this.$service.activity.qrCode({
          page: 'pages/activity/detail',
          scene: `id=${this.forms.id}`
        })
        this.qrcode = 'data:image/png;base64,' + temp
      }
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
.c-flexs {
  display: flex;
  align-items: center;
}
.back {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  .back-span {
    margin-left: 3px;
  }
  & > span {
    margin-right: 40px;
    &:hover {
      cursor: pointer;
      color: #00BA75;
    }
  }
}

.avatar-list {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .covers {
    display: flex;
    align-items: center;
    img {
      width: 180px;
      height: 180px;
      margin-right: 21px;
      object-fit: contain;
    }
    .publiser-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #f6f7fa;
      margin-right: 5px;
    }
  }
  .avatar-left {
    img {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      margin-right: 11px;
      object-fit: contain;
    }
  }

  .avatar-left,
  .avatar-status {
    display: flex;
  }
}
.avatar-user {
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 6px;
}
.b-title {
  font-size: 15px;
  font-weight: bold;
  margin-top: 33px;
  margin-bottom: 18px;
}
.drawer-contetnt {
  color: #919eab;
  font-size: 12px;
  p {
    line-height: 1;
  }
}
.sincerity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}
.msg-item {
  margin-left: 32px;
}
.el-drawer__wrapper::v-deep {
  .el-drawer__header {
    font-weight: bold;
    margin-bottom: 0;
  }
}
.transverse-table {
  border-collapse: collapse;
  th,
  td {
    height: 43px;
    font-size: 13px;
  }
}
.transverse-table,
th,
td {
  border: 1px solid #efefef;
}
.td-label {
  background: #f6f7fa;
  width: 146px;
  text-align: right;
  padding-right: 20px;
}
.td-cotent {
  text-align: left;
  width: 474px;
  padding-left: 20px;
  padding-right: 10px;
}
.msg-content {
  padding: 6px 16px;
  background: #f6f7fa;
  border-radius: 3px;
  word-break: break-all;
}
.act-content {
  img {
    display: block;
    width: 600px;
    height: auto;
    margin-top: 10px;
  }
}
.upload-img::v-deep {
  .upload-image {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
.el-card {
  position: relative;
}
.publiser {
  display: flex;
  align-items: center;
}
.submit-btn {
  position: fixed;
  bottom: 40px;
  left: 50%;
  z-index: 99;
}
.view-img-list {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin-right: 11px;
    border: 1px solid #f6f7fa;
    object-fit: contain;
  }
}
.view-img-list::v-deep {
  .el-image {
    margin-right: 12px;
  }
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-15 {
  margin-bottom: 15px;
}
.qr-code::v-deep {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  .el-image {
    width: 240px;
    height: 240px;
  }
}
.page::v-deep {
  .el-drawer__body {
    padding: 10px;
  }
}
.qr-title {
  font-size: 18px;
  text-align: center;
  color: #00BA75;
}
</style>
