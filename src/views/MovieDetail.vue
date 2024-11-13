<template>
  <div class="movie-detail" v-if="movie">
    <div class="movie-header" :style="{ backgroundImage: `url(${backdropUrl})` }">
      <div class="overlay">
        <h1>{{ movie.title }}</h1>
        <p>{{ movie.overview }}</p>
        <div class="buttons">
          <button class="play-btn" @click="playTrailer">예고편 재생</button>
          <span>평점: {{ movie.vote_average }}</span>
        </div>
      </div>
    </div>

    <div class="movie-info">
      <h2>영화 정보</h2>
      <ul>
        <li><strong>개봉일:</strong> {{ movie.release_date }}</li>
        <li><strong>장르:</strong> {{ genreNames }}</li>
        <li><strong>상영 시간:</strong> {{ movie.runtime }}분</li>
      </ul>
    </div>

    <!-- 예고편 모달 -->
    <div v-if="showTrailerModal" class="modal-overlay" @click="closeTrailer">
      <div class="modal-content" @click.stop>
        <iframe
            v-if="trailerUrl"
            width="100%"
            height="100%"
            :src="`https://www.youtube.com/embed/${trailerUrl}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
        <button class="close-btn" @click="closeTrailer">닫기</button>
      </div>
    </div>
  </div>

  <p v-else>영화 데이터를 불러오는 중...</p>
</template>

<script>
import { fetchMovieDetails, fetchMovieTrailer } from "@/services/tmdbService.js";

export default {
  name: "MovieDetail",
  props: ["id"],
  data() {
    return {
      movie: null,
      showTrailerModal: false,
      trailerUrl: null,
    };
  },
  computed: {
    backdropUrl() {
      return this.movie ? `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}` : '';
    },
    genreNames() {
      return this.movie.genres ? this.movie.genres.map(genre => genre.name).join(", ") : "";
    }
  },
  methods: {
    async loadMovieDetails() {
      // 영화 상세 정보 가져오기
      this.movie = await fetchMovieDetails(this.id);
    },
    async playTrailer() {
      // 예고편 불러오기 및 모달 표시
      const trailerKey = await fetchMovieTrailer(this.id);
      if (trailerKey) {
        this.trailerUrl = trailerKey;
        this.showTrailerModal = true;
      } else {
        alert("예고편을 찾을 수 없습니다.");
      }
    },
    closeTrailer() {
      this.showTrailerModal = false;
      this.trailerUrl = null;
    }
  },
  async created() {
    await this.loadMovieDetails();
  }
};
</script>

<style scoped>
.movie-detail {
  color: white;
}
.movie-header {
  position: relative;
  height: 60vh;
  background-size: cover;
  background-position: center;
}
.overlay {
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  width: 100%;
}
.buttons {
  margin-top: 20px;
}
.play-btn {
  margin-right: 10px;
}
.movie-info {
  padding: 20px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  position: relative;
  width: 80%;
  height: 60%;
  background-color: black;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  border: none;
}
</style>
