<template>
  <div class="infinite-scroll">
    <div v-for="movie in movies" :key="movie.id" class="movie-item">
      <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
      <h3>{{ movie.title }}</h3>
    </div>
    <div v-if="loading" class="loading">로딩 중...</div>
  </div>
</template>

<script>
export default {
  name: "InfiniteScrollView",
  props: {
    movies: Array,
    loading: Boolean,
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const bottomOfWindow =
          window.innerHeight + window.scrollY >= document.documentElement.offsetHeight;
      if (bottomOfWindow && !this.loading) {
        this.$emit("loadMore");
      }
    },
  },
};
</script>

<style scoped>
.infinite-scroll {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 화면 크기에 맞춰 자동 조정 */
  gap: 1rem; /* 포스터 사이의 간격 */
  padding: 1rem; /* 전체 그리드에 여백 추가 */
}
.movie-item {
  text-align: center;
}
.loading {
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}
</style>


