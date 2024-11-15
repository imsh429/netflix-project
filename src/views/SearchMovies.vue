<template>
  <div class="search-movies">
    <h1>영화 검색</h1>

    <!-- 영화 제목으로 검색하는 부분 -->
    <div class="search-bar">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="영화 제목을 입력하세요"
          @keyup.enter="applySearch"
      />
      <button @click="applySearch">검색</button>
    </div>

    <!-- 필터링 및 정렬 옵션 (검색어가 없을 경우에만 사용) -->
    <div v-if="!searchQuery">
      <SearchFilter
          @applyFilters="applyFilters"
          @clearFilters="clearFilters"
      />
    </div>

    <!-- 검색 결과 컴포넌트 (Table View) -->
    <TableView
        :movies="movies"
        :currentPage="currentPage"
        :hasMorePages="hasMorePages"
        @fetchPage="fetchMovies"
        @movie-selected="goToMovieDetail"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TableView from "@/components/TableView.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import { fetchMoviesByQuery, fetchMoviesByGenre, fetchMoviesByRating, fetchPopularMovies, fetchMoviesByGenreAndRating } from "@/services/tmdbService.js";

export default {
  name: "SearchMovies",
  components: {
    TableView,
    SearchFilter,
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref(""); // 영화 제목 검색어
    const genre = ref(null); // 필터링할 장르
    const rating = ref(null); // 필터링할 평점
    const sortOption = ref(""); // 정렬 옵션 추가
    const movies = ref([]);
    const loading = ref(false);
    const currentPage = ref(1);
    const hasMorePages = ref(true);

    // 검색 기능
    const applySearch = async () => {
      if (!searchQuery.value) {
        loadDefaultMovies(); // 검색어가 없을 경우 기본 영화 로드
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

    // 필터링 기능
    const applyFilters = async (filters) => {
      loading.value = true;
      currentPage.value = 1; // 페이지를 1로 초기화
      genre.value = filters.genre; // 필터 값을 업데이트
      rating.value = filters.rating;
      sortOption.value = filters.sort; // 정렬 옵션 추가
      try {
        // 장르와 평점에 따라 영화 필터링
        if (genre.value && rating.value) {
          movies.value = await fetchMoviesByGenreAndRating(genre.value, rating.value, currentPage.value);
        } else if (genre.value) {
          movies.value = await fetchMoviesByGenre(genre.value, currentPage.value);
        } else if (rating.value) {
          movies.value = await fetchMoviesByRating(rating.value, currentPage.value);
        } else {
          movies.value = await fetchPopularMovies(currentPage.value);
        }

        // 정렬 옵션이 있을 경우 정렬 적용
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

    // 정렬 기능
    const sortMovies = (sort) => {
      if (sort === "popularity") {
        movies.value.sort((a, b) => b.popularity - a.popularity);
      } else if (sort === "release_date") {
        movies.value.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      }
    };

    // 필터 초기화
    const clearFilters = async () => {
      genre.value = null;
      rating.value = null;
      sortOption.value = ""; // 정렬 옵션 초기화
      searchQuery.value = "";
      currentPage.value = 1;
      await loadDefaultMovies();
    };

    // 기본 영화 로드
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

    // 페이지 변경 시 필터를 유지하며 새로운 영화 데이터를 가져옴
    const fetchMovies = async (page) => {
      loading.value = true;
      currentPage.value = page;
      try {
        if (searchQuery.value) {
          // 검색어가 있을 경우 해당 검색어로 페이지 변경
          const additionalMovies = await fetchMoviesByQuery(searchQuery.value, page);
          movies.value = additionalMovies;
        } else if (genre.value || rating.value) {
          // 필터가 적용된 경우 해당 필터와 함께 페이지 변경
          if (genre.value && rating.value) {
            movies.value = await fetchMoviesByGenreAndRating(genre.value, rating.value, page);
          } else if (genre.value) {
            movies.value = await fetchMoviesByGenre(genre.value, page);
          } else if (rating.value) {
            movies.value = await fetchMoviesByRating(rating.value, page);
          }
        } else {
          // 필터나 검색어가 없는 경우 기본 인기 영화 불러오기
          movies.value = await fetchPopularMovies(page);
        }

        // 페이지 이동 시 정렬 옵션이 있을 경우 정렬 적용
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

    // 영화 상세 페이지로 이동
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
}
.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
