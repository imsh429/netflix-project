import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import PopularMovies from '@/views/PopularMovies.vue';

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
    }
];

const router = createRouter({
    history: createWebHistory('/netflix-project/'),
    routes
});

export default router;
