export default {
  data () {
    return {
      loadAfterCreated: true, // 加载后是否自动加载
      refreshToTop: true, // 是否刷新页面跳到顶部

      loading: false, // 加载中

      paging: { page: 1, size: 10 }, // 分页器
      filter: {}, // 搜索条件
      orders: [], // 排序

      total: 0,
      records: [],
      timer: null
    }
  },
  created () {
    if (this.loadAfterCreated) {
      this.updateRecordsByPage(1)
    }
  },
  computed: {
    startIndex () {
      return (this.paging.page - 1) * this.paging.size + 1
    }
  },
  methods: {
    // 请求服务
    async requestService (paging, filter, orders) {
      return { total: 0, records: [] }
    },

    // 刷新列表
    async updateRecords () {
      this.loading = true
      try {
        const filter = {}
        for (const key of Object.keys(this.filter)) {
          if (this.filter[key] != null) {
            filter[key] = this.filter[key]
          }
        }
        // 结束时间加一天
        if (filter.endCreateTime) {
          filter.endCreateTime = filter.endCreateTime + 24 * 60 * 60 * 1000 - 1000
        }
        if (filter.beginEndTime) {
          filter.beginEndTime = filter.beginEndTime + 24 * 60 * 60 * 1000 - 1000
        }
        if (filter.endEndTime) {
          filter.endEndTime = filter.endEndTime + 24 * 60 * 60 * 1000 - 1000
        }
        if (filter.endBeginTime) {
          filter.endBeginTime = filter.endBeginTime + 24 * 60 * 60 * 1000 - 1000
        }
        if (filter.endUpdateTime) {
          filter.endUpdateTime = filter.endUpdateTime + 24 * 60 * 60 * 1000 - 1000
        }
        if (filter.endTime) {
          filter.endTime = filter.endTime + 24 * 60 * 60 * 1000 - 1000
        }
        const result = await this.requestService(
          this.paging,
          filter,
          this.orders
        )
        if (result) {
          this.total = result.total || result.totalElements
          this.records =
            result.records ||
            result.list ||
            result.content ||
            result.data ||
            []
          if (this.refreshToTop) {
            typeof window !== 'undefined' && window.scrollTo(0, 0)
          }
        } else {
          this.total = 0
          this.records = []
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
      this.loading = false
    },

    // 跳转列表
    async updateRecordsByPage (page) {
      this.paging.page = page
      return this.updateRecords()
    },
    // 排序
    async sortRecords ({ prop, order }) {
      this.orders = []
      if (order) {
        this.orders.push({
          field: prop,
          desc: order === 'descending'
        })
      }
      return this.updateRecords()
    },

    handleCurrentChange (page) {
      return this.updateRecordsByPage(page)
    },

    handleSizeChange (size) {
      this.paging.size = size
      return this.updateRecordsByPage(1)
    },

    handleSortChange (column) {
      return this.sortRecords(column)
    }
  }
}
