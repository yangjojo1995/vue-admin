<template>
  <div>
    <el-dialog title="导出报表"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="cancel()">
      <div v-if="candidates.length>0" class="title">请选择导出的项</div>
      <div v-if="candidates.length>0">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkList"
                         @change="handleCheckedCandidatesChange">
        <el-checkbox v-for="(item, index) in candidates"
                     :key="index"
                     :label="item.value"> {{item.label}}</el-checkbox>
      </el-checkbox-group>
      </div>
      <h3 v-else>确定导出{{excelName}}？</h3>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary"
                   @click="exportExcel()">导 出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config/index'
import store from '@/store'
export default {
  data () {
    return {
      dialogVisible: this.exportDialogVisible,
      checkAll: true,
      isIndeterminate: false,
      checkList: []
    }
  },
  props: {
    candidates: {
      type: Array,
      default: () => {
        return []
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    exportDialogVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    apiUrl: {
      type: String,
      default: () => {
        return ''
      }
    },
    excelName: {
      type: String,
      default: () => {
        return '报表'
      }
    }
  },
  watch: {
    exportDialogVisible (newVal) {
      this.dialogVisible = newVal
    }
  },
  mounted () {
    this.checkList = this.candidates.map(item => item.value)
  },
  methods: {
    handleCheckAllChange (val) {
      const result = []
      this.candidates.forEach(item => result.push(item.value))
      this.checkList = val ? result : []
      this.isIndeterminate = false
    },
    handleCheckedCandidatesChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.candidates.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.candidates.length
    },
    // 定义导出Excel表格事件
    exportExcel () {
      const options = Object.assign(this.formData, { include: this.checkList })
      const userInfo = store.state.user.userInfo

      axios.post(config.API_BASE_URL + this.apiUrl, options, {
        responseType: 'blob',
        headers: {
          'dreamkey-token': userInfo.token
        }
        // withCredentials: true
      }).then(res => {
        if (res.status === 200) {
          this.handleExport(res)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleDownload (res) {
      const loading = this.$loading({
        lock: true,
        text: '正在导出',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
      }, 1000)
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      if (window.navigator && window.navigator.msSaveBlob) {
        // 兼容IE10，IE11
        window.navigator.msSaveBlob(blob, this.excelName)
      } else {
        const blobUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        let name = this.excelName
        name += '.xlsx'
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(blobUrl)
      }
      this.cancel()
    },
    handleExport (res) {
      const resData = res.data
      const fileReader = new FileReader()
      const _this = this
      // 读取文件完成后触发
      fileReader.onloadend = function () {
        try {
          const jsonData = JSON.parse(fileReader.result)
          if (jsonData.code) {
            // 普通对象数据，说明请求文件流失败
            _this.$message({
              type: 'error',
              message: jsonData.msg
            })
          }
          _this.cancel()
        } catch (err) {
          // 解析成对象失败，说明是正常的文件流
          _this.handleDownload(res)
        }
      }
      // 读取文件
      fileReader.readAsText(resData)
      // 无论成功与否都把选中的项清空
      this.isIndeterminate = false
      this.checkAll = true
      this.checkList = this.candidates.map(item => item.value)
    },
    cancel () {
      this.dialogVisible = false
      this.$emit('cancelExport', this.dialogVisible)
    }
  }
}
</script>
<style scoped>
.title {
  font-weight: bold;
  margin-bottom: 10px;
}
::v-deep .el-checkbox {
  padding: 5px;
  width: 28%;
}
</style>
