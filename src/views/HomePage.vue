<template>
  <div class="home-page">
    <!-- HeroSection에 featuredMovies 배열을 movies prop으로 전달 -->
    <HeroSection v-if="featuredMovies.length" :movies="featuredMovies" />

    <section>
      <h2>인기 영화</h2>
      <div v-if="loadingPopular" class="loading-spinner">로딩 중...</div>
      <MovieRow
          v-else
          :movies="popularMovies"
          @movie-selected="goToMovieDetail"
          @toggleFavorite="toggleFavorite"
      />
    </section>

    <section>
      <h2>현재 상영작</h2>
      <div v-if="loadingNowPlaying" class="loading-spinner">로딩 중...</div>
      <MovieRow
          v-else
          :movies="nowPlayingMovies"
          @movie-selected="goToMovieDetail"
          @toggleFavorite="toggleFavorite"
      />
    </section>

    <section>
      <h2>최고 평점 영화</h2>
      <div v-if="loadingTopRated" class="loading-spinner">로딩 중...</div>
      <MovieRow
          v-else
          :movies="topRatedMovies"
          @movie-selected="goToMovieDetail"
          @toggleFavorite="toggleFavorite"
      />
    </section>

    <section>
      <h2>개봉 예정작</h2>
      <div v-if="loadingUpcoming" class="loading-spinner">로딩 중...</div>
      <MovieRow
          v-else
          :movies="upcomingMovies"
          @movie-selected="goToMovieDetail"
          @toggleFavorite="toggleFavorite"
      />
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
      favoriteMovies: JSON.parse(localStorage.getItem("favoriteMovies")) || []
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
    },
    goToMovieDetail(movieId) {
      // MovieDetail 페이지로 이동
      this.$router.push({ name: "MovieDetail", params: { id: movieId } });
    }
  },
  mounted() {
    this.loadMovies();
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 각 섹션 간 기본 간격 */
  background: linear-gradient(180deg, #1c1c1c, #111); /* 어두운 그라데이션 배경 */
  color: #1c1c1c;
  padding: 15px; /* 전체 패딩 줄이기 */
}

h2 {
  font-family: 'Poppins', sans-serif; /* 세련된 폰트 */
  font-size: 1.6rem; /* 글씨 크기 조금 더 줄이기 */
  font-weight: 700; /* 폰트 두껍게 */
  color: white;
  margin-bottom: 10px; /* 제목 아래 간격 줄이기 */
  text-align: left;
}

section {
  border-radius: 6px; /* 섹션 모서리 둥글기 */
  background-color: rgba(255, 255, 255, 0.04); /* 투명 배경 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 가벼운 그림자 */
}

.loading-spinner {
  text-align: left; /* 로딩 메시지 왼쪽 정렬 */
  font-size: 1rem;
  color: white;
  margin: 10px 0; /* 로딩 메시지 간격 축소 */
}

@media screen and (max-width: 768px) {
  h2 {
    font-size: 1.4rem; /* 모바일에서 글씨 크기 줄임 */
    text-align: left;
  }
  section {
    padding: 8px; /* 모바일에서 섹션 패딩 축소 */
    margin-bottom: 15px; /* 모바일 섹션 간 간격 줄이기 */
  }
}
@media (max-width: 480px) {
  .home-page {
    gap: 10px; /* 모바일에서는 간격 축소 */
  }
}

</style>




