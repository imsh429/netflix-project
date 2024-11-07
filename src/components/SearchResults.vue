<template>
  <div>
    <div class="view-toggle">
      <button @click="changeView('table')" :class="{ active: viewMode === 'table' }">Table View</button>
      <button @click="changeView('infinite')" :class="{ active: viewMode === 'infinite' }">Infinite Scroll</button>
    </div>

    <TableView
        v-if="viewMode === 'table'"
        :movies="movies"
        :currentPage="currentPage"
        :hasMorePages="hasMorePages"
        @fetchPage="fetchPage"
    />

    <InfiniteScrollView
        v-if="viewMode === 'infinite'"
        :movies="movies"
        :loading="loading"
        @loadMore="loadMore"
    />
  </div>
</template>

<script>
import TableView from "@/components/TableView.vue";
import InfiniteScrollView from "@/components/InfiniteScrollView.vue";

export default {
  name: "SearchResults",
  components: {
    TableView,
    InfiniteScrollView
  },
  props: {
    movies: Array,
    loading: Boolean,
    currentPage: Number,
    hasMorePages: Boolean
  },
  data() {
    return {
      viewMode: "table"
    };
  },
  methods: {
    changeView(view) {
      this.viewMode = view;
    },
    fetchPage(page) {
      this.$emit("fetchPage", page);
    },
    loadMore() {
      this.$emit("loadMore");
    }
  }
};
</script>

<style scoped>
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
