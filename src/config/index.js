/*
* 环境配置文件
* 一般在企业项目里有三个环境：开发环境、测试环境、线上环境
*/

//当前的环境
let env=import.meta.env.MODE || 'prod'
env='development'//现在强行声明为开发环境

const EnvConfig = {
    development:{//开发环境
        baseApi: '/api',
        mockApi: 'https://mock.apifox.com/m1/4022542-0-default/'//开启云端mock了
    },
    test:{//测试环境
        baseApi: '//test.future.com/api',
        mockApi: 'https://mock.apifox.com/m1/4022542-0-default/'
    },
    production:{//生产环境
        baseApi: '//future.com/api',
        mockApi: 'https://mock.apifox.com/m1/4022542-0-default/'
    }
}
export default{
    env,
    mock:true,//mock的总开关
    ...EnvConfig[env]
}