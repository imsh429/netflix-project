<template>
  <header :class="{ 'scrolled': isScrolled }">
    <div class="logo">
      <router-link to="/">넷플릭스 클론</router-link>
    </div>
    <nav class="nav-links">
      <router-link to="/" class="icon-link">
        <i class="fas fa-home"></i>
      </router-link>
      <router-link to="/popular" class="icon-link">
        <i class="fas fa-fire"></i>
      </router-link>
      <router-link to="/search" class="icon-link">
        <i class="fas fa-search"></i>
      </router-link>
      <router-link to="/wishlist" class="icon-link">
        <i class="fas fa-heart"></i>
      </router-link>
    </nav>
    <div class="user-info">
      <span v-if="isLoggedIn">{{ userId }}</span>
      <button @click="handleAuthAction">
        {{ isLoggedIn ? '로그아웃' : '로그인' }}
      </button>
    </div>
  </header>
</template>

<script>
import { isLoggedIn as checkLoginStatus, logout } from "@/services/AuthenticationService.js";

export default {
  name: "AppHeader",
  data() {
    return {
      isScrolled: false,
      isLoggedIn: false,
      userId: "", // 로그인된 사용자 ID 저장
    };
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    handleAuthAction() {
      if (this.isLoggedIn) {
        logout();
        this.isLoggedIn = false;
        this.userId = "";
        this.$router.push("/signin");
      } else {
        this.$router.push("/signin");
      }
    },
  },
  watch: {
    isLoggedIn(newStatus) {
      if (newStatus) {
        this.userId = localStorage.getItem("userId") || "사용자";
      } else {
        this.userId = "";
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.isLoggedIn = checkLoginStatus();
    if (this.isLoggedIn) {
      this.userId = localStorage.getItem("userId") || "사용자";
    }
  },
  unmounted() {
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
  gap: 1.5rem;
}

.icon-link {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.icon-link:hover {
  color: #ff0000; /* 강조 색상 */
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
