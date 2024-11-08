<template>
  <div class="wishlist-movies">
    <h1>위시리스트</h1>

    <div v-if="wishlistMovies.length === 0" class="empty-message">
      위시리스트에 영화가 없습니다.
    </div>

    <div class="view-toggle">
      <button @click="changeView('table')" :class="{ active: viewMode === 'table' }">Table View</button>
      <button @click="changeView('infinite')" :class="{ active: viewMode === 'infinite' }">Infinite Scroll</button>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="wishlist-table">
      <table>
        <thead>
        <tr>
          <th>포스터</th>
          <th>영화 제목</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="movie in wishlistMovies" :key="movie.id">
          <td><img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" /></td>
          <td>{{ movie.title }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Infinite Scroll View -->
    <div v-if="viewMode === 'infinite'" class="wishlist-infinite-view">
      <div class="movies-grid">
        <div v-for="movie in wishlistMovies" :key="movie.id" class="movie-item">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWishlistMovies } from "@/utils/storage.js";

export default {
  name: "WishlistMovies",
  data() {
    return {
      wishlistMovies: [],
      viewMode: "table",
    };
  },
  methods: {
    loadWishlistMovies() {
      this.wishlistMovies = getWishlistMovies();
    },
    changeView(view) {
      this.viewMode = view;
    },
  },
  created() {
    this.loadWishlistMovies();
  }
};
</script>

<style scoped>
/* 스타일 정의 */
</style>
