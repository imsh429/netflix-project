<template>
  <div class="wishlist-infinite-view">
    <div class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-item">
        <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="poster-image"
            @click="openMovieDetail(movie.id)"
        />
        <p>{{ movie.title }}</p>
        <button class="wishlist-btn" @click="removeFromWishlist(movie.id)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-message">더 불러오는 중...</div>
    <div v-if="noMoreMovies" class="end-message">더 이상 불러올 영화가 없습니다.</div>

    <ReusableModal :visible="showMovieDetail" @close="closeMovieDetail">
      <MovieDetail :id="selectedMovieId" />
    </ReusableModal>

    <button
        v-if="showTopButton"
        class="top-btn"
        @click="scrollToTop"
    >
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>
</template>

<script>
import { getWishlistMovies, removeMovieFromWishlist } from "@/utils/storage.js";
import MovieDetail from "@/views/MovieDetail.vue";
import ReusableModal from "@/components/ReusableModal.vue";

export default {
  name: "WishlistInfiniteView",
  components: {
    ReusableModal,
    MovieDetail,
  },
  data() {
    return {
      movies: [],
      isLoading: false,
      noMoreMovies: false,
      page: 1,
      moviesPerPage: 10,
      showMovieDetail: false,
      selectedMovieId: null,
      showTopButton: false, // Top 버튼 표시 여부
    };
  },
  methods: {
    loadMoreMovies() {
      if (this.isLoading || this.noMoreMovies) return;

      this.isLoading = true;

      const allMovies = getWishlistMovies();
      const startIndex = (this.page - 1) * this.moviesPerPage;
      const endIndex = this.page * this.moviesPerPage;
      const nextMovies = allMovies.slice(startIndex, endIndex);

      if (nextMovies.length > 0) {
        this.movies = [...this.movies, ...nextMovies];
        this.page += 1;
      } else {
        this.noMoreMovies = true;
      }

      this.isLoading = false;
    },
    removeFromWishlist(movieId) {
      removeMovieFromWishlist(movieId);
      this.movies = this.movies.filter((movie) => movie.id !== movieId);
    },
    openMovieDetail(movieId) {
      this.selectedMovieId = movieId;
      this.showMovieDetail = true;
    },
    closeMovieDetail() {
      this.showMovieDetail = false;
      this.selectedMovieId = null;
    },
    handleScroll() {
      const bottomOffset = 100;
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;

      if (scrollPosition + bottomOffset >= documentHeight) {
        this.loadMoreMovies();
      }
      this.showTopButton = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" }); // 부드럽게 스크롤
    },
  },
  mounted() {
    this.loadMoreMovies();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>


<style scoped>
@keyframes fadeInZoom {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  justify-items: center;
}

.movie-item {
  position: relative;
  text-align: center;
  overflow: hidden;
  width: 100%;
  max-width: 180px;
  box-sizing: border-box;
}

.movie-item .poster-image {
  width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-item .poster-image:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.movie-item .poster-image:active {
  transform: scale(0.95);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.wishlist-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  color: white;
}

.movie-item:hover .wishlist-btn {
  display: flex;
}

.wishlist-btn:active {
  transform: scale(0.9);
}

.movies-grid:empty:before {
  content: "저장된 영화가 없습니다.";
  display: block;
  text-align: center;
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  color: #ccc;
  margin: 2rem auto;
}

.loading-message,
.end-message {
  text-align: center;
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  margin-top: 1rem;
}

.loading-message {
  color: white;
}

.end-message {
  color: #aaa;
}

@media (max-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .movie-item .poster-image {
    border-radius: 6px;
  }

  .wishlist-btn {
    width: 35px;
    height: 35px;
  }
}

.top-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0.8;
}

.top-btn:hover {
  transform: scale(1.1);
  opacity: 1;
}

.top-btn:active {
  transform: scale(0.95);
}

@media (orientation: landscape) {
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

</style>