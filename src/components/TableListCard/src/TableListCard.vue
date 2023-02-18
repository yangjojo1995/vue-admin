<template>
  <div class="table-list-card-container" :class="{ 'is-has-aside': isHasAside, 'is-inner': inner }">
    <div class="table-list-card">
      <div v-if="showHeader" class="table-list-card__header">
        <div class="table-list-card__header__left">
          <ym-link v-if="isHasAside" class="aside-button" slot="reference" type="text" @click.native="isShowAside = !isShowAside">
            <i class="el-icon-s-unfold" aria-hidden="true"></i>
          </ym-link>
          <ym-input class="table-list-card__header__input" v-if="showSearch" v-model="currentSearch" :placeholder="searchPlaceholder" @input="handleSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </ym-input>
          <slot name="header-left"></slot>
        </div>
        <div class="table-list-card__header__right">
          <slot name="header-right"></slot>
          <ym-popover v-if="enableFilterColumn" placement="bottom-end" trigger="click">
            <ym-link class="filter-button" slot="reference" type="text">
              <i class="ym-icon ym-icon-shezhi" aria-hidden="true"></i>
            </ym-link>
            <div class="filter-checkbox">
              <span class="filter-checkbox-tip">请选择列表中要展示的信息</span>
              <div class="filter-checkbox-inner">
                <ym-checkbox
                  v-for="(item, key) in currentOptions"
                  :key="key"
                  v-model="item.show"
                  :disabled="item.disabled"
                  :label="item.label">
                  <span :title="item.label" class="filter-checkbox-label">{{ item.label }}</span>
                </ym-checkbox>
              </div>
            </div>
          </ym-popover>
        </div>
      </div>
      <div v-loading="loading" class="table-list-card__body">
        <ym-table
          ref="table"
          :height="height"
          :max-height="maxHeight"
          :row-key="rowKey"
          :data="currentData"
          :cell-class-name="handleCellClassName"
          :default-expand-all="defaultExpandAll"
          :tree-props="treeProps"
          @row-click="handRowClick"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange"
          @expand-change="expandChange">
          <RenderTab :render="handleRenderTableSlots"></RenderTab>
        </ym-table>
      </div>
      <div v-if="isShowAllSelect||currentPage" class="table-list-card__footer">
        <div class="table-list-card__footer__left">
          <div v-if="isShowAllSelect" class="selected-box">
            <ym-checkbox class="selected-box__checkbox" :value="isAllSelected" :indeterminate="isAllIndeterminate" @input="toggleAllSelection()">
              <span>全选</span>
              <span v-if="selection.length">（{{selection.length}}）</span>
            </ym-checkbox>
            <slot
              v-if="selection.length"
              name="selected-tool"
              :selection="selection"
              :clearSelection="clearSelection"
              :toggleRowSelection="toggleRowSelection">
            </slot>
          </div>
        </div>
        <div class="table-list-card__footer__right">
          <ym-pagination
            ref="pagination"
            v-if="currentPage"
            background
            :layout="pagerLayout"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :pager-count="pagerCount"
            :total="currentTotal"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange">
          </ym-pagination>
        </div>
      </div>
    </div>
    <div v-if="isHasAside" class="table-list-card-container__aside">
      <ym-scrollbar class="ym-scrollbar">
        <slot name="aside"></slot>
      </ym-scrollbar>
    </div>
    <el-drawer v-if="isHasAside" :size="280" :show-close="false" :with-header="false" :visible.sync="isShowAside" direction="ltr">
      <slot name="aside"></slot>
    </el-drawer>
  </div>
</template>

<script>
import RenderTab from './RenderTab'
import debounce from '@/utils/debounce'

