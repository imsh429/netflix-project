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
  },
  methods: {
    async loadMovieDetails() {
      this.movie = await fetchMovieDetails(this.id);
    },
    async playTrailer() {
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
  font-family: 'Poppins', sans-serif;
  background: #111; /* 배경 어두운 색으로 설정 */
  min-height: 100vh; /* 화면 전체 채우기 */
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.movie-header {
  position: relative;
  height: 100vh; /* 전체 화면 채우기 */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.overlay {
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* 어두운 배경 */
  padding: 30px;
  width: 100%;
  box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.5);
}

.overlay h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.overlay p {
  font-size: 1rem;
  line-height: 1.6;
  max-width: 80%;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.play-btn {
  background: linear-gradient(90deg, #e50914, #f40612);
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
}

.play-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #f40612, #e50914);
}

.buttons span {
  font-size: 1.2rem;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  position: relative;
  width: 80%;
  height: 60%;
  background-color: black;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  animation: zoomIn 0.3s ease-in-out;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

@media screen and (max-width: 768px) {
  .overlay h1 {
    font-size: 2rem;
  }

  .overlay p {
    font-size: 0.9rem;
  }

  .play-btn {
    padding: 8px 15px;
  }
}
</style>
