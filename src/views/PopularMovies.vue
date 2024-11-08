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
        @toggleWishlist="toggleWishlist"
        :isMovieInWishlist="isMovieInWishlist"
    />

    <!-- Infinite Scroll View 컴포넌트 -->
    <InfiniteScrollView
        v-if="viewMode === 'infinite'"
        :movies="movies"
        :loading="loading"
        @loadMore="loadMoreMovies"
        @toggleWishlist="toggleWishlist"
        :isMovieInWishlist="isMovieInWishlist"
    />
  </div>
</template>

<script>
import TableView from "@/components/TableView.vue";
import InfiniteScrollView from "@/components/InfiniteScrollView.vue";
import { fetchMovies, endpoints } from "@/services/tmdbService.js";
import {
  addMovieToWishlist,
  removeMovieFromWishlist,
  isMovieInWishlist,
} from "@/utils/storage.js";

export default {
  name: "PopularMovies",
  components: {
    TableView,
    InfiniteScrollView,
  },
  data() {
    return {
      movies: [],
      loading: true,
      viewMode: "table",
      currentPage: 1,
      hasMorePages: true,
    };
  },
  methods: {
    async fetchMovies(page = 1) {
      this.loading = true;
      try {
        const data = await fetchMovies(endpoints.popular, page);
        this.movies = data.results;
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
        const data = await fetchMovies(endpoints.popular, nextPage);
        this.movies = [...this.movies, ...data.results];
        this.currentPage = nextPage;
        this.hasMorePages = data.page < data.total_pages;
      } catch (error) {
        console.error("추가 영화 데이터를 불러오는 중 오류:", error);
      } finally {
        this.loading = false;
      }
    },
    changeView(view) {
      this.viewMode = view;
      this.movies = [];
      this.fetchMovies(1);
    },
    toggleWishlist(movie) {
      if (isMovieInWishlist(movie.id)) {
        removeMovieFromWishlist(movie.id);
      } else {
        addMovieToWishlist(movie);
      }
      this.$forceUpdate(); // 컴포넌트를 강제로 다시 렌더링하여 UI 반영
    },
    isMovieInWishlist(movieId) {
      return isMovieInWishlist(movieId);
    },
  },
  async created() {
    await this.fetchMovies(this.currentPage);
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
.movie-item.wishlist-added {
  border: 2px solid #ff0000; /* 추천 영화 스타일 차별화 */
}
</style>
