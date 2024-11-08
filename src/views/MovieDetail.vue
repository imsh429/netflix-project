<template>
  <div v-if="movie" class="movie-detail">
    <h1>{{ movie.title }}</h1>
    <img :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`" alt="movie backdrop" />
    <p>{{ movie.overview }}</p>
  </div>
  <div v-else class="loading">로딩 중...</div> <!-- 로딩 중인 경우 표시할 메시지 -->
</template>

<script>
import { fetchMovieDetails } from "@/services/tmdbService.js"; // 영화 세부 정보를 가져오는 함수

export default {
  name: "MovieDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      movie: null,
    };
  },
  async created() {
    try {
      const data = await fetchMovieDetails(this.id); // 영화 세부 정보 API 호출
      this.movie = data;
    } catch (error) {
      console.error("영화 세부 정보를 가져오는 중 오류 발생:", error);
    }
  },
};
</script>

<style scoped>
.movie-detail {
  padding: 2rem;
  color: white;
}
.loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>
