<template>
  <div class="page">
    <ym-form-filter-card :model.sync="params" watch-exclude="pageNumber,pageSize" @model-change="handleSearch()">
      <ym-form-item label="姓名">
        <ym-input v-model="params.name" placeholder="请输入姓名"></ym-input>
      </ym-form-item>
      <ym-form-item label="用户组">
        <ym-select v-model="params.group" placeholder="请选择用户组" clearable>
          <ym-option label="管理员" value="管理员"></ym-option>
          <ym-option label="财务" value="财务"></ym-option>
          <ym-option label="人事" value="人事"></ym-option>
          <ym-option label="开发" value="开发"></ym-option>
          <ym-option label="测试" value="测试"></ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="性别">
        <ym-select v-model="params.sex" placeholder="请选择性别" clearable>
          <ym-option label="男" value="男"></ym-option>
          <ym-option label="女" value="女"></ym-option>
        </ym-select>
      </ym-form-item>
      <ym-form-item label="年龄">
        <ym-input-number v-model="params.age" placeholder="请输入年龄"></ym-input-number>
      </ym-form-item>
      <ym-form-item label="创建时间" :span="2">
        <el-date-picker v-model="params.createTimeDateInterval" type="datetimerange" range-separator="至" clearable placeholder="请选择" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </ym-form-item>
    </ym-form-filter-card>

    <ym-table-list-card
      row-key="id"
      :loading="loading"
      :data="data"
      :current-page.sync="params.pageNumber"
      :page-size.sync="params.pageSize"
      :total="total"
      :show-search="false"
      @search="handleSearch"
      @current-change="handleCurrentChange">

      <ym-table-column type="selection" width="56px" align="center" reserve-selection></ym-table-column>

      <ym-table-column type="index" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="avatar" label="图片" width="84px" align="center">
        <ym-image class="avatar" slot-scope="{ row }" :src="row.avatar" alt=""></ym-image>
      </ym-table-column>
      <ym-table-column prop="name" label="名称" disabled-toggle>
        <span slot-scope="{ row }">{{ row.name }}</span>
      </ym-table-column>
      <ym-table-column prop="group" label="用户组">
        <ym-link slot-scope="{ row }" type="primary">{{ row.group }}</ym-link>
      </ym-table-column>
      <ym-table-column prop="sex" label="性别" align="center">
        <span slot-scope="{ row }">{{ row.sex }}</span>
      </ym-table-column>
      <ym-table-column prop="age" label="年龄" align="center">
        <span slot-scope="{ row }">{{ row.age }}</span>
      </ym-table-column>
      <ym-table-column prop="money" label="余额" width="120px" align="right">
        <span slot-scope="{ row }">{{ row.money | money }}</span>
      </ym-table-column>
      <ym-table-column prop="integral" label="积分" width="120px" align="right">
        <span slot-scope="{ row }">{{ row.integral }}</span>
      </ym-table-column>
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
        name: '',
        group: '',
        sex: '',
        age: '',
        createTimeDateInterval: [],
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
          return Object.entries(this.params).every(([key, value]) => {
            if (!value) return true

            if (key === 'search') return Object.values(item).some(val => String(val).includes(value))

            if (/DateInterval$/.test(key) && Array.isArray(value) && value.length) {
              const _key = key.slice(0, -12)
              if (_key && item[_key]) return new Date(item[_key]) >= new Date(value[0]) && new Date(item[_key]) <= new Date(value[1])
            }

            if (!Object.prototype.hasOwnProperty.call(item, key)) return true
            return String(item[key]).includes(value)
          })
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
