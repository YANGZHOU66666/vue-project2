import { createStore } from "vuex";
import Cookies from 'js-cookie'
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
        ],
        menu:[],
        token:null,
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
                if(res==-1){
                    state.tagsList.push(val);
                }
            }
            //localStorage.setItem('currentMenu',JSON.stringify(state.currentMenu));
            localStorage.setItem('tagsList',JSON.stringify(state.tagsList));
        },
        closeTag(state,val){
            let index=state.tagsList.findIndex(item=>item.name==val.name);
            state.tagsList.splice(index,1);
            localStorage.setItem('tagsList',JSON.stringify(state.tagsList));
        },
        setMenu(state,val){
            state.menu=val;
            localStorage.setItem('menu', JSON.stringify(val));//将用户登陆后侧栏数据存储到本地，解决数据持久化的问题
        },
        addMenu(state){
            if(!localStorage.getItem('menu')){
                return;
            }
            state.menu=JSON.parse(localStorage.getItem('menu'));
        },
        addTags(state){
            if(!localStorage.getItem('tagsList')){
                return;
            }
            //state.currentMenu=localStorage.getItem('currentMenu');
            state.tagsList=JSON.parse(localStorage.getItem('tagsList'));
        },
        logOutConfiguration(state){
            state.menu=[];//必须要加,用户登出不刷新页面,vuex不重置
            state.tagsList=[
                {
                    path:'/',
                    name:'home',
                    label:'首页',
                    icon:'home'
                }
            ];
            state.currentMenu=null;
            if(localStorage.getItem('menu')!=null){//必须要加!=null，只是用!取反不行(成功的话返回的不是true)
                localStorage.removeItem('menu');
            }
            if(localStorage.getItem('tagsList')!=null){
                localStorage.removeItem('tagsList');
            }
        },
        setToken(state,val){
            state.token=val;
            Cookies.set('token',val);
        },
        clearToken(state){
            state.token=null;
            Cookies.remove('token');
        },
        getToken(state){
            state.token=state.token||Cookies.get('token');
        }
    }
});
export default store