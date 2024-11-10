<template>
  <div class="search-movies">
    <h1>영화 검색</h1>

    <!-- 필터링 컴포넌트 -->
    <SearchFilter
        @applyFilters="applyFilters"
        @clearFilters="clearFilters"
    />

    <!-- 검색 결과 컴포넌트 -->
    <SearchResults
        :movies="movies"
        :loading="loading"
    />
  </div>
</template>

<script>
import { fetchMoviesByGenre, fetchMoviesByRating, fetchPopularMovies, fetchMoviesByGenreAndRating } from "@/services/tmdbService.js";
import SearchFilter from "@/components/SearchFilter.vue";
import SearchResults from "@/components/SearchResults.vue";

export default {
  name: "SearchMovies",
  components: {
    SearchFilter,
    SearchResults
  },
  data() {
    return {
      movies: [],
      genre: null,
      rating: null,
      loading: true,
    };
  },
  methods: {
    async applyFilters(filters) {
      this.loading = true;
      try {
        const { genre, rating } = filters;

        if (genre && rating) {
          // 장르와 평점을 동시에 필터링
          this.movies = await fetchMoviesByGenreAndRating(genre, rating);
        } else if (genre) {
          // 장르로만 필터링
          this.movies = await fetchMoviesByGenre(genre);
        } else if (rating) {
          // 평점으로만 필터링
          this.movies = await fetchMoviesByRating(rating);
        } else {
          // 기본 인기 영화 불러오기
          this.movies = await fetchPopularMovies();
        }
      } catch (error) {
        console.error("영화 필터링 중 오류가 발생했습니다:", error);
      } finally {
        this.loading = false;
      }
    },
    async clearFilters() {
      this.genre = null;
      this.rating = null;
      await this.loadDefaultMovies();
    },
    async loadDefaultMovies() {
      this.loading = true;
      try {
        this.movies = await fetchPopularMovies();
      } catch (error) {
        console.error("영화를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    await this.loadDefaultMovies();
  }
};
</script>
