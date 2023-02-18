<template>
  <div class="page">

    <ym-table-list-card
      row-key="id"
      :loading="loading"
      :show-search="true"
      :search.sync="params.search"
      :data="data"
      :current-page.sync="params.pageNumber"
      :page-size.sync="params.pageSize"
      :total="total"
      @search="handleSearch"
      @current-change="handleCurrentChange">

      <ym-table-column type="selection" width="56px" align="center" reserve-selection></ym-table-column>

      <ym-table-column type="index" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="avatar" label="图片" width="84px" align="center">
        <ym-image class="avatar" slot-scope="{ row }" :src="row.avatar" alt=""></ym-image>
      </ym-table-column>
      <ym-table-column prop="name" label="名称" min-width="120px" disabled-toggle></ym-table-column>
      <ym-table-column prop="group" label="用户组" min-width="120px"></ym-table-column>
      <ym-table-column prop="sex" label="性别" width="102px" align="center"></ym-table-column>
      <ym-table-column prop="age" label="年龄" width="102px" align="center"></ym-table-column>
      <ym-table-column prop="money" label="余额" width="120px" align="right">
        <span slot-scope="{ row }">{{ row.money | money }}</span>
      </ym-table-column>
      <ym-table-column prop="integral" label="积分" width="120px" align="right"></ym-table-column>
      <ym-table-column prop="statusName" label="状态" width="120px" align="center">
        <template slot-scope="{ row }">
          <ym-tag v-if="row.statusName === '已启用'" type="success" size="mini">{{ row.statusName }}</ym-tag>
          <ym-tag v-else-if="row.statusName === '已禁用'" type="danger" size="mini">{{ row.statusName }}</ym-tag>
        </template>
      </ym-table-column>
      <ym-table-column prop="createTime" label="创建时间" width="120px" align="center">
        <template slot-scope="{ row }">
          <div>{{ row.createTime | dateFormat('YYYY-MM-DD') }}</div>
          <div>{{ row.createTime | dateFormat('HH:mm:ss') }}</div>
        </template>
      </ym-table-column>
      <ym-table-column prop="updateTime" label="更新时间" width="120px" align="center" :toggle="false">
        <template slot-scope="{ row }">
          <div>{{ row.updateTime | dateFormat('YYYY-MM-DD') }}</div>
          <div>{{ row.updateTime | dateFormat('HH:mm:ss') }}</div>
        </template>
      </ym-table-column>
      <ym-table-column label="操作" width="152px" align="center" fixed="right">
        <ym-link type="primary" icon="el-icon-edit">编辑</ym-link>
        <ym-link type="danger" icon="el-icon-delete">删除</ym-link>
      </ym-table-column>

      <template slot="header-right">
        <ym-button type="primary" size="medium">添加用户</ym-button>
      </template>

      <template slot="selected-tool">
        <ym-button size="small">批量上架</ym-button>
        <ym-button size="small">批量删除</ym-button>
      </template>
    </ym-table-list-card>
  </div>
</template>

<script>
import Mock from 'mockjs'

export default {
  data () {
    return {
      nativeData: Mock.mock({
        'value|500-800': [{
          id: '@increment', // ID
          name: '@cname',
          avatar: 'http://lorempixel.com/64/64/?id=@increment',
          'group|1': ['管理员', '财务', '人事', '开发', '测试'],
          'sex|1': ['男', '女', ''],
          age: '@integer(16, 60)',
          'statusName|1': ['已禁用', '已启用'],
          createTime: '@datetime',
          updateTime: '@datetime',
          money: '@float(0, 10000000, 0, 2)',
          integral: '@integer(0, 10000)'
        }]
      }).value,

      loading: false,
      params: {
        search: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      data: []

    }
  },
  created () {
    this.handleCurrentChange(1)
  },
  methods: {
    // 搜索
    handleSearch () {
      this.handleCurrentChange(1)
    },

    // 切换页面
    handleCurrentChange (page) {
      if (this.loading) return
      this.loading = true
      setTimeout(() => {
        if (page) this.params.pageNumber = page
        const array = this.nativeData.filter(item => {
          for (const val of Object.values(item)) {
            if (String(val).includes(this.params.search)) {
              return true
            }
          }
          return false
        })
        const pageSize = this.params.pageSize
        const pageNumber = this.params.pageNumber
        const offset = (pageNumber - 1) * pageSize

        this.data = (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize)
        this.total = array.length
        this.loading = false
      }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  display: block;
  width: 64px;
  height: 64px;
}
</style>
