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
      if (this.movie && this.movie.id) {
        this.$router.push(`/movie/${this.movie.id}`);
      } else {
        console.error("영화 ID가 존재하지 않습니다.");
      }
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-width: 600px;
  padding: 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e50914;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

button:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.9rem;
  }

  button {
    padding: 0.4rem 0.8rem;
  }
}
</style>
