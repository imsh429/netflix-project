import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import PopularMovies from '@/views/PopularMovies.vue';
import SearchMovies from '@/views/SearchMovies.vue';
import WishlistMovies from '@/views/WishlistMovies.vue';
import MovieDetail from '@/views/MovieDetail.vue';
import AuthPage from '@/views/Auth.vue';
//import { isLoggedIn } from "@/services/AuthenticationService.js";

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
        path: '/movie/:id',
        name: 'MovieDetail',
        component: MovieDetail,
        props: true
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: AuthPage
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: AuthPage
    },
];

const router = createRouter({
    history: createWebHashHistory('/netflix-project/'),
    routes
});

// Middleware to check authentication before each route
/*router.beforeEach((to, from, next) => {
    const publicPages = ['/signin', '/signup'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = isLoggedIn();

    if (authRequired && !loggedIn) {
        return next('/signin');
    }
    next();
});*/

export default router;
