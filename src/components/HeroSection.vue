<template>
  <section class="hero-section" :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }">
    <div class="overlay">
      <div class="movie-info">
        <h1>{{ movie.title }}</h1>
        <p>{{ movie.overview }}</p>
        <button @click="handleMoreInfo">자세히 보기</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HeroSection",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleMoreInfo() {
      this.$router.push(`/movie/${this.movie.id}`);
    },
  },
};
</script>

<style scoped>
.hero-section {
  position: relative;
  background-size: cover;
  background-position: center;
  height: 500px;
  color: white;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.movie-info {
  text-align: center;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e50914;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
