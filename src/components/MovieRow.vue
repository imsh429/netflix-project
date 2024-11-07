<template>
  <div class="movie-row">
    <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-item"
        @mouseover="hover = movie.id"
        @mouseleave="hover = null"
    >
      <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          :class="{ hover: hover === movie.id }"
      />
      <p>{{ movie.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movies: Array,
    default: () => [] // 기본값을 빈 배열로 설정
  },
  data() {
    return {
      hover: null
    };
  }
};
</script>

<style>
.movie-row {
  display: flex;
  gap: 16px;
  overflow-x: scroll;
}

.movie-item img {
  transition: transform 0.3s ease;
}

.movie-item img.hover {
  transform: scale(1.1);
}
</style>
