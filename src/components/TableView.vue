<template>
  <div class="table-view">
    <table>
      <thead>
      <tr>
        <th>포스터</th>
        <th>영화 제목</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="movie in paginatedMovies"
          :key="movie.id"
          @click="toggleWishlist(movie)"
          :class="{ 'wishlist-added': isMovieInWishlist(movie.id) }"
      >
        <td><img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" /></td>
        <td>{{ movie.title }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination 버튼 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>페이지 {{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["movies", "isMovieInWishlist", "toggleWishlist"],
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.movies.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.movies.length / this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
};
</script>
