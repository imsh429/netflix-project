<script>
import { fetchMovies } from "@/services/tmdbService.js";

export default {
  props: ["filters"],
  data() {
    return {
      movies: [],
    };
  },
  watch: {
    filters: {
      immediate: true,
      handler(newFilters) {
        this.loadMovies(newFilters);
      }
    }
  },
  methods: {
    async loadMovies(filters) {
      const { genre, rating, sort } = filters;
      console.log("필터를 바탕으로 영화를 로드합니다:", filters);

      // fetchMovies 호출 시 필터 적용
      this.movies = await fetchMovies("popular", genre, rating, sort);
    }
  }
};
</script>
