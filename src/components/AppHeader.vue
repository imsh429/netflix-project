<template>
  <header :class="{ 'scrolled': isScrolled }">
    <div class="logo">
      <router-link to="/">넷플릭스 클론</router-link>
    </div>
    <nav class="nav-links">
      <router-link to="/">홈</router-link>
      <router-link to="/popular">인기 영화</router-link>
      <router-link to="/search">검색</router-link>
      <router-link to="/wishlist">위시리스트</router-link>
    </nav>
    <div class="user-info">
      <span v-if="isLoggedIn">{{ userId }}</span>
      <button @click="toggleLogin">{{ isLoggedIn ? '로그아웃' : '로그인' }}</button>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      isScrolled: false,
      isLoggedIn: false,
      userId: "사용자ID"
    };
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    toggleLogin() {
      this.isLoggedIn = !this.isLoggedIn;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() { // Vue 3에서는 'unmounted' 사용
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.7);
  transition: background-color 0.3s ease;
  color: white;
}
header.scrolled {
  background-color: rgba(0, 0, 0, 0.9);
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
}
.nav-links {
  display: flex;
  gap: 1rem;
}
.nav-links a {
  color: white;
  text-decoration: none;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
button {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}
button:hover {
  background: white;
  color: black;
}
</style>
