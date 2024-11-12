<template>
  <section v-if="currentMovie" class="hero-slider" :style="{ backgroundImage: `url(${backdropUrl})` }">
    <div class="banner-content">
      <h1>{{ currentMovie.title }}</h1>
      <p>{{ currentMovie.overview }}</p>
      <button class="play-btn title-btn">재생</button>
      <button class="info-btn title-btn" @click="showMoreInfo">상세 정보</button>
    </div>
    <!-- 슬라이드 기능이 필요한 경우, 하단의 점을 통해 제어 가능 -->
    <div class="dots">
      <span v-for="(movie, index) in movies" :key="movie.id"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"></span>
    </div>
  </section>
</template>

<script>
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
    };
  },
  computed: {
    // 현재 슬라이드에 맞는 영화 정보 반환
    currentMovie() {
      return this.movies[this.currentSlide];
    },
    // 현재 영화의 배경 이미지 URL
    backdropUrl() {
      return this.currentMovie ? `https://image.tmdb.org/t/p/original${this.currentMovie.backdrop_path}` : '';
    }
  },
  methods: {
    showMoreInfo() {
      // 상세 정보 페이지로 이동 (예: /movie/:id)
      if (this.currentMovie) {
        this.$router.push(`/movie/${this.currentMovie.id}`);
      }
    },
    goToSlide(index) {
      this.currentSlide = index;
    },
    startAutoSlide() {
      // 자동 슬라이드 설정, 5초마다 전환
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.movies.length;
      }, 5000);
    }
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    clearInterval(this.slideInterval);
  }
};
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 80vh; /* 화면의 80% 높이로 설정 */
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease;
  margin-top: 60px; /* header가 겹치지 않도록 여백 설정 */
  z-index: 1;
}

.banner-content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  z-index: 2; /* 텍스트와 버튼이 항상 배경 이미지 위에 표시되도록 */
}

.title-btn {
  margin-right: 10px;
}
.dots {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gray;
  margin: 5px;
  cursor: pointer;
}
.dot.active {
  background-color: white;
}
</style>
