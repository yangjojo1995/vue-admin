<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <ym-page-header @back="toBack" content="点评对象详情" class="ym-mb-3"></ym-page-header>
      <div class="flex">
        <div class="strech mr-10">
         <strong class="fs-18">点评对象</strong>
        </div>
        <div >
          <div class="flex mb-10">
            {{dataInfo.desc}}
          </div>
          <div class="ym-mb-1">
            <div class="flex">
             <span>总体评分: {{dataInfo.score}}</span>
             <!-- <ym-rate v-model="dataInfo.score" disabled ></ym-rate> -->
            </div>
          </div>
          <div class="ym-mb-2">
            <span class="mr-10" v-for="item,index in dataInfo.commentScoringList" :key="index">{{item.commentScoringItemName}}：{{item.score}}</span>
          </div>
        </div>
      </div>
    </ym-card>
    <ym-card class="ym-mb-3">
      <div slot="header">点评信息</div>
      <ym-table :data="likeList"  header-align="center">
        <ym-table-column type="index" label="序号"></ym-table-column>
        <ym-table-column prop="createByName" label="点评人"></ym-table-column>
        <ym-table-column prop="createTime" label="时间"  width="120px">
          <template slot-scope="{row}">
            <div>{{row.createTime | dateFormat('YYYY-MM-DD')}}</div>
            <div>{{row.createTime | dateFormat(' HH:mm:ss')}}</div>
          </template>
        </ym-table-column>
        <ym-table-column prop="content" label="内容" >

          <div slot-scope="{row}" class="ellipsis">
            {{row.content}}
          </div>
        </ym-table-column>
        <ym-table-column prop="likes" label="点赞">

        </ym-table-column>
        <ym-table-column prop="enable" label="启用" >
          <span slot-scope="{ row }">
            <el-switch :value="row.enable" @change=" val => { statusChange(val, row);}" :active-value="0" :inactive-value="1">
            </el-switch>
          </span>
        </ym-table-column>
        <ym-table-column prop="enable" label="操作" >
          <span slot-scope="{ row }">
            <ym-link type="primary" @click="goDetail(row)">查看</ym-link>
          </span>
        </ym-table-column>

      </ym-table>

      <div class="page-wrap">
        <ym-pagination
          ref="pagination"
          background
          :layout="pagesParms.pagerLayout"
          :current-page="pagesParms.currentPage"
          :page-sizes="pagesParms.pageSizes"
          :page-size="pagesParms.pageSize"
          :pager-count="pagesParms.pagerCount"
          :total="pagesParms.currentTotal"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange">
        </ym-pagination>
      </div>
    </ym-card>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      dataInfo: {},
      id: '',
      likeList: [],
      pagesParms: {
        pagerLayout: 'total, sizes, prev, pager, next, jumper',
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        pagerCount: 5,
        currentTotal: 0
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.loadData(this.id)
    }
  },
  methods: {
    handleCurrentChange (value) {
      this.pagesParms.currentPage = value
      this.getCommentContentList()
    },
    // 分页大小发生变化时
    handleSizeChange (value) {
      this.pagesParms.pageSize = value
      this.getCommentContentList()
    },
    goDetail (row) {
      this.$router.push({
        path: '/project/comment/content/detail?id=' + row.id
      })
    },
    // 加载数据
    async loadData (id) {
      const result = await this.$service.project.commentObjectDetail({
        bindId: id
      })
      this.dataInfo = result
      this.getCommentContentList()
    },
    async getCommentContentList () {
      const result = await this.$service.project.commentSearch({
        bindId: this.id,
        page: this.pagesParms.currentPage,
        size: this.pagesParms.pageSize
      })
      this.likeList = result.records
      this.pagesParms.currentTotal = result.total
    },
    // 返回
    toBack () {
      this.$router.go(-1)
    },
    // 状态修改
    // 状态修改
    async statusChange (value, row) {
      console.log(value)
      if (value === 1) {
        const h = this.$createElement
        // 状态先保持不变
        // value === 1 ? (row.enable = 1) : (row.enable = 0)

        this.$msgbox({
          title: '确认提示',
          message: h('p', null, [
            h('p', { style: 'color: #000;font-size:16px;font-weight:bold' }, '确认关闭点评内容吗?'),
            h('p', { style: 'color: #666' }, '关闭后该点评，即此内容对所有人不可见')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async () => {
          this.switchValue = value

          const params = {
            commentId: row.id,
            enable: value
          }
          await this.$service.project.commentOperate(params)
          row.enable = value
          this.$message.success('修改成功')
        })
      } else {
        const params = {
          commentId: row.id,
          enable: value
        }
        await this.$service.project.commentOperate(params)
        row.enable = value
        this.$message.success('修改成功')
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.el-card {
  position: relative;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-15 {
  margin-bottom: 15px;
}
.mx-10{
  margin:0 10px;
}
.mr-10{
  margin-right:20px;
}
.flex{
  display: flex;
  align-items: center;
}
.flex-wrap{
  flex-wrap: wrap;
}
.h-80{
  height:80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.page-wrap{
  display: flex;
  justify-content: flex-end;
  padding:20px 0;
}
.fs-18{
  font-size: 18px;
}
.strech{
  align-self: stretch;
  min-width: 80px;
}
.ellipsis {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
