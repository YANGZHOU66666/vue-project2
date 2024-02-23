# vue_project2记录

## vite创建项目

创建项目：

```
yarn create vite vue_project2 --template vue
```

安装依赖：

```
cd vue_project2
yarn install
```

启动：

```
yarn dev
```

## 引入ElementPlus

+ 先安装：

```
yarn add element-plus
```

+ 然后引入：

完整引入：会导致打包后的文件偏大

```javascript
//main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app=createApp(App);
app.use(ElementPlus)
app.mount('#app')
```

自动引入：推荐

先安装：

```javascript
npm install -D unplugin-vue-components unplugin-auto-import
```

再引入：

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

## 引入vue-router

在src文件夹下新建views文件夹（用于存放组件）和router文件夹（用于放路由设置）

+ 复习一下router下index.js的配置：

首先引入createRouter和createWebHashHistory的API:

```javascript
import { createRouter,createWebHashHistory } from "vue-router"
```

路由数组解构：

```javascript
const routes=[
    {
        path:'/',
        component:()=>import('../views/Main.vue'),
        children:[
            {
                path:'/',
                name:'home',
                component:()=>import('../views/home/Home.vue')
            }
        ]
    }
]
```

创建`router`对象并导出：

```javascript
const router=createRouter({
    history:createWebHashHistory(),
    routes
})

export default router
```

按层次在`App.vue`和`Main.vue`中放入\<router-view>

注意这里分两层，一层是根，根下面的children数组是第二层

## 整体布局实现

在ElementUI官网上找到相应布局即可

（下面示例同时展示了\<router-view>位置和布局）

```vue
<!--Main.vue-->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
            <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
```

```vue
<!--App.vue-->
<template>
  <router-view/>
</template>
```

## Header顶栏实现

### Header1-图标引入

找到`Main.vue`中\<el-header>的位置，放上从`CommonHeader.vue`引入的组件，注意\<el-header>标签放在组件里而非原位置

引入图标，在ElementUI官网上找即可

```vue
<!--Commonheader.vue-->
<template>
  <el-header>
    <div class="l-content">
        <el-button size="small">
            <el-icon :size="20"><Menu/></el-icon>
        </el-button>
      
    </div>
    <div class="r-content"></div>
  </el-header>
</template>
```

```vue
<!--Main.vue-->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
      </el-aside>
      <el-container>
        <CommonHeader/>
        <el-main>
            <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
```

### Header2-右侧下拉菜单的实现

从ElementPlus官网找到dropdown，按照语法规则引入即可

```html
<div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" src="../assets/user.png" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
</div>
```

### 调整Header处布局

此时.el-header的盒子布局相当的乱（里面有一个.l-container和一个.r-container，div默认换行，且大小未设置，呈如下状）

![](./assets/vue_project2_1.png)

对.el-header进行盒子布局，让.l-container靠左，r-container靠右并在同一行：

```css
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
}
```

这时下方出现了滑动栏，查询页面元素后发现是Home.vue组件到.el-header后面去了，说明它们的父组件是没换行的flex盒子

对其进行如下改动：

```css
.el-container{
  flex-wrap: wrap;
}
```

## 动态引入资源

从vite官网上找到：

`new URL()`方法：第一个参数为相对路径，第二个参数为当前路径

```javascript
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

然后在HTML中引入即可：

```HTML
<img class="user" :src="getImgSrc('user')" />
```

## 左侧菜单实现

### 引入el-menu

```html
<el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
>
    <el-menu-item index="2">
    <el-icon><icon-menu /></el-icon>
    <span>Navigator Two</span>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
     <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
     </el-menu-item-group>
     <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
     </el-menu-item-group>
     <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>

</el-menu>
```

### 用for循环将el-menu重构

首先写两个方法帮助确定应该写在el-menu-item里还是el-sub-item中：

```javascript
const noChildren = () => {
  return list.filter((item) => !item.children);
};
const hasChildren = () => {
  return list.filter((item) => item.children);
};
```

引入html中：

```html
<el-menu
  class="el-menu-vertical-demo"
  background-color="#545c64"
  text-color="#fff"
  :collapse="false"
