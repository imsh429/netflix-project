<template>
  <div class="search-movies">
    <!-- 상단 검색 바 -->
    <div class="search-bar">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="제목으로 검색하세요"
          @keyup.enter="applySearch"
      />
      <button @click="applySearch">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- 필터링 및 카테고리 탐색 -->
    <div class="filter-section" v-if="!searchQuery">
      <h2 class="filter-title">필터링 및 탐색</h2>
      <SearchFilter
          @applyFilters="applyFilters"
          @clearFilters="clearFilters"
      />
    </div>

    <!-- 검색 결과 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p class="loading-text">검색 중...</p>
    </div>

    <TableView
        v-else
        :movies="movies"
        :currentPage="currentPage"
        :hasMorePages="hasMorePages"
        @fetchPage="fetchMovies"
        @movie-selected="goToMovieDetail"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import TableView from "@/components/TableView.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import {
  fetchMoviesByQuery,
  fetchMoviesByGenre,
  fetchMoviesByRating,
  fetchPopularMovies,
  fetchMoviesByGenreAndRating,
} from "@/services/tmdbService.js";

export default {
  name: "SearchMovies",
  components: {
    TableView,
    SearchFilter,
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref("");
    const genre = ref(null);
    const rating = ref(null);
    const sortOption = ref("");
    const movies = ref([]);
    const loading = ref(false);
    const currentPage = ref(1);
    const hasMorePages = ref(true);

    const applySearch = async () => {
      if (!searchQuery.value) {
        loadDefaultMovies();
        return;
      }
      loading.value = true;
      currentPage.value = 1;
      try {
        movies.value = await fetchMoviesByQuery(searchQuery.value, currentPage.value);
        hasMorePages.value = movies.value.length > 0;
      } catch (error) {
        console.error("영화 검색 중 오류가 발생했습니다:", error);
      } finally {
        loading.value = false;
      }
    };

    const applyFilters = async (filters) => {
      loading.value = true;
      currentPage.value = 1;
      genre.value = filters.genre;
      rating.value = filters.rating;
      sortOption.value = filters.sort;
      try {
        if (genre.value && rating.value) {
          movies.value = await fetchMoviesByGenreAndRating(genre.value, rating.value, currentPage.value);
        } else if (genre.value) {
          movies.value = await fetchMoviesByGenre(genre.value, currentPage.value);
        } else if (rating.value) {
          movies.value = await fetchMoviesByRating(rating.value, currentPage.value);
        } else {
          movies.value = await fetchPopularMovies(currentPage.value);
        }

        if (sortOption.value) {
          sortMovies(sortOption.value);
        }

        hasMorePages.value = movies.value.length > 0;
      } catch (error) {
        console.error("영화 필터링 중 오류가 발생했습니다:", error);
      } finally {
        loading.value = false;
      }
    };

    const sortMovies = (sort) => {
      if (sort === "popularity") {
        movies.value.sort((a, b) => b.popularity - a.popularity);
      } else if (sort === "release_date") {
        movies.value.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      }
    };

    const clearFilters = async () => {
      genre.value = null;
      rating.value = null;
      sortOption.value = "";
      searchQuery.value = "";
      currentPage.value = 1;
      await loadDefaultMovies();
    };

    const loadDefaultMovies = async () => {
      loading.value = true;
      try {
        movies.value = await fetchPopularMovies(currentPage.value);
        hasMorePages.value = movies.value.length > 0;
      } catch (error) {
        console.error("기본 영화를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchMovies = async (page) => {
      loading.value = true;
      currentPage.value = page;
      try {
        if (searchQuery.value) {
          const additionalMovies = await fetchMoviesByQuery(searchQuery.value, page);
          movies.value = additionalMovies;
        } else if (genre.value || rating.value) {
          if (genre.value && rating.value) {
            movies.value = await fetchMoviesByGenreAndRating(genre.value, rating.value, page);
          } else if (genre.value) {
            movies.value = await fetchMoviesByGenre(genre.value, page);
          } else if (rating.value) {
            movies.value = await fetchMoviesByRating(rating.value, page);
          }
        } else {
          movies.value = await fetchPopularMovies(page);
        }

        if (sortOption.value) {
          sortMovies(sortOption.value);
        }

        hasMorePages.value = movies.value.length > 0;
      } catch (error) {
        console.error("페이지 변경 중 오류가 발생했습니다:", error);
      } finally {
        loading.value = false;
      }
    };

    const goToMovieDetail = (movieId) => {
      router.push({ name: "MovieDetail", params: { id: movieId } });
    };

    return {
      searchQuery,
      movies,
      loading,
      currentPage,
      hasMorePages,
      applySearch,
      applyFilters,
      clearFilters,
      fetchMovies,
      goToMovieDetail,
    };
  },
};
</script>

<style scoped>
.search-movies {
  padding: 2rem;
  background-color: #1c1c1c;
  color: #fff;
  min-height: 100vh;
}

/* 상단 검색 바 */
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  width: 400px;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
}

.search-bar button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.search-bar button i {
  font-size: 1.2rem;
}

/* 필터 섹션 */
.filter-section {
  padding: 1rem;
  background-color: #2b2b2b;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* 로딩 스피너 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: #ccc;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
