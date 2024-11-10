// tmdbService.js
import axios from 'axios';

const language = 'ko-KR';
const endpoints = {
    popular: `/movie/popular`,
    nowPlaying: `/movie/now_playing`,
    upcoming: `/movie/upcoming`,
    topRated: `/movie/top_rated`,
    genreList: `/genre/movie/list` // 장르 목록을 위한 엔드포인트
};

// Local Storage에서 API 키를 가져오는 함수
const getApiKey = () => localStorage.getItem("TMDb-Key");

// 특정 카테고리의 영화 데이터를 요청하는 함수
const fetchMovies = async (category, page = 1) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("API 키가 설정되지 않았습니다. 로그인 필요");
        return [];
    }
    try {
        // 전달된 category 값에 따라 endpoints 객체에서 URL 가져오기
        const url = `https://api.themoviedb.org/3${endpoints[category]}?api_key=${apiKey}&language=${language}&page=${page}`;
        const response = await axios.get(url);
        return response.data.results || []; // 영화 목록을 반환
    } catch (error) {
        console.error(`영화 데이터를 불러오는 중 오류가 발생했습니다 (${category}):`, error.message);
        return [];
    }
};

// 각 카테고리별로 데이터를 가져오는 별도의 함수 정의
const fetchPopularMovies = async (page = 1) => await fetchMovies('popular', page);
const fetchNowPlayingMovies = async (page = 1) => await fetchMovies('nowPlaying', page);
const fetchUpcomingMovies = async (page = 1) => await fetchMovies('upcoming', page);
const fetchTopRatedMovies = async (page = 1) => await fetchMovies('topRated', page);

// 장르 데이터를 요청하는 함수
const fetchGenres = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("API 키가 설정되지 않았습니다. 로그인 필요");
        return [];
    }
    try {
        const url = `https://api.themoviedb.org/3${endpoints.genreList}?api_key=${apiKey}&language=${language}`;
        const response = await axios.get(url);
        return response.data.genres || []; // 장르 목록을 반환
    } catch (error) {
        console.error("장르 데이터를 불러오는 중 오류가 발생했습니다:", error.message);
        return [];
    }
};

export { fetchPopularMovies, fetchNowPlayingMovies, fetchUpcomingMovies, fetchTopRatedMovies, fetchGenres };
