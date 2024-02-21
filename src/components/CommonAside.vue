<template>
  <div
    class="aside-cover"
    :style="{ width: $store.state.isCollapse ? '64px' : '180px' }"
  ></div>
  <el-aside :width="$store.state.isCollapse ? '64px' : '180px'">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      :collapse="$store.state.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="!$store.state.isCollapse">后台管理</h3>
      <h3 v-show="$store.state.isCollapse">管理</h3>
      <el-menu-item
        :index="item.path + ''"
        v-for="item in noChildren()"
        :key="item.path+''"
        @click="onClickMenu(item)"
      >
        <component :is="item.icon" class="icons"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
        :index="item.path+''"
        v-for="item in hasChildren()"
        :key="item.path"
      >
        <template #title>
          <component :is="item.icon" class="icons"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="subItem.path"
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            @click="onClickMenu(subItem)"
          >
            <component :is="subItem.icon" class="icons"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
/*const list = ref([
  {
    path: "/user",
    name: "user",
    label: "用户管理",
    icon: "user",
    url: "UserManage/UserManage",
  },
  {
    label: "其他",
    icon: "location",
    path: "/other",
    children: [
      {
        path: "/page1",
        name: "page1",
        label: "页面1",
        icon: "setting",
        url: "Other/PageOne",
      },
      {
        path: "/page2",
        name: "page2",
        label: "页面2",
        icon: "setting",
        url: "Other/PageTwo",
      },
    ],
  },
]);*/
const noChildren = () => {
  return asyncList.filter((item) => !item.children);
};
const hasChildren = () => {
  return asyncList.filter((item) => item.children);
};
const router = useRouter();
const onClickMenu = (item) => {
  router.push(item);
  store.commit("selectMenu", item);
};
const asyncList=store.state.menu;
</script>

<style>
.icons {
  width: 16px;
  height: 16px;
}
.el-aside {
  height: 100%;
  background-color: #545c64;
}
.el-menu {
  border-right: none;
}
.el-menu h3 {
  line-height: 48px;
  text-align: center;
  color: #fff;
}
.aside-cover {
  position: fixed;
  background-color: #545c64;
  height: 100%;
}
</style>
