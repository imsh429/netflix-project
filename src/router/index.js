import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import PopularMovies from '@/views/PopularMovies.vue';
import SearchMovies from '@/views/SearchMovies.vue';
import WishlistMovies from '@/views/WishlistMovies.vue';
import MovieDetail from '@/views/MovieDetail.vue'; // MovieDetail 컴포넌트 추가

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/popular',
        name: 'PopularMovies',
        component: PopularMovies
    },
    {
        path: '/search',
        name: 'SearchMovies',
        component: SearchMovies
    },
    {
        path: '/wishlist',
        name: 'WishlistMovies',
        component: WishlistMovies
    },
    {
        path: '/movie/:id', // 영화 상세 페이지 경로 추가
        name: 'MovieDetail',
        component: MovieDetail,
        props: true // route params를 props로 전달
    }
];

const router = createRouter({
    history: createWebHistory('/netflix-project/'),
    routes
});

export default router;
