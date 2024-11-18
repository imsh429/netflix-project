<template>
  <section v-if="currentMovie" class="hero-slider" :style="{ backgroundImage: `url(${backdropUrl})` }">
    <div class="banner-content">
      <h1 @click="goToDetailPage" class="title">{{ currentMovie.title }}</h1>
      <p class="overview">{{ currentMovie.overview }}</p>
      <div class="button-group">
        <button class="play-btn title-btn" @click="playTrailer">재생</button>
        <button class="info-btn title-btn" @click="goToDetailPage">상세 정보</button>
      </div>
    </div>
    <div class="dots">
      <span
          v-for="(movie, index) in movies"
          :key="movie.id"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)">
      </span>
    </div>
    <div v-if="showTrailerModal" class="modal-overlay" @click="closeTrailer">
      <div class="modal-content" @click.stop>
        <iframe
            v-if="trailerUrl"
            width="100%"
            height="100%"
            :src="`https://www.youtube.com/embed/${trailerUrl}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
        <button class="close-btn" @click="closeTrailer">닫기</button>
      </div>
    </div>
  </section>
</template>

<script>
import {fetchMovieTrailer} from "@/services/tmdbService.js";

export default {
  name: "HeroSection",
  props: {
    movies: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      currentSlide: 0,
      showTrailerModal: false,
      trailerUrl: null,
      slideInterval: null,
    };
  },
  computed: {
    currentMovie() {
      return this.movies[this.currentSlide];
    },
    backdropUrl() {
      return this.currentMovie ? `https://image.tmdb.org/t/p/original${this.currentMovie.backdrop_path}` : '';
    },
  },
  methods: {
    async playTrailer() {
      if (this.currentMovie) {
        const trailerKey = await fetchMovieTrailer(this.currentMovie.id);
        if (trailerKey) {
          this.trailerUrl = trailerKey;
          this.showTrailerModal = true;
        } else {
          alert("예고편을 찾을 수 없습니다.");
        }
      }
    },
    closeTrailer() {
      this.showTrailerModal = false;
      this.trailerUrl = null;
    },
    goToDetailPage() {
      if (this.currentMovie) {
        this.$router.push({name: 'MovieDetail', params: {id: this.currentMovie.id}});
      }
    },
    goToSlide(index) {
      this.currentSlide = index;
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    },
    startAutoSlide() {
      if (this.movies.length > 1) {
        this.slideInterval = setInterval(() => {
          this.currentSlide = (this.currentSlide + 1) % this.movies.length;
        }, 10000);
      }
    },
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    clearInterval(this.slideInterval);
  },
};
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 80vh;
  background-size: cover;
  background-position: center;
  transition: background-image 0.8s ease-in-out;
  margin-top: 60px;
}

.banner-content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  z-index: 2;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  cursor: pointer;
}

.overview {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.title-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.play-btn {
  background-color: #e50914;
  color: white;
}

.info-btn {
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
}

.dots {
  position: absolute;
  bottom: 15px;
  width: 100%;
  text-align: center;
  z-index: 3;
}

.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 5px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.dot.active {
  background-color: white;
  transform: scale(1.2);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 80%;
  height: 60%;
  background: black;
  border-radius: 10px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
