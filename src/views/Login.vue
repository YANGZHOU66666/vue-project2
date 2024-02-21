<template>
  <div class="login-form-container">
    <el-form class="login-form">
      <h1>登录</h1>
      <el-form-item>
        <el-input placeholder="请输入用户名" v-model="loginForm.username">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="loginForm.password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const loginForm = reactive({
  username: "admin",
  password: "admin",
});
const { proxy } = getCurrentInstance();
const handleLogin = async () => {
  proxy.$api.getMenu(loginForm).then((res) => {
    store.commit('setMenu',res.data.menu);
    store.commit('setToken',res.data.token);
    router.push({"name":"home"});
  });
  /*if (loginForm.userName == "admin" && loginForm.password == "admin") {
    router.push({ name: "home" });
  }*/
};
</script>

<style lang="less" scoped>
.login-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 26%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: #eaeaea 1px solid;
  border-radius: 15px;
  box-shadow: 0 0 25px #cacaca;
  h1 {
    margin: 15px;
    font-size: larger;
  }
  .el-form-item {
    width: 70%;
    margin: 12px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
