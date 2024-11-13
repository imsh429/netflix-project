<template>
  <div class="movie-card" @click="handleClick">
    <img :src="posterUrl" :alt="movie.title" class="movie-poster" />
    <h3 class="movie-title">{{ movie.title }}</h3>
  </div>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  computed: {
    posterUrl() {
      return this.movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
          : 'path/to/default/poster.jpg'; // 기본 이미지 경로
    }
  },
  methods: {
    handleClick() {
      this.$emit('movie-selected', this.movie.id); // 부모에게 이벤트 전달
      this.$router.push({ name: 'MovieDetail', params: { id: this.movie.id } });
    }
  }
};
</script>

<style scoped>
.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.movie-card:hover {
  transform: scale(1.05);
}
.movie-poster {
  width: 100%;
  border-radius: 8px;
}
.movie-title {
  text-align: center;
  margin-top: 8px;
  font-size: 1rem;
}
</style>
