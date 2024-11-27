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

    <!-- 최근 검색어 -->
    <div class="recent-searches" v-if="recentSearches.length">
      <h4>최근 검색어</h4>
      <ul>
        <li v-for="search in recentSearches" :key="search">
          <span @click="selectRecentSearch(search)" class="search-text">
            {{ search }}
          </span>
          <button @click="removeSearch(search)" class="remove-btn">❌</button>
        </li>
      </ul>
      <button class="clear-btn" @click="clearSearchHistory">전체 기록 삭제</button>
    </div>

    <!-- 필터링 및 카테고리 탐색 -->
    <div class="filter-section" v-if="!searchQuery">
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
        v-else-if="movies.length > 0"
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
import { getRecentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } from "@/utils/storage";

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
    const recentSearches = ref(getRecentSearches());

    const applySearch = async () => {
      if (!searchQuery.value.trim()) {
        loadDefaultMovies();
        return;
      }

      // 검색어 저장
      addRecentSearch(searchQuery.value);
      recentSearches.value = getRecentSearches(); // UI 업데이트

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
      router.push({name: "MovieDetail", params: {id: movieId}});
    };

    const selectRecentSearch = (search) => {
      searchQuery.value = search;
      applySearch();
    };

    const clearSearchHistory = () => {
      clearRecentSearches();
      recentSearches.value = [];
    };

    const removeSearch = (search) => {
      removeRecentSearch(search);
      recentSearches.value = getRecentSearches(); // UI 업데이트
    };

    return {
      searchQuery,
      movies,
      loading,
      currentPage,
      hasMorePages,
      recentSearches,
      applySearch,
      applyFilters,
      clearFilters,
      fetchMovies,
      goToMovieDetail,
      selectRecentSearch,
      removeSearch,
      clearSearchHistory,
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap; /* 작은 화면에서 검색 바가 줄바꿈되도록 설정 */

}

.search-bar input {
  flex: 1; /* 입력창이 넓이를 유연하게 차지 */
  max-width: 400px;
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 5px;
  font-size: clamp(0.9rem, 1.5vw, 1.2rem); /* 반응형 폰트 크기 */  outline: none;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.search-bar button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.8rem, 1vw, 1rem); /* 반응형 폰트 크기 */
  transition: transform 0.2s ease, background-color 0.3s ease;
}


.search-bar button:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

.recent-searches {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2e2e2e;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.recent-searches h4 {
  margin-bottom: 1rem;
  font-size: clamp(1rem, 2vw, 1.3rem); /* 반응형 폰트 */
  color: #a3a2a2;
}

.recent-searches ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* 그리드로 검색어 배치 */
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-searches li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #252525;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.recent-searches li:last-child {
  border-bottom: none;
}

.recent-searches li:hover {
  background-color: #3d3d3d;
  transform: scale(1.05);
}

.search-text {
  cursor: pointer;
  color: white;
  font-size: clamp(0.9rem, 1vw, 1rem);
  transition: color 0.3s ease;
}

.search-text:hover {
  color: #007bff;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s ease, color 0.3s ease;
}

.remove-btn:hover {
  color: #ff0000;
  transform: scale(1.1);
}

.clear-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  margin-top: 1rem;
  text-align: center;
  display: block;
  font-size: 0.9rem;
}

.clear-btn:hover {
  color: #ff0000;
  text-decoration: underline;
}
.loading {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
/* 미디어 쿼리 */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column; /* 검색 바를 세로로 배치 */
    align-items: stretch;
  }

  .search-bar input,
  .search-bar button {
    width: 100%; /* 검색 바 요소가 전체 너비 차지 */
  }

  .recent-searches ul {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}

@media (orientation: landscape) {
  .recent-searches ul {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>


