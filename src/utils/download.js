// 前端下载文件 兼容跨域
const download = function (url, filename) {
  filename = filename || url.split('/').pop()
  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // Firefox
    const elemIF = document.createElement('iframe')
    elemIF.src = url
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
    setTimeout(function () {
      document.body.removeChild(elemIF)
    }, 1000)
  }
}

export default download
