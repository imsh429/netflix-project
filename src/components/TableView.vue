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
</template>

<script>
import { addMovieToWishlist, removeMovieFromWishlist, isMovieInWishlist } from "@/utils/storage.js";

export default {
  name: "TableView",
  props: {
    movies: Array,
    currentPage: Number,
    hasMorePages: Boolean,
  },
  methods: {
    selectMovie(movieId) {
      // 부모 컴포넌트로 movie-selected 이벤트를 전달
      this.$emit("movie-selected", movieId);
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 포스터 크기 조정 */
  gap: 1.5rem; /* 카드 간격 */
  padding: 1rem;
  min-height: calc(100vh - 100px); /* 페이지네이션 버튼을 밀어내기 위한 최소 높이 */
  box-sizing: border-box;
  position: relative; /* 하단 버튼 위치를 기준으로 배치 */
}

.movie-item {
  position: relative; /* 하트 버튼 배치를 위한 부모 요소 기준 */
  text-align: center;
  overflow: hidden; /* 확대된 포스터가 넘치지 않도록 설정 */
  transition: transform 0.3s ease; /* 확대 시 부드럽게 */
}

.movie-item:hover {
  transform: scale(1); /* 마우스 올렸을 때 카드 확대 */
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
  font-size: 16px;
}

.pagination {
  position: absolute; /* 부모 컨테이너 안에서 절대 위치 */
  bottom: -20px; /* 페이지 하단에 배치 */
  left: 50%; /* 중앙 정렬 */
  transform: translateX(-50%); /* 정확히 중앙에 위치하도록 조정 */
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%; /* 버튼들을 중앙에 맞추기 위해 전체 너비 사용 */
  padding: 1rem 0; /* 약간의 여백 추가 */
}

.pagination button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
</style>
