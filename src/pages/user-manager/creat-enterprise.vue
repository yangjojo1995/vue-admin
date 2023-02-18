<template>
  <el-card v-loading="loading">
    <div class="back">
      <span @click="toBack"><i class="el-icon-arrow-left"></i>
        <span class="back-span">返回</span>
      </span>
    </div>
    <div class="msg-block">
      <div class="b-title">
        管理员
      </div>
      <ym-form ref="baseForm" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="选择个人用户" prop="tempName" style="margin-bottom:0">
              <ym-input v-trim v-model="forms.tempName" readonly @click.native="dialogSearch = true" :maxlength="50" placeholder="请输入"></ym-input>
              <div>
                没有账号？
                <ym-link type="primary" @click="dialogPro = true">创建个人用户账号</ym-link>
              </div>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        基本信息
      </div>
      <ym-form ref="baseForm1" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="单位名称" prop="fullName">
              <ym-input v-trim v-model="forms.fullName" :maxlength="50" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="单位logo" prop="logo">
              <div class="c-flexs upload-img circle-img">
                <ym-upload-circle v-model="forms.logo" name="file" :uploadWidth="100" :uploadHeight="100" :dataSize="6" accept=".png,.jpg,.jpeg"></ym-upload-circle>
              </div>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="单位简称" prop="shortName">
              <ym-input v-trim v-model="forms.shortName" :maxlength="10" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="统一社会信用代码" class="long-label" prop="creditCode">
              <ym-input v-trim v-model="forms.creditCode" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="注册资本金" prop="registeredCapital">
              <ym-input-number :min="0" :max="9999999999" :precision="2" v-model.number="forms.registeredCapital" placeholder="请输入">
                <div slot="append">万元</div>
              </ym-input-number>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="单位性质" prop="nature">
              <el-select v-model="forms.nature" clearable>
                <el-option v-for="item in natureOptions" :key="item.itemValue" :label="item.itemName" :value="item.itemValue">
                </el-option>
              </el-select>
              <ym-input style="margin-top:10px" v-if="forms.nature === '其他'" :maxlength="15" v-model="forms.detailNature" placeholder="请输入单位性质">
              </ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="成立时间" prop="foundTime">
              <el-date-picker v-model="forms.foundTime" value-format="timestamp" type="date" placeholder="请选择"></el-date-picker>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="从业人员数量" prop="practitionerNum">
              <ym-input-number :min="0" :max="9999999999" :precision="0" v-model.number="forms.practitionerNum" placeholder="请输入">
                <div slot="append">人</div>
              </ym-input-number>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="单位地址" prop="address">
              <ym-input v-trim v-model="forms.address" :maxlength="60" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="业务规模" prop="businessScale">
              <ym-input v-trim v-model="forms.businessScale" :maxlength="50" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        投资信息
      </div>
      <ym-form ref="baseForm2" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="关注地区" prop="areas">
              <ym-mul-cascader-area v-model="forms.areas" :level="2" :levelDisabled="1"></ym-mul-cascader-area>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="投资轮次" prop="investRounds">
              <el-select multiple v-model="forms.investRounds" :multiple-limit="10" clearable>
                <el-option v-for="item in roundsOptions" :key="item.itemValue" :label="item.itemName" :value="item.itemValue">
                </el-option>
              </el-select>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="投资领域" prop="investFields">
              <el-select multiple v-model="forms.investFields" :multiple-limit="10" clearable>
                <el-option v-for="item in fieldsOptions" :key="item.itemValue" :label="item.itemName" :value="item.itemValue">
                </el-option>
              </el-select>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="单笔投额" prop="investment">
              <div class="invest">
                <div class="invest-sel">
                  <el-select v-model="leftValue" @change="leftChange" clearable>
                    <el-option v-for="(item,index) in investmentLeftOptions" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
                <span>~</span>
                <div class="invest-sel">
                  <el-select v-model="rightValue" @change="rightChange" clearable>
                    <el-option v-for="(item,index) in investmentRightOptions" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="所属区域" prop="location.address">
              <ym-input v-trim v-model="forms.location.address" readonly @click.native="dialogVisible = true" :maxlength="50" placeholder="点击选择位置"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        法定代表人
      </div>
      <ym-form ref="baseForm3" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="姓名" prop="legalRepresentativeName">
              <ym-input v-trim v-model="forms.legalRepresentativeName" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="职务" prop="legalRepresentativePosition">
              <ym-input v-trim v-model="forms.legalRepresentativePosition" :maxlength="20" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="联系电话" prop="legalRepresentativePhone">
              <ym-input v-trim v-model="forms.legalRepresentativePhone" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        单位联系人
      </div>
      <ym-form ref="baseForm4" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="姓名" prop="contactName">
              <ym-input v-trim v-model="forms.contactName" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="通讯地址" prop="contactAddress">
              <ym-input v-trim v-model="forms.contactAddress" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="职务" prop="contactPosition">
              <ym-input v-trim v-model="forms.contactPosition" :maxlength="20" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="电子邮箱" prop="contactEmail">
              <ym-input v-trim v-model="forms.contactEmail" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="联系电话" prop="contactPhone">
              <ym-input v-trim v-model="forms.contactPhone" :maxlength="25" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        单位简介
      </div>
      <ym-form ref="baseForm4" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="单位简介" prop="introduction">
              <ym-input type="textarea" v-model="forms.introduction" :maxlength="2000" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        荣誉奖励
      </div>
      <ym-form ref="baseForm4" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="荣誉奖励" prop="honor">
              <ym-input type="textarea" v-model="forms.honor" :maxlength="2000" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        营业执照或申请表（签章）
      </div>
      <ym-form ref="baseForm5" :model="forms" class="form" :rules="rules" label-width="130px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="文件" prop="stampImage">
              <div class="c-flexs upload-img">
                <ym-upload-image bucket="account" :max-size="10 * 1048576" v-model="forms.stampImage" accept=".png,.jpg,.jpeg" :limit="6"></ym-upload-image>
              </div>
              <div style="color:#919EAB">仅支持图片，不超过10M</div>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="submit-list">
      <div class="submit-btn is-always-shadow">
        <ym-button type="primary" size="medium" @click="handleSubmit()">保存</ym-button>
      </div>
    </div>
    <!-- 询问弹窗 -->
    <CreateUserDialog :visible.sync="dialogPro" @submit-success="examine">
    </CreateUserDialog>
    <!-- 选择用户 -->
    <SearchUserDialog v-if="dialogSearch" :visible.sync="dialogSearch" @submit-success="getUser">
    </SearchUserDialog>
    <!-- 地图弹窗 -->
    <ym-dialog title="选择所属区域" size="small" top="5vh" :close-on-click-modal="false" :visible.sync="dialogVisible" width="60%">
      <div style="height:60vh">
        <iframe id="mapPage" :src="mapUrl" frameborder="0" width="100%" height="100%"></iframe>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMap">确 定</el-button>
      </span>
    </ym-dialog>
  </el-card>
