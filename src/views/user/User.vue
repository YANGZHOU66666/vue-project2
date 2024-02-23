<template>
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    ><!--弹出对话框-->
    <el-form :inline="true" :model="userFormData" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="姓名"
            prop="name"
            :rules="[
              {
                required: true,
                message: '姓名为必填项',
              },
            ]"
          >
            <el-input
              v-model="userFormData.name"
              placeholder="请输入姓名"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="年龄"
            prop="age"
            :rules="[
              {
                required: true,
                message: '年龄为必填项',
              },
              {
                type: 'number',
                message: '年龄必须为数字',
              },
            ]"
          >
            <el-input
              v-model.number="userFormData.age"
              placeholder="请输入年龄"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="地址"
            prop="addr"
            :rules="[
              {
                required: true,
                message: '地址为必填项',
              },
            ]"
          >
            <el-input
              v-model="userFormData.addr"
              placeholder="请输入地址"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="性别"
            style="width: 100%; padding-right: 32px"
            prop="sexLabel"
            :rules="[
              {
                required: true,
                message: '性别为必填项',
              },
            ]"
          >
            <el-select
              v-model="userFormData.sexLabel"
              placeholder="请选择"
              clearable
            >
              <el-option label="女" value="女" />
              <el-option label="男" value="男" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="出生日期"
            style="width: 100%; padding-right: 32px"
            prop="birth"
            :rules="[
              {
                required: true,
                message: '出生日期为必填项',
              },
            ]"
          >
            <el-date-picker
              v-model="userFormData.birth"
              type="date"
              placeholder="请选择"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="onHideAddUser">取消</el-button>
        <el-button type="primary" @click="onSubmitUserData"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
  <div class="user-header">
    <!--添加用户和搜索-->
    <el-button type="primary" class="add-button" @click="onDisplayAddUser"
      >+新增</el-button
    >
    <el-form :inline="true" :model="formInline">
      <el-form-item label="查找用户">
        <el-input
          placeholder="请输入用户名"
          clearable
          v-model="formInline.keyword"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="getCurrentDisplayData()"
    ><!--表格主体-->
    <el-table-column
      v-for="item in tableLabel"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width ? item.width : 125"
    >
    </el-table-column>
    <el-table-column fixed="right" label="操作" min-width="180">
      <template #default="scope">
        <el-button size="small" @click="onDisplayEditUser(scope)"
          >编辑</el-button
        >
        <el-button size="small" type="danger" @click="onDeleteUser(scope)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <!--分页器-->
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :page-size="itemInOnePage"
      :total="config.total"
      v-model:current-page="config.page"
      @current-change="onChangePage"
    />
  </div>
</template>
<script setup>
//import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

//页面初始化
const getUserTableData = async () => {
  //页面挂载后下载数据
  await proxy.$api.getUserTableData().then((res) => {
    let len = res.length;
    tableData.value = res.map((item) => {
      item.sexLabel = item.sexLabel == 0 ? "女" : "男";
      return item;
    });
    config.total = len;
  });
};
onMounted(() => {
  getUserTableData();
});

/*
 *表格展示与搜索相关
 */
const itemInOnePage = 12; //控制每页数据行数
const tableLabel = reactive([
  //表头
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 320,
  },
]);
const tableData = ref([]); //表格中所有数据
const formInline = reactive({
  //搜索框动态绑定的数据
  keyword: "",
});
const config = reactive({
  //控制搜索框内容、当前页面、总数据条数
  page: 1,
  total: 0,
  name: "",
});

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
    return curRes;
  }
};
const onChangePage = (page) => {
  //点击跳转页面后，config.page变化
  config.page = page;
};
const handleSearch = () => {
  //点击搜索后，将搜索框内容传到config中，并将当前页面号置1
  config.name = formInline.keyword;
  if (config.name == "") {
    config.total = tableData.value.length;
  }
  config.page = 1;
};

/* 新增用户相关 */
//控制是否显示新增用户的窗口
const dialogVisible = ref(false);
//动态绑定用户新增页面的表单
const userFormData = reactive({
  name: null,
  age: null,
  sexLabel: null,
  birth: null,
  addr: null,
});

