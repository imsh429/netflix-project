<template>
  <div id="app">
    <AppHeader /> <!-- 헤더 추가 -->
    <router-view /> <!-- 라우터를 통해 페이지가 표시되는 부분 -->
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "App",
  components: {
    AppHeader
  }
};
</script>

<style>
/* 전역 스타일을 필요에 따라 추가하세요 */
</style>
