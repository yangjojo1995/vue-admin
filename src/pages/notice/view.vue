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
          <div>
            <div class="avatar-user">{{ forms.title || "-" }}</div>
            <div class="times">
              发布时间：{{
                forms.createTime | dateFormat("YYYY-MM-DD HH:mm:ss")
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="msg-block">
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="msg-content">
              <div v-html="forms.content"></div>
            </div>
          </ym-col>
        </ym-row>
      </div>
    </ym-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      forms: {}
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
      const result = await this.$service.notice.announcementInfo({
        id: id
      })
      if (result) {
        this.forms = result
        this.forms.content = this.forms.content.replace(/<img/gi, '<img style="max-width:100%;height:auto"')
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
      color: #00ba75;
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
    .times {
      color: #999;
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
</style>
