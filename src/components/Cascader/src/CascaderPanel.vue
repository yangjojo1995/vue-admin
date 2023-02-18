<template>
  <el-cascader-panel
    v-model="path"
    :separator="separator"
    :filterable="filterable"
    :props="currentProps"
    :disabled="disabled"
    :options="options"
    :clearable="clearable"
    :placeholder="currentPlaceholder">
    <span slot="hide"></span>
  </el-cascader-panel>
</template>

<script>
import Cascader from './Cascader'
export default {
  extends: Cascader
}
</script>
