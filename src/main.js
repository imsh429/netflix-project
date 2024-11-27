import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import store from './store'; // Vuex 스토어 가져오기

createApp(App).use(router, store).mount('#app');
