<template>
  <div class="table-view">
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
    <div class="pagination">
      <button @click="$emit('fetchPage', currentPage - 1)" :disabled="currentPage === 1">
        이전
      </button>
      <span>{{ currentPage }}</span>
      <button @click="$emit('fetchPage', currentPage + 1)" :disabled="!hasMorePages">
        다음
      </button>
    </div>
  </div>
  <ReusableModal :visible="showDetailModal" @close="closeDetailModal">
    <MovieDetail v-if="selectedMovie" :id="selectedMovie.id" />
  </ReusableModal>
</template>

<script>
import { addMovieToWishlist, removeMovieFromWishlist, isMovieInWishlist } from "@/utils/storage.js";
import MovieDetail from "@/views/MovieDetail.vue";
import ReusableModal from "@/components/ReusableModal.vue";

export default {
  name: "TableView",
  components: {
    MovieDetail,
    ReusableModal,
  },
  data() {
    return {
      showDetailModal: false, // 상세정보 모달 표시 여부
      selectedMovie: null,    // 선택된 영화 데이터
    };
  },
  props: {
    movies: Array,
    currentPage: Number,
    hasMorePages: Boolean,
  },
  methods: {
    selectMovie(movieId) {
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

.table-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* 포스터 크기 조정 */
  gap: 0.5rem; /* 카드 간격 */
  padding: 0.5rem;
  box-sizing: border-box;
  grid-auto-rows: 1fr; /* 카드의 높이를 균일하게 유지 */
  position: relative; /* 하단 버튼 위치를 기준으로 배치 */
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
  height: auto; /* 반응형 크기 유지 */
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
  font-size: 1rem;
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
  font-size: clamp(0.8rem, 1vw, 1.2rem); /* 반응형 폰트 크기 */
}

.pagination {
  position: absolute; /* 부모 컨테이너 안에서 절대 위치 */
  bottom: 0px; /* 페이지 하단에 배치 */
  left: 50%; /* 중앙 정렬 */
  transform: translateX(-50%); /* 정확히 중앙에 위치하도록 조정 */
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;

}

.pagination button {
  padding: 0.5rem 1rem;
  font-size: clamp(0.8rem, 1vw, 1rem);
  font-family: 'Roboto', sans-serif; /* 현대적인 폰트 추가 */
  background-color: #333333; /* 어두운 배경 */
  color: #ffffff; /* 흰색 텍스트 */
  border: 1px solid #444444; /* 다크 테마에 맞는 경계 */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease; /* 부드러운 전환 추가 */
}

.pagination button:hover:not(:disabled) {
  background-color: #555555; /* 호버 시 약간 밝은 회색 */
  transform: scale(1.05); /* 호버 시 살짝 확대 */
}

.pagination button:disabled {
  background-color: #222222; /* 비활성화 상태 배경 */
  color: #666666; /* 비활성화 상태 텍스트 */
  border: 1px solid #333333; /* 비활성화 경계 색상 */
  cursor: not-allowed;
}

/* 미디어 쿼리 */
@media (max-width: 768px) {
  .table-view {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* 모바일에서 카드 크기 축소 */
    gap: 0.3rem; /* 카드 간격 축소 */
  }

  .movie-title {
    font-size: clamp(0.7rem, 1vw, 1rem);
  }

  .pagination button {
    font-size: clamp(0.7rem, 1vw, 0.9rem); /* 모바일에서 버튼 크기 축소 */
    padding: 0.3rem 0.8rem;
  }
}

@media (orientation: landscape) {
  .table-view {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* 가로 모드에서 카드 크기 조정 */
  }

  .pagination button {
    font-size: clamp(0.8rem, 1vw, 1rem);
    padding: 0.5rem 1rem;
  }
}
</style>
