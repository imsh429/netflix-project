<template>
  <section v-if="currentMovie" class="hero-slider" :style="{ backgroundImage: `url(${backdropUrl})` }">
    <div class="banner-content">
      <h1 class="title">{{ currentMovie.title }}</h1>
      <p class="overview">{{ currentMovie.overview }}</p>
      <div class="button-group">
        <button class="play-btn title-btn" @click="playTrailer"><i class="fas fa-play"></i> 재생</button>
        <button class="info-btn title-btn" @click="openDetailModal(currentMovie)"><i class="fas fa-info-circle"></i>상세 정보</button>
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
    <ReusableModal :visible="showDetailModal" @close="closeDetailModal">
      <MovieDetail v-if="selectedMovie" :id="selectedMovie.id" />
    </ReusableModal>
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
import ReusableModal from "@/components/ReusableModal.vue";
import MovieDetail from "@/views/MovieDetail.vue";

export default {
  name: "HeroSection",
  components: {
    ReusableModal,
    MovieDetail,
  },
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
      showDetailModal: false, // 상세정보 모달 표시 여부
      selectedMovie: null,    // 선택된 영화 데이터
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
    openDetailModal(movie) {
      this.selectedMovie = movie; // 선택된 영화 데이터 설정
      this.showDetailModal = true; // 모달 표시
    },
    closeDetailModal() {
      this.showDetailModal = false; // 모달 닫기
      this.selectedMovie = null;   // 선택된 영화 초기화
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
  display: grid;
  grid-template-rows: 1fr auto;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  transition: background-image 0.8s ease-in-out;
  overflow: hidden; /* 불필요한 스크롤 방지 */
  touch-action: manipulation; /* 스크롤, 줌 등 기본 터치 동작 제한 */

}

.banner-content {
  position: absolute;
  bottom: 10px;
  left: 5px;
  width: 90%; /* 전체 화면 폭을 고려한 너비 */
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  cursor: pointer;
  line-height: 1.2;
}

.overview {
  font-size: 1rem;
  line-height: 1.5;
  max-width: 600px; /* 텍스트의 가로 폭 제한 */
  margin-right: auto; /* 텍스트가 오른쪽으로 치우치지 않게 */
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-wrap: wrap; /* 버튼이 화면에 맞춰 줄바꿈 */
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
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 버튼 그림자 */
  position: relative;
  overflow: hidden; /* 클릭 효과 제한 */
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

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .hero-slider {
    height: 100vh;
  }

  .banner-content {
    bottom: 15px;
    left: 15px;
    gap: 0.8rem;
  }

  .title {
    font-size: 2rem;
  }

  .overview {
    font-size: 0.9rem;
  }

  .button-group {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .hero-slider {
    height: 70vh;
  }

  .banner-content {
    bottom: 10px;
    left: 10px;
  }

  .title {
    font-size: 1.8rem;
  }

  .overview {
    font-size: 0.8rem;
  }

  .title-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .dot {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .hero-slider {
    height: 50vh;
    background-size: cover;
    background-position: center center;
  }

  .banner-content {
    bottom: 5px;
    left: 5px;
    padding: 5px;
    gap: 0.5rem;
  }

  .title {
    font-size: 1.2rem;
    line-height: 1.4;
  }

  .overview {
    font-size: 0.8rem;
  }

  .title-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}

@media (orientation: landscape) {
  .hero-slider {
    height: 70vh;
  }

  .movie-item {
    width: 150px; /* 가로 화면에서 포스터 크기 확대 */
  }

  .banner-content {
    left: 20px;
    bottom: 10px;
  }

  .title {
    font-size: 2.2rem;
  }

  .overview {
    font-size: 1rem;
  }
}

</style>
