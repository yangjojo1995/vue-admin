<template>
  <div class="page">
    <ym-table-list-card row-key="keyword" :data="data">
      <template slot="header-left">
        <el-page-header v-if="fatherValue !== null" @back="handleBack" :content="fatherLabel"></el-page-header>
      </template>

      <template slot="header-right">
        <ym-button v-if="$auth('create')" type="primary" size="medium" @click="handleCreateItem()">添加</ym-button>
      </template>

      <ym-table-column type="selection" width="56px" align="center" reserve-selection></ym-table-column>

      <ym-table-column type="index" label="序号" width="56px" align="center"></ym-table-column>
      <ym-table-column prop="keyword" label="名称" disabled-toggle>
        <el-link slot-scope="{ row }" type="primary" @click="handleClickItem(row)">{{ row.keyword }}</el-link>
      </ym-table-column>
      <ym-table-column prop="options" label="代码"></ym-table-column>

      <ym-table-column label="操作" min-width="100px" fixed="right">
        <template slot-scope="{ row }">
          <ym-link v-if="$auth('update')" type="primary" @click="handleUpdateItem(row)">编辑</ym-link>
          <ym-link v-if="$auth('delete') && row.state !== 0" type="danger" @click="handleDeleteItem(row)">删除</ym-link>
        </template>
      </ym-table-column>

    </ym-table-list-card>

    <DictionaryDialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      :parent="parent"
      @submit-success="handleDictionaryDialogSubmitSuccess()">
    </DictionaryDialog>
  </div>
</template>

<script>
import DictionaryDialog from './DictionaryDialog'
export default {
  components: { DictionaryDialog },
  props: {
    parent: { type: Object },
    data: { type: Array, default: () => [] }
  },
  data () {
    return {
      dialogVisible: false,
      dialogData: null
    }
  },
  computed: {
    fatherValue () {
      return this.parent && this.parent.dictionaryId
    },
    fatherLabel () {
      return this.parent && this.parent.keyword
    }
  },
  methods: {

    // 添加
    handleCreateItem () {
      this.dialogData = null
      this.dialogVisible = true
    },

    // 编辑
    handleUpdateItem (row) {
      this.dialogData = row
      this.dialogVisible = true
    },

    // 编辑
    handleClickItem (row) {
      this.$emit('click-row', row)
    },

    // 编辑
    async handleDictionaryDialogSubmitSuccess () {
      this.$emit('save-success')
    },

    // 删除
    handleDeleteItem (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        this.genderDictionarys = await this.$service.app.deleteDictionary({ dictionaryId: row.dictionaryId })
        this.$message.success('删除成功')
        this.$emit('delete-success')
      }).catch(() => {})
    },

    // 后退
    handleBack () {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.classify-item {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  border-radius: 4px;
  background-color: #eee;
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
