<template>
  <div class="search-movies">
    <h1>영화 검색</h1>

    <!-- 필터링 및 정렬 컴포넌트 -->
    <SearchFilter
        @applyFilters="applyFilters"
        @clearFilters="clearFilters"
    />

    <!-- 보기 모드 선택 버튼 -->
    <div class="view-toggle">
      <button @click="changeView('table')" :class="{ active: viewMode === 'table' }">Table View</button>
      <button @click="changeView('infinite')" :class="{ active: viewMode === 'infinite' }">Infinite Scroll</button>
    </div>

    <!-- 검색 결과 컴포넌트 -->
    <SearchResults
        :movies="movies"
        :loading="loading"
        :viewMode="viewMode"
        @loadMore="loadMoreMovies"
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
      viewMode: 'table',  // 기본 보기 모드 설정
      currentPage: 1, // Infinite Scroll에 필요한 현재 페이지 번호
    };
  },
  methods: {
    async applyFilters(filters) {
      this.loading = true;
      try {
        const {genre, rating, sort} = filters; // 정렬 옵션 추가

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

        // 정렬 처리 (예: 인기순, 개봉년도 순)
        if (sort) {
          this.sortMovies(sort);
        }

      } catch (error) {
        console.error("영화 필터링 중 오류가 발생했습니다:", error);
      } finally {
        this.loading = false;
      }
    },
    sortMovies(sortOption) {
      if (sortOption === "popularity") {
        this.movies.sort((a, b) => b.popularity - a.popularity);
      } else if (sortOption === "release_date") {
        this.movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
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
    },
    changeView(view) {
      this.viewMode = view;
      this.currentPage = 1;
      this.loadDefaultMovies();
    },
    async loadMoreMovies() {
      if (this.loading || this.viewMode !== 'infinite') return;
      this.loading = true;
      this.currentPage += 1;
      try {
        const additionalMovies = await fetchPopularMovies(this.currentPage);
        this.movies = [...this.movies, ...additionalMovies];
      } catch (error) {
        console.error("영화를 더 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    await this.loadDefaultMovies();
  }
};
</script>

<style scoped>
.search-movies {
  padding: 2rem;
}

.view-toggle {
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
}

.view-toggle button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.view-toggle button.active {
  font-weight: bold;
}
</style>
