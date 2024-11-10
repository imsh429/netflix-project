<template>
  <div class="table-view">
    <div v-for="movie in movies" :key="movie.id" class="movie-item">
      <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
      <h3>{{ movie.title }}</h3>
    </div>
    <div class="pagination">
      <button @click="$emit('fetchPage', currentPage - 1)" :disabled="currentPage === 1">
        이전
      </button>
      <span>{{ currentPage }}</span>
      <button @click="$emit('fetchPage', currentPage + 1)" :disabled="!hasMorePages">
        다음
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableView",
  props: {
    movies: Array,
    currentPage: Number,
    hasMorePages: Boolean,
  },
};
</script>

<style scoped>
.table-view {
  display: flex;
  flex-direction: column;
}
.movie-item {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}
.movie-item img {
  width: 100px;
  margin-right: 1rem;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