>
  <el-menu-item
    :index="item.path"
    v-for="item in noChildren()"
    :key="item.path"
  >
    <component :is="item.icon" class="icons"></component>
    <span>{{ item.label }}</span>
  </el-menu-item>
  <el-sub-menu
    :index="item.path"
    v-for="item in hasChildren()"
    :key="item.path"
  >
    <template #title>
      <component :is="item.icon" class="icons"></component>
      <span>{{ item.label }}</span>
    </template>
    <el-menu-item-group>
      <el-menu-item
        :index="1 - 1"
        v-for="(subItem, subIndex) in item.children"
        :key="subIndex"
      >
        <component :is="subItem.icon" class="icons"></component>
        <span>{{ subItem.label }}</span>
      </el-menu-item>
    </el-menu-item-group>
  </el-sub-menu>
</el-menu>
```

### icon的动态引入

```html
<component :is="item.icon" class="icons"></component>
```

\<component>标签的is属性可以用来引入外部组件

## 基础样式整理实现

### 引入`reset.less`

在assets下开less文件夹，放入index.less和reset.less

index.less是所有less文件的汇总，便于管理，如下引入reset.less：

```less
@import "./reset.less";
```

再在main.js中引入：

```javascript
import './assets/less/index.less'
```

这时出现了报错：

```
[vite] Internal server error: Preprocessor dependency "less" not found. Did you install it? Try `yarn add -D less`.
```

安装less依赖后成功解决

**成功引入reset.less后，浏览器与组件之间的缝隙没有了**

### 调整几个大盒子的高度

首先是最外层的#app：

```css
/*App.vue*/
#app{
  height:100%;
}
```

其次是.common-layout和它的孩子.el-container：

```css
/*Main.vue*/
.common-layout {
  height: 100%;
  & > .el-container {
    height: 100%;
  }
}
```

最后是el-aside，它还需要背景色和menu一致：

```css
/*CommonAside.vue*/
.el-aside{
  height: 100%;
  background-color: #545c64;
}
```

### 一些细节的调整

+ 首先发现home组件跑到header右边了，（原因是右侧的.el-container盒子模型不换行，改成`flex-wrap:wrap`）

+ .el-menu有右边距，去掉：

```css
.el-menu{
  border-right:none;
}
```

+ home和.el-header之间有一块空白：这是由于它们的父元素.el-container是flex盒子，默认align-items为stretch导致。将align-items换成flex-start即可靠交叉轴起始位置对齐

```css
.el-container {
  flex-wrap: wrap;
  align-items: flex-start;
}
```

## vuex实现左侧菜单伸缩

需求：通过Menu按钮实现控制菜单的展开和收缩。当菜单展开时，宽度180px；收缩时，宽度64px

实现：el-menu默认有collapse的值实现伸缩。用vuex控制这个值的变化，同时在width处设置逻辑

+ 配置vuex：

```javascript
//store/index.js
import { createStore } from "vuex";
const store=createStore({
    state:{
        isCollapse:false,
    },
    mutations:{
        updateIsCollapse(state, payload){
            state.isCollapse=!state.isCollapse;
        }
    }
});
export default store
```

+ 在main.js中使用：

```javascript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

import './assets/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app=createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router).use(store)
app.mount('#app')
```

+ 在el-menu处用store.state控制值：

```html
<el-aside :width="$store.state.isCollapse ? '64px' : '180px'">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      :collapse="$store.state.isCollapse"
      :collapse-transition="false"
    >
```

+ 在button处声明新函数，同时获取store对象，调用相关方法

```javascript
import { useStore } from "vuex";
const store = useStore();
const handleCollapse = () => {
  store.commit("updateIsCollapse");
};
```

```html
<el-button size="small" @click="handleCollapse">
    <el-icon :size="20"><Menu /></el-icon>
</el-button>
```

## 用router实现左侧菜单路由跳转

用useRouter()获取router对象，router.push()可以跳转路由，和\<router-link to="">是一样的，这里由于标签已经设计好，不用\<router-link>

注意这里跳转的路由必须在createRouter中声明过，故createRouter()的参数routes数组应该改为如下：

```javascript
const routes=[
    {
        path:'/',
        component:()=>import('../views/Main.vue'),
        redirect:'/home',
        children:[
            {
                path:'/home',
                name:'home',
                component:()=>import('../views/home/Home.vue')
            },
            {
                path:'/user',
                name:'user',
                component:()=>import("../views/user/User.vue")
            },
            {
                path:'/page1',
                name:'page1',
                component:()=>import("../views/Page1.vue")
            },
            {
                path:'/page2',
                name:'page2',
                component:()=>import("../views/Page2.vue")
            }
        ]
    }
]
```

将相关函数放入html中：

```vue
<template>
  <el-menu-item
    :index="item.path"
    v-for="item in noChildren()"
    :key="item.path"
    @click="onClickMenu(item)"
  >
  <el-menu-item
      :index="1 - 1"
      v-for="(subItem, subIndex) in item.children"
      :key="subIndex"
      @click="onClickMenu(subItem)"
  >
