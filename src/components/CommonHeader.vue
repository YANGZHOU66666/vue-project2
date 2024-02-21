<template>
  <el-header>
    <div class="l-content">
      <el-button size="small" @click="handleCollapse()">
        <el-icon :size="20"><Menu /></el-icon>
      </el-button>
      <router-link to="/home" class="first-breadcrumb" @click="toHome()"
        >首页</router-link
      >
      <span v-if="$store.state.currentMenu!=null" class="second-breadcrumb"> > {{ $store.state.currentMenu.label }}</span>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" :src="getImgSrc('user')" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { useStore } from "vuex";
import {useRouter} from 'vue-router'
const store = useStore();
const router = useRouter();
const getImgSrc = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};
const handleCollapse = () => {
  store.commit("updateIsCollapse");
};
/*const current = () => {
  return store.state.currentMenu;
};*/
const toHome = () => {
  store.commit("selectMenu", { name: "home" });
};
const handleLogOut=()=>{
  store.commit("logOutConfiguration");
  router.push({name:'login'});
}
</script>

<style>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #333;
  color: #fff;
}
.r-content .user {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.l-content {
  display: flex;
  align-items: center;
}

.l-content .el-button {
  margin-right: 20px;
}
.l-content .first-breadcrumb {
  color: #fff;
  font-size: medium;
  margin-right: 10px;
}
.l-content .second-breadcrumb {
  color: #bbb;
  font-size: medium;
  margin-right: 10px;
}
</style>
