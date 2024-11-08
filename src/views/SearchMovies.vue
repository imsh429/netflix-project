<template>
  <div class="search-movies">
    <h1>영화 검색</h1>

    <!-- 필터링 및 초기화 버튼 -->
    <div class="filter-section">
      <select v-model="selectedGenre" @change="applyFilters">
        <option value="">장르 선택</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
      </select>

      <select v-model="selectedRating" @change="applyFilters">
        <option value="">평점 선택</option>
        <option v-for="rating in ratings" :key="rating">{{ rating }}</option>
      </select>

      <select v-model="selectedSort" @change="applyFilters">
        <option value="">정렬 방식 선택</option>
        <option value="popularity.desc">인기순</option>
        <option value="release_date.desc">최신 개봉순</option>
        <option value="vote_average.desc">평점 높은순</option>
      </select>

      <button @click="resetFilters">초기화</button>
    </div>

    <!-- 검색 결과 View 선택 -->
    <div class="view-toggle">
      <button @click="changeView('table')" :class="{ active: viewMode === 'table' }">Table View</button>
      <button @click="changeView('infinite')" :class="{ active: viewMode === 'infinite' }">Infinite Scroll</button>
    </div>

    <!-- 검색 결과 View -->
    <TableView
        v-if="viewMode === 'table'"
        :movies="filteredMovies"
        :currentPage="currentPage"
        :hasMorePages="hasMorePages"
        @fetchPage="fetchMovies"
    />

    <InfiniteScrollView
        v-if="viewMode === 'infinite'"
        :movies="filteredMovies"
        :loading="loading"
        @loadMore="loadMoreMovies"
    />
  </div>
</template>

<script>
import TableView from "@/components/TableView.vue";
import InfiniteScrollView from "@/components/InfiniteScrollView.vue";
import { fetchMovies, endpoints } from "@/services/tmdbService.js";

export default {
  name: "SearchMovies",
  components: {
    TableView,
    InfiniteScrollView
  },
  data() {
    return {
      movies: [],
      filteredMovies: [],
      loading: true,
      viewMode: "table",
      currentPage: 1,
      hasMorePages: true,
      genres: [],
      ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      selectedGenre: "",
      selectedRating: "",
      selectedSort: ""
    };
  },
  methods: {
    async fetchMovies(page = 1) {
      this.loading = true;
      try {
        const url = `${endpoints.genre}?api_key=YOUR_API_KEY&language=ko-KR&page=${page}`;
        const data = await fetchMovies(url);
        this.movies = data.results;
        this.filteredMovies = this.movies;
        this.currentPage = page;
        this.hasMorePages = data.page < data.total_pages;
      } catch (error) {
        console.error("영화 데이터를 불러오는 중 오류:", error);
      } finally {
        this.loading = false;
      }
    },
    async loadMoreMovies() {
      if (this.loading || !this.hasMorePages) return;
      this.loading = true;
      try {
        const nextPage = this.currentPage + 1;
        const url = `${endpoints.genre}?api_key=YOUR_API_KEY&language=ko-KR&page=${nextPage}`;
        const data = await fetchMovies(url);
        this.movies = [...this.movies, ...data.results];
        this.filteredMovies = this.applyLocalFilters(this.movies);
        this.currentPage = nextPage;
        this.hasMorePages = data.page < data.total_pages;
      } catch (error) {
        console.error("추가 영화 데이터를 불러오는 중 오류:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchGenres() {
      try {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=YOUR_API_KEY&language=ko-KR`;
        const data = await fetchMovies(url);
        this.genres = data.genres;
      } catch (error) {
        console.error("장르 데이터를 불러오는 중 오류:", error);
      }
    },
    applyFilters() {
      this.filteredMovies = this.applyLocalFilters(this.movies);
    },
    applyLocalFilters(movies) {
      let filtered = movies;

      if (this.selectedGenre) {
        filtered = filtered.filter(movie => movie.genre_ids.includes(Number(this.selectedGenre)));
      }
      if (this.selectedRating) {
        filtered = filtered.filter(movie => Math.floor(movie.vote_average) >= Number(this.selectedRating));
      }
      if (this.selectedSort === "popularity.desc") {
        filtered = filtered.sort((a, b) => b.popularity - a.popularity);
      } else if (this.selectedSort === "release_date.desc") {
        filtered = filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      } else if (this.selectedSort === "vote_average.desc") {
        filtered = filtered.sort((a, b) => b.vote_average - a.vote_average);
      }

      return filtered;
    },
    resetFilters() {
      this.selectedGenre = "";
      this.selectedRating = "";
      this.selectedSort = "";
      this.filteredMovies = this.movies;
    },
    changeView(view) {
      this.viewMode = view;
      this.movies = [];
      this.fetchMovies(1);
    }
  },
  async created() {
    await this.fetchMovies(this.currentPage);
    await this.fetchGenres();
  }
};
</script>

<style scoped>
.search-movies {
  padding: 2rem;
}
.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.filter-section select, .filter-section button {
  padding: 0.5rem;
}
.view-toggle {
  margin-bottom: 1rem;
}
.view-toggle button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.view-toggle button.active {
  font-weight: bold;
}
</style>
