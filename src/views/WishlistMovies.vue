<template>
  <div class="wishlist-movies">
    <!-- 위시리스트가 비어 있을 때 표시 -->
    <div v-if="wishlistMovies.length === 0" class="empty-message">
      위시리스트에 영화가 없습니다.
    </div>

    <!-- Infinite Scroll View -->
    <wishlist-infinite-view v-else></wishlist-infinite-view>
  </div>
</template>

<script>
import WishlistInfiniteView from "@/components/WishlistInfiniteView.vue"; // Infinite Scroll View 컴포넌트 가져오기
import { getWishlistMovies } from "@/utils/storage.js";

export default {
  name: "WishlistMovies",
  components: {
    WishlistInfiniteView, // 컴포넌트 등록
  },
  data() {
    return {
      wishlistMovies: [], // 위시리스트 영화 목록
    };
  },
  created() {
    // 위시리스트 영화 목록을 로드하여 빈 상태 확인
    this.wishlistMovies = getWishlistMovies();
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
</style>
