<template>
  <div class="page">

    <div class="back">
      <span @click="toBack"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
      <div class="btn-group">
        <el-button @click="openAudit" type="primary" size="medium" round>审 核</el-button>
      </div>
    </div>

    <detail :detail="projectDetail"></detail>

    <el-dialog title="审核" :visible.sync="auditVisible" width="40%">
        <el-form :model="auditForm" :rules="auditRules" v-loading="loading" ref="auditForm" label-width="100px">
          <el-form-item label="审核结果" prop="status">
            <el-radio-group v-model="auditForm.status">
              <el-radio label="pass" value="pass">审核通过</el-radio>
              <el-radio label="refuse" value="refuse">审核不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核批注" prop="reason">
            <el-input type="textarea" v-trim v-model="auditForm.reason" maxlength="50" show-word-limit placeholder="请输入审核批注，不超过50字" rows="2"></el-input>
            <div>注：审核批注将显示在项目上</div>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="auditVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="checkForm">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import detail from '@/pages/project/detail'
export default {
  components: { detail },
  data () {
    return {
      id: '',
      projectDetail: {},
      loading: false,
      auditVisible: false,
      auditForm: {},
      auditRules: {
        status: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
        reason: [{ max: 50, message: '审核批注不超过50字', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    !!this.id && this.loadData(this.id)
  },
  methods: {
    // 加载数据
    async loadData (id) {
      this.projectDetail = await this.$service.project.getAuditDetail({ id: this.id })
    },

    // 打开审核窗口
    openAudit () {
      this.auditVisible = true
    },

    // 点击确定进行表单校验
    async checkForm (id) {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          this.submitAudit()
        } else {
          return false
        }
      })
    },

    // 提交审核表单
    async submitAudit () {
      this.loading = true
      try {
        const res = await this.$service.project.updateAudit({ id: this.id, ...this.auditForm })
        if (res) {
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      } finally {
        this.loading = false
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
.page {
  .back {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-bottom: 16px;

    .back-span {
      cursor: d;
    }

    .btn-group {
      button {
        padding-left: 32px;
        padding-right: 32px;
      }
    }
  }
}
</style>
