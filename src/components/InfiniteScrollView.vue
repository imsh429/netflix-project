<template>
  <div class="infinite-scroll">
    <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-item"
        @click="selectMovie(movie.id)"
    >
      <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title || '영화 포스터'"
      />
      <h3>{{ movie.title }}</h3>
    </div>
    <div v-if="loading" class="loading">로딩 중...</div>

    <!-- Top 버튼 추가 -->
    <button v-if="showTopButton" class="top-button" @click="scrollToTop">
      Top
    </button>
  </div>
</template>

<script>
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
      window.scrollTo({top: 0, behavior: "smooth"});
    },
  },
};
</script>

<style scoped>
.infinite-scroll {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.movie-item {
  text-align: center;
  cursor: pointer;
}

.movie-item img {
  width: 100%;
  border-radius: 8px;
}

.loading {
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}

/* Top 버튼 스타일 */
.top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  font-size: 16px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.top-button:hover {
  opacity: 1;
}
</style>
