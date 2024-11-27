<template>
  <header :class="{ 'scrolled': isScrolled }">
    <div class="header-left">
      <!-- 로고 -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <i class="fas fa-film"></i>
        </router-link>
      </div>

      <!-- 네비게이션 링크 -->
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
    </div>

    <!-- 유저 정보 -->
    <div class="user-info">
      <div class="user-icon-wrapper">
        <i class="fas fa-user"></i>
        <span v-if="isLoggedIn" class="user-email">{{ userId }}</span>
      </div>
      <button @click="handleAuthAction" class="auth-button">
        {{ isLoggedIn ? 'Logout' : 'Login' }}
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
      userId: "",
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
    updateUserInfo() {
      this.isLoggedIn = checkLoginStatus(); // 로그인 상태 확인
      this.userId = localStorage.getItem("userId") || "사용자"; // userId 가져오기
    },
  },
  watch: {
    isLoggedIn() {
      this.updateUserInfo(); // 로그인 상태가 변경되면 userId 업데이트
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.updateUserInfo(); // 컴포넌트 초기화 시 userId 업데이트
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
/* 헤더 공통 스타일 */
header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex; /* Flexbox로 변경 */
  justify-content: space-between; /* 좌우 정렬 */
  align-items: center; /* 세로 정렬 중앙 */
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.88);
  color: white;
  transition: background-color 0.3s ease;
}

header.scrolled {
  background-color: transparent;
}

header:hover {
  background-color: rgba(0, 0, 0, 0.79);
}

header.scrolled:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 좌측 헤더 섹션 */
.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* 네비게이션 링크 */
.nav-links {
  flex-direction: row; /* 항상 가로 정렬 */
  display: flex;
  gap: 1.5rem;
}

.icon-link {
  color: white;
  font-size: 1.3rem;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.icon-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 4px;
  background-color: white;
  border-radius: 50px;
  transition: width 0.3s ease;
}

.icon-link:hover {
  color: white;
}

.icon-link:hover::after {
  width: 100%;
}

/* 로고 */
.logo {
  font-size: 1.5rem;
}

.logo-link {
  color: white;
  font-size: 2rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo-link:hover {
  color: #007bff;
}

/* 사용자 정보 */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-icon-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
  touch-action: manipulation;
}

.user-icon-wrapper i {
  font-size: 1.5rem;
  color: white;
  transition: transform 0.3s ease, font-size 0.3s ease;
}

.user-icon-wrapper:hover i {
  font-size: 2rem;
  transform: scale(1.2);
}

.user-email {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.user-icon-wrapper:hover .user-email {
  opacity: 1;
  visibility: visible;
}

/* 로그인/로그아웃 버튼 */
.auth-button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  touch-action: manipulation; /* 터치 지원 */
}

.auth-button:hover {
  background: linear-gradient(135deg, #2575fc, #6a11cb);
  transform: scale(1.05);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
}

.auth-button:active {
  background: linear-gradient(135deg, #ff5722, #ff9800); /* 터치 시 색상 변화 */
  transform: scale(0.95);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}

.auth-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150;
  height: 150;
  opacity: 1;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: width 0.4s ease, height 0.4s ease, opacity 0.6s ease;
  opacity: 0;
}

.auth-button:active::before {
  width: 150%;
  height: 150%;
  opacity: 1;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  header {
    flex-wrap: wrap; /* 가로로 공간이 부족하면 줄바꿈 허용 */
    padding: 0.5rem;
  }

  .header-left,
  .user-info {
    flex: 1; /* 화면 크기에 따라 공간을 유연하게 차지 */
    justify-content: center;
    gap: 1rem; /* 간격 줄이기 */
  }

  .nav-links {
    flex: 1;
    justify-content: center; /* 네비게이션 링크 중앙 정렬 */
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  header {
    flex-wrap: wrap; /* 헤더 줄바꿈 허용 */
    padding: 0.5rem; /* 패딩 축소 */
    height: 50px; /* 모바일에서 높이 축소 */
  }

  .nav-links {
    gap: 1rem;
    justify-content: space-around;
  }

  .icon-link {
    font-size: 1.1rem;
  }

  .auth-button {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem; /* 버튼 크기 축소 */
  }
}

@media (orientation: landscape) {
  header {
    padding: 0.5rem 2rem;
  }

  .nav-links {
    gap: 1rem;
  }
}

.logo-link img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
