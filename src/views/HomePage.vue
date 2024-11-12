<template>
  <div class="home-page">
    <!-- HeroSection에 featuredMovies 배열을 movies prop으로 전달 -->
    <HeroSection v-if="featuredMovies.length" :movies="featuredMovies" />

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
      featuredMovies: [], // 다중 추천 영화 배열로 설정
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
        this.popularMovies = await fetchPopularMovies();
        this.loadingPopular = false;

        this.nowPlayingMovies = await fetchNowPlayingMovies();
        this.loadingNowPlaying = false;

        this.topRatedMovies = await fetchTopRatedMovies();
        this.loadingTopRated = false;

        this.upcomingMovies = await fetchUpcomingMovies();
        this.loadingUpcoming = false;

        // 인기 영화 중 상위 5개를 featuredMovies 배열에 저장
        this.featuredMovies = this.popularMovies.slice(0, 5);
        console.log("Featured Movies:", this.featuredMovies); // 확인용 로그
      } catch (error) {
        console.error("영화 데이터를 로드하는 중 오류가 발생했습니다:", error);
      }
    },
    toggleFavorite(movie) {
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
.loading-spinner {
  text-align: center;
  font-size: 1.2em;
  color: gray;
}
</style>
