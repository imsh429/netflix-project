<template>
  <div class="search-movies">
    <h1>영화 검색</h1>

    <!-- 필터링 컴포넌트 -->
    <SearchFilter
        :genres="genres"
        :ratings="ratings"
        @updateFilters="applyFilters"
    />

    <!-- 검색 결과 컴포넌트 -->
    <SearchResults
        :movies="filteredMovies"
        :loading="loading"
        :currentPage="currentPage"
        :hasMorePages="hasMorePages"
        @fetchPage="fetchMovies"
        @loadMore="loadMoreMovies"
    />
  </div>
</template>

<script>
import SearchFilter from "@/components/SearchFilter.vue";
import SearchResults from "@/components/SearchResults.vue";
import { fetchMovies, endpoints } from "@/services/tmdbService.js";

export default {
  name: "SearchMovies",
  components: {
    SearchFilter,
    SearchResults
  },
  data() {
    return {
      movies: [],
      filteredMovies: [],
      loading: true,
      currentPage: 1,
      hasMorePages: true,
      genres: [],
      ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      filters: {
        genre: "",
        rating: "",
        sort: ""
      }
    };
  },
  methods: {
    async fetchMovies(page = 1) {
      this.loading = true;
      try {
        const data = await fetchMovies(endpoints.genre, page);
        this.movies = data.results;
        this.filteredMovies = this.applyLocalFilters(this.movies);
        this.currentPage = page;
        this.hasMorePages = data.page < data.total_pages;
      } catch (error) {
        console.error("영화 데이터를 불러오는 중 오류:", error);
      } finally {
        this.loading = false;
      }
    },
    loadMoreMovies() {
      if (this.loading || !this.hasMorePages) return;
      const nextPage = this.currentPage + 1;
      this.fetchMovies(nextPage); // 다음 페이지 데이터를 가져옴
    },
    applyFilters(filters) {
      this.filters = filters;
      this.filteredMovies = this.applyLocalFilters(this.movies);
    },
    applyLocalFilters(movies) {
      let filtered = movies;

      if (this.filters.genre) {
        filtered = filtered.filter(movie => movie.genre_ids.includes(Number(this.filters.genre)));
      }
      if (this.filters.rating) {
        filtered = filtered.filter(movie => Math.floor(movie.vote_average) >= Number(this.filters.rating));
      }
      if (this.filters.sort === "popularity.desc") {
        filtered = filtered.sort((a, b) => b.popularity - a.popularity);
      } else if (this.filters.sort === "release_date.desc") {
        filtered = filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      } else if (this.filters.sort === "vote_average.desc") {
        filtered = filtered.sort((a, b) => b.vote_average - a.vote_average);
      }

      return filtered;
    }
  },
  async created() {
    await this.fetchMovies(this.currentPage);
  }
};
</script>

<style scoped>
.search-movies {
  padding: 2rem;
}
</style>
