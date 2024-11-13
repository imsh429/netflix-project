<template>
  <div class="popular-movies">
    <h1>인기 영화</h1>

    <!-- View 전환 버튼 -->
    <div class="view-toggle">
      <button @click="changeView('table')" :class="{ active: viewMode === 'table' }">Table View</button>
      <button @click="changeView('infinite')" :class="{ active: viewMode === 'infinite' }">Infinite Scroll</button>
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
import { useRouter } from 'vue-router'; // useRouter import 추가
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
      fetchMovies(1); // view 변경 시 첫 페이지부터 다시 로딩
    };

    const goToMovieDetail = (movieId) => {
      // 라우터를 통해 상세 페이지로 이동
      router.push({ name: "MovieDetail", params: { id: movieId } });
    };

    // 컴포넌트가 마운트될 때 첫 페이지 로딩
    onMounted(() => {
      fetchMovies(currentPage.value);
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
