import axios from 'axios';

const language = 'ko-KR';

const endpoints = {
    popular: `/movie/popular`,
    nowPlaying: `/movie/now_playing`,
    genre: `/discover/movie`
};

// Local Storage에서 API 키를 가져오는 함수
const getApiKey = () => localStorage.getItem("TMDb-Key");

// 영화 데이터를 요청하는 함수
const fetchMovies = async (endpoint, page = 1) => {
    const apiKey = getApiKey(); // 동적으로 API 키를 가져옴
    if (!apiKey) {
        throw new Error("API 키가 설정되지 않았습니다. 로그인 필요");
    }
    try {
        const url = `https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=${language}&page=${page}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

// 영화 세부 정보를 요청하는 함수
const fetchMovieDetails = async (id) => {
    const apiKey = getApiKey(); // 동적으로 API 키를 가져옴
    if (!apiKey) {
        throw new Error("API 키가 설정되지 않았습니다. 로그인 필요");
    }
    try {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=${language}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("영화 세부 정보를 불러오는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

export { endpoints, fetchMovies, fetchMovieDetails };
