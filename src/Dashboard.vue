
<template>
  <el-container class="dashboard">
    <el-aside width="255px">
      <el-menu
        router
        default-active="/books"
        text-color="#fff"
        active-text-color="#ffd04b"
        background-color="#545c64"
      >
        <el-menu-item
          v-for="itm in uiData.tabs"
          :key="itm.path"
          :index="itm.path"
        >
          {{ itm.meta.name }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { menus } from "./main";
const uiData = reactive({
  tabs: menus,
});
</script>
<style scoped>
.el-menu-item.is-active {
  background-color: #3370ff !important;
  color: #fff;
}
.el-aside {
  background-color: rgb(32, 34, 42) !important;
}
</style>>
<style>
.dashboard .el-menu-item {
  background-color: rgb(32, 34, 42);
}
</style>