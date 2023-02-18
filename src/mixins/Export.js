// 导出方法
import axios from 'axios'
import config from '@/config/index'
import store from '@/store'
export default {
  data () {
    return {
      ExportProjectName: ''
    }
  },
  created () {
  },
  methods: {
    // 导出单个或多个
    exportSingle (item, id) {
      let options = {}
      if (id) {
        options = { auditIds: [id] }
      } else {
        options = { projectIds: [item.id] }
      }
      const userInfo = store.state.user.userInfo
      this.excelName = item.projectName
      !!item.projectName && (this.ExportProjectName = item.projectName)
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
    // 导出Excel表格
    exportExcel () {
      const options = { ...this.filter, ...this.paging }
      if (options.endCreateTime) {
        options.endCreateTime = options.endCreateTime + 24 * 60 * 60 * 1000
      }
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
        let name = this.excelName || this.ExportProjectName || '项目导出'
        name += '.xlsx'
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(blobUrl)
      }
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
    }
  }
}
