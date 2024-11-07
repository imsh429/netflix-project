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
      <tr v-for="movie in movies" :key="movie.id">
        <td><img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" /></td>
        <td>{{ movie.title }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="$emit('fetchPage', currentPage - 1)" :disabled="currentPage === 1">이전</button>
      <span>페이지 {{ currentPage }}</span>
      <button @click="$emit('fetchPage', currentPage + 1)" :disabled="!hasMorePages">다음</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableView",
  props: {
    movies: Array,
    currentPage: Number,
    hasMorePages: Boolean
  }
};
</script>

<style scoped>
.table-view table {
  width: 100%;
  border-collapse: collapse;
}
.table-view th, .table-view td {
  padding: 0.5rem;
  border: 1px solid #ddd;
  text-align: center;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
