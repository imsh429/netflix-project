import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import PopularMovies from '@/views/PopularMovies.vue';
import SearchMovies from '@/views/SearchMovies.vue';
import WishlistMovies from '@/views/WishlistMovies.vue';
import MovieDetail from '@/views/MovieDetail.vue'; // MovieDetail 컴포넌트 추가
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import { isLoggedIn } from "@/services/AuthenticationService.js";

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
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: SignIn
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
];

const router = createRouter({
    history: createWebHistory('/netflix-project/'),
    routes
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/signin', '/signup'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = isLoggedIn();

    if (authRequired && !loggedIn) {
        return next('/signin');
    }
    next();
});

export default router;
