<template>
  <div class="project" v-if="Object.keys(projectMembers).length>0">

    <div class="title">团队成员</div>
    <el-table :data="projectMembers" border style="width: 100%">
      <el-table-column prop="image" label="头像" width="120">
        <span slot-scope="{ row }">
          <el-image v-if="row.image" :src="$assets(row.image)" :preview-src-list="[$assets(row.image)]"></el-image>
          <img class="image" v-else src="@/assets/images/global/user-avatar.png" alt="团队成员头像" />
        </span>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="160"> </el-table-column>
      <el-table-column prop="position" label="职业" width="120"> </el-table-column>
      <el-table-column prop="profile" label="简介"> </el-table-column>
    </el-table>

  </div>
</template>

<script>

export default {
  components: {},
  props: {
    projectMembers: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./project-css.scss";

.image{
  width: 100px;
}
</style>
