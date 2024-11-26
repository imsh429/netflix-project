<template>
  <div class="wishlist-infinite-view">
    <!-- 무한 스크롤 영화 목록 그리드 -->
    <div class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-item">
        <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="poster-image"
        />
        <p>{{ movie.title }}</p>
        <button class="wishlist-btn" @click="removeFromWishlist(movie.id)">
          ❤️
        </button>
      </div>
    </div>

    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="loading-message">
      더 불러오는 중...
    </div>
    <div v-if="noMoreMovies" class="end-message">
      더 이상 불러올 영화가 없습니다.
    </div>
  </div>
</template>

<script>
import { getWishlistMovies, removeMovieFromWishlist } from "@/utils/storage.js";

export default {
  name: "WishlistInfiniteView",
  data() {
    return {
      movies: [], // 현재 표시 중인 영화 목록
      isLoading: false, // 로딩 상태
      noMoreMovies: false, // 더 이상 영화가 없을 때 표시
      page: 1, // 현재 페이지 번호
      moviesPerPage: 10, // 한 번에 불러올 영화 수
    };
  },
  methods: {
    loadMoreMovies() {
      if (this.isLoading || this.noMoreMovies) return;

      this.isLoading = true;

      // 로컬 스토리지에서 영화 데이터를 가져오고 페이징 처리
      const allMovies = getWishlistMovies();
      const startIndex = (this.page - 1) * this.moviesPerPage;
      const endIndex = this.page * this.moviesPerPage;
      const nextMovies = allMovies.slice(startIndex, endIndex);

      if (nextMovies.length > 0) {
        this.movies = [...this.movies, ...nextMovies];
        this.page += 1;
      } else {
        // 더 이상 로드할 영화가 없으면 상태 업데이트
        this.noMoreMovies = true;
      }

      this.isLoading = false;
    },
    removeFromWishlist(movieId) {
      removeMovieFromWishlist(movieId);
      this.movies = this.movies.filter((movie) => movie.id !== movieId);
    },
    handleScroll() {
      const bottomOffset = 100;
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;

      if (scrollPosition + bottomOffset >= documentHeight) {
        this.loadMoreMovies();
      }
    },
  },
  mounted() {
    this.loadMoreMovies();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.movie-item {
  position: relative;
  text-align: center;
  overflow: hidden;
}

.movie-item .poster-image {
  width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-item .poster-image:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
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
}

.wishlist-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  color: white;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 1rem;
  color: white;
}

.end-message {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 1rem;
  color: #aaa;
}
</style>
