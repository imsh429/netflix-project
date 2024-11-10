<template>
  <div class="filter-section">
    <select v-model="selectedGenre" @change="emitFilters">
      <option value="">장르 선택</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
    </select>

    <select v-model="selectedRating" @change="emitFilters">
      <option value="">평점 선택</option>
      <option v-for="rating in ratings" :key="rating">{{ rating }}</option>
    </select>

    <select v-model="selectedSort" @change="emitFilters">
      <option value="">정렬 기준 선택</option>
      <option v-for="option in sortOptions" :key="option">{{ option }}</option>
    </select>

    <!-- 필터 초기화 버튼 -->
    <button @click="resetFilters">초기화</button>
  </div>
</template>

<script>
export default {
  props: ["genres", "ratings", "sortOptions"],
  data() {
    return {
      selectedGenre: "",
      selectedRating: "",
      selectedSort: "",
    };
  },
  methods: {
    emitFilters() {
      // 선택한 필터 정보를 부모 컴포넌트로 전달
      this.$emit("applyFilters", {
        genre: this.selectedGenre,
        rating: this.selectedRating,
        sort: this.selectedSort,
      });
    },
    resetFilters() {
      // 필터 초기화
      this.selectedGenre = "";
      this.selectedRating = "";
      this.selectedSort = "";
      this.emitFilters(); // 초기화된 필터 정보를 적용
    },
  },
};
</script>