</template>
<script setup>
const router=useRouter();
const onClickMenu=(item)=>{
  router.push(item);
}
</script>
```

## home内容实现

### 栅格布局、.el-table的使用

基本是用ElementUI的简单实现，均为细节，代码如下：

```vue
<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.png" />
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <template #footer>
          <div class="login-info">
            <p>上次登陆时间:<span>2022-7-11</span></p>
            <p>上次登陆地点:<span>Beijing</span></p>
          </div>
        </template>
      </el-card>
      <el-card style="margin-top: 20px" shadow="hover">
        <el-table :data="tableData">
          <el-table-column v-for="(val,key) in tableLabel" :prop="key" :label="val" :key="key"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px"></el-col>
  </el-row>
</template>

<script setup>
const tableData = [
  {
    name: "oppo",
    todayBuy: 500,
    monthBuy: 3500,
    totalBuy: 22000,
  },
  {
    name: "vivo",
    todayBuy: 300,
    monthBuy: 2200,
    totalBuy: 24000,
  },
  {
    name: "苹果",
    todayBuy: 800,
    monthBuy: 4500,
    totalBuy: 65000,
  },
  {
    name: "小米",
    todayBuy: 1200,
    monthBuy: 6500,
    totalBuy: 45000,
  },
  {
    name: "三星",
    todayBuy: 300,
    monthBuy: 2000,
    totalBuy: 34000,
  },
  {
    name: "魅族",
    todayBuy: 350,
    monthBuy: 3000,
    totalBuy: 22000,
  },
];
const tableLabel = 
  {
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
  }
;
</script>

<style lang="less">
.home {
  .user {
    display: flex;
    align-items: center;
  }
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }
}
.login-info {
  p {
    line-height: 30px;
    font-size: 14px;
    color: #999;
    span {
      margin-left: 60px;
      color: #666;
    }
  }
}
</style>
```

## 本地mock和线上mock的使用

**mock：**用于模拟后端发送请求，用于当后端还没有给具体接口数据时前端先测试

先安装mock依赖、axios依赖：

```
cnpm install mockjs -S
cnpm install axios -S
```

### 本地mock

#### 配置mock

src下新建api文件夹，api文件夹下放mockData文件夹和mock.js作为总配置文件；mockData文件夹放测试数据。这里先放一个home.js如下：

```javascript
export default {
    getHomeData:()=>{
        return {
            code:200,
            data:{
                tableData:[
                    {
                      name: "oppo",
                      todayBuy: 500,
                      monthBuy: 3500,
                      totalBuy: 22000,
                    },
                    {
                      name: "vivo",
                      todayBuy: 300,
                      monthBuy: 2200,
                      totalBuy: 24000,
                    },
                    {
                      name: "苹果",
                      todayBuy: 800,
                      monthBuy: 4500,
                      totalBuy: 65000,
                    },
                    {
                      name: "小米",
                      todayBuy: 1200,
                      monthBuy: 6500,
                      totalBuy: 45000,
                    },
                    {
                      name: "三星",
                      todayBuy: 300,
                      monthBuy: 2000,
                      totalBuy: 34000,
                    },
                    {
                      name: "魅族",
                      todayBuy: 350,
                      monthBuy: 3000,
                      totalBuy: 22000,
                    },
                ]
            }
        }
    }
}
```

export一个函数组成的对象，作为返回数据的接口

再在mock.js中拦截请求：

```javascript
import Mock from 'mockjs'
import homeApi from './mockData/home.js'
//拦截请求
Mock.mock('/home/getData', homeApi.getHomeData)
```

这样，mock就配置好了，可以在vue文件中模拟接收请求了

#### 在Home.vue中模拟

```javascript
import { onMounted, ref} from 'vue';
import axios from "axios";
const tableData = ref([]);//ref的数据才能和DOM中的动态绑定
const getTableList=async ()=>{
  await axios.get('/home/getData').then((res)=>{
    tableData.value=res.data.data.tableData;
  });//用mock的接口模拟请求返回的数据
}
onMounted(() => {//生命周期钩子，一挂载好就下载数据
  getTableList();
});
```

### 线上mock

+ 这里使用apifox

创建新接口->设置接口的基本格式，然后就可以自动生成满足条件的json数据了。

保存后会给一个URL，拿这个URL直接发请求即可

如下：

```javascript
const getTableList=async ()=>{
  await axios.get('http://127.0.0.1:4523/m1/4022542-0-default/getTableData').then((res)=>{
    tableData.value=res.data.data.tableData;
  });
}
```

相比上例，仅仅修改了get()的参数，效果相同

## 二次封装axios

### 原因

**统一管理接口：**多个axios请求会有一部分相同的地方（如请求头、返回数据对状态码的分类讨论等），这时如果每个请求重新写一遍这些东西，会很麻烦。

### 操作

+ src/api文件夹下新建request.js文件

+ src文件夹下新建config文件夹，内建index.js文件作为环境配置文件

一般在企业级项目里面有三个环境：开发环境、测试环境、线上环境

配置文件用于请求前选择环境、选择mockAPI的前缀：

```javascript
/*
* config/index.js 环境配置文件
* 一般在企业项目里有三个环境：开发环境、测试环境、线上环境
*/

