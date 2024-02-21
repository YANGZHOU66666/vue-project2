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
    },
    getChartData(params){
        return request({
            url:'/getChartData',
            method:'get',
            data:params,
            mock:true
        })
    },
    getUserTableData(params){
        return request({
            url:'/getUserTableData',
            method:'get',
            data:params,
            mock:true
        });
    },
    getMenu(params){
        return request({
            url:'/getMenu',
            method:'post',
            data:params,
            mock:false
        })
    }
}