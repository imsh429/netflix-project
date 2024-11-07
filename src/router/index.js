import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import PopularMovies from '@/views/PopularMovies.vue';
import SearchMovies from '@/views/SearchMovies.vue'; // SearchMovies 컴포넌트 추가

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/popular',
        name: 'PopularMovies',
        component: PopularMovies // 인기 영화 페이지 경로 추가
    },
    {
        path: '/search', // /search 경로 추가
        name: 'SearchMovies',
        component: SearchMovies
    }
];

const router = createRouter({
    history: createWebHistory('/netflix-project/'),
    routes
});

export default router;