//当前的环境
const env=import.meta.env.MODE || 'prod'
const EnvConfig = {
    development:{//开发环境
        baseApi: '/api',
        mockApi: 'http://127.0.0.1:4523/m1/4022542-0-default/'
    },
    test:{//测试环境
        baseApi: '//test.future.com/api',
        mockApi: 'http://127.0.0.1:4523/m1/4022542-0-default/'
    },
    production:{//生产环境
        baseApi: '//future.com/api',
        mockApi: 'http://127.0.0.1:4523/m1/4022542-0-default/'
    }
}
export default{
    env,
    mock:true,//mock的总开关
    ...EnvConfig[env]//baseApi和mockApi
}
```

#### 追加更新

apifox支持云端mock，将上述mockApi的值换成`https://mock.apifox.com/m1/4022542-0-default`

+ src/api文件夹下新建request.js，作为封装的核心函数

创建axios实例对象->对请求前、请求后的数据做统一处理->request具体封装（调整参数中信息封装到axios对象中并返回），将request接口导出，作为统一封装函数

```javascript
//request.js
import axios from 'axios'
import config from '../config/index.js'
import { ElMessage } from 'element-plus'
const NETWORK_ERROR_MSG = '网络请求异常，请稍后重试.....'
//创建一个axios实例对象
const service = axios.create({
  baseURL:config.baseApi,
})

//在请求之前做一些事情
service.interceptors.request.use((req)=>{
  //可以自定义header
  // jwt-token认证的时候
  return req
})

// 在请求之后做一些事情
service.interceptors.response.use((res)=>{
  const {status,data,msg}=res;//这里mock的状态码是status
  if(status==200){
    return data;
  }else{
    //网络请求错误
    ElMessage.error(msg||NETWORK_ERROR_MSG)
    return Promise.reject(msg||NETWORK_ERROR_MSG)
  }
})

//封装的核心函数
function request(options){
  //处理大小写
  options.method=options.method||'get';
  if(options.method.toLowerCase()=='get'){
    options.params=options.data;
  }
  //对mock的处理
  let isMock = config.mock;
  if(typeof options.mock !== 'undefined'){
    isMock = options.mock;
  }
  //对线上环境做处理
  if(config.env=='prod'){
    service.defaults.baseURL=config.baseApi;//线上环境不允许mock，所以只用baseApi
  } else{
    service.defaults.baseURL=isMock?config.mockApi:config.baseApi;
  }

  return service(options)
}

export default request
```

+ src/api文件夹下创建api.js文件，用于放vue组件可以直接调用的接口函数

```javascript
/*
 * 整个项目api管理
*/
import request from './request'
export default{
    getTableData(params){
        return request({
            url:'/getTableData',
            method:'get',
            data:params,
            mock:true
        })
    },
    getCountData(params){
        return request({
            url:'/getCountData',
            method:'get',
            data:params,
            mock:true
        })
    }
}
```

+ main.js中挂载到全局：

