# 通用后台管理项目

## 技术栈: Vue3 + Vite + ElementPlus + Vue-Router + Vuex + axios

本项目为个人学习所用，实现了后台管理的前端部分

**后端数据使用本地 Mock 和 Apifox 线上 Mock 随机生成两种模式模拟，故看上去可能有些怪异**

- 使用 Vue3 的 API+ElementPlus 组件库实现页面基础布局
- 通过 Vue-Router 实现不同页面路由跳转
- 通过 Vuex 实现左侧栏的伸缩、上方 tags 增删、用户登录状态缓存(以实现路由守卫)、左侧目录的保存
- 通过 axios 二次封装,集中处理请求前、请求后的特殊情况

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
