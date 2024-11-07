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
      <option value="">정렬 방식 선택</option>
      <option value="popularity.desc">인기순</option>
      <option value="release_date.desc">최신 개봉순</option>
      <option value="vote_average.desc">평점 높은순</option>
    </select>

    <button @click="resetFilters">초기화</button>
  </div>
</template>

<script>
export default {
  name: "SearchFilter",
  props: {
    genres: Array,
    ratings: Array
  },
  data() {
    return {
      selectedGenre: "",
      selectedRating: "",
      selectedSort: ""
    };
  },
  methods: {
    emitFilters() {
      this.$emit("updateFilters", {
        genre: this.selectedGenre,
        rating: this.selectedRating,
        sort: this.selectedSort
      });
    },
    resetFilters() {
      this.selectedGenre = "";
      this.selectedRating = "";
      this.selectedSort = "";
      this.emitFilters();
    }
  }
};
</script>

<style scoped>
.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.filter-section select, .filter-section button {
  padding: 0.5rem;
}
</style>
