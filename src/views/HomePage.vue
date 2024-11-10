<template>
  <div class="home-page">
    <HeroSection v-if="featuredMovie" :movie="featuredMovie" />

    <section>
      <h2>인기 영화</h2>
      <div v-if="loadingPopular" class="loading-spinner">로딩 중...</div>
      <MovieRow v-else :movies="popularMovies" @toggleFavorite="toggleFavorite" />
    </section>

    <section>
      <h2>현재 상영작</h2>
      <div v-if="loadingNowPlaying" class="loading-spinner">로딩 중...</div>
      <MovieRow v-else :movies="nowPlayingMovies" @toggleFavorite="toggleFavorite" />
    </section>

    <section>
      <h2>최고 평점 영화</h2>
      <div v-if="loadingTopRated" class="loading-spinner">로딩 중...</div>
      <MovieRow v-else :movies="topRatedMovies" @toggleFavorite="toggleFavorite" />
    </section>

    <section>
      <h2>개봉 예정작</h2>
      <div v-if="loadingUpcoming" class="loading-spinner">로딩 중...</div>
      <MovieRow v-else :movies="upcomingMovies" @toggleFavorite="toggleFavorite" />
    </section>
  </div>
</template>

<script>
import HeroSection from "@/components/HeroSection.vue";
import MovieRow from "@/components/MovieRow.vue";
import { fetchPopularMovies, fetchNowPlayingMovies, fetchTopRatedMovies, fetchUpcomingMovies } from "@/services/tmdbService.js";

export default {
  components: { HeroSection, MovieRow },
  data() {
    return {
      featuredMovie: null,
      popularMovies: [],
      nowPlayingMovies: [],
      topRatedMovies: [],
      upcomingMovies: [],
      loadingPopular: true,
      loadingNowPlaying: true,
      loadingTopRated: true,
      loadingUpcoming: true,
      favoriteMovies: JSON.parse(localStorage.getItem("favoriteMovies")) || [],
    };
  },
  methods: {
    async loadMovies() {
      try {
        // 각 영화 리스트를 가져오는 TMDB API 호출
        this.popularMovies = await fetchPopularMovies();
        this.loadingPopular = false;

        this.nowPlayingMovies = await fetchNowPlayingMovies();
        this.loadingNowPlaying = false;

        this.topRatedMovies = await fetchTopRatedMovies();
        this.loadingTopRated = false;

        this.upcomingMovies = await fetchUpcomingMovies();
        this.loadingUpcoming = false;

        // 추천 영화에 featuredMovie 설정
        this.featuredMovie = this.popularMovies[0] || null;
      } catch (error) {
        console.error("영화 데이터를 로드하는 중 오류가 발생했습니다:", error);
      }
    },
    toggleFavorite(movie) {
      // 추천 영화 등록/삭제 및 로컬 스토리지 저장
      const index = this.favoriteMovies.findIndex(fav => fav.id === movie.id);
      if (index >= 0) {
        this.favoriteMovies.splice(index, 1);
      } else {
        this.favoriteMovies.push(movie);
      }
      localStorage.setItem("favoriteMovies", JSON.stringify(this.favoriteMovies));
    }
  },
  mounted() {
    this.loadMovies();
  }
};
</script>

<style scoped>
/* 홈 페이지 스타일 */
.loading-spinner {
  text-align: center;
  font-size: 1.2em;
  color: gray;
}
</style>
