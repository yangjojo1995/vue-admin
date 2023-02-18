<template>
  <el-card v-loading="loading">
    <div class="back">
      <span @click="toBack"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
    </div>
    <div class="msg-block">
      <ym-form ref="baseForm" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="公告标题" prop="title">
              <ym-input v-trim v-model="forms.title" :maxlength="100" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="公告内容" prop="content">
              <ym-tinymce v-model="forms.content" ref="tinymce" :disabled="disabled" :editor="editor" :init="currentInit">
              </ym-tinymce>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="submit-list">
      <div class="submit-btn is-always-shadow">
        <ym-button type="primary" size="medium" @click="handleSubmit()">
          发布公告</ym-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      forms: {},
      tinyInit: {},
      editor: {},
      rules: {
        title: [{ type: 'string', required: true, message: '请输入公告标题' }],
        content: [{ required: true, message: '请输入公告内容' }]
      }
    }
  },
  computed: {
    currentInit () {
      return {
        ...(this.tinyInit || {}),
        plugins: 'lists advlist charmap fullscreen code codesample help hr image importcss insertdatetime preview searchreplace table visualblocks visualchars wordcount',
        toolbar: ['fontsizeselect formats | bold italic strikethrough forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | image table | preview fullscreen']
      }
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
      }
    },
    // 校验
    validate (name) {
      return new Promise((resolve, reject) => {
        if (!this.$refs[name]) return resolve(true)
        return this.$refs[name].validate(async valid => {
          if (!valid) {
            this.$message.error('信息有误，请检查!')
            return reject(valid)
          }
          return resolve(this[name])
        })
      })
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 保存
    async handleSubmit () {
      this.loading = true
      try {
        await this.validate('baseForm')
        const params = {
          ...this.forms
        }
        // 获取tinymce文字
        params.contentWord = this.$refs.tinymce.editor.getContent({ format: 'text' })
        if (params.contentWord.length > 2000) {
          return this.$message.warning(`公告内容限2000字,当前为${params.contentWord.length}字`)
        }
        if(this.id){
          await this.$service.notice.announcementUpdate(params)
          this.$message.success('编辑公告成功')
        }else{
          await this.$service.notice.announcementCreate(params)
          this.$message.success('创建公告成功')
        }
        this.$router.push('/notice?type=new')
      } finally {
        this.loading = false
      }
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
.teams-label {
  &:before {
    content: "*";
    color: #ff4842;
  }
}
.avatar-img::v-deep {
  .upload-image {
    width: 120px;
    height: 120px;
    line-height: 120px;
    border-radius: 50%;
    margin-right: 11px;
  }
}
.avatar-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .covers {
    display: flex;
    align-items: center;
    img {
      width: 100px;
      height: 100px;
      margin-right: 21px;
    }
  }
  .avatar-left {
    img {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      margin-right: 11px;
    }
  }

  .avatar-left,
  .avatar-status {
    display: flex;
    align-items: center;
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
  font-size: 13px;
  border-radius: 3px;
  word-break: break-all;
}
.upload-img::v-deep {
  .upload-image {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
.submit-list {
  position: fixed;
  bottom: 3px;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  justify-content: center;
  margin-top: 15px;
  padding: 0 32px 0 272px;
  transition: width 0.3s, max-width 0.3s;
}
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 942px;
  margin: auto;
  background: #fff;
  transition: width 0.3s, max-width 0.3s;
}
@media (min-width: 1280px) {
  .submit-btn {
    width: 1280px;
  }
}

.view-img-list {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 60px;
    height: auto;
    margin-right: 12px;
  }
}
.mb-10 {
  margin-bottom: 10px;
}
.el-row {
  margin-bottom: 0;
}
.el-card {
  margin-bottom: 30px !important;
}
.is-always-shadow {
  border: none;
  box-shadow: rgb(145 158 171 / 24%) 0px -2px 10px 0px,
    rgb(145 158 171 / 24%) 0px 16px 32px 0px;
}
</style>