```javascript
import api from './api/api.js'
app.config.globalProperties.$api=api
```

这样就可以在vue文件里调用这些api了！

如上一例，如下：

```javascript
const getTableList = async () => {
  await proxy.$api.getTableData().then((res) => {
    tableData.value = res.data.tableData;
  });
};
```

等效于之前的用axios直接调用云api

## 右上角卡片实现

数据部分处理类似于左下角，略





## Echarts添加

数据部分略，对echarts官方文档crud即可。

+ 值得注意的是，放echarts的div必须要用style=""设置宽高，否则会报错。但这里只设置了高也可以了，很奇怪（可能是由于弹性盒子中宽度可以唯一确定而高度不能？）

```javascript
<div ref="echart" style="height: 280px"></div>
```

+ vue不用传统的getElementById这种DOM语法，而是用ref取而代之，如下：

```vue
<div ref="echart" style="height: 240px"></div>
<script>
    let hEchart = echarts.init(proxy.$refs.echart);//获取DOM元素
</script>
```

#### 追加更新

这里增加chart后，height超了浏览器大小，右侧出现滚动条了。下拉滚动条，左侧设为高度100%的侧栏下方出现空白

+ 解决方法：

左侧增加`height:100%;position:fixed`的盒子，悬浮在画面下面遮挡住

```vue
<div class="aside-cover" :style="{width:$store.state.isCollapse ? '64px' : '180px'}">
</div>
<style>
.aside-cover {
  position: fixed;
  background-color: #545c64;
  height: 100%;
}
</style>
```

## 面包屑的实现

试图跟着教程用elementPlus自带的面包屑，但用起来很难，不知道怎么调整字体颜色，故自己从头手搓

+ 使用vuex管理当前路由，从CommonHeader中获取store.state并渲染到页面上

+ 点击“首页”可以返回首页

具体实现：用\<router-link>写到首页的标签（因为首页一定存在），在后面用\<span>写一级路径（由于这里路径只有一层，故不需要跳转了）

```javascript
//store.js
const store=createStore({
    state:{
        currentMenu:null,
    },
    mutations:{
        selectMenu(state,val){
            if(val.name==='home'){
                state.currentMenu=null;
                
            }else{
                state.currentMenu=val;
            }
        },
    }
});
```

`CommonHeader.vue`中获取vuex状态，并渲染到页面上：

（line1含义：点击“首页”跳转到首页，并将vuex容器中currentMenu设为空，通过selectMenu方法来实现）

（line2含义：当vuex容器的currentMenu不为null时（说明现在不在主页），显示处当前页面的面包屑）

```vue
<router-link to="/" class="first-breadcrumb" @click="toHome()">首页</router-link>
<span v-if="$store.state.currentMenu!=null" class="second-breadcrumb"> > {{$store.state.currentMenu.label }}</span>
<script>
import { useStore } from "vuex";
const store = useStore();
const toHome = () => {
  store.commit("selectMenu", { name: "home" });//将vuex容器的currentMenu改为null
};
</script>
```

## CommonHeader下侧tags实现

+ 新增CommonTab.vue组件放在Main下

+ tag的添加和删除均需要借助vuex

具体逻辑：

+ 添加逻辑：任一种页面跳转如果跳转到tag里没有的页面，需要新加tag（向vuex容器的数组里push）

+ 跳转逻辑：向router中push对应tag即可，同时应**调用selectMenu以保证面包屑正确显示**

+ 删除逻辑：vuex容器中tagsList数组删除对应tag；如果删除的不是当前页面，不用干其他事；如果删除的刚好是当前显示的页面，需强制跳转到另一个页面（否则会出现tag删除而页面还在这里的情况）

实现：

```javascript
//store/index.js
import { createStore } from "vuex";
const store=createStore({
    state:{
        isCollapse:false,
        currentMenu:null,
        tagsList:[
            {
                path:'/',
                name:'home',
                label:'首页',
                icon:'home'
            }
        ]
    },
    mutations:{
        updateIsCollapse(state, payload){
            state.isCollapse=!state.isCollapse;
        },
        selectMenu(state,val){
            if(val.name==='home'){
                state.currentMenu=null;
            }else{
                state.currentMenu=val;
                let res=state.tagsList.findIndex(item=>item.name==val.name);
                if(res==-1){//如果要跳转的页面不在tags里，push进去
                    state.tagsList.push(val);
                }
            }
        },
        closeTag(state,val){//在tags里删除对应tag
            let index=state.tagsList.findIndex(item=>item.name==val.name);
            state.tagsList.splice(index,1);
        }
    }
});
export default store
```

