<template>
  <div class="wishlist-movies">
    <h1>위시리스트</h1>

    <!-- View 전환 버튼 -->
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
    <div v-if="viewMode === 'infinite'" class="wishlist-infinite-view" @scroll="handleScroll">
      <div class="movies-grid">
        <div v-for="movie in wishlistMovies" :key="movie.id" class="movie-item">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>

      <!-- 맨 위로 이동 버튼 -->
      <button v-if="showTopButton" class="top-button" @click="scrollToTop">Top</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WishlistMovies",
  data() {
    return {
      wishlistMovies: [],
      viewMode: "table",
      showTopButton: false,
    };
  },
  methods: {
    loadWishlistMovies() {
      // Local Storage에서 추천 영화 목록 불러오기
      const movies = JSON.parse(localStorage.getItem("wishlist")) || [];
      this.wishlistMovies = movies;
    },
    changeView(view) {
      this.viewMode = view;
    },
    handleScroll() {
      this.showTopButton = this.$el.scrollTop > 200;
    },
    scrollToTop() {
      this.$el.scrollTop = 0;
    }
  },
  created() {
    this.loadWishlistMovies(); // 페이지 로드 시 Local Storage에서 영화 목록 불러오기
  }
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
.wishlist-table table {
  width: 100%;
  border-collapse: collapse;
}
.wishlist-table th, .wishlist-table td {
  padding: 0.5rem;
  border: 1px solid #ddd;
  text-align: center;
}
.wishlist-table img {
  width: 100px;
  border-radius: 5px;
}
.wishlist-infinite-view {
  overflow-y: auto;
  height: 80vh;
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
.movie-item img {
  width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease;
}
.movie-item img:hover {
  transform: scale(1.05);
}
.top-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.5rem 1rem;
  background: #333;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}
</style>
