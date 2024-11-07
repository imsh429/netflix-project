import axios from 'axios';

const apiKey = 'YOUR_API_KEY'; // 발급받은 API 키를 여기에 입력하세요.
const language = 'ko-KR';

const endpoints = {
    popular: `/movie/popular`,
    nowPlaying: `/movie/now_playing`,
    genre: `/discover/movie`
};

// 영화 데이터를 요청하는 함수
const fetchMovies = async (endpoint, page = 1) => {
    try {
        const url = `https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=${language}&page=${page}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

export { endpoints, fetchMovies };
