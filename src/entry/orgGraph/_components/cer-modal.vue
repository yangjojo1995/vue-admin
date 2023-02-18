<template>
<div>
  <div class="voucher">
    <div class="voucher__header flex">
      <div class="voucher__header__title">区块链身份凭证</div>
      <div class="voucher__header__link" @click="showCertificate">查看身份证书</div>
    </div>
    <div class="voucher__group">
      <div class="voucher__group__label">身份ID：</div>
      <div class="voucher__group__value">{{certificate && certificate.digitalIdentity}}</div>
    </div>
    <div class="voucher__group">
      <div class="voucher__group__label">公&nbsp;&nbsp;&nbsp;&nbsp;钥：</div>
      <div class="voucher__group__value">{{certificate && certificate.publicKey}}</div>
    </div>
  </div>

  <div class="dialog-box" v-if="showCertificateModal">
    <div class="inner" :style="{height: (620 + middleBgList.length*200) + 'px'}">

      <div class="wrap" :style="{height: (520 + middleBgList.length*200) + 'px'}"  @click.stop="handle">

        <!-- 临时增加动态拼接背景图效果，由于时间紧迫因此不再重构 html 结构，在原基础上使用定位插入图片作为背景 -->
        <img src="../icon/c-top.png" class="c-top">
        <template>
          <img src="../icon/c-middle.png" class="c-middle" v-for="item in middleBgList" :style="{top: item + 'px'}" :key="item">
        </template>

        <img src="../icon/c-bottom.png" class="c-bottom">

        <div class="">
            <div class="text-center">
              <img src="../icon/logo.png" alt="" class="logo">
            </div>
            <div class="text-center">
              <img src="../icon/text.png" alt="" class="sys-name">
            </div>
            <p class="code text-center">证书编号：{{detail.number}}</p>
        </div>
        <div class="info-wrap">
          <div class="info-item">
            <template v-if="certificate.roleType===1">
              <p><span class="label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span><span class="value">{{detail.name}}</span></p>
              <p><span class="label">身份证号：</span><span class="value">{{detail.code}}</span></p>
              <p><span class="label">认证身份：</span><span class="value">投资经理</span></p>
            </template>

            <template v-if="certificate.roleType===2 || certificate.roleType===3">
              <p><span class="label">企业名称：</span><span class="value">{{detail.name}}</span></p>
              <p><span class="label">统一社会信用代码：</span><span class="value">{{detail.code}}</span></p>
              <p><span class="label">认证身份：</span><span class="value">{{certificate.roleType===2 ? '投资机构' : '企业'}}</span></p>
            </template>

            <template v-if="certificate.roleType===4">
              <p><span class="label">单位名称：</span><span class="value">{{detail.name}}</span></p>
              <p><span class="label">认证身份：</span><span class="value">指导单位</span></p>
            </template>

            <p>
              <span class="label">认证时间：</span>
              <span class="value">{{ detail.authTime | timeFormat }}</span>
            </p>

          </div>
          <div class="person">
            <p> <span class="label">确权人：</span></p>
             <div class="label-box">
              <div v-html="investStr"></div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <span>乡产投盟平台</span>
        </div>
      </div>
      <div class="btn" @click.stop="showCertificate">关闭</div>
    </div>
  </div>

</div>

</template>

<script>
import dayjs from 'dayjs'
export default {
  props: {
    certificate: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showCertificateModal: false,
      detail: {},
      middleBgList: []
    }
  },
  computed: {
    // 确权人
    investStr: function () {
      if (this.certificate.roleType === 1) {
        let returnStr = ''
        const { investManagers, investInstitutions } = this.detail
        if (Array.isArray(investManagers) && investManagers.length > 0) {
          returnStr += '<div>已通过投资经理“' + investManagers.map((i) => { return i.name }).join(',') + '”确权</div>'
        }
        if (Array.isArray(investInstitutions) && investInstitutions.length > 0) {
          returnStr += '<div>已通过投资机构“' + investInstitutions.map((i) => { return i.name }).join(',') + '”确权</div>'
        }
        return returnStr
      } else {
        return '<div>已通过乡产投盟官方确权</div>'
      }
    }
  },
  filters: {
    timeFormat (value) {
      return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      const { data } = await this.$axios.get('/front/user/info/cert?id=' + this.certificate.representativeId)
      this.detail = data
      this.setMiddleBg()
    },
    showCertificate () {
      this.showCertificateModal = !this.showCertificateModal
    },
    // 根据文字内容计算中部背景图的数量
    setMiddleBg () {
      const middleBgNum = parseInt((this.investStr.length + 40) / 220)
      for (let i = 0; i < middleBgNum; i++) {
        this.middleBgList[i] = 400 + i * 200
      }
    },

    handle () {
    }
  }
}
</script>

