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
header {
  position: sticky; /* 스크롤 시 상단에 고정 */
  top: 0; /* 화면의 최상단에 위치 */
  z-index: 1000; /* 다른 요소들 위에 나타나도록 설정 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  background-color: rgba(0, 0, 0, 0.88);
  transition: background-color 0.3s ease;
  color: white;
}

/* 헤더 hover 상태에서 배경색 연해짐 */
header:hover {
  background-color: rgba(0, 0, 0, 0.79); /* 진한 배경색 */
}

/* 스크롤 시 배경색 변경 */
header.scrolled {
  background-color: transparent;
  transition: background-color 0.3s ease; /* 부드러운 전환 */
}
header.scrolled:hover {
  background-color: rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s ease; /* 부드러운 전환 */
}

/* 왼쪽 섹션 */
.header-left {
  display: flex;
  align-items: center;
  gap: 2rem; /* 로고와 네비게이션 간 간격 조정 */
}

/* 로고 */
.logo {
  font-size: 1.5rem;
}

.logo-link {
  color: white;
  font-size: 2rem; /* 로고 크기를 더 크게 설정 */
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo-link:hover {
  color: #007bff; /* 로고 호버 시 파란색 */
}

/* 네비게이션 아이콘 */
.icon-link {
  color: white;
  font-size: 1.3rem;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.icon-link::after {
  content: ""; /* 밑줄 추가 */
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

.icon-link:hover::after {
  width: 100%; /* 호버 시 밑줄 확장 */
}

.icon-link:hover {
  color: white; /* 링크 색상은 유지 */
}

.nav-links {
  display: flex;
  gap: 1.5rem; /* 네비게이션 아이콘 간격 */
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
}

.user-icon-wrapper i {
  font-size: 1.5rem;
  color: white;
  transition: transform 0.3s ease, font-size 0.3s ease;
}

.user-icon-wrapper:hover i {
  font-size: 2rem; /* 아이콘 크기 증가 */
  transform: scale(1.2); /* 추가 확대 효과 */
}

.user-email {
  position: absolute;
  top: 30px; /* 아이콘 위에 이메일 표시 */
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

.auth-button {
  background: linear-gradient(135deg, #6a11cb, #2575fc); /* 기본 색상 그라데이션 */
  color: white;
  font-size: 0.8rem; /* 글꼴 크기 축소 */
  font-weight: bold;
  padding: 0.4rem 1rem; /* 패딩 줄이기 */
  border: none;
  border-radius: 20px; /* 작고 둥근 버튼 */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 크기 축소 */
  position: relative;
  overflow: hidden;
}

.auth-button:hover {
  background: linear-gradient(135deg, #2575fc, #6a11cb); /* 호버 시 색상 반전 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15); /* 호버 시 약간의 그림자 증가 */
  transform: scale(1.05); /* 버튼 확대 효과 */
}

.auth-button:active {
  transform: scale(0.95); /* 클릭 시 축소 효과 */
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2); /* 클릭 시 그림자 감소 */
}

.auth-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3); /* 클릭 시 원형 퍼짐 효과 */
  border-radius: 50%;
  transition: width 0.4s ease, height 0.4s ease, opacity 0.6s ease;
  opacity: 0;
}

.auth-button:active::before {
  width: 150%; /* 퍼짐 크기 축소 */
  height: 150%; /* 퍼짐 크기 축소 */
  opacity: 1; /* 클릭 시 애니메이션 발생 */
}


</style>
