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

button {
  background-color: rgba(255, 255, 255, 0.1); /* 버튼 기본 배경 투명한 흰색 */
  border: 2px solid white; /* 흰색 테두리 */
  color: white; /* 기본 텍스트 색상 흰색 */
  padding: 0.5rem 1rem; /* 버튼 내부 여백 */
  border-radius: 20px; /* 둥근 버튼 스타일 */
  font-size: 1rem; /* 텍스트 크기 */
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #007bff; /* Hover 시 파란색 */
  color: white; /* 텍스트 색상 유지 */
  transform: scale(1.05); /* 살짝 확대 효과 */
}

button:focus {
  outline: none; /* 포커스 시 기본 아웃라인 제거 */
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.8); /* 파란색 그림자 효과 */
}

button:active {
  transform: scale(0.95); /* 클릭 시 살짝 눌리는 효과 */
}

</style>
