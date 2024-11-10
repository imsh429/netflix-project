<template>
  <div class="search-filter">
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
    };
  },
  methods: {
    applyFilters() {
      this.$emit("applyFilters", {
        genre: this.selectedGenre,
        rating: this.selectedRating,
      });
    },
    clearFilters() {
      this.selectedGenre = "";
      this.selectedRating = "";
      this.$emit("clearFilters");
    }
  }
};
</script>
