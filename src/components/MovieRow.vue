<template>
  <div class="movie-row-container">
    <!-- 왼쪽 스크롤 버튼 -->
    <button class="scroll-button left" @click="scrollLeft">
      <i class="fas fa-chevron-left"></i>
    </button>

    <!-- 영화 목록 -->
    <div ref="movieRow" class="movie-row">
      <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-item"
          @mouseover="hover = movie.id"
          @mouseleave="hover = null"
      >
        <div class="poster-container">
          <!-- 영화 포스터 -->
          <img
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
              :class="{ hover: hover === movie.id }"
              @click="handleMovieClick(movie.id)"
          />
          <!-- 하트 버튼 -->
          <button
              class="wishlist-btn"
              :class="{ active: isInWishlist(movie.id) }"
              @click.stop="toggleWishlist(movie)"
          >
            <i :class="isInWishlist(movie.id) ? 'fas fa-star' : 'far fa-star'"></i>
          </button>
        </div>
        <p class="movie-title">{{ movie.title }}</p>
      </div>
    </div>

    <!-- 오른쪽 스크롤 버튼 -->
    <button class="scroll-button right" @click="scrollRight">
      <i class="fas fa-chevron-right"></i>
    </button>

    <!-- 상세정보 모달 -->
    <ReusableModal :visible="showDetailModal" @close="closeDetailModal">
      <MovieDetail v-if="selectedMovie" :id="selectedMovie.id" />
    </ReusableModal>
  </div>
</template>

<script>
import { addMovieToWishlist, removeMovieFromWishlist, isMovieInWishlist } from "@/utils/storage.js";
import ReusableModal from "@/components/ReusableModal.vue";
import MovieDetail from "@/views/MovieDetail.vue";

export default {
    components: {
      ReusableModal,
      MovieDetail,
    },
  props: {
    movies: {
      type: Array,
      default: () => [] // 기본값을 빈 배열로 설정
    }
  },
  data() {
    return {
      hover: null,
      showDetailModal: false, // 상세정보 모달 표시 여부
      selectedMovie: null, // 선택된 영화 데이터
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.movieRow.scrollBy({ left: -300, behavior: "smooth" });
    },
    scrollRight() {
      this.$refs.movieRow.scrollBy({ left: 300, behavior: "smooth" });
    },
    handleMovieClick(movieId) {
      const selected = this.movies.find((movie) => movie.id === movieId);
      if (selected) {
        this.selectedMovie = selected; // 선택된 영화 데이터 설정
        this.showDetailModal = true;  // 모달 표시
      }
    },
    closeDetailModal() {
      this.showDetailModal = false; // 모달 닫기
      this.selectedMovie = null;   // 선택된 영화 초기화
    },
    toggleWishlist(movie) {
      // 위시리스트 추가/삭제
      if (isMovieInWishlist(movie.id)) {
        removeMovieFromWishlist(movie.id);
      } else {
        addMovieToWishlist(movie);
      }
      this.$forceUpdate(); // 위시리스트 상태 반영
    },
    isInWishlist(movieId) {
      // 위시리스트에 영화가 있는지 확인
      return isMovieInWishlist(movieId);
    }
  }
};
</script>

<style scoped>
.movie-row-container {
  position: relative;
  display: flex;
  align-items: center;
}

.movie-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 20px 0;
  background-color: #141414;
  scroll-behavior: smooth;
}

.movie-row::-webkit-scrollbar {
  display: none;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  border-radius: 50%;
  z-index: 1;
}

.scroll-button.left {
  left: 10px;
}

.scroll-button.right {
  right: 10px;
}

.movie-item {
  flex: 0 0 auto;
  width: 200px;
  background-color: #1c1c1c;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.poster-container {
  position: relative;
}

.movie-item img {
  width: 100%;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.movie-item img.hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}

.movie-title {
  margin: 10px;
  color: #fff;
  font-size: 16px;
  text-align: center;
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  padding: 6px;
  z-index: 2;
  color: rgba(0, 0, 0, 0.6); /* 기본 비활성 상태 색상 */
  transition: background-color 0.3s ease, color 0.3s ease; /* 부드러운 전환 추가 */
}

.wishlist-btn.active {
  background: rgba(255, 215, 0, 0.8);
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease; /* 활성 상태에서도 동일 전환 효과 */
}

.wishlist-btn:hover {
  background: rgba(255, 215, 0, 1);
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease; /* 호버 상태에서도 부드럽게 전환 */
}

/* 반응형 */
@media (max-width: 768px) {
  .movie-title {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .movie-row {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* 모바일 환경에서 포스터 크기 축소 */
  }

  .movie-title {
    font-size: 0.7rem;
  }

  .scroll-button {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
}

/* 가로 화면 스타일 */
@media (orientation: landscape) {
  .movie-row-container {
    padding: 0 20px; /* 가로 화면에서 좌우 여백 추가 */
  }

  .movie-row {
    gap: 24px; /* 포스터 간 간격 확대 */
  }

  .movie-item {
    width: 150px; /* 포스터 크기 확대 */
  }

  .movie-title {
    font-size: 0.8rem; /* 가로 화면에서 글씨 크기 확대 */
  }

  .scroll-button {
    top: 60%; /* 가로 화면에서 버튼 위치 조정 */
    width: 36px; /* 버튼 크기 확대 */
    height: 36px;
    font-size: 20px; /* 버튼 아이콘 크기 확대 */
  }
}

</style>
