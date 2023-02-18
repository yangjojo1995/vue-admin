<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <div class="back">
        <span @click="toBack"
          ><i class="el-icon-arrow-left"></i>
          <span class="back-span">返回</span>
        </span>
        <div class="drawer-list" v-if="bpUrl">
          <ym-button size="mini" @click="previewBp">预览BP</ym-button>
        </div>
      </div>
      <div class="avatar-list">
        <div class="covers">
         <el-image
          v-if="projectBase.image"
          style="width: 100px; height: 100px;margin-right: 10px;"
          fit="contain"
          :src="$assets(projectBase.image)"
          :preview-src-list="[$assets(projectBase.image)]"
        >
        </el-image>
          <img
            v-else
            src="@/assets/images/global/project-default.png"
            alt="头像"
          />
          <div>
            <div class="avatar-user">{{ projectBase.projectName || "-" }}</div>
            <!-- <div>上链编号：{{ projectBase.chainNo || "-" }}</div> -->
            <div>
              所属行业：{{
                projectBase.industryDict
                  ? projectBase.industryDict.itemName
                  : "-"
              }}
            </div>
            <div>
              项目发布人：{{
                projectBase.publisherInfo ? projectBase.publisherInfo.name : "-"
              }}
            </div>
            <div>项目描述：{{ projectBase.description || "-" }}</div>
          </div>
        </div>
        <div class="avatar-status" v-if="projectBase.status !== 'pre-publish'">
          <span>状态：</span>
          <el-switch
            :value="projectBase.status"
            @change="
              val => {
                statusChange(val, projectBase.id);
              }
            "
            active-value="publish"
            inactive-value="stop"
          >
          </el-switch>
        </div>
      </div>
      <div class="msg-block">
        <div class="b-title">
          项目介绍
        </div>
        <table
          cellspacing="0"
          cellpadding="0"
          align="center"
          class="transverse-table"
        >
          <tbody>
            <tr>
              <td class="td-label">项目负责人</td>
              <td class="td-cotent">{{ projectBase.director || "-" }}</td>
              <td class="td-label">负责人电话</td>
              <td class="td-cotent">{{ projectBase.mobile || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">融资计划</td>
              <td class="td-cotent">{{ projectBase.financingPlan || "-" }}</td>
              <td class="td-label">估值</td>
              <td class="td-cotent">{{ projectBase.assessedValue || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">被投金额</td>
              <td class="td-cotent">
                {{ projectBase.investment || "-" }}
                <span v-if="projectBase.investment">万元</span>
              </td>
              <td class="td-label">项目亮点</td>
              <td class="td-cotent" style="white-space: pre-wrap">{{ projectBase.advantage || "-" }}</td>
            </tr>
            <tr>
              <td class="td-label">市场分析</td>
              <td
                class="td-cotent"
                v-if="projectBase.marketAnalysis"
                style="white-space: pre-wrap"
                v-html="projectBase.marketAnalysis"
              ></td>
              <td class="td-cotent" v-else>-</td>
              <td class="td-label">商业模式</td>
              <td class="td-cotent" style="white-space: pre-wrap">{{ projectBase.businessModel || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="msg-block">
        <div class="b-title">
          产品&服务
        </div>
        <div class="product-img-list">
         <el-image
          v-if="projectProduct.image"
          style="width: 100px; height: 100px;margin-right: 10px;"
          fit="contain"
          :src="$assets(projectProduct.image)"
          :preview-src-list="[$assets(projectProduct.image)]"
        >
        </el-image>
          <img
            v-else
            src="@/assets/images/global/project-default.png"
            alt="产品图"
          />
          <div class="view-img-text">
            <div class="mb-5">
              产品/服务名称：{{ projectProduct.productName || "-" }}
            </div>
            <div>服务描述：{{ projectProduct.description || "-" }}</div>
          </div>
        </div>
      </div>
      <div class="msg-block">
        <div class="b-title">
          团队成员
        </div>
        <template v-if="projectMembers.length > 0">
          <div
            class="view-img-list"
            v-for="(item, index) in projectMembers"
            :key="index"
          >
            <el-image
            v-if="item.image"
            style="width: 100px; height: 100px;margin-right: 10px;"
            fit="contain"
            :src="$assets(item.image)"
            :preview-src-list="[$assets(item.image)]"
          >
          </el-image>
            <img
              v-else
              src="@/assets/images/global/user-avatar.png"
              alt="团队成员头像"
            />
            <div class="view-img-text">
              <div class="avatar-user">{{ item.name || "-" }}</div>
              <div>职位：{{ item.position || "-" }}</div>
              <div>简介：{{ item.profile || "-" }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div>暂无数据</div>
        </template>
      </div>
      <div class="msg-block">
        <div class="b-title">
          运营情况
        </div>
        <ym-row :gutter="24">
          <ym-col :span="24">
            <div class="msg-content" style="white-space: pre-wrap">{{ projectBase.operation || "-" }}</div>
          </ym-col>
        </ym-row>
      </div>
    </ym-card>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      id: '',
      activeNames: ['1'],
      forms: {},
      accountDialog: false,
      sincerityDialog: false,
      projectBase: {},
      projectProduct: {},
      projectMembers: [],
      bpUrl: ''
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    }
  },
  methods: {
    // 加载数据
    async loadData (id) {
      const result = await this.$service.project.getProjectDetails({
        id: id
      })
      if (result) {
        this.projectBase = result.projectBase
        this.projectProduct = result.projectProduct
        this.projectMembers = result.projectMembers
      }
      const bpPdfResult = await this.$service.project.getBp({
        id: this.id
      })
      this.bpUrl = this.$assets(bpPdfResult.bpUrl)
    },
    // 预览BP
    async previewBp (val) {
      window.open(this.bpUrl)
    },
    openReviewDialog (type) {
      if (type === 'success') {
        this.promptTitle = '审核通过原因'
      } else {
        this.promptTitle = '审核不通过原因'
      }
      this.dialogPro = true
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 状态修改
    async statusChange (value, id) {
      // 状态先保持不变
      value === 'publish'
        ? (this.projectBase.status = 'stop')
        : (this.projectBase.status = 'publish')
      this.$confirm(value === 'publish' ? '是否发布？' : '是否停止？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        try {
          this.loading = true
          const params = {
            id: id,
            status: value
          }
          await this.$service.project.stausProjectDetails(params)
          value === 'publish'
            ? (this.projectBase.status = 'publish')
            : (this.projectBase.status = 'stop')
          this.$message.success('修改成功')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mb-5 {
  margin-bottom: 5px;
}
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

.avatar-list {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .covers {
    display: flex;
    align-items: center;
    img {
      width: 100px;
      height: 100px;
      margin-right: 21px;
      object-fit: contain;
    }
  }
  .avatar-left {
    img {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      margin-right: 11px;
      object-fit: contain;
    }
  }

  .avatar-left,
  .avatar-status {
    display: flex;
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
  word-break: break-all;
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
.el-card {
  position: relative;
}
.submit-btn {
  position: fixed;
  bottom: 40px;
  left: 50%;
  z-index: 99;
}
.view-img-list {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin-right: 11px;
    border: 1px solid #f6f7fa;
    object-fit: contain;
  }
}
.product-img-list {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  img {
    width: 80px;
    height: 80px;
    margin-right: 11px;
    object-fit: contain;
  }
}
.view-img-list::v-deep {
  .el-image {
    margin-right: 12px;
  }
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-15 {
  margin-bottom: 15px;
}
</style>
