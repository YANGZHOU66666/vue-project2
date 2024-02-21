<template>
  <div class="common-layout">
    <el-container style="flex-wrap: nowrap">
      <CommonAside />
      <el-container>
        <CommonHeader />
        <CommonTab />
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonHeader from "../components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
import CommonTab from "../components/CommonTab.vue";
</script>

<style lang="less" scoped>
.el-container {
  flex-wrap: wrap;
  align-items: flex-start;
}
.common-layout {
  height: 100%;
  & > .el-container {
    height: 100%;
  }
}
</style>
