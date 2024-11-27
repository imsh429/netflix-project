import { createStore } from 'vuex';

export default createStore({
    state: {
        user: null, // 사용자 정보 저장
    },
    mutations: {
        setUser(state, user) {
            state.user = user; // 사용자 정보 설정
        },
    },
    getters: {
        getUser: (state) => state.user, // 사용자 정보 반환
    },
});
