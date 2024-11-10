<template>
  <div class="search-results">
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else>
      <div v-for="movie in movies" :key="movie.id" class="movie-item">
        <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchResults",
  props: ["movies", "loading"]
};
</script>