```vue
<!--CommonTab.vue-->
<template>
  <div class="tags">
    <el-tag
      :key="tag.name"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const route = useRoute();
const tags = store.state.tagsList;
const changeMenu = (item) => {
  router.push({
    name: item.name,
  });
  store.commit("selectMenu", item); //***很重要，把面包屑的currentMenu改成正确的***
};
const handleClose = (tag, index) => {
  let len = tags.length - 1;
  //处理vuex中的tagsList
  store.commit("closeTag", tag);
  //做第一个判断
  if (tag.name !== route.name) {
    //删除tag的不等于当前的路径
    return;
  }
  if (index === len) {
    //当删除的是最后一项且是自己
    router.push({
      name: tags[index - 1].name, //自己的前一项
    });
    store.commit("selectMenu", tags[index - 1]);//一定记得更新面包屑！
  } else {
    //当删除的不是最后一项且是自己
    router.push({
      name: tags[index].name, //自己的后一项
    });
    store.commit("selectMenu", tags[index]);//一定记得更新面包屑！
  }
};
</script>
<style lang="less" scoped>
.tags {
  padding: 20px;
  width: 100%;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
```

之后正常将组件导入main中即可

## User组件表格实现

`onMounted()`之后向后端请求数据，对设计图CRUD即可



## 用户添加表单实现

注意.el-select的宽度必须要手动设置el-form才可以，否则不会变、不会显示placeholder的内容（算是elementPlus没优化好的地方）

样式实现部分基本是对UI进行CRUD，不展开了

由于没有后端无法模拟上传，提交数据部分只写一个空函数`submitToServer()`。

注意.el-form刚开始没设置`:model="userFormData"`所以不能对表格全局调用一些东西，后面加了之后好了

每次提交数据时需要清空表单+更新表格，故作以下处理：（获取.el-form DOM，清空表格）

```javascript
proxy.$refs.userForm.resetFields();
```

检验数据：按照elementPlus中的语法规则对每个.el-form-item进行设置，然后通过调用.el-form的validate()方法即可

点击提交按钮后应调用的方法：

```javascript
const onSubmitUserData = () => {
  //提交用户数据
  proxy.$refs.userForm.validate(async (valid) => {
    if (valid) {
      userFormData.birth = toFormatTime(userFormData.birth); //将生日全部标准化为字符串
      await submitToServer(userFormData).then((res) => {
        //模拟上传至后端成功
        console.log(res);
        //本地数据添加，深拷贝新对象(没想到其他好方法，如果直接unshift(userFormData)会导致指向同一块内存)
        tableData.value.unshift(JSON.parse(JSON.stringify(userFormData)));
        config.total++;
        //这里用.el-form表单自带的resetFields()清空表单中数据
        proxy.$refs.userForm.resetFields();
      });
    }
  });
};
```

#### 追加更新

在提交表单检验不合法后弹出提示框，使用ElMessage，但是不显示。最后发现问题是当使用vue自动引入时再import {ElMessage}就会出问题。



## 用户编辑表单实现

由于弹出框的UI和添加基本是一样的，故沿用添加的`dialog`框，新增一个变量action用于判断应该弹出的是添加还是编辑用户

```javascript
const action = ref("add");
```

action影响的有二：一是dialog上的标题会变为"编辑用户"，二是提交数据时onSubmitUserData逻辑不一样。

**关键点：**点击编辑按钮onDispayEditUser()后的逻辑实现，必须使用$nextTick()

```javascript
const onDisplayEditUser = (res) => {
  //打开编辑窗口，进行必要设置
  action.value = "edit";
  dialogVisible.value = true;
  proxy.$nextTick(() => {
    Object.assign(userFormData, res.row); //将用户数据放在绑定区中
    curIndex.value = res.$index;
  });
};
```



## 追加更新

+ 不知道怎么回事突然发现性别一栏显示的是0和1？（可能是之前就没弄好，还是哪一次弄坏了？）

解决方案：直接从源头上改了，设置数据时直接设为"男"和"女"，

