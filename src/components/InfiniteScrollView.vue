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
          window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100;
      if (bottomOfWindow && !this.loading) {
        this.$emit("loadMore");
      }
    },
    selectMovie(movieId) {
      this.$emit("movie-selected", movieId);
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
</style>
