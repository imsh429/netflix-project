<template>
  <div class="infinite-view" @scroll="handleScroll">
    <div class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-item">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
        <p>{{ movie.title }}</p>
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="loading" class="loading">로딩 중...</div>

    <!-- 맨 위로 이동 버튼 -->
    <button v-if="showTopButton" class="top-button" @click="scrollToTop">Top</button>
  </div>
</template>

<script>
export default {
  name: "InfiniteScrollView",
  props: {
    movies: Array,
    loading: Boolean
  },
  data() {
    return {
      showTopButton: false
    };
  },
  methods: {
    handleScroll() {
      const bottom = this.$el.scrollTop + this.$el.clientHeight >= this.$el.scrollHeight;
      this.showTopButton = this.$el.scrollTop > 200;
      if (bottom) {
        this.$emit("loadMore"); // 무한 스크롤 이벤트
      }
    },
    scrollToTop() {
      this.$el.scrollTop = 0;
    }
  }
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
.movie-item img {
  width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease;
}
.movie-item img:hover {
  transform: scale(1.05);
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
