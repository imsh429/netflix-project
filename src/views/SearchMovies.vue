<template>
  <div class="search-movies">
    <h1>영화 검색</h1>

    <!-- 필터링 UI -->
    <div class="filter-section">
      <select v-model="selectedGenre" @change="applyFilters">
        <option value="">장르 선택</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
      </select>

      <select v-model="selectedRating" @change="applyFilters">
        <option value="">평점 선택</option>
        <option v-for="rating in ratings" :key="rating">{{ rating }}</option>
      </select>

      <select v-model="selectedSort" @change="applyFilters">
        <option value="">정렬 기준 선택</option>
        <option v-for="option in sortOptions" :key="option">{{ option }}</option>
      </select>

      <button @click="resetFilters">초기화</button>
    </div>

    <!-- 검색 결과 -->
    <SearchResults :filters="{ genre: selectedGenre, rating: selectedRating, sort: selectedSort }" />
  </div>
</template>

<script>
import SearchResults from "@/components/SearchResults.vue";
import { fetchGenres } from "@/services/tmdbService.js"; // 장르 데이터 가져오기 함수가 필요하다면 사용

export default {
  components: {
    SearchResults
  },
  data() {
    return {
      genres: [], // 장르 데이터 초기화
      ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 평점 범위
      sortOptions: ["인기순", "최신순", "높은 평점순"],
      selectedGenre: "",
      selectedRating: "",
      selectedSort: "",
    };
  },
  mounted() {
    this.loadGenres(); // 장르 데이터 로드
  },
  methods: {
    async loadGenres() {
      // 장르 데이터를 API에서 가져오는 경우
      const genreData = await fetchGenres(); // TMDB API에서 장르를 가져오는 함수 예시
      this.genres = genreData;
    },
    applyFilters() {
      // 필터 변경 사항을 SearchResults로 전달
      console.log("필터가 적용되었습니다.", {
        genre: this.selectedGenre,
        rating: this.selectedRating,
        sort: this.selectedSort,
      });
    },
    resetFilters() {
      this.selectedGenre = "";
      this.selectedRating = "";
      this.selectedSort = "";
      this.applyFilters();
    }
  }
};
</script>
