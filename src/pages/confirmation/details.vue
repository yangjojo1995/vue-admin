<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <div class="back">
        <span @click="toBack"
          ><i class="el-icon-arrow-left"></i>
          <span class="back-span">返回</span>
        </span>
      </div>
      <div class="avatar-list">
        <div class="avatar-left">
          <img v-if="forms.logo" :src="$assets(forms.logo)" alt="" />
          <img v-else src="@/assets/images/global/user-avatar.png" alt="" />
          <div>
            <div class="avatar-user">{{ forms.name || "-" }}</div>
            <div><span>{{ forms.roleTypeStr || "-" }}</span>
            </div>
          </div>
        </div>
        <div class="avatar-status">
          <span>确权人权限：</span>
          <el-switch
            :value="forms.enable"
            @change="
              val => {
                statusChange(val, forms.id);
              }
            "
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
        </div>
      </div>
      <div class="msg-block">
        <div class="b-title">
            确权信息
        </div>
        <div>
          <div v-loading="loading" class="table-list-card__body">
            <ym-table ref="table" row-key="id" :data="records">
              <ym-table-column
                prop="projectName"
                disabled-toggle
                label="项目名称"
                min-width="120px"
              >
                <div slot-scope="{ row }">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="row.projectName"
                    placement="top-end"
                  >
                    <span class="ellipsis">{{ row.projectName || "-" }}</span>
                  </el-tooltip>
                </div>
              </ym-table-column>
              <ym-table-column
                prop="publisherStr"
                disabled-toggle
                label="项目发布人"
                min-width="120px"
              >
                <div slot-scope="{ row }">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="row.publisherStr"
                    placement="top-end"
                  >
                    <span class="ellipsis">{{ row.publisherStr || "-" }}</span>
                  </el-tooltip>
                </div>
              </ym-table-column>
              <ym-table-column
                prop="assistTargetCreateTime"
                disabled-toggle
                label="邀请确权时间"
                min-width="120px"
              >
                <span slot-scope="{ row }">{{
                  row.assistTargetCreateTime | dateFormat("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </ym-table-column>
              <ym-table-column
                prop="assistedTime"
                disabled-toggle
                label="确权时间"
                min-width="120px"
              >
                <span slot-scope="{ row }">{{
                  row.assistedTime | dateFormat("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </ym-table-column>
            </ym-table>
          </div>
          <div class="table-list-card__footer__right">
            <ym-pagination
              ref="pagination"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="paging.page"
              :page-size="paging.size"
              :total="total"
              @current-change="updateRecordsByPage"
              @size-change="updateRecordsByPage(1)"
            >
            </ym-pagination>
          </div>
        </div>
      </div>
    </ym-card>
  </div>
</template>

<script>
import PageSingleList from '@/mixins/PageSingleList'
export default {
  components: {},
  mixins: [PageSingleList],
  data () {
    return {
      activeNames: ['1'],
      forms: {},
      promptTitle: '',
      dialogPro: false,
      dialogSign: false,
      noPass: false,
      statusTemp: '',
      industryOptions: [],
      accountDialog: false,
      sincerityDialog: false,
      loadAfterCreated: false
    }
  },
  async created () {
    this.industryOptions = await this.$service.app.dictSearch({
      dictCode: 'company_type'
    })
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    }
  },
  methods: {
    // 加载数据
    async loadData (id) {
      const result = await this.$service.confirmation.assistInfo({
        id: id
      })
      if (result) {
        this.forms = result
        this.updateRecordsByPage(1)
      }
    },
    // 列表请求
    async requestService (paging, entity, orders) {
      return this.$service.confirmation.memberSearch({
        page: paging.page,
        ...entity,
        rid: this.forms.rid
      })
    },
    // 查看
    goTo (form) {
      if (form.investManagerId) {
        this.$router.push({
          path: '/user-manager/detail/investment-details',
          query: { id: form.investManagerId }
        })
      } else if (form.userId) {
        this.$router.push({
          path: '/user-manager/detail/ordinary-details',
          query: { id: form.userId }
        })
      }
    },
    // 审核操作
    openReviewDialog (type) {
      if (type === 'accept') {
        this.$confirm('确认审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async () => {
          const params = {
            id: this.id,
            status: type
          }
          await this.$service.manager.verifyAudit(params)
          this.$message.success('操作成功')
          this.$router.push('/user-manager/review')
        })
      } else if (type === 'refuse') {
        this.promptTitle = '审核不通过原因'
        this.statusTemp = type
        this.dialogPro = true
      }
    },
    // 状态修改
    async statusChange (value, id) {
      // 状态先保持不变
      value === 0 ? (this.forms.deleted = 1) : (this.forms.deleted = 0)
      this.$confirm(value === 0 ? '您确定开启该用户的确权人权限吗？' : '您确定关闭该用户的确权人权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        try {
          this.loading = true
          const params = {
            id: id,
            enable: value
          }
          await this.$service.confirmation.assistUpdate(params)
          value === 0 ? (this.forms.enable = 0) : (this.forms.enable = 1)
          this.$message.success('修改成功')
        } finally {
          this.loading = false
        }
      })
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 关闭弹窗
    closePrompt () {
      this.dialogPro = false
    },
    // 个人详情
    toLink (id) {
      this.$router.push({
        path: '/user-manager/detail/ordinary-details',
        query: { id: id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mb-10 {
  margin-bottom: 10px;
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .covers {
    display: flex;
    align-items: center;
    img {
      width: 54px;
      height: 54px;
      margin-right: 11px;
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
  .names {
    font-size: 14px;
    font-weight: normal;
    margin-left: 6px;
  }
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
    width: 60px;
    height: auto;
    margin-right: 12px;
  }
}
.mb-15 {
  margin-bottom: 15px;
}
.table-list-card__footer__right {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
