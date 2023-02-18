<template>
  <ym-dialog :visible.sync="currentVisible" :title="currentTitle" :width="width">
    <ym-form ref="form" :model="form" class="form" :rules="rules" label-width="100px" @submit.native.prevent>
      <ym-form-item label="消息主题" prop="topic">
        <ym-input v-model.trim="form.topic" :maxlength="255" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="消息标题" prop="title">
        <ym-input v-model.trim="form.title" :maxlength="255" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="消息代码" prop="noticeCode">
        <ym-input-number v-model.number="form.noticeCode" type="number" placeholder="请输入"></ym-input-number>
      </ym-form-item>
      <ym-form-item label="消息内容" prop="message">
        <ym-input v-model.trim="form.message" type="textarea" rows="5" :maxlength="255" placeholder="请输入"></ym-input>
      </ym-form-item>
      <ym-form-item label="推送用户" prop="userIds">
        <el-select v-model="form.userIds" multiple filterable remote :remote-method="remoteMethod" :loading="remoteLoading" placeholder="请输入用户名称进行搜索">
          <el-option v-for="item in userList" :key="item.accountId" :label="item.realName" :value="item.accountId"></el-option>
        </el-select>
      </ym-form-item>
    </ym-form>
    <div slot="footer" class="ym-text-right">
      <ym-button @click="handleClose">关闭</ym-button>
      <ym-button type="primary" :loading="loading" @click="handleSubmit">{{ isEdit ? '保存' : '添加'}}</ym-button>
    </div>
  </ym-dialog>
</template>

<script>
import DialogSingleForm from '@/mixins/DialogSingleForm'

export default {
  mixins: [DialogSingleForm],
  props: {
    title: {
      type: String,
      default: '消息'
    }
  },
  data () {
    return {
      loading: false,
      defaultForm: {
        noticeId: undefined,
        topic: '',
        title: '',
        message: '',
        noticeCode: 0,
        bingId: '',
        userIds: []
      },
      rules: {
        topic: [
          { type: 'string', required: true, message: '请输入消息主题' },
          { max: 255, message: '长度在最多255个字符' }
        ],
        title: [
          { type: 'string', required: true, message: '请输入消息标题' },
          { max: 255, message: '长度在最多255个字符' }
        ],
        noticeCode: [
          { type: 'number', required: true, message: '请输入消息代码' }
        ],
        message: [
          { type: 'string', required: true, message: '请输入消息内容' },
          { max: 255, message: '长度在最多255个字符' }
        ],
        userIds: [
          { type: 'array', required: true, message: '请选择发推送用户' }
        ]
      },

      remoteLoading: false,
      userList: []
    }
  },
  computed: {
    currentTitle () {
      return (this.isEdit ? '编辑' : '推送') + this.title
    }
  },
  async created () {
  },
  methods: {
    // 请求服务
    async submitService (form) {
      if (this.isEdit) {
        // return this.$service.app.updateUser(form)
      } else {
        return this.$service.app.pushMessage({
          notice: {
            ...this.form,
            userIds: undefined
          },
          bindId: this.form.userIds
        })
      }
    },
    async remoteMethod (realName) {
      const result = await this.$service.app.getUserPage({
        page: 0,
        size: 10,
        entity: { realName }
      })
      this.userList = result.content || []
    }
  }
}
</script>
