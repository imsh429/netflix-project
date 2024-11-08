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
          <th>삭제</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="movie in wishlistMovies" :key="movie.id">
          <td>
            <img
                :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
                :alt="movie.title"
                @click="removeFromWishlist(movie.id)"
            />
          </td>
          <td>{{ movie.title }}</td>
          <td><button @click="removeFromWishlist(movie.id)">삭제</button></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Infinite Scroll View -->
    <div v-if="viewMode === 'infinite'" class="wishlist-infinite-view">
      <div class="movies-grid">
        <div
            v-for="movie in wishlistMovies"
            :key="movie.id"
            class="movie-item"
            @click="removeFromWishlist(movie.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWishlistMovies, removeMovieFromWishlist } from "@/utils/storage.js";

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
    removeFromWishlist(movieId) {
      // Local Storage에서 영화 제거
      removeMovieFromWishlist(movieId);
      // 위시리스트 업데이트
      this.loadWishlistMovies();
    },
  },
  created() {
    this.loadWishlistMovies();
  },
};
</script>

<style scoped>
.wishlist-movies {
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

.wishlist-table img,
.movies-grid img {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.wishlist-table img:hover,
.movies-grid img:hover {
  transform: scale(1.05);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
</style>
