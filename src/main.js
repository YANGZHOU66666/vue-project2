import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import './api/mock.js'
import './assets/less/index.less'
import api from './api/api.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//import 'element-plus/dist/index.css'

const app=createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$api=api
const check=(path)=>{
    let routes=router.getRoutes();
    let res=routes.filter(item=>item.path==path).length;
    if(res!=1){
        return false;
    }else{
        return true;  //返回true表示有这个路由，返回false表示没有这个路由
    }
}


router.beforeEach(async (to,from)=>{
    store.commit('getToken');
    if(store.state.token==null&&to.name!='login'){
        return {name:"login"}
    }else if(!check(to.path)){
        return {name:"home"};
    }
})
app.use(router).use(store)
app.mount('#app')
