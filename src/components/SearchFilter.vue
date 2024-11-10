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
        <!-- 다른 장르 추가 가능 -->
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
        <!-- 다른 평점 추가 가능 -->
      </select>
    </label>

    <!-- 정렬 필터 -->
    <label>
      정렬:
      <select v-model="selectedSort">
        <option value="">선택 안함</option>
        <option value="popularity">인기순</option>
        <option value="release_date">개봉년도</option>
        <!-- 다른 정렬 옵션 추가 가능 -->
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
      selectedSort: "", // 정렬 옵션 추가
    };
  },
  methods: {
    applyFilters() {
      this.$emit("applyFilters", {
        genre: this.selectedGenre,
        rating: this.selectedRating,
        sort: this.selectedSort, // 정렬 값 전달
      });
    },
    clearFilters() {
      this.selectedGenre = "";
      this.selectedRating = "";
      this.selectedSort = ""; // 정렬 옵션 초기화
      this.$emit("clearFilters");
    }
  }
};
</script>

<style scoped>
.search-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
