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
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
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
