import Mock from 'mockjs'
import homeApi from './mockData/home.js'
import loginApi from './mockData/login.js'
//拦截请求(本地mock需要的)
Mock.mock('/api/getTableData', homeApi.getHomeData)
Mock.mock('/api/getMenu',loginApi.getMenu)