export default {
  components: {
    RenderTab
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String
    },
    defaultExpandAll: {
      type: Boolean
    },
    treeProps: {
      type: Object
    },
    height: {
      type: [String, Number]
    },
    maxHeight: {
      type: [String, Number]
    },
    pagerLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    currentPage: {
      type: Number
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      default: ''
    },
    searchPlaceholder: {
      type: String,
      default: '随便输入点什么'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showAllSelect: {
      type: Boolean,
      default: true
    },
    inner: {
      type: Boolean,
      default: false
    },
    enableFilterColumn: {
      type: Boolean,
      default: true
    },
    autoPaging: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentSearch: this.search,

      showFieldsViewFlag: false,
      currentOptions: {},

      isHasAside: false,
      isShowAside: false,

      isShowAllSelect: false,
      isAllSelected: false, // 全选
      isAllIndeterminate: false, // 全选（部分）
      selection: [] // 选择的值
    }
  },
  // 计算
  computed: {
    currentData () {
      if (this.autoPaging && this.currentPage && this.pageSize) {
        return this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      } else {
        return this.data
      }
    },
    currentTotal () {
      return this.total || this.data.length
    }
  },
  watch: {
    search (value) {
      this.currentSearch = value
    },
    currentSearch (value) {
      this.$emit('update:search', value)
    },
    total () {
      const pages = Math.ceil(this.total / this.pageSize)
      if (pages && this.currentPage > pages) {
        this.handleCurrentChange(pages)
      }

      // 解决el分页器内部参数不一致
      if (this.$refs.pagination && this.$refs.pagination.internalCurrentPage !== this.currentPage) {
        this.$refs.pagination.internalCurrentPage = this.currentPage
      }
    }
  },
  created () {
    this.updateStates()
    this.handleRenderTableSlots = this.handleRenderTableSlots.bind(this)
    this.handleSearch = debounce(this.handleSearch.bind(this), 200)
    this.updatedCurrentOptions = debounce(this.updatedCurrentOptions.bind(this), 200)
    this.handleCurrentChange = debounce(this.handleCurrentChange.bind(this), 200)
    this.handleSizeChange = debounce(this.handleSizeChange.bind(this), 200)
  },
  mounted () {
    this.updateStates()
  },
  updated () {
    this.updateStates()
  },
  methods: {

    // 更新状态
    updateStates () {
      this.updatedCurrentOptions()
      if (!this.$refs.table) return
      const states = this.$refs.table.store.states

      this.isHasAside = !!this.$slots.aside

      this.isShowAllSelect = this.showAllSelect && states.columns.some(column => column.type === 'selection')
      this.isAllSelected = states.isAllSelected
      this.isAllIndeterminate = states.selection.length > 0 && !states.isAllSelected
      this.selection = states.selection
    },

    // 更新筛选器
    updatedCurrentOptions () {
      const currentOptions = this.currentOptions

      const vnodes = this.$slots.default.filter(vnode => {
        if (!vnode.componentOptions) return false
        if (!vnode.componentOptions.propsData) return false
        const { type, prop, label } = vnode.componentOptions.propsData
        if (type === 'selection') this.showSelectionFlag = true
        return prop && label
      })

      // 删除旧数据
      for (const prop of Object.keys(currentOptions)) {
        const vnode = vnodes.find(item => item.componentOptions.propsData.prop === prop)
        if (!vnode) this.$delete(currentOptions, prop)
      }

      let showFieldsViewFlag = false
      for (const vnode of vnodes) {
        const { prop, label } = vnode.componentOptions.propsData
        const { toggle, 'disabled-toggle': disabled } = vnode.data.attrs
        if (typeof hide !== 'undefined' && !showFieldsViewFlag) {
          showFieldsViewFlag = true
        }

        if (currentOptions[prop]) {
          Object.assign(currentOptions[prop], {
            prop: prop,
            label: label,
            show: currentOptions[prop].show,
            disabled: currentOptions[prop].disabled
          })
        } else {
          this.$set(currentOptions, prop, {
            prop: prop,
            label: label,
            show: toggle === true || toggle === 'true' || typeof toggle === 'undefined',
            disabled: disabled === true || disabled === 'true' || disabled === ''
          })
        }
      }

      this.showFieldsViewFlag = showFieldsViewFlag

      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout()
      })
    },

    // 切换选择全部
    toggleAllSelection () {
      if (!this.$refs.table) return
      this.$refs.table.toggleAllSelection()
    },

    // 关闭侧边
    closeAside () {
      this.isShowAside = false
    },

    // 清空选择
    clearSelection () {
      return this.$refs.table && this.$refs.table.clearSelection()
    },

    // 切换选择
    toggleRowSelection (row, selected) {
      return this.$refs.table && this.$refs.table.toggleRowSelection(row, selected)
    },

    // 行点击
    handRowClick (event) {
      this.$emit('row-click', event)
    },

    // 渲染表格项
    handleRenderTableSlots () {
      this._children = this.$slots.default.filter((vnode, index) => {
        if (!vnode.componentOptions) return false
        if (!vnode.componentOptions.propsData) return false
        const { prop } = vnode.componentOptions.propsData
        vnode.key = prop || index
        return this.currentOptions[prop] ? this.currentOptions[prop].show : true
      })
      return this._children
    },

    // 单元格 class
    handleCellClassName ({ columnIndex }) {
      if (!this._children) this.handleRenderTableSlots()
      const slot = this._children[columnIndex]
      if (slot && slot.componentOptions.children && !slot.data.scopedSlots) {
        return 'is-default-formatter'
      }
      return ''
    },

    // 排序
    handleSortChange (event) {
      this.$emit('sort-change', event)
    },

    // 选择改变时
    handleSelectionChange (event) {
      this.$nextTick(this.updateStates)
      this.$emit('selection-change', event)
    },
    // 展开
    expandChange (event) {
      this.$emit('expand-change', event)
    },
    // 搜索
    handleSearch (value) {
      this.$emit('search', value)
    },

    // 分页发生变化时
    handleCurrentChange (value) {
      this.$emit('update:current-page', value)
      this.$emit('current-change', value)
    },

    // 分页大小发生变化时
    handleSizeChange (value) {
      this.$emit('update:page-size', value)
      this.$emit('size-change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list-card {
  position: relative;
  width: 100%;
  box-shadow: $--ym-box-shadow-base;
  border-radius: $--ym-card-border-radius;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &__header {
    flex-shrink: 0;
    flex-grow: 0;
    width: 100%;
    min-height: 48px;
    padding: 24px;
    // min-height: 96px;
    // padding-left: 24px;
    // padding-right: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    overflow: auto;
    white-space: nowrap;
    &__left {
      flex: 1;
    }
    &__right {
      flex: 1;
      text-align: right;
      .el-button {
        margin-left: 32px;
      }
    }
    &__input {
      max-width: 240px;
      min-width: 160px;
    }
  }

  &__body {
    flex-shrink: 1;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 8px;
  }

  &__footer {
    flex-shrink: 0;
    flex-grow: 0;
    // border-top: 1px solid rgba(145, 158, 171, 0.24);
    width: 100%;
    min-height: 65px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    overflow: auto;;
    &__left {
      flex: 1;
      flex-grow: 1;
      flex-shrink: 1;
      padding-left: 20px;
      white-space: nowrap;
      .el-checkbox {
        margin-right: 10px;
      }
    }
    &__right {
      flex: 1;
      flex-grow: 1;
      flex-shrink: 1;
      text-align: right;
    }
  }

  &::v-deep {
    .el-table {
      height: 100%;
    }
    .is-default-formatter .cell {
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

.selected-box__checkbox {
  vertical-align: middle;
  line-height: 22px;
  &::v-deep {
    .el-checkbox__input {
      line-height: 0;
      vertical-align: middle;
    }
    .el-checkbox__label {
      vertical-align: middle;
    }
  }
}

.filter-checkbox {
  display: inline-block;
  .filter-checkbox-tip {
    display: block;
    color: $--ym-text-color-secondary;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .filter-checkbox-inner {
    overflow: auto;
    max-height: 560px;
  }
  .filter-checkbox-label {
    display: block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-checkbox {
    display: block;
    line-height: 32px;
    margin: 0;
    &::v-deep {
      .el-checkbox__input {
        vertical-align: middle;
      }
      .el-checkbox__label {
        vertical-align: middle;
      }
    }
  }
}

.filter-button {
  color: $--ym-text-color-regular;
  transition: all 0.3s;
  margin-left: 24px;
  i {
    font-size: 16px;
  }
  &:hover {
    transform: scale(1.1);
    color: $--ym-color-primary;
  }
  &:active {
    transform: scale(1);
  }
}

.aside-button {
  color: $--ym-text-color-regular;
  transition: all 0.3s;
  margin-right: 24px;
  i {
    font-size: 16px;
  }
  &:hover {
    transform: scale(1.1);
    color: $--ym-color-primary;
  }
  &:active {
    transform: scale(1);
  }
}

.ym-scrollbar {
  width: 100%;
  height: 100%;
}

.table-list-card-container {
  position: relative;
  .aside-button {
    display: none;
  }
  .table-list-card {
    height: 100%;
  }

  &.is-has-aside {
    @media screen and (min-width: 1024px) {
      .table-list-card-container__aside {
        position: absolute;
        border-top-left-radius: $--ym-card-border-radius;
        border-bottom-left-radius: $--ym-card-border-radius;
        top: 0;
        bottom: 0;
        left: 0;
        width: 280px;
        z-index: 1;
        border-right: 1px solid $--ym-color-grey-4;
        box-sizing: border-box;
        background-color: #fff;
      }
      .table-list-card {
        padding-left: 280px;
      }
    }
    @media screen and (max-width: 1023px) {
      .table-list-card-container__aside {
        display: none;
      }
      .aside-button {
        display: inline-block;
      }
    }
  }

  &.is-inner .table-list-card {
    box-shadow: none;
    border: solid 1px $--ym-color-grey-4;
    .table-list-card__header + .table-list-card__body {
      margin-bottom: 0;
    }
    .table-list-card__body {
      margin-top: 12px;
    }
  }
}

</style>
