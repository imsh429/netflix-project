<template>
  <div class="search-movies">
    <h1>영화 검색</h1>

    <!-- 필터링 및 초기화 버튼 -->
    <div class="filter-section">
      <SearchFilter @applyFilters="applyFilters" @resetFilters="resetFilters" />
    </div>

    <!-- 검색 결과 View 전환 버튼 및 결과 표시 -->
    <SearchResults :filters="filters" />
  </div>
</template>

<script>
import SearchFilter from '@/components/SearchFilter.vue';
import SearchResults from '@/components/SearchResults.vue';

export default {
  components: {
    SearchFilter,
    SearchResults
  },
  data() {
    return {
      filters: {
        genre: "",
        rating: "",
        sort: "",
      },
    };
  },
  methods: {
    applyFilters(filters) {
      this.filters = filters; // 필터 업데이트
    },
    resetFilters() {
      this.filters = { genre: "", rating: "", sort: "" }; // 필터 초기화
    }
  }
};
</script>


<style scoped>
.search-movies {
  padding: 2rem;
}
.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.filter-section select, .filter-section button {
  padding: 0.5rem;
}
.view-toggle {
  margin-bottom: 1rem;
}
.view-toggle button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.view-toggle button.active {
  font-weight: bold;
}
</style>
