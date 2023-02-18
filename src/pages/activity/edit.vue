<template>
  <el-card v-loading="loading">
    <div class="back">
      <span @click="toBack"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
    </div>
    <div class="msg-block">
      <div class="b-title">
        基本信息
      </div>
      <ym-form ref="baseForm" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="活动封面图" prop="image">
              <div class="c-flexs upload-img">
                <ym-upload-circle v-model="forms.image" :uploadWidth="160" :uploadHeight="90" :tCropWidth="320" :tCropHeight="180" :circularImage="false" :fixed="false" name="file" :dataSize="6" accept=".png,.jpg,.jpeg"></ym-upload-circle>
              </div>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="活动标题" prop="title">
              <ym-input v-trim v-model="forms.title" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="发布方式" prop="publishType">
              <ym-radio-group v-model="forms.publishType" @change="typeChange">
                <template v-for="(item, index) in typeOptions">
                  <ym-radio :key="index" v-if="item.itemName !== '用户发布'" :disabled="id" :label="item.itemValue">
                    {{ item.itemName }}</ym-radio>
                </template>
              </ym-radio-group>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="发布人" prop="publisher">
              <ym-select v-model="forms.publisher" filterable :disabled="publisherDisabled||id" remote :remote-method="remoteMethod" placeholder="请选择">
                <ym-option v-for="item in publishOptions" :key="item.id" :label="item.name" :value="item.id">
                </ym-option>
              </ym-select>
            </ym-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="指导单位" prop="director">
              <ym-input v-trim v-model="forms.director" :maxlength="100" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="主办方" prop="organizer">
              <ym-input v-trim v-model="forms.organizer" :maxlength="100" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="承办方" prop="undertaker">
              <ym-input v-trim v-model="forms.undertaker" :maxlength="100" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="支持单位" prop="supporter">
              <ym-input v-trim v-model="forms.supporter" :maxlength="100" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="活动开始时间" prop="beginTime">
              <ym-date-picker popper-class="no-atTheMoment" v-model="forms.beginTime" value-format="timestamp" type="datetime" :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < new Date().getTime() - 8.64e7;
                  },
                  selectableRange: selectableRange()
                }" placeholder="请选择"></ym-date-picker>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="活动结束时间" prop="endTime">
              <ym-date-picker popper-class="no-atTheMoment" :disabled="endTimeDisabled" v-model="forms.endTime" value-format="timestamp" type="datetime" :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < new Date().getTime() - 8.64e7;
                  },
                  selectableRange: endSelectableRange()
                }" placeholder="请选择"></ym-date-picker>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="活动地址" prop="address">
              <ym-input v-trim v-model="forms.address" :maxlength="100" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="活动介绍" prop="content">
              <ym-input type="textarea" :rows="8" v-model="forms.content" :maxlength="2000" placeholder="请输入"></ym-input>
            </ym-form-item>
            <ym-form-item label="" prop="pictures">
              <div class="c-flexs upload-img">
                <ym-upload-image bucket="account" v-model="forms.pictures" accept=".png,.jpg" :max-size="6 * 1048576"></ym-upload-image>
              </div>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="submit-list">
      <div class="submit-btn is-always-shadow">
        <ym-button type="primary" size="medium" @click="handleSubmit()">
          提交</ym-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      forms: { pictures: [], publishType: 1 },
      publishOptions: [],
      typeOptions: [],
      startTimeOptions: {},
      endTimeOptions: {},
      endTimeDisabled: true,
      publisherDisabled: true,
      beginInits: true,
      rules: {
        publishType: [{ required: true }],
        title: [{ type: 'string', required: true, message: '请输入活动标题' }],
        publisher: [
          { required: false, message: '请选择发布人', trigger: 'change' }
        ],
        organizer: [
          { type: 'string', required: true, message: '请输入主办方' }
        ],
        address: [
          { type: 'string', required: true, message: '请输入活动地点' }
        ],
        content: [{ required: true, message: '请输入活动介绍' }],
        beginTime: [
          { required: true, message: '请选择活动开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择活动结束时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'forms.endTime' (newVal, oldVal) {
      if (newVal < this.forms.beginTime) {
        this.forms.endTime = this.forms.beginTime + 1000
      }
    },
    'forms.beginTime' (newVal) {
      if (newVal) {
        const data = new Date()
        const dateObj = new Date(newVal)
        // 当天延时两小时
        if (
          dateObj.getDate() === data.getDate() &&
          newVal <= data.getTime() + 2 * 60 * 60 * 1000 + 60000
        ) {
          this.forms.beginTime = data.getTime() + 2 * 60 * 60 * 1000 + 60000
        }
        this.endTimeDisabled = false
        if (newVal > this.forms.endTime) {
          this.forms.endTime = newVal + 1000
        }
      } else {
        this.forms.endTime = null
        this.endTimeDisabled = true
      }
    }
  },
  async created () {
    this.typeOptions = await this.$service.app.dictSearch({
      dictCode: 'publish_type'
    })
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    } else {
      this.forms.publishType = this.typeOptions[0].itemValue
      if (this.forms.publishType === 'official') {
        this.publisherDisabled = true
        this.rules.publisher[0].required = false
      } else {
        this.publisherDisabled = false
        this.rules.publisher[0].required = true
      }
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
        if (this.forms.publisherInfo) {
          this.publishOptions = [this.forms.publisherInfo]
        }
        if (!this.forms.publishType) {
          this.forms.publishType = this.typeOptions[0].itemValue
        }
        if (this.forms.publishType === 'official') {
          this.publisherDisabled = true
          this.rules.publisher[0].required = false
        } else {
          this.publisherDisabled = false
          this.rules.publisher[0].required = true
        }
      }
    },
    // 发布类型
    typeChange (val) {
      if (val === 'official') {
        this.publisherDisabled = true
        this.forms.publisher = ''
        this.rules.publisher[0].required = false
      } else {
        this.publisherDisabled = false
        this.rules.publisher[0].required = true
      }
    },
    selectableRange () {
      const data = new Date()
      const hour = data.getHours()
      const minute = data.getMinutes()
      const second = data.getSeconds()
      if (this.forms.beginTime) {
        const dateObj = new Date(this.forms.beginTime)
        // 当天延时两小时
        if (dateObj.getDate() === data.getDate()) {
          return [`${hour + 2}:${minute + 1}:${second} - 23:59:59`]
        } else {
          return ['0:0:0 - 23:59:59']
        }
      } else {
        return ['0:0:0 - 23:59:59']
      }
    },
    endSelectableRange () {
      const data = new Date()
      const hour = data.getHours()
      const minute = data.getMinutes()
      const second = data.getSeconds()
      if (this.forms.beginTime) {
        const dateObj = new Date(this.forms.endTime)
        // 当天延时两小时
        if (dateObj.getDate() === data.getDate()) {
          return [`${hour + 2}:${minute + 1}:${second} - 23:59:59`]
        } else {
          return ['0:0:0 - 23:59:59']
        }
      } else {
        return ['0:0:0 - 23:59:59']
      }
    },
    disabledDate (time) {
      if (this.forms.beginTime) {
        // 如果开始时间不为空，则结束时间大于开始时间
        return new Date(this.forms.beginTime).getTime() > time.getTime()
      }
    },
    async remoteMethod (val) {
      const result = await this.$service.project.publisher({
        publisherName: val
      })
      this.publishOptions = result.records
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
        if (this.id) {
          await this.$service.activity.activityUpdate(params)
          this.$message.success('修改成功')
          this.$router.push('/activity')
        } else {
          await this.$service.activity.activityCreate(params)
          this.$message.success('创建成功')
          this.$router.push('/activity?type=new')
        }
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
