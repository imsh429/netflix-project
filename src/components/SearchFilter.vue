<template>
  <div class="search-filter">
    <div class="filter-card">
      <label for="genre-select">
        <i class="fas fa-film"></i> 장르
      </label>
      <select id="genre-select" v-model="selectedGenre" class="filter-select">
        <option value="">선택 안함</option>
        <option value="28">액션</option>
        <option value="12">모험</option>
        <option value="16">애니메이션</option>
        <option value="35">코미디</option>
      </select>
    </div>

    <div class="filter-card">
      <label for="rating-select">
        <i class="fas fa-star"></i> 평점
      </label>
      <select id="rating-select" v-model="selectedRating" class="filter-select">
        <option value="">선택 안함</option>
        <option value="8">8 이상</option>
        <option value="7">7 이상</option>
        <option value="6">6 이상</option>
      </select>
    </div>

    <div class="filter-card">
      <label for="sort-select">
        <i class="fas fa-sort"></i> 정렬
      </label>
      <select id="sort-select" v-model="selectedSort" class="filter-select">
        <option value="">선택 안함</option>
        <option value="popularity">인기순</option>
        <option value="release_date">개봉년도</option>
      </select>
    </div>

    <div class="filter-actions">
      <button @click="applyFilters" class="filter-btn apply-btn">
        <i class="fas fa-check"></i> 적용
      </button>
      <button @click="clearFilters" class="filter-btn clear-btn">
        <i class="fas fa-redo"></i> 초기화
      </button>
    </div>
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

<style scoped>
.search-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background: linear-gradient(145deg, #1f1f1f, #2c2c2c);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

.filter-card {
  flex: 1 1 200px;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #252525;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.filter-card label {
  font-size: 1rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #1c1c1c;
  color: #fff;
  outline: none;
  transition: background-color 0.2s ease, color 0.3s ease;
}

.filter-select:hover,
.filter-select:focus {
  background-color: #2c2c2c;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.apply-btn {
  background: #007bff;
  color: #fff;
}

.apply-btn:hover {
  background: #0056b3;
  transform: scale(1.05);
}

.clear-btn {
  background: #555;
  color: #fff;
}

.clear-btn:hover {
  background: #333;
  transform: scale(1.05);
}
</style>
