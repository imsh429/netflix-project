<template>
  <div class="search-results">
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else class="infinite-scroll">
      <div v-for="movie in movies" :key="movie.id" class="movie-item">
        <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
      </div>
      <div v-if="loading" class="loading">로딩 중...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchResults",
  props: ["movies", "loading"],
  methods: {
    onScroll() {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
      if (bottom) {
        this.$emit("loadMore");
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }
};
</script>

<style scoped>
.search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.infinite-scroll {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.movie-item {
  width: 200px;
  text-align: center;
}
.loading {
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}
</style>
