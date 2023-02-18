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
      <ym-form ref="baseForm" :model="projectBase" class="form" :rules="rules" label-width="140px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="上传封面" prop="image">
              <div class="c-flexs upload-img">
                <ym-upload-circle v-model="projectBase.image" :uploadWidth="100" :uploadHeight="100" name="file" :dataSize="6" accept=".png,.jpg,.jpeg"></ym-upload-circle>
                <span style="color:#919EAB;margin-left: 10px;">
                  仅支持 png、jpg、jpeg，大小不超过6M
                </span>
              </div>
            </ym-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <ym-form-item label="项目发布人" prop="publisher">
              <ym-select
                v-model="projectBase.publisher"
                filterable
                remote
                :remote-method="remoteMethod"
                placeholder="请选择"
              >
                <ym-option
                  v-for="item in publishOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </ym-option>
              </ym-select>
            </ym-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="项目名称" prop="projectName">
              <ym-input v-trim v-model="projectBase.projectName" :maxlength="30" placeholder="请输入项目名称"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="所属行业" prop="industry">
              <el-select v-model="projectBase.industry" clearable>
                <el-option v-for="item in industryOptions" :key="item.itemValue" :label="item.itemName" :value="item.itemValue">
                </el-option>
              </el-select>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="项目描述" prop="description">
              <ym-input v-trim v-model="projectBase.description" :maxlength="200" placeholder="一句话介绍项目定位，不超过200字"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="股权融资需求" prop="financingPlan">
              <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-trim v-model="projectBase.financingPlan" placeholder="请填写计划融资金额">
                <div slot="append">万元</div>
              </ym-input-number>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="股权投资退出方式" prop="equityExitWay">
              <ym-input v-trim v-model="projectBase.equityExitWay" :maxlength="100" placeholder="请输入股权投资退出方式，不超过100字"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="融资用途" prop="financingPurpose">
              <ym-input v-trim v-model="projectBase.financingPurpose" :maxlength="100" placeholder="请输入融资用途，不超过100字"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="市场份额" prop="marketShare">
              <ym-input v-trim v-model="projectBase.marketShare" :maxlength="100" placeholder="企业产品市场占有率，不超过100字"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="估值" prop="assessedValue">
              <ym-input v-trim v-model="projectBase.assessedValue" :maxlength="10" placeholder="请输入估值，不超过10字">
              </ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="行业地位" prop="industryStatus">
              <ym-input v-trim v-model="projectBase.industryStatus" :maxlength="100" placeholder="在细分行业获得的荣誉，不超过100字"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="轮次" prop="investRound">
              <el-select v-model="projectBase.investRound" clearable>
                <el-option v-for="item in roundsOptions" :key="item.itemValue" :label="item.itemName" :value="item.itemValue">
                </el-option>
              </el-select>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="行业细分" prop="industrySegmentation">
              <ym-cascader v-if="showIndustry" :props="industryProps" v-model="projectBase.industrySegmentation">
              </ym-cascader>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="历往获投金额" prop="investment">
              <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="projectBase.investment" placeholder="请输入获投金额">
                <div slot="append">万元</div>
              </ym-input-number>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="项目联系人" prop="director">
              <ym-input v-trim v-model="projectBase.director" :maxlength="25" placeholder="请输入项目负责人名称"></ym-input>
            </ym-form-item>
          </el-col>

          <el-col :span="12">
            <ym-form-item label="联系人电话" prop="mobile">
              <ym-input v-trim v-model="projectBase.mobile" :maxlength="50" placeholder="请输入“区号-xxx...”或手机号"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="项目亮点" prop="advantage">
              <ym-input type="textarea" v-trim v-model="projectBase.advantage" :maxlength="2000" placeholder="填写须知：从产品、技术、服务、市场、团队等方面，简要列示投资亮点"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="市场分析" prop="marketAnalysis">
              <ym-input type="textarea" v-trim v-model="projectBase.marketAnalysis" :maxlength="2000" placeholder="填写须知：截止到目前为止，营收、客户量、分布区域、合作资源、投资情况等"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="商业模式" prop="businessModel">
              <ym-input type="textarea" v-trim v-model="projectBase.businessModel" :maxlength="2000" placeholder="请简要介绍公司的商业模式"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="运营情况" prop="operation">
              <ym-input type="textarea" v-model="projectBase.operation" :maxlength="2000" placeholder="请输入公司运营情况"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        公司信息
      </div>
      <ym-form ref="serveForm" :model="projectCompany" class="form" :rules="rules" label-width="140px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="公司全称" prop="companyName">
              <ym-input v-trim v-model="projectCompany.companyName" :maxlength="50" placeholder="请输入企业名称"></ym-input>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item class="long-label" label="统一社会信用代码" prop="creditCode">
              <ym-input v-trim v-model="projectCompany.creditCode" :maxlength="20" placeholder="请输入统一社会信用代码"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="注册资本" prop="registeredCapital">
              <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="projectCompany.registeredCapital" placeholder="请输入注册资本">
                <div slot="append">万元</div>
              </ym-input-number>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="法定代表人" prop="legalRepresentativeName">
              <ym-input v-trim v-model="projectCompany.legalRepresentativeName" :maxlength="20" placeholder="请输入法定代表人姓名"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="地区" prop="areas">
              <ym-mul-cascader-area v-if="showCascaderArea" v-model="projectCompany.areas" :level="3" :levelDisabled="1" :multiple="false"></ym-mul-cascader-area>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="员工人数" prop="practitionerNum">
              <ym-input-number v-trim v-model="projectCompany.practitionerNum" :min="0" :max="9999999999" :precision="0" :maxlength="10" placeholder="请输入员工人数">
                <div slot="append">人</div>
              </ym-input-number>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="龙头企业级别" prop="enterpriseLevel">
              <el-select v-model="projectCompany.enterpriseLevel" clearable>
                <el-option v-for="item in levelOptions" :key="item.itemValue" :label="item.itemName" :value="item.itemValue">
                </el-option>
              </el-select>
            </ym-form-item>
          </el-col>
          <el-col :span="12">
            <ym-form-item label="主营业务" prop="mainBusiness">
              <ym-input type="textarea" v-trim v-model="projectCompany.mainBusiness" :maxlength="2000" placeholder="请输入主营业务，不超过2000字"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        财务状况
      </div>
      <el-form ref="teamForm" :model="financesForms" label="近三年财务数据" class="no-margin-form" label-width="0" :rules="rules">
        <el-form-item prop="projectFinances">
          <ym-table-list-card row-key="id" :data="financesForms.projectFinances" :enableFilterColumn="false" inner>
            <template slot="header-left">
              <span class="gray-text teams-label">近3年财务数据</span>
            </template>
            <template slot="header-right">
              <span class="gray-text">单位：万元</span>
            </template>
            <ym-table-column prop="year" label="年度/项目" min-width="80px">
              <div slot-scope="{ row }">
                <el-form-item>
                  <span class="year-text">{{ row.year }}</span>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="totalAssets" label="资产总额" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectFinances.' + $index + '.totalAssets'">
                  <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="row.totalAssets">
                  </ym-input-number>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="income" label="营业收入" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectFinances.' + $index + '.income'">
                  <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="row.income">
                  </ym-input-number>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="netAssets" label="净资产" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectFinances.' + $index + '.netAssets'">
                  <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="row.netAssets">
                  </ym-input-number>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="netProfit" label="净利润" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectFinances.' + $index + '.netProfit'">
                  <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="row.netProfit">
                  </ym-input-number>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="debt" label="负债" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectFinances.' + $index + '.debt'">
                  <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="row.debt">
                  </ym-input-number>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="debtRatio" label="资产负债率（%）" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectFinances.' + $index + '.debtRatio'">
                  <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="row.debtRatio">
                  </ym-input-number>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="netCashFlow" label="现金流量净额" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectFinances.' + $index + '.netCashFlow'">
                  <ym-input-number :min="0" :max="9999999999.999999" :precision="6" v-model.number="row.netCashFlow">
                  </ym-input-number>
                </el-form-item>
              </div>
            </ym-table-column>
          </ym-table-list-card>
          <div class="gray-text">注，若没有该年份数据，默认为0</div>
        </el-form-item>
      </el-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        产品&服务
      </div>
      <ym-form ref="serveForm" :model="projectProduct" class="form" :rules="serveRules" label-width="140px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="产品&服务名称" prop="productName">
              <ym-input v-trim v-model="projectProduct.productName" :maxlength="20" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="产品&服务描述" prop="descriptions">
              <ym-input type="textarea" v-trim v-model="projectProduct.description" :maxlength="2000" placeholder="请输入"></ym-input>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <ym-form-item label="产品&服务图片" prop="image">
              <div class="c-flexs upload-img">
                <ym-upload-image bucket="account" v-model="projectProduct.image" accept=".png,.jpg" :limit="6" :max-size="6 * 1048576"></ym-upload-image>
              </div>
            </ym-form-item>
          </el-col>
        </el-row>
      </ym-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        团队成员
      </div>
      <el-form ref="teamForm" class="no-margin-form" :model="memberForms" label-width="0" :rules="rules">
        <el-form-item prop="projectMembers">
          <ym-table-list-card row-key="id" :data="memberForms.projectMembers" inner>
            <template slot="header-right">
              <ym-button type="primary" size="medium" @click="addTeam()">添加</ym-button>
            </template>
            <ym-table-column prop="atra" label="头像" min-width="100px">
              <div slot-scope="{ row }">
                <div class="avatar-img">
                  <ym-upload-circle v-model="row.image" v-if="row" :uploadWidth="80" :uploadHeight="80" :tCropWidth="300" :tCropHeight="300" name="file" :dataSize="6" accept=".png,.jpg,.jpeg"></ym-upload-circle>
                </div>
              </div>
            </ym-table-column>
            <ym-table-column prop="name" label="姓名" disabled-toggle min-width="120px">
              <!-- <template slot="header">
                <span class="teams-label">姓名</span>
              </template> -->
              <div slot-scope="{ row, $index }">
                <!-- :rules="rules.teamName" -->
                <el-form-item :prop="'projectMembers.' + $index + '.name'">
                  <ym-input v-trim v-model="row.name" :maxlength="25" placeholder="请输入"></ym-input>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="position" label="职业" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectMembers.' + $index + '.position'">
                  <ym-input v-trim v-model="row.position" :maxlength="20" placeholder="请输入"></ym-input>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column prop="profile" label="简介" min-width="120px">
              <div slot-scope="{ row, $index }">
                <el-form-item :prop="'projectMembers.' + $index + '.profile'">
                  <ym-input type="textarea" v-trim v-model="row.profile" :maxlength="2000" placeholder="请输入"></ym-input>
                </el-form-item>
              </div>
            </ym-table-column>
            <ym-table-column label="操作" min-width="100px" fixed="right">
              <template slot-scope="{ $index }">
                <ym-link type="info" @click="delTeam($index)">删除</ym-link>
              </template>
            </ym-table-column>
          </ym-table-list-card>
        </el-form-item>
      </el-form>
    </div>
    <div class="msg-block">
      <div class="b-title">
        商业计划书(BP)
      </div>
      <ym-form ref="serveForm" :model="projectBusinessPlan" class="form" :rules="rules" label-width="140px" @submit.native.prevent>
        <el-row :gutter="24">
          <el-col :span="12">
            <ym-form-item label="BP上传" prop="bpUrl">
              <div class="flexs upload-img">
                <ym-upload-file @preview="previewBp" bucket="account" :upload="uploadMethod" :preventDel="true" @success="bpsuccess" v-model="projectBusinessPlan.bpUrl" accept=".pdf" limitExt=".pdf" :limit="1" :max-size="200 * 1048576"></ym-upload-file>
                <ym-button type="primary" size="medium" style="height:40px;margin-top:4px;margin-left: 10px;position: absolute;left: 120px;" @click="downBp()">下载BP模板</ym-button>
              </div>
              <div class="bp-title">
                <p>1.仅支持200M以内的1个PDF文件</p>
              </div>
            </ym-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="projectBusinessPlan.bpUrl">
          <el-col :span="12">
            <ym-form-item label="BP公开权限" prop="showAll">
              <ym-radio-group :disabled="bpDisabled" v-model="projectBusinessPlan.showAll">
                <ym-radio v-for="(item, index) in typeOptions" :key="index" :label="item.itemValue">
                  {{ item.itemName }}</ym-radio>
              </ym-radio-group>
            </ym-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="24" v-if="projectBusinessPlan.bpUrl">
          <el-col :span="24" v-if="isQqr">
            <ym-form-item label="邀请确权人" prop="image">
              <span>您的身份为确权人，视为自动为BP确权，无需邀请他人确权</span>
            </ym-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <ym-form-item label="邀请确权人" prop="image">
              <ym-button
                type="primary"
                :disabled="bpDisabled || isQqr"
                size="medium"
                @click="manShow = true"
                >选择确权人</ym-button
              >
              <p class="invite-title">
                <span>已加入邀请的确权人（{{ peopleLength }}/10）</span
                ><span style="color:#919EAB">
                  （邀请确权即赋予确权人查看和下载权限）</span
                >
              </p>
              <div v-loading="loading" class="table-list-card__body">
                <ym-table ref="table" row-key="id" :data="bpList">
                  <ym-table-column
                    prop="representativeIdStr"
                    disabled-toggle
                    label="确权人名称"
                    min-width="120px"
                  >
                    <div slot-scope="{ row }">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="row.representativeIdStr"
                        placement="top-end"
                      >
                        <span class="ellipsis">{{
                          row.representativeIdStr || "-"
                        }}</span>
                      </el-tooltip>
                    </div>
                  </ym-table-column>
                  <ym-table-column
                    prop="roleTypeStr"
                    disabled-toggle
                    label="身份"
                    min-width="120px"
                  >
                    <div slot-scope="{ row }">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="row.roleTypeStr"
                        placement="top-end"
                      >
                        <span class="ellipsis">{{
                          row.roleTypeStr || "-"
                        }}</span>
                      </el-tooltip>
                    </div>
                  </ym-table-column>
                  <ym-table-column label="操作" min-width="120px" fixed="right">
                    <template slot-scope="{ row, $index }">
                      <ym-link
                        :disabled="bpDisabled || isQqr"
                        type="primary"
                        @click="delPeople(row, $index)"
                        >移除</ym-link
                      >
                    </template>
                  </ym-table-column>
                </ym-table>
              </div>
            </ym-form-item>
          </el-col>
        </el-row> -->
      </ym-form>
    </div>

    <div class="submit-list">
      <div class="submit-btn is-always-shadow">
        <ym-button type="info" size="medium" @click="saveDrafts()">保存草稿</ym-button>
        <ym-button type="primary" size="medium" @click="handleSubmit()">提交</ym-button>
      </div>
    </div>
    <!-- 选择弹窗 -->
    <selDialog v-if="manShow" :visible.sync="manShow" :bpList="bpList" title="选择确权人" @submit-success="examine">
    </selDialog>
  </el-card>