const onDisplayAddUser = () => {
  //点击"+新增"按钮后展示添加用户页面
  dialogVisible.value = true;
  action.value = "add";
};
const onHideAddUser = () => {
  //关闭新增用户的窗口
  dialogVisible.value = false;
  proxy.$refs.userForm.resetFields();
};
const submitAddToServer = async (data) => {
  //模拟传至后端，不做任何操作
  return Promise.resolve("上传添加成功");
};
const submitUpdateToServer = async (data) => {
  //模拟传至后端，不做任何操作
  return Promise.resolve("上传更新成功");
};
const submitDeleteToServer = async (data) => {
  //模拟传至后端，不做任何操作
  return Promise.resolve("上传删除成功");
};
const toFormatTime = (time) => {
  //将时间标准化的工具
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : "" + month;
  day = day < 10 ? "0" + day : "" + day;
  return year + "-" + month + "-" + day;
};
const onSubmitUserData = () => {
  //提交用户数据
  proxy.$refs.userForm.validate(async (valid) => {
    if (valid) {
      if (action.value == "add") {
        //添加用户的逻辑
        userFormData.birth = toFormatTime(userFormData.birth); //将生日全部标准化为字符串
        await submitAddToServer(userFormData).then((res) => {
          //模拟上传至后端成功
          console.log(res);
          //本地数据添加，深拷贝新对象(没想到其他好方法，如果直接unshift(userFormData)会导致指向同一块内存)
          tableData.value.unshift(JSON.parse(JSON.stringify(userFormData)));
          config.total++;
          //这里用.el-form表单自带的resetFields()清空表单中数据
          proxy.$refs.userForm.resetFields();
          dialogVisible.value = false;
        });
      } else {
        //编辑用户的逻辑
        userFormData.birth = toFormatTime(userFormData.birth); //将生日全部标准化为字符串
        await submitUpdateToServer(userFormData).then((res) => {
          console.log(res);
          let dataIndex = (config.page - 1) * itemInOnePage + curIndex.value;
          tableData.value[dataIndex] = JSON.parse(JSON.stringify(userFormData));
          proxy.$refs.userForm.resetFields();
          dialogVisible.value = false;
          /*proxy.$nextTick(() => {
            let keys=Object.keys(userFormData);
            keys.forEach((key)=>{
              userFormData[key]=null;
            })
          });*/
        });
      }
    } else {
      ElMessage.error("需要填完所有项");
    }
  });
  //提交新增用户的数据
};

/* 编辑用户相关 */
//区分是编辑还是添加
const action = ref("add");
//当前编辑的元素在当页的序号
const curIndex = ref(0);
const onDisplayEditUser = (res) => {
  //打开编辑窗口，进行必要设置
  action.value = "edit";
  dialogVisible.value = true;
  proxy.$nextTick(() => {
  Object.assign(userFormData, res.row); //将用户数据放在绑定区中
  curIndex.value = res.$index;
  });
};
const onHideEditUser = () => {
  //关闭编辑窗口
  dialogVisible.value = false;
};

/* 删除用户相关 */
const onDeleteUser = (res) => {
  //点击删除按钮后
  let tempIndex = res.$index;
  let deleteIndex = (config.page - 1) * itemInOnePage + tempIndex;
  ElMessageBox.confirm("确定删除这条数据吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      submitDeleteToServer(res.row).then((res) => {
        //模拟在后端成功删除
        tableData.value.splice(deleteIndex, 1);
        config.total--;
        if (
          config.total % itemInOnePage == 0 &&
          itemInOnePage * (config.page + 1) == config.total
        ) {
          //如果刚好最后一页只有一个数据且当前在最后一页
          config.page--;
        }
      });
    })
    .catch(() => {});
};
</script>

<style lang="less" scoped>
.el-table {
  height: 533px;
}
.pagination-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.user-header {
  display: flex;
  justify-content: space-between;
  .el-form {
    .el-form-item {
      .el-input {
        margin-right: 20px;
      }
      margin-right: 0;
      margin-bottom: 10px;
    }
  }
}
</style>
