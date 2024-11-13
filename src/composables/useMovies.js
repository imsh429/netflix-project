// src/composables/useMovies.js
import { ref } from 'vue';
import { fetchPopularMovies, fetchNowPlayingMovies, fetchTopRatedMovies, fetchUpcomingMovies } from '@/services/tmdbService.js';

export function useMovies(category = 'popular') {
    const movies = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const hasMorePages = ref(true);

    const fetchMovies = async (page = 1) => {
        loading.value = true;
        try {
            let data;
            // 카테고리에 따라 다른 API 호출
            switch (category) {
                case 'popular':
                    data = await fetchPopularMovies(page);
                    break;
                case 'nowPlaying':
                    data = await fetchNowPlayingMovies(page);
                    break;
                case 'topRated':
                    data = await fetchTopRatedMovies(page);
                    break;
                case 'upcoming':
                    data = await fetchUpcomingMovies(page);
                    break;
                default:
                    console.error("잘못된 카테고리입니다.");
                    data = [];
            }
            movies.value = page === 1 ? data : [...movies.value, ...data];
            currentPage.value = page;
            hasMorePages.value = data.length > 0;
        } catch (error) {
            console.error("영화 데이터를 불러오는 중 오류:", error);
        } finally {
            loading.value = false;
        }
    };

    const loadMoreMovies = async () => {
        if (loading.value || !hasMorePages.value) return;
        await fetchMovies(currentPage.value + 1);
    };

    return {
        movies,
        loading,
        currentPage,
        hasMorePages,
        fetchMovies,
        loadMoreMovies,
    };
}
