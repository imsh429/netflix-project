<template>
  <div class="popular-movies">
    <!-- View 전환 버튼 -->
    <div class="view-toggle-container">
      <div class="view-toggle">
        <button @click="changeView('table')" :class="{ active: viewMode === 'table' }">
          <i class="fas fa-table"></i>
        </button>
        <button @click="changeView('infinite')" :class="{ active: viewMode === 'infinite' }">
          <i class="fas fa-infinity"></i>
        </button>
      </div>
    </div>

    <!-- Table View 컴포넌트 -->
    <TableView
        v-if="viewMode === 'table'"
        :movies="movies"
        :currentPage="currentPage"
        :hasMorePages="hasMorePages"
        @fetchPage="fetchMovies"
        @movie-selected="goToMovieDetail"
    />

    <!-- Infinite Scroll View 컴포넌트 -->
    <InfiniteScrollView
        v-if="viewMode === 'infinite'"
        :movies="movies"
        :loading="loading"
        @loadMore="loadMoreMovies"
        @movie-selected="goToMovieDetail"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovies } from '@/composables/useMovies.js';
import TableView from "@/components/TableView.vue";
import InfiniteScrollView from "@/components/InfiniteScrollView.vue";

export default {
  name: "PopularMovies",
  components: { TableView, InfiniteScrollView },
  setup() {
    const { movies, loading, currentPage, hasMorePages, fetchMovies, loadMoreMovies } = useMovies();

    const viewMode = ref('table');
    const router = useRouter();

    const changeView = (view) => {
      viewMode.value = view;
      fetchMovies(1, false);
    };

    const goToMovieDetail = (movieId) => {
      router.push({ name: "MovieDetail", params: { id: movieId } });
    };

    onMounted(() => {
      fetchMovies(currentPage.value, false);
    });

    return {
      movies,
      loading,
      currentPage,
      hasMorePages,
      viewMode,
      changeView,
      goToMovieDetail,
      fetchMovies,
      loadMoreMovies,
    };
  },
};
</script>

<style scoped>
.popular-movies {
  padding: 2rem;
  position: relative;
  background-color: #1e1e1e; /* 배경색 추가 */
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 선택 사항: 약간의 그림자 효과 */
}

/* View 전환 버튼 컨테이너 */
.view-toggle-container {
  display: flex;
  justify-content: flex-end; /* 오른쪽으로 배치 */
  margin-bottom: 1rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem; /* 버튼 간 간격 */
}

.view-toggle button {
  padding: 0.5rem;
  font-size: 1.2rem; /* 아이콘 크기 */
  border: none;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}

.view-toggle button.active {
  color: #007bff; /* 활성 상태 색상 */
}

.view-toggle button:hover:not(.active) {
  color: #555;
  transform: scale(1.1); /* 호버 시 약간 확대 */
}

.view-toggle button:focus {
  outline: none;
}
</style>