</template>

<script>
import { isPhoneTwo, isTelPhone, isEmail } from '@/utils/validate.js'
import CreateUserDialog from './_components/CreateUserDialog.vue'
import SearchUserDialog from './_components/SearchUserDialog.vue'
import CONFIG from '@/config'
export default {
  components: { CreateUserDialog, SearchUserDialog },
  data () {
    // 验证手机号是否合法
    const checkPhone = (rule, value, callback) => {
      if (value) {
        if (!isPhoneTwo(value) && !isTelPhone(value)) {
          callback(new Error('请输入正确的电话或手机号码'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入电话或手机号码'))
      }
    }
    // 验证邮箱是否合法
    const checkEmail = (rule, value, callback) => {
      if (value) {
        if (!isEmail(value)) {
          callback(new Error('请输入正确的电子邮箱'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入单位联系人电子邮箱'))
      }
    }
    return {
      loading: false,
      CONFIG: CONFIG,
      leftValue: '',
      rightValue: '',
      forms: {
        location: { address: '' },
        focusAreas: [],
        logo: '',
        investRounds: [],
        investFields: [],
        tempName: '',
        stampImage: [],
        areas: []
      },
      dialogPro: false,
      dialogVisible: false,
      dialogSearch: false,
      map_data: {
        name: '',
        address: '',
        longitude: '',
        latitude: ''
      },
      mapUrl:
        'https://mapapi.qq.com/web/mapComponents/locationPicker/v/index.html?search=1&type=1&key=IEFBZ-7HHKO-XM6WL-SVNLH-UHPNE-XUF5Z&referer=xctm',
      teams: [],
      roundsOptions: [],
      fieldsOptions: [],
      natureOptions: [],
      investmentLeftOptions: [
        '0',
        '500万',
        '1000万',
        '2000万',
        '3000万',
        '5000万',
        '1亿',
        '2亿',
        '5亿',
        '10亿',
        '20亿',
        '30亿',
        '50亿',
        '100亿',
        '200亿'
      ],
      investmentRightOptions: [
        '500万',
        '1000万',
        '2000万',
        '3000万',
        '5000万',
        '1亿',
        '2亿',
        '5亿',
        '10亿',
        '20亿',
        '30亿',
        '50亿',
        '100亿',
        '200亿',
        '以上'
      ],
      publishOptions: [],
      areaProps: { multiple: true },
      rules: {
        tempName: [
          { required: true, message: '请选择个人用户', trigger: 'change' }
        ],
        fullName: [
          { type: 'string', required: true, message: '请输入单位名称' }
        ],
        logo: [
          {
            required: true,
            message: '请上传单位logo',
            trigger: ['blur', 'change']
          }
        ],
        stampImage: [
          { required: true, message: '请上传营业执照或申请表（签章）' }
        ],
        shortName: [
          { type: 'string', required: true, message: '请输入单位简称' }
        ],
        investment: [
          { required: true, message: '请选择单笔投额', trigger: 'blur' }
        ],
        creditCode: [
          { type: 'string', required: true, message: '请输入统一社会信用代码' }
        ],
        registeredCapital: [{ required: true, message: '请输入注册资本金' }],
        nature: [
          { required: true, message: '请选择单位性质', trigger: 'change' }
        ],
        areas: [
          { required: true, message: '请选择关注地区', trigger: 'change' }
        ],
        investRounds: [
          { required: true, message: '请选择投资轮次', trigger: 'change' }
        ],
        investFields: [
          { required: true, message: '请选择投资领域', trigger: 'change' }
        ],
        'location.address': [
          { required: true, message: '请选择所属区域', trigger: 'change' }
        ],
        foundTime: [
          { required: true, message: '请选择成立时间', trigger: 'change' }
        ],
        practitionerNum: [{ required: true, message: '请输入从业人员数量' }],
        address: [{ required: true, message: '请输入单位地址' }],
        legalRepresentativeName: [
          { required: true, message: '请输入法定代表人姓名' }
        ],
        legalRepresentativePosition: [
          { required: true, message: '请输入法定代表人职务' }
        ],
        legalRepresentativePhone: [
          {
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        businessScale: [{ required: true, message: '请输入业务规模' }],
        contactName: [{ required: true, message: '请输入单位联系人通讯地址' }],
        contactAddress: [{ required: true, message: '请输入单位联系人姓名' }],
        contactPosition: [{ required: true, message: '请输入单位联系人职务' }],
        contactEmail: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        contactPhone: [
          {
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        introduction: [
          { type: 'string', required: true, message: '请输入单位简介' }
        ],
        honor: [{ type: 'string', required: true, message: '请输入荣誉奖励' }]
      }
    }
  },
  async created () {
    this.natureOptions = [
      {
        itemValue: '私募股权投资基金管理公司',
        itemName: '私募股权投资基金管理公司'
      },
      { itemValue: '证券公司', itemName: '证券公司' },
      { itemValue: '产业投资机构', itemName: '产业投资机构' },
      { itemValue: '其他', itemName: '其他' }
    ]
    this.roundsOptions = await this.$service.app.dictSearch({
      dictCode: 'invest_round'
    })
    this.fieldsOptions = await this.$service.app.dictSearch({
      dictCode: 'invest_field'
    })
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    }
  },
  watch: {
    'forms.areas' (newVal, oldVal) {
      if (newVal.length > 10) {
        this.$message({
          message: '最多只支持选择10项',
          type: 'warning'
        })
        this.$nextTick(() => {
          this.forms.areas = oldVal
        })
      }
    }
  },
  mounted () {
    const that = this
    window.addEventListener(
      'message',
      function (event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data
        if (loc && loc.module === 'locationPicker') {
          // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          that.map_data.address = loc.poiaddress
          that.map_data.name = loc.poiname
          that.map_data.latitude = loc.latlng.lat
          that.map_data.longitude = loc.latlng.lng
        }
      },
      false
    )
  },
  methods: {
    // 新建用户
    async examine (form) {
      const params = {
        ...form
      }
      await this.$service.manager.saveUser(params)
      this.$message.success('创建成功')
      this.dialogPro = false
    },
    // 单笔投额
    leftChange (val) {
      const index = this.investmentLeftOptions.indexOf(val)
      if (this.rightValue && index > this.investmentRightOptions.indexOf(this.rightValue)) {
        this.rightValue = this.investmentRightOptions[index]
      }
    },
    rightChange (val) {
      const index = this.investmentRightOptions.indexOf(val)
      if (this.leftValue && this.investmentLeftOptions.indexOf(this.leftValue) > index) {
        this.leftValue = this.investmentLeftOptions[index]
      }
    },
    // 获取用户
    getUser (val) {
      this.dialogSearch = false
      this.forms.userId = val.id
      this.forms.tempName = val.realName || val.userName
    },
    async remoteMethod (val) {
      const result = await this.$service.manager.allUserSearch({
        userName: val
      })
      this.publishOptions = result.records
    },
    async submitService (form) {
      return this.$service.app.updateMyInfo(form)
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
      this.forms.investment = this.leftValue + '~' + this.rightValue
      try {
        await this.validate('baseForm')
        await this.validate('baseForm1')
        await this.validate('baseForm2')
        await this.validate('baseForm3')
        await this.validate('baseForm4')
        await this.validate('baseForm5')
        if (!this.leftValue && !this.rightValue) {
          this.$message.warning('请选择单笔投额')
        }
        this.forms.focusAreas = []
        // 省市数据装换
        this.forms.areas.map(item => {
          this.forms.focusAreas.push({
            provinceId: item[0],
            cityId: item[1]
          })
        })
        const params = {
          ...this.forms
        }
        params.signature = 'yvTW'
        params.businessLicense = 'DGkv'
        // 删除备用数据
        delete params.tempName
        delete params.areas
        await this.$service.manager.investCreate(params)
        this.$message.success('创建成功')
        this.$router.push('/user-manager/enterprise')
      } finally {
        this.loading = false
      }
    },
    // 地图选点
    submitMap () {
      this.forms.location.name = this.map_data.name
      this.forms.location.address = this.map_data.address
      this.forms.location.latitude = this.map_data.latitude
      this.forms.location.longitude = this.map_data.longitude
      this.dialogVisible = false
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
  margin-top: 15px;
  margin-bottom: 18px;
}
.drawer-contetnt {
  color: #919eab;
  font-size: 12px;
  p {
    line-height: 1;
  }
}
.invest {
  display: flex;
  justify-content: space-between;
  span {
    color: #919eab;
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
</style>