```javascript
const getCurrentDisplayData = () => {
  //获取当前应该展示的一页数据(包含搜索/非搜索情况)
  if (config.name == "") {
    //如果不进行搜索，展示所有数据
    let resData = tableData.value.slice(
      (config.page - 1) * itemInOnePage,
      config.page * itemInOnePage
    );
    return resData;
  } else {
    //搜索栏有字符串，展示符合的数据
    let searchRes = tableData.value.filter((item) => {
      return item.name.indexOf(config.name) != -1;
    });
    let num = searchRes.length;
    config.total = num;
    let curRes = searchRes.slice(
      (config.page - 1) * itemInOnePage,
      config.page * itemInOnePage
    );
    })
    return curRes;
  }
};
```

+ 报错：

```
[Vue warn]: Invalid prop: type check failed for prop "index". Expected String | Null, got Number with value 0. 
  at <ElMenuItem index=0 key=0 onClick=fn<onClick> > 
  at <ElMenuItemGroup> 
  at <BaseTransition onBeforeEnter=fn<onBeforeEnter> onEnter=fn onAfterEnter=fn<afterEnter>  ... > 
  at <Transition name="el-collapse-transition" onBeforeEnter=fn<beforeEnter> onEnter=fn<enter>  ... > 
  at <ElCollapseTransition > 
  at <ElSubMenu index="/other" key="/other" > 
  at <ElMenu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"  ... > 
  at <ElAside width="180px" > 
  at <CommonAside> 
  at <ElContainer style= {flex-wrap: 'nowrap'} > 
  at <Main onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< undefined > > 
  at <RouterView> 
  at <App>
```

检查发现CommonAside.vue中一个不关键的prop（.el-menu-item中的:index）误设为常量0了，改正即可。

补：同样问题的还有`:index="item.page+''"`需要加个单引号转化为字符串就不会报错

## 解决数据持久化问题

核心思想：每次在vuex容器中更新数据时再存储到本地一份，每次更新页面时将本地数据再加载到vuex容器中



## 动态路由实现

原因：如果把router/index.js的routes写死，当用户种类比较多、页面很多时routes元素会过多，应当按照后端传来的数据动态调整路由

（没做）

## 登出功能实现

思路：清除vuex在本地的localStorate，将页面转至login页





## 项目打包和部署

关键点：

1. 本地`npm run build`打包，`npm run preview`预览

2. 参考vite官方文档（[部署静态站点 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/guide/static-deploy)）和一个GitHub项目（[sitek94/vite-deploy-demo: Deploy Vite app to GitHub Pages using GitHub Actions](https://github.com/sitek94/vite-deploy-demo?tab=readme-ov-file)）核心步骤为本地提交项目到main分支到GitHub上（命令行如下）

   ```
   git init
   git add .
   git commit -m "init vite project"
   git remote add origin git@github.com:sitek94/vite-deploy-demo.git
   git branch -M main
   git push -u origin main
   ```

3. 再新开deploy.yml脚本（放在根目录/.github/workflows）下，用vite官网提供的脚本：

   ```
   # 将静态内容部署到 GitHub Pages 的简易工作流程
   name: Deploy static content to Pages
   
   on:
     # 仅在推送到默认分支时运行。
     push:
       branches: ['main']
   
     # 这个选项可以使你手动在 Action tab 页面触发工作流
     workflow_dispatch:
   
   # 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages。
   permissions:
     contents: read
     pages: write
     id-token: write
   
   # 允许一个并发的部署
   concurrency:
     group: 'pages'
     cancel-in-progress: true
   
   jobs:
     # 单次部署的工作描述
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Set up Node
           uses: actions/setup-node@v3
           with:
             node-version: 18
             cache: 'npm'
         - name: Install dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Setup Pages
           uses: actions/configure-pages@v3
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v2
           with:
             # Upload dist repository
             path: './dist'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v2
   ```

   再次提交到GitHub上去后actions应该会自动执行脚本，注意按照如上所说GitHub项目中写到必须要在设置中允许writing and reading（`read and write permissions`）和下面的一个复选框（`Allow GitHub Actions to create and approve pull requests`）

   这里还需要在GitHub Pages的设置中将source改为GitHub Actions（最后就卡在这一步了，之前一直没设），等待脚本执行完毕即可

## 追加更新

项目期间发生了好几次路由跳转至首页但是面包屑不更新的情况，在对应情况调用一下vuex中的函数即可

