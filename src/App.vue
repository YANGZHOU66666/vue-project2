<script setup>
import {useStore} from 'vuex';
const store=useStore();
store.commit("addMenu");
store.commit('addTags');
</script>

<template>
  <router-view/>
</template>

<style>
#app{
  height:100%;
}
</style>
