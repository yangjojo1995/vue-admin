<template>
  <div class="page">
    <ym-card class="ym-mb-3">
      <ym-page-header @back="toBack" content="点评内容详情" class="ym-mb-3"></ym-page-header>
      <ym-row :gutter="80">
        <ym-col :xs="2" :md="2" :ms="2">
          <ym-avatar  shape="circle" :size="80" fit="contain" :src="$assets(dataInfo.createByIcon)"></ym-avatar>
        </ym-col>
        <ym-col :xs="22" :md="22" :ms="22">
          <div class="h-80">
            <div class="flex mb-10">
              <strong class="mr-10 fs-18">{{dataInfo.createByName}}</strong>
              <ym-tag class="mr-10" type="primary" size="small" v-if="dataInfo.publisher">发布人</ym-tag>
              <div v-for="item,index in dataInfo.commentTags" :key="index">
                {{item.name}}
               <span class="mx-10" v-if="index!== dataInfo.commentTags.length-1">|</span>
              </div>
            </div>
            <div>
              {{dataInfo.createTime | dateFormat('YYYY-MM-DD HH:mm:ss')}}
            </div>
          </div>
          <div class="ym-mb-1">
            <div class="flex">
             <span>评分:</span>
             <ym-rate v-model="dataInfo.score" disabled ></ym-rate>
            </div>
          </div>
          <div class="ym-mb-2">
            <span class="mr-10" v-for="item,index in dataInfo.commentScoringList" :key="index">{{item.commentScoringItemName}}：{{item.score}}</span>
          </div>
          <div class="ym-mb-2">{{dataInfo.content}}</div>
          <div class="flex flex-wrap">
            <div class="mr-10 mb-10" v-for="item,index in dataInfo.pictureList" :key="index">
              <el-image
                style="width: 100px; height: 100px"
                :src="$assets(item)"
                :preview-src-list="srcList">
              </el-image>
            </div>
          </div>
        </ym-col>
      </ym-row>
    </ym-card>

    <ym-card class="ym-mb-3">
      <div>点评对象：<ym-link type="primary" :underline="true" @click="goDetail"> {{dataInfo.bindObject&&dataInfo.bindObject.desc}}</ym-link></div>
    </ym-card>
    <ym-card class="ym-mb-3">
      <div slot="header">点赞信息</div>
      <ym-table :data="likeList">
        <ym-table-column type="index" label="序号"></ym-table-column>
        <ym-table-column prop="createByName" label="点赞人名称" min-width="140"></ym-table-column>
        <ym-table-column prop="commentTags" label="身份" min-width="140">
          <template slot-scope="{row}">
            <span v-for="item,index in row.commentTags" :key="index">
                {{item.name}}
               <span class="mx-10" v-if="index!==row.commentTags.length-1">|</span>
            </span>
          </template>
        </ym-table-column>
        <ym-table-column prop="createTime" label="点赞时间" min-width="140">
          <template slot-scope="{row}">
            {{row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss')}}
          </template>
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
import assets from '@/utils/assets'
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
      },
      srcList: []
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
      this.getLikesList()
    },
    // 分页大小发生变化时
    handleSizeChange (value) {
      this.pagesParms.pageSize = value
      this.getLikesList()
    },
    goDetail () {
      this.$router.push({
        path: '/project/libraries/view/view-detail?id=' + this.dataInfo.bindObject.bindId
      })
    },
    // 加载数据
    async loadData (id) {
      const result = await this.$service.project.commentContentDetail({
        id: id
      })
      this.dataInfo = result
      if (result.pictureList && result.pictureList.length > 0) {
        this.srcList = result.pictureList.map(item => assets(item))
      }
      this.getLikesList()
    },
    async getLikesList () {
      const result = await this.$service.project.commentLikesList({
        commentId: this.id,
        page: this.pagesParms.currentPage,
        size: this.pagesParms.pageSize
      })
      this.likeList = result.records
      this.pagesParms.currentTotal = result.total
    },
    // 返回
    toBack () {
      this.$router.go(-1)
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
</style>
