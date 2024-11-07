<template>
  <div class="popular-movies">
    <h1>인기 영화</h1>
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-item">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
        <p>{{ movie.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchMovies, endpoints } from "@/services/tmdbService.js";

export default {
  name: "PopularMovies",
  data() {
    return {
      movies: [],
      loading: true
    };
  },
  async created() {
    try {
      const data = await fetchMovies(endpoints.popular);
      this.movies = data.results;
    } catch (error) {
      console.error("영화 데이터를 불러오는 중 오류:", error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.popular-movies {
  padding: 2rem;
}
.loading {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 2rem;
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
.movie-item p {
  text-align: center;
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #333;
}
</style>
