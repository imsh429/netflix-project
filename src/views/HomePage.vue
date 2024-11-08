<template>
  <div class="home-page">
    <h1>넷플릭스 클론</h1>

    <!-- 인기 영화 섹션 -->
    <section>
      <h2>인기 영화</h2>
      <div v-if="loadingPopular" class="loading-spinner">로딩 중...</div>
      <MovieRow v-else :movies="popularMovies" />
    </section>

    <!-- 현재 상영작 섹션 -->
    <section>
      <h2>현재 상영작</h2>
      <div v-if="loadingNowPlaying" class="loading-spinner">로딩 중...</div>
      <MovieRow v-else :movies="nowPlayingMovies" />
    </section>

    <!-- 장르별 영화 섹션 -->
    <section>
      <h2>장르별 영화</h2>
      <div v-if="loadingGenre" class="loading-spinner">로딩 중...</div>
      <MovieRow v-else :movies="genreMovies" />
    </section>

    <!-- 추천 영화 섹션 -->
    <section v-if="wishlistMovies.length > 0">
      <h2>추천 영화</h2>
      <MovieRow :movies="wishlistMovies" />
    </section>
  </div>
</template>

<script>
import MovieRow from "@/components/MovieRow.vue";
import { fetchMovies, endpoints } from "@/services/tmdbService.js";
import { getWishlistMovies } from "@/utils/storage.js";

export default {
  name: "HomePage",
  components: {
    MovieRow
  },
  data() {
    return {
      popularMovies: [],
      nowPlayingMovies: [],
      genreMovies: [],
      wishlistMovies: [],
      loadingPopular: true,
      loadingNowPlaying: true,
      loadingGenre: true
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
    } finally {
      this.loadingPopular = false;
      this.loadingNowPlaying = false;
      this.loadingGenre = false;
    }

    // 추천 영화 데이터를 Local Storage에서 불러오기
    this.wishlistMovies = getWishlistMovies();
  }
};
</script>

<style scoped>
.home-page {
  padding: 2rem;
}
.loading-spinner {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 1rem 0;
}
section {
  margin-bottom: 2rem;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