<style lang="scss" scoped>
.voucher{
  font-size: 13px;
  background-color: #fff;
  width: 92%;
  position: fixed;
  left: 4%;
  top: 10px;
  z-index: 999;
  overflow: hidden;
  padding: 16px 0;
  background: url(../icon/bg.png) no-repeat;
  background-size: 100% 100%;
  background-position: center;

  .voucher__header{
    padding: 0 4% 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .voucher__header__title{
      font-weight: 500;
      font-size: 17px;
      color: #333;
      font-weight:500
    }
    .voucher__header__link{
      font-size: 12px;
      color: #00BA75;
      padding-right: 16px;
      &::after{
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAI1JREFUOE9jZKAQMFKon4GGBuws0WFw77lCyIXYXbC7XJfh/79VDAyMsQxuXWfwGYLbC9tLLBmYGVcy/GOIZvDoPozLEPxhsKPEhYGRcRUDw79wBvfe3dgMIRyIu0v8Gf4zrmJg/B/G4NqzEd0QGhuwu8SF4R+5XqAoEKkSjRQlJELJD0mecCwQMIxiAwADvTMRvCY5nwAAAABJRU5ErkJggg==) no-repeat;
        background-size: 100% 100%;
        background-position: center;
      }
    }
  }

  .voucher__group{
    margin-bottom: 12px;
    display: flex;
    padding: 0 4%;

    .voucher__group__label{
      margin-right: 12px;
      color: #999;
    }

    .voucher__group__value{
      color: #666;
      width: 75%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.label-box{
  font-size:13px;
  color:#666;
  padding-top:10px;
  flex-wrap: wrap;
  div{
    word-break: break-all
  }
}

p{
  margin: 0;
  padding:0;
}
.text-center{
  text-align: center;
}
.logo{
  width:184px;
  height:auto;
  margin-bottom:10px;
}
.sys-name{
  width:242px;
  height:32px;
  margin-bottom:10px;
}
.info-wrap{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;

  .info-item{
    flex-grow: 1;
     display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .person{
    margin-top: 20px;
  }
  p{
    margin: 0;
    display: flex;
    font-size:13px;
    .label{
      min-width: 72px;
      color:#999
    }
    .value{
       color:#666;
       word-break: break-all;
    }
  }
}
.bottom{
  width:100%;
  height:64px;
  background-position: center right;
  font-size: 14px;
  color:#333;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  span{
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    height:64px;
    background: url(../icon/sign.png) no-repeat;
    background-size: 64px 64px;
    background-position: center left;
  }
}
.code{
  font-size: 14px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: 500;
  color: #A26A25;
}

.dialog-box {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
  z-index: 10000000;
  position: absolute;
  top: 0;
  left: 0;
}
.inner {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4%;
  box-sizing: border-box;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  top: 20px;
}

.wrap {
  height: 520px;
  width: 100%;
  max-width: 343px;
  padding: 12% 9.5% 12%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.c-top{
  position: absolute;
  width: 100%;
  height: 400px;
  top: 0;
  left: 0;
  z-index: -1;
}
.c-middle{
  position: absolute;
  width: 100%;
  height: 200px;
  top: 400px;
  left: 0;
  z-index: -1;
}
.c-bottom{
  position: absolute;
  width: 100%;
  height: 120px;
  bottom: 0;
  left: 0;
  z-index: -1;
}

.btn {
  width: 30%;
  max-width: 120px;
  background: linear-gradient(270deg, #00CD85 0%, #01BA76 100%);
  border-radius: 50px;
  text-align: center;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  margin-top: 40px;
}

</style>
