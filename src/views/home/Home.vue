<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8">
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
          <el-table-column
            v-for="(val, key) in tableLabel"
            :prop="key"
            :label="val"
            :key="key"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="count">
        <el-card
          v-for="(item, index) in countText"
          :body-style="{ display: 'flex', padding: 0 }"
          :key="item.name"
          shadow="hover"
        >
          <component
            class="icons"
            :is="item.icon"
            :style="{ background: item.color }"
          >
          </component>
          <div class="details">
            <p class="num">￥{{ countData[index] }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card class="echart-card" shadow="hover">
        <div ref="echart" style="height: 240px"></div>
      </el-card>
      <div class="graph">
        <el-card style="height: 260px; width: 48%" shadow="hover">
          <div style="height: 240px" ref="userEchart"></div>
        </el-card>
        <el-card style="height: 260px; width: 48%" shadow="hover">
          <div style="height: 240px" ref="videoEchart"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import * as echarts from "echarts";
//import axios from "axios";
const { proxy } = getCurrentInstance(); //proxy类似this
const tableData = ref([]);
const countText = [
  {
    name: "今日支付订单",
    icon: "SuccessFilled",
    color: "#2ec7c9",
  },
  {
    name: "今日收藏订单",
    icon: "StarFilled",
    color: "#ffb980",
  },
  {
    name: "今日未支付订单",
    icon: "GoodsFilled",
    color: "#5ab1ef",
  },
  {
    name: "本月支付订单",
    icon: "SuccessFilled",
    color: "#2ec7c9",
  },
  {
    name: "本月收藏订单",
    icon: "StarFilled",
    color: "#ffb980",
  },
  {
    name: "本月未支付订单",
    icon: "GoodsFilled",
    color: "#5ab1ef",
  },
];

const countData = ref([]);
const tableLabel = {
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
};
const getTableList = async () => {

  /*await axios.get('/api/getTableData').then((res)=>{//本地mock的残留
    tableData.value=res.data.data.tableData;
  });*/
  await proxy.$api.getTableData().then((res) => {
    tableData.value = res.data.tableData;
  });
};
const getCountList = async () => {
  await proxy.$api.getCountData().then((res) => {
    //console.log(res);
    countData.value = res;
  });
};

let xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});
let orderData = reactive({
  xData: [
    "20191001",
    "20191002",
    "20191003",
    "20191004",
    "20191005",
    "20191006",
    "20191007",
  ], //date目前是写死的
  series: [],
});

let pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: [],
});
let userData = reactive({
  xData: [],
  series: [],
});
let videoData = reactive({
  series: [],
});

const getChartData = async () => {
  await proxy.$api.getChartData().then((res) => {
    //console.log(res);
    let tempOrderData = res.orderData.data;
    let keyArr = Object.keys(tempOrderData[0]);
    let series = [];
    keyArr.forEach((key) => {
      series.push({
        name: key,
        data: tempOrderData.map((item) => item[key]),
        type: "line",
      });
    });
    orderData.series = series;
    xOptions.xAxis.data = orderData.xData;
    xOptions.series = series;
    //orderData进行渲染
    let hEchart = echarts.init(proxy.$refs.echart);
    hEchart.setOption(xOptions);
    //userData柱状图进行渲染
    let tempUserData = res.userData;
    userData.xData = ["星期一", "星期二", "星期三", "星期四", "星期五"]; //这里后端不方便传，暂时写死
    userData.series = [
      {
        name: "新增用户",
        data: tempUserData.map((item) => item.new),
        type: "bar",
      },
      {
        name: "活跃用户",
        data: tempUserData.map((item) => item.active),
        type: "bar",
      },
    ];
    xOptions.xAxis.data = userData.xData; //仍然挂载到xOptions上
    xOptions.series = userData.series;
    let uEchart = echarts.init(proxy.$refs.userEchart);
    uEchart.setOption(xOptions);
    //饼状图渲染
    let tempVideoData = res.videoData;
    videoData.series = {
      type: "pie",
      data: tempVideoData,
    };
    pieOptions.series = videoData.series;
    let vChart = echarts.init(proxy.$refs.videoEchart);
    vChart.setOption(pieOptions);
  });
};

onMounted(() => {
  getTableList();
  getCountList();
  getChartData();
});
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
.count {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
  .icons {
    height: 80px;
    width: 80px;
    color: white;
  }
  .details {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .num {
      margin-bottom: 10px;
      font-size: 30px;
    }
    .txt {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
}
.echart-card {
  height: 260px;
}
.graph {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