</template>

<script>
import selDialog from '../_components/selDialog.vue'
import { mapActions } from 'vuex'
import { isPhoneTwo, isTelPhone } from '@/utils/validate.js'
export default {
  components: { selDialog },
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
        callback()
      }
    }
    return {
      loading: false,
      form: {},
      projectBase: {},
      projectAudit: {},
      projectProduct: { image: [] },
      projectCompany: { areas: [] },
      projectBusinessPlan: {},
      memberForms: { projectMembers: [] },
      financesForms: { projectFinances: [] },
      industryProps: {
        lazy: true,
        lazyLoad: this.lazyLoad.bind(this)
      },
      showIndustry: false,
      showCascaderArea: false,
      teams: [],
      industryOptions: [],
      levelOptions: [],
      publishOptions: [],
      orgIdOptions: [],
      roundsOptions: [],
      uploadMethod: null,
      manShow: false,
      selList: [],
      bpDisabled: false,
      isQqr: false,
      bpChange: false,
      typeOptions: [
        { itemValue: 1, itemName: '平台所有投资人可查看、下载' },
        { itemValue: 0, itemName: '向我申请授权后可查看、下载' }
      ],
      rules: {
        image: [
          {
            required: true,
            message: '请选择封面'
          }
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        projectName: [
          { type: 'string', required: true, message: '请输入项目名称' }
        ],
        financingPurpose: [{ required: true, message: '请输入融资用途' }],
        director: [
          { type: 'string', required: true, message: '请输入项目负责人' }
        ],
        areas: [
          { required: true, message: '请选择关注地区', trigger: 'change' }
        ],
        enterpriseLevel: [
          { required: true, message: '请选择龙头企业级别', trigger: 'change' }
        ],
        registeredCapital: [
          { required: true, message: '请输入注册资本', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
        ],
        legalRepresentativeName: [
          { required: true, message: '请输入法定代表人姓名', trigger: 'blur' }
        ],
        mainBusiness: [
          { required: true, message: '请输入主营业务', trigger: 'blur' }
        ],
        practitionerNum: [
          { required: true, message: '请输入员工人数', trigger: 'blur' }
        ],
        description: [
          { type: 'string', required: true, message: '请输入项目描述' }
        ],
        publisher: [
          {
            type: 'string',
            required: true,
            message: '请选择项目发布人',
            trigger: 'change'
          }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        investRound: [
          { required: true, message: '请选择轮次', trigger: 'change' }
        ],
        financingPlan: [
          { required: true, trigger: 'blur', message: '股权融资需求不可为空' }
        ],
        teamName: [
          { required: true, trigger: 'blur', message: '姓名不可为空' }
        ],
        teamPosition: [
          { required: true, trigger: 'blur', message: '职业不可为空' }
        ],
        teamProfile: [
          { required: true, trigger: 'blur', message: '简介不可为空' }
        ]
      },
      serveRules: {}
    }
  },
  async created () {
    // 财务年度
    const date = new Date()
    const year = date.getFullYear()
    this.financesForms.projectFinances = [
      { year: year - 1 },
      { year: year - 2 },
      { year: year - 3 }
    ]
    // 枚举
    this.industryOptions = await this.$service.app.dictSearch({
      dictCode: 'industry_type'
    })
    this.levelOptions = await this.$service.app.dictSearch({
      dictCode: 'enterprise_level'
    })
    this.roundsOptions = await this.$service.app.dictSearch({
      dictCode: 'invest_round'
    })
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    } else {
      // 回显懒加载多选
      this.showCascaderArea = this.showIndustry = true
    }
  },
  async mounted () {
    this.uploadMethod = async function (file, onUploadProgress) {
      const result = await this.$service.app.uploadBpFile(
        { file },
        { onUploadProgress, errorMessage: false }
      )
      return result
    }
    const roleList = JSON.parse(localStorage.getItem('roleList'))
    if (roleList.roles.length > 0) {
      roleList.roles.map(item => {
        if (item.id === '1') {
          this.isQqr = true
          return false
        }
      })
    }
  },
  methods: {
    ...mapActions('user', ['updateUserInfo']),
    // 请求服务
    async loadData (id) {
      const result = await this.$service.project.getProjectDetails({ id: id })
      if (result) {
        this.projectBase = result.projectBase
        this.publishOptions = this.projectBase.publisherInfo
          ? [this.projectBase.publisherInfo]
          : ''
        this.projectProduct = result.projectProduct || {}
        this.memberForms.projectMembers = result.projectMembers || []
        this.projectBusinessPlan = result.projectBusinessPlan || {}
        this.projectCompany = result.projectCompany || {}
        this.projectAudit = result.projectAudit || {}
        this.projectCompany.areas = []
        this.projectBase.industrySegmentation = []
        // 回显多选
        if (this.projectCompany.belongProvince) {
          this.projectCompany.areas.push(this.projectCompany.belongProvince)
        }
        if (this.projectCompany.belongCity) {
          this.projectCompany.areas.push(this.projectCompany.belongCity)
        }
        if (this.projectCompany.belongDistrict) {
          this.projectCompany.areas.push(this.projectCompany.belongDistrict)
        }
        if (this.projectBase.industryLevelOne) {
          this.projectBase.industrySegmentation.push(
            this.projectBase.industryLevelOne
          )
        }
        if (this.projectBase.industryLevelTwo) {
          this.projectBase.industrySegmentation.push(
            this.projectBase.industryLevelTwo
          )
        }
        const date = new Date()
        const year = date.getFullYear()
        if (this.$route.query.entry === 'drafts') {
          this.financesForms.projectFinances = result.projectFinances || [
            { year: year - 1 },
            { year: year - 2 },
            { year: year - 3 }
          ]
        } else if (this.projectCompany.id) {
          this.financesForms.projectFinances = await this.$service.project.financeList({
            projectCompanyId: this.projectCompany.id
          }) || [
            { year: year - 1 },
            { year: year - 2 },
            { year: year - 3 }
          ]
        }
        this.showIndustry = true
        this.showCascaderArea = true
      }
      if (this.$route.query.entry !== 'drafts') {
        // 编辑单独查询BP信息
        this.bpMsg = await this.$service.project.getBpInfo({
          id: this.$route.query.id
        })
        if (this.bpMsg) {
          this.$set(this.projectBusinessPlan, 'showAll', this.bpMsg.showAll)
          this.projectBusinessPlan.bpName = this.bpMsg.bpName
          this.projectBusinessPlan.fileId = this.bpMsg.fileId
          // bp文件
          const bpPdfResult = await this.$service.project.infoBp({
            bpId: this.bpMsg.id
          })
          this.projectBusinessPlan.bpUrl = bpPdfResult.bpUrl
          this.bpDisabled = true
          this.$forceUpdate()
        }
      }
    },
    // 行业细分
    async lazyLoad (node, resolve) {
      const { value, level } = node
      let result, fristList, secondList
      switch (level) {
        case 0: // 类型
          fristList = await this.$service.app.dictSearch({
            dictCode: 'industry_subdivision'
          })
          result = fristList.map(item => {
            return {
              value: item.itemValue,
              label: item.itemName
            }
          })
          break
        case 1: // 一级目录
          secondList = await this.$service.app.dictSearch({
            dictCode: value
          })
          result = secondList.map(item => {
            return {
              value: item.itemValue,
              label: item.itemName,
              leaf: level >= 1
            }
          })
          break
        default:
          result = []
          break
      }
      resolve(result)
    },
    async remoteMethod (val) {
      const result = await this.$service.project.publisher({
        publisherName: val
      })
      this.publishOptions = result.records
    },
    async rgIdremoteMethod (val) {
      const result = await this.$service.project.recommendUnitSearch({
        groupName: val
      })
      this.orgIdOptions = result
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
    // 选择确权人
    examine (selList) {
      this.peopleLength = selList.length
      this.projectBusinessPlan.representativeIds = []
      this.bpList = []
      selList.map(item => {
        this.bpList.push({
          representativeId: item.rid,
          representativeIdStr: item.name,
          roleTypeStr: item.roleTypeStr
        })
        this.projectBusinessPlan.representativeIds.push(item.rid)
      })
      this.manShow = false
    },
    // 移除确权人
    delPeople (row, index) {
      this.$confirm('确定移除确权人?需保存后生效', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          this.projectBusinessPlan.representativeIds.splice(
            this.projectBusinessPlan.representativeIds.indexOf(
              row.representativeId
            ),
            1
          )
          this.bpList.splice(index, 1)
          this.peopleLength = this.bpList.length
        })
        .catch(() => { })
    },
    downBp () {
      const url =
        'https://www.gdxctm.cn/business/static/file/%E4%BC%81%E4%B8%9A%E8%9E%8D%E8%B5%84BP%E6%A8%A1%E6%9D%BF_17ffaa4381e54478859fcd98a4a70e3e.pptx'
      const name = 'BP模板'
      this.fileLinkToStreamDownload(url, name, 'pdf')
    },
    fileLinkToStreamDownload (url, fileName, type) {
      const xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.setRequestHeader('Content-Type', `application/${type}`)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          // 接受二进制文件流
          var blob = this.response
          const blobUrl = window.URL.createObjectURL(blob)
          // 这里的文件名根据实际情况从响应头或者url里获取
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = fileName
          a.click()
          window.URL.revokeObjectURL(blobUrl)
        }
      }
      xhr.send()
    },
    previewBp (val) {
      window.open(val.src)
    },
    bpsuccess (bpFile) {
      this.bpDisabled = false
      this.bpChange = true
      this.projectBusinessPlan.bpName = bpFile.name
      this.projectBusinessPlan.fileId = bpFile.data.fileId
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 添加团队成员
    addTeam () {
      this.memberForms.projectMembers.push({})
    },
    // 删除团队成员
    delTeam (index) {
      this.$confirm('确定删除此条数据?需保存后生效', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          this.memberForms.projectMembers.splice(index, 1)
        })
        .catch(() => { })
    },
    // 保存草稿
    async saveDrafts () {
      let params = null
      if (!this.projectBase.projectName) {
        return this.$message.error('草稿保存需填写项目名称!')
      }
      const CompanyDate = { ...this.projectCompany }
      // 省市数据装换
      if (CompanyDate.areas && CompanyDate.areas.length > 0) {
        CompanyDate.belongProvince = CompanyDate.areas[0]
        CompanyDate.belongCity = CompanyDate.areas[1]
        CompanyDate.belongDistrict = CompanyDate.areas[2]
        delete CompanyDate.areas
      }
      if (
        this.projectBase.industrySegmentation &&
        this.projectBase.industrySegmentation.length > 0
      ) {
        this.projectBase.industryLevelOne = this.projectBase.industrySegmentation[0]
        this.projectBase.industryLevelTwo = this.projectBase.industrySegmentation[1]
        delete this.projectBase.industrySegmentation
      }
      // 是否向投资人公开财务信息
      CompanyDate.showAll = 0
      if (this.projectBusinessPlan.bpUrl) {
        params = {
          projectBase: this.projectBase,
          projectProduct: this.projectProduct,
          projectFinances: this.financesForms.projectFinances,
          projectBusinessPlan: this.projectBusinessPlan,
          projectMembers: this.memberForms.projectMembers,
          projectCompany: CompanyDate
        }
      } else {
        params = {
          projectBase: this.projectBase,
          projectProduct: this.projectProduct,
          projectFinances: this.financesForms.projectFinances,
          projectMembers: this.memberForms.projectMembers,
          projectCompany: CompanyDate
        }
      }
      await this.$service.project.draftSave(params)
      this.$message.success('保存草稿成功')
      this.$router.push('/project/my/drafts')
    },
    async changeParams () {
      const CompanyDate = { ...this.projectCompany }
      // 省市数据装换
      if (CompanyDate.areas && CompanyDate.areas.length > 0) {
        CompanyDate.belongProvince = CompanyDate.areas[0]
        CompanyDate.belongCity = CompanyDate.areas[1]
        CompanyDate.belongDistrict = CompanyDate.areas[2]
        delete CompanyDate.areas
      }
      // 是否向投资人公开财务信息
      CompanyDate.showAll = 0
      let params = null
      if (this.projectBusinessPlan.bpUrl) {
        if (!this.projectBusinessPlan.showAll) {
          this.projectBusinessPlan.showAll = 0
        }
        params = {
          projectBase: this.projectBase,
          projectProduct: this.projectProduct,
          projectFinances: this.financesForms.projectFinances,
          projectBusinessPlan: this.projectBusinessPlan,
          projectMembers: this.memberForms.projectMembers,
          projectCompany: CompanyDate
        }
      } else {
        params = {
          projectBase: this.projectBase,
          projectProduct: this.projectProduct,
          projectFinances: this.financesForms.projectFinances,
          projectMembers: this.memberForms.projectMembers,
          projectCompany: CompanyDate
        }
      }
      await this.$service.project.updateProjectDetails(params)
      if (this.projectBusinessPlan.bpUrl && this.bpChange) {
        if (this.isQqr) {
          this.$message.success(
            '发布成功，系统正在针对上传的 BP 文件进行压缩和转码，该过程可能需要一段时间。'
          )
        } else {
          this.$message.success(
            '发布成功，系统正在针对上传的 BP 文件进行压缩和转码，该过程可能需要一段时间，系统处理完后会以短信方式通知确权人。'
          )
        }
      } else {
        this.$message.success('提交成功')
      }
      if (this.$route.query.entry === 'drafts') {
        this.$router.push('/project/my')
      } else {
        this.$router.back()
      }
    },
    // 提交
    async handleSubmit () {
      this.loading = true
      try {
        await this.validate('baseForm')
        await this.validate('serveForm')
        await this.validate('teamForm')
        if (this.id && this.bpChange && this.projectBusinessPlan.fileId) {
          try {
            await this.$confirm('若替换BP则会撤销确权邀请，且需要重新邀请确权，确定吗？', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
          } catch (error) {
            return false
          }
        }
        this.changeParams()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  background-color: #fff;
  padding: 20px;
}
.team-form::v-deep {
  .el-form-item {
    margin-bottom: 0;
  }
}
.header {
  margin-bottom: 30px;
}
.gray-text {
  font-size: 14px;
  color: #919eab;
}
.el-row {
  margin-bottom: 10px;
}
.w-100 {
  width: 100%;
}
.c-flexs {
  display: flex;
  align-items: center;
}
.flexs {
  display: flex;
  align-items: baseline;
}
.year-text {
  font-weight: bold;
}
.bp-title {
  color: #919eab;
  line-height: 1;
}
.teams-label {
  &:before {
    content: "*";
    color: #ff4842;
  }
}
.avatar-img::v-deep {
  .upload-image {
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
    margin-right: 11px;
  }
}
.no-margin-form::v-deep {
  .el-form-item {
    margin-bottom: 0;
  }
}
.pro-reason {
  p {
    color: #ff4842;
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
.invite-title {
  line-height: 1;
  margin-bottom: 30px;
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
  .el-button {
    margin-right: 15px;
  }
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
