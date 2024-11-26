<template>
  <section v-if="currentMovie" class="hero-slider" :style="{ backgroundImage: `url(${backdropUrl})` }">
    <div class="banner-content">
      <h1 @click="goToDetailPage" class="title">{{ currentMovie.title }}</h1>
      <p class="overview">{{ currentMovie.overview }}</p>
      <div class="button-group">
        <button class="play-btn title-btn" @click="playTrailer"><i class="fas fa-play"></i> 재생</button>
        <button class="info-btn title-btn" @click="goToDetailPage"><i class="fas fa-info-circle"></i>상세 정보</button>
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
      isLoading: true,
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
    if (this.movies.length > 0) {
      this.isLoading = false; // 영화 데이터가 존재하면 로딩 종료
      this.startAutoSlide();
    }
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
  padding: 12px 24px; /* 버튼 크기 */
  border: none;
  border-radius: 25px; /* 둥근 모서리 */
  cursor: pointer;
  font-size: 1rem; /* 글씨 크기 */
  font-weight: bold; /* 글씨 굵기 */
  transition: all 0.2s ease-in-out; /* 더 빠른 반응 시간 */
  display: flex; /* 아이콘과 텍스트를 수평 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  gap: 8px; /* 아이콘과 텍스트 간격 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 버튼 그림자 */
}

.title-btn:active {
  transform: scale(0.95); /* 클릭 시 살짝 축소 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 그림자 줄이기 */
}

.play-btn {
  background-color: #007bff; /* 기본 파란색 */
  color: white;
}

.play-btn:hover {
  background-color: #0056b3; /* 어두운 파란색 */
  transform: scale(1.05); /* 살짝 확대 */
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2); /* 그림자 강조 */
}

.play-btn:active {
  transform: scale(0.70); /* 클릭 시 살짝 축소 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 그림자 줄이기 */
}


.info-btn {
  background-color: rgba(255, 255, 255, 0.9);
  color: #007bff; /* 파란색 글씨 */
}

.info-btn:hover {
  background-color: #007bff; /* 파란색으로 변경 */
  color: white; /* 글씨 색상 변경 */
  transform: scale(1.05); /* 살짝 확대 */
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2); /* 그림자 강조 */
}

.info-btn:active {
  transform: scale(0.70); /* 클릭 시 살짝 축소 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 그림자 줄이기 */
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

.dot:hover {
  animation: pulse 0.6s infinite; /* 부드럽게 확장 후 축소 */
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
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
