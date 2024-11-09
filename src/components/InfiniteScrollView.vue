<template>
  <div class="infinite-view" @scroll="handleScroll">
    <div class="movies-grid">
      <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-item"
          :class="{ 'wishlist-added': isMovieInWishlist(movie.id) }"
          @click="toggleWishlist(movie)"
      >
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
        <p>{{ movie.title }}</p>
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- 맨 위로 이동 버튼 -->
    <button v-if="showTopButton" @click="scrollToTop" class="top-button">Top</button>
  </div>
</template>

<script>
export default {
  props: ["movies", "isMovieInWishlist", "toggleWishlist"],
  data() {
    return {
      isLoading: false,
      showTopButton: false,
    };
  },
  methods: {
    handleScroll(event) {
      const element = event.target;
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.loadMoreMovies();
      }
      this.showTopButton = element.scrollTop > 300;
    },
    loadMoreMovies() {
      this.isLoading = true;
      // 영화 로딩 로직 (예: API 호출)
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>


<style scoped>
.infinite-view {
  overflow-y: auto;
  height: 80vh;
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
.movie-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}
.movie-item img {
  width: 100%;
  border-radius: 8px;
}
.movie-item:hover img {
  transform: scale(1.05);
}
.movie-item.wishlist-added {
  border: 2px solid #ff0000; /* 추천 영화 스타일 차별화 */
}
.loading {
  text-align: center;
  margin-top: 1rem;
}
.top-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.5rem 1rem;
  background: #333;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}
</style>
