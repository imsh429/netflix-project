<template>
  <div id="app">
    <header-component /> <!-- 헤더 컴포넌트 -->
    <transition name="page">
      <router-view /> <!-- 페이지 전환 시 애니메이션 적용 -->
    </transition>
  </div>
</template>

<script>
import HeaderComponent from '@/components/AppHeader.vue';

export default {
  components: {
    HeaderComponent,
  },
};
</script>

<style>
/* 전역 페이지 전환 애니메이션 */
.page-enter-active, .page-leave-active {
  transition: opacity 0.5s ease;
}
.page-enter, .page-leave-to {
  opacity: 0;
}
</style>
