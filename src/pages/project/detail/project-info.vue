<template>
  <div class="project" v-if="projectBase.id">
    <div class="title" style="margin-top:24px">基本信息</div>
    <div class="table">
      <div class="table-group">
        <div class="table-group-label flex-left">所属行业</div>
        <div class="table-group-value flex-left">{{projectBase.industryDict && projectBase.industryDict.itemName || '-'}}</div>
        <div class="table-group-label flex-left">估值</div>
        <div class="table-group-value flex-left">{{ projectBase.assessedValue || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">股权融资需求</div>
        <div class="table-group-value flex-left">{{ projectBase.financingPlan ? (projectBase.financingPlan+'万元') : '-' }}</div>
        <div class="table-group-label flex-left">轮次</div>
        <div class="table-group-value flex-left">{{ projectBase.investRoundDict && projectBase.investRoundDict.itemName || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">融资用途</div>
        <div class="table-group-value flex-left">{{ projectBase.financingPurpose || '-' }}</div>
        <div class="table-group-label flex-left">历往获投金额</div>
        <div class="table-group-value flex-left">{{ projectBase.investment ? (projectBase.investment + '万元') : '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">股权投资退出方式</div>
        <div class="table-group-value flex-left">{{ projectBase.equityExitWay || '-' }}</div>
        <div class="table-group-label flex-left">市场份额</div>
        <div class="table-group-value flex-left">{{ projectBase.marketShare || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">行业地位</div>
        <div class="table-group-value flex-left">{{ projectBase.industryStatus || '-' }}</div>
        <div class="table-group-label flex-left">行业细分</div>
        <div class="table-group-value flex-left">
          <template v-if="projectBase.industryLevelOneDict">
            {{ projectBase.industryLevelOneDict && projectBase.industryLevelOneDict.itemName }}{{projectBase.industryLevelTwoDict ? ' / '+ projectBase.industryLevelTwoDict.itemName:''}}
          </template>
          <template v-else>-</template>
        </div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">项目亮点</div>
        <div class="table-group-value flex-left">{{ projectBase.advantage || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">市场分析</div>
        <div class="table-group-value flex-left">{{ projectBase.marketAnalysis || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">商业模式</div>
        <div class="table-group-value flex-left">{{ projectBase.businessModel || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">运营情况</div>
        <div class="table-group-value flex-left">{{ projectBase.operation || '-' }}</div>
      </div>
    </div>

    <div class="title" v-if="projectCompany">企业信息</div>
    <div class="table" v-if="projectCompany">
      <div class="table-group">
        <div class="table-group-label flex-left">企业全称</div>
        <div class="table-group-value flex-left">{{ projectCompany.companyName || '-' }}</div>
        <div class="table-group-label flex-left">统一社会信用代码</div>
        <div class="table-group-value flex-left">{{ projectCompany.creditCode || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">注册资金</div>
        <div class="table-group-value flex-left">{{ projectCompany.registeredCapital ? ( projectCompany.registeredCapital + '万元') : '-' }}</div>
        <div class="table-group-label flex-left">地区</div>
        <div class="table-group-value flex-left">
          {{ projectCompany.belongProvinceStr || ''}}
          {{ projectCompany.belongCityStr || ''}}
          {{ projectCompany.belongDistrictStr || ''}}
        </div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">法定代表人</div>
        <div class="table-group-value flex-left">{{ projectCompany.legalRepresentativeName  || '-'}}</div>
        <div class="table-group-label flex-left">员工人数</div>
        <div class="table-group-value flex-left">{{ projectCompany.practitionerNum?(projectCompany.practitionerNum + '人') : '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">龙头企业级别</div>
        <div class="table-group-value flex-left">{{ projectCompany.enterpriseLevelStr  || '-'}}</div>
        <div class="table-group-label flex-left">主营业务</div>
        <div class="table-group-value flex-left">{{ projectCompany.mainBusiness || '-' }}</div>
      </div>
    </div>

    <div class="title">联系人信息</div>
    <div class="table">
      <div class="table-group">
        <div class="table-group-label flex-left">项目发布人</div>
        <div class="table-group-value flex-left">{{  projectBase.publisherInfo && projectBase.publisherInfo.name  || '-'}}</div>
        <div class="table-group-label flex-left">项目联系人</div>
        <div class="table-group-value flex-left">{{ projectBase.director || '-' }}</div>
      </div>
      <div class="table-group">
        <div class="table-group-label flex-left">联系人电话</div>
        <div class="table-group-value flex-left">{{ projectBase.mobile || '-' }}</div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  components: {},
  props: {
    projectBase: {
      type: Object,
      default: () => {
        return {}
      }
    },
    projectCompany: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./project-css.scss";
</style>
