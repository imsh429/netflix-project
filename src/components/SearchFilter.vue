<template>
  <div class="search-filter">
    <!-- 장르 필터 -->
    <label>
      장르:
      <select v-model="selectedGenre">
        <option value="">선택 안함</option>
        <option value="28">액션</option>
        <option value="12">모험</option>
        <option value="16">애니메이션</option>
        <option value="35">코미디</option>
      </select>
    </label>

    <!-- 평점 필터 -->
    <label>
      평점:
      <select v-model="selectedRating">
        <option value="">선택 안함</option>
        <option value="8">8 이상</option>
        <option value="7">7 이상</option>
        <option value="6">6 이상</option>
      </select>
    </label>

    <!-- 정렬 필터 -->
    <label>
      정렬:
      <select v-model="selectedSort">
        <option value="">선택 안함</option>
        <option value="popularity">인기순</option>
        <option value="release_date">개봉년도</option>
      </select>
    </label>

    <!-- 필터 적용 및 초기화 버튼 -->
    <button @click="applyFilters">필터 적용</button>
    <button @click="clearFilters">필터 초기화</button>
  </div>
</template>

<script>
export default {
  name: "SearchFilter",
  data() {
    return {
      selectedGenre: "",
      selectedRating: "",
      selectedSort: "",
    };
  },
  methods: {
    applyFilters() {
      this.$emit("applyFilters", {
        genre: this.selectedGenre,
        rating: this.selectedRating,
        sort: this.selectedSort,
      });
    },
    clearFilters() {
      this.selectedGenre = "";
      this.selectedRating = "";
      this.selectedSort = "";
      this.$emit("clearFilters");
    }
  }
};
</script>
