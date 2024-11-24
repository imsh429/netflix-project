<template>
  <div class="wishlist-movies">
    <!-- 위시리스트가 비어 있을 때 표시 -->
    <div v-if="wishlistMovies.length === 0" class="empty-message">
      위시리스트에 영화가 없습니다.
    </div>

    <!-- 보기 전환 버튼 -->
    <div v-else>
      <div class="view-toggle">
        <button @click="changeView('table')" :class="{ active: viewMode === 'table' }">Table View</button>
        <button @click="changeView('infinite')" :class="{ active: viewMode === 'infinite' }">Infinite Scroll</button>
      </div>

      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="wishlist-table">
        <table>
          <thead>
          <tr>
            <th>포스터</th>
            <th>영화 제목</th>
            <th>삭제</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="movie in wishlistMovies" :key="movie.id">
            <td>
              <img
                  :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
                  :alt="movie.title"
                  class="poster-image"
              />
            </td>
            <td>{{ movie.title }}</td>
            <td>
              <button class="remove-btn" @click="removeFromWishlist(movie.id)">삭제</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Infinite Scroll View -->
      <div v-else class="wishlist-infinite-view">
        <div class="movies-grid">
          <div
              v-for="movie in wishlistMovies"
              :key="movie.id"
              class="movie-item"
          >
            <img
                :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                :alt="movie.title"
                class="poster-image"
            />
            <p>{{ movie.title }}</p>
            <button class="wishlist-btn" @click="removeFromWishlist(movie.id)">
              ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWishlistMovies, removeMovieFromWishlist } from "@/utils/storage.js";

export default {
  name: "WishlistMovies",
  data() {
    return {
      wishlistMovies: [], // 위시리스트 영화 목록
      viewMode: "table", // 기본 보기 모드: Table View
    };
  },
  methods: {
    // 위시리스트 영화 목록을 Local Storage에서 로드
    loadWishlistMovies() {
      this.wishlistMovies = getWishlistMovies();
    },
    // 보기 모드 전환
    changeView(view) {
      this.viewMode = view;
    },
    // 위시리스트에서 영화 제거
    removeFromWishlist(movieId) {
      removeMovieFromWishlist(movieId); // Local Storage에서 삭제
      this.loadWishlistMovies(); // 목록 다시 로드
    },
  },
  created() {
    this.loadWishlistMovies(); // 컴포넌트 생성 시 영화 목록 로드
  },
};
</script>

<style scoped>
/* 전체 컨테이너 */
.wishlist-movies {
  padding: 2rem;
  color: white;
  background-color: #1e1e1e;
  min-height: 100vh;
}

/* 빈 상태 메시지 */
.empty-message {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 2rem;
  color: #aaa;
}

/* 보기 전환 버튼 */
.view-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.view-toggle button {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.view-toggle button.active {
  background-color: white;
  color: black;
}

.view-toggle button:hover {
  background-color: #555;
}

/* 테이블 스타일 */
.wishlist-table table {
  width: 100%;
  border-collapse: collapse;
}

.wishlist-table th,
.wishlist-table td {
  border: 1px solid #555;
  padding: 0.75rem;
  text-align: center;
}

.wishlist-table th {
  background-color: #333;
}

.wishlist-table .poster-image {
  width: 100px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.wishlist-table .poster-image:hover {
  transform: scale(1.1);
}

/* 삭제 버튼 */
.remove-btn {
  background-color: transparent;
  color: red;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: rgba(255, 0, 0, 0.2);
  border-radius: 4px;
}

/* Infinite Scroll Grid */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.movie-item {
  position: relative;
  text-align: center;
  overflow: hidden;
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

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
}

.wishlist-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  color: white;
}
</style>
