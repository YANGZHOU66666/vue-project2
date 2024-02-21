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
    store.commit("selectMenu", tags[index - 1]);
  } else {
    //当删除的不是最后一项且是自己
    router.push({
      name: tags[index].name, //自己的后一项
    });
    store.commit("selectMenu", tags[index]);
  }
};
</script>
<style lang="less" scoped>
.tags {
  padding: 20px;
  padding-bottom:0;
  width: 100%;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
