<template>
  <div class="infinite-scroll">
    <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-item"
    >
      <div class="poster-container">
        <!-- 영화 포스터 -->
        <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="poster-image"
            @click="selectMovie(movie.id)"
        />
        <!-- 위시리스트 버튼 -->
        <button
            class="wishlist-btn"
            :class="{ active: isInWishlist(movie.id) }"
            @click.stop="toggleWishlist(movie)"
        >
          <i :class="isInWishlist(movie.id) ? 'fas fa-star' : 'far fa-star'"></i>
        </button>
      </div>
      <h3 class="movie-title">{{ movie.title }}</h3>
    </div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p class="loading-text">영화 데이터를 불러오는 중입니다...</p>
    </div>

    <!-- Top 버튼 추가 -->
    <button v-if="showTopButton" class="top-button" @click="scrollToTop">
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</template>

<script>
import { addMovieToWishlist, removeMovieFromWishlist, isMovieInWishlist } from "@/utils/storage.js";

export default {
  name: "InfiniteScrollView",
  props: {
    movies: Array,
    loading: Boolean,
  },
  data() {
    return {
      showTopButton: false, // Top 버튼 표시 여부
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      // 무한 스크롤 체크
      const bottomOfWindow =
          window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100;
      if (bottomOfWindow && !this.loading) {
        this.$emit("loadMore");
      }

      // 스크롤 위치가 400px 이상일 때 Top 버튼 표시
      this.showTopButton = window.scrollY > 400;
    },
    selectMovie(movieId) {
      this.$emit("movie-selected", movieId);
    },
    scrollToTop() {
      // 페이지 맨 위로 부드럽게 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    toggleWishlist(movie) {
      console.log("Toggling wishlist for movie: ", movie); // movie 객체 확인
      // 위시리스트 추가/삭제
      if (isMovieInWishlist(movie.id)) {
        console.log("Removing from wishlist: ", movie.id);
        removeMovieFromWishlist(movie.id);
      } else {
        console.log("Adding to wishlist: ", movie);
        addMovieToWishlist(movie);
      }
      this.$forceUpdate(); // 위시리스트 상태를 즉시 반영
    },
    isInWishlist(movieId) {
      // 위시리스트에 영화가 있는지 확인
      return isMovieInWishlist(movieId);
    },
  },
};
</script>

<style scoped>
.infinite-scroll {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 반응형 카드 배치 */
  gap: 1.5rem;
  padding: 1rem;
}

.movie-item {
  position: relative; /* 하트 버튼 배치를 위한 부모 요소 기준 */
  text-align: center;
  overflow: hidden; /* 확대된 포스터가 넘치지 않도록 설정 */
  transition: transform 0.3s ease; /* 확대 시 부드럽게 */
}

.movie-item:hover {
  transform: scale(1.05); /* 마우스 올렸을 때 카드 확대 */
}

.poster-container {
  position: relative; /* 위시리스트 버튼 위치 설정 */
}

.poster-image {
  width: 100%; /* 포스터가 컨테이너 크기에 맞게 조정 */
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 부드러운 확대 효과 */
}

.poster-image:hover {
  transform: scale(1.1); /* 마우스 올렸을 때 포스터 확대 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* 확대 시 그림자 추가 */
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 6px;
  z-index: 2;
  color: rgba(0, 0, 0, 0.6); /* 기본 비활성 상태 색상 */
  transition: background-color 0.3s ease, color 0.3s ease; /* 부드러운 전환 추가 */
}

.wishlist-btn.active {
  background: rgba(255, 215, 0, 0.8);
  color: white;
}

.wishlist-btn:hover {
  background: rgba(255, 215, 0, 1);
  color: white;
}

.movie-title {
  margin-top: 0.5rem;
  color: #fff;
  font-size: 16px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-text {
  font-size: 1.2rem;
  color: #fff;
  margin-top: 0.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Top 버튼 */
.top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  font-size: 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.top-button i {
  font-size: 16px;
}

.top-button:hover {
  opacity: 1;
  transform: scale(1); /* 호버 시 확대 */
}
</style>
