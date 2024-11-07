<template>
  <div>
    <h1>넷플릭스 클론</h1>
    <section>
      <h2>인기 영화</h2>
      <MovieRow :movies="popularMovies" />
    </section>
    <section>
      <h2>현재 상영작</h2>
      <MovieRow :movies="nowPlayingMovies" />
    </section>
    <section>
      <h2>장르별 영화</h2>
      <MovieRow :movies="genreMovies" />
    </section>
  </div>
</template>

<script>
import MovieRow from "@/components/MovieRow.vue";
import { fetchMovies, endpoints } from "@/services/tmdbService.js";

export default {
  components: {
    MovieRow
  },
  data() {
    return {
      popularMovies: [],
      nowPlayingMovies: [],
      genreMovies: []
    };
  },
  async created() {
    try {
      const popularData = await fetchMovies(endpoints.popular);
      const nowPlayingData = await fetchMovies(endpoints.nowPlaying);
      const genreData = await fetchMovies(endpoints.genre);

      this.popularMovies = popularData.results;
      this.nowPlayingMovies = nowPlayingData.results;
      this.genreMovies = genreData.results;
    } catch (error) {
      console.error("영화 데이터를 불러오는 중 오류:", error);
    }
  }
};
</script>

<style>
/* 필요에 따라 스타일 추가 */
</style>
