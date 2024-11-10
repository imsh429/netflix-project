// tmdbService.js
import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const language = 'ko-KR';
const endpoints = {
    popular: '/movie/popular',         // 인기 영화
    nowPlaying: '/movie/now_playing',  // 현재 상영 중인 영화
    upcoming: '/movie/upcoming',       // 개봉 예정 영화
    topRated: '/movie/top_rated',      // 높은 평점 영화
};

// Local Storage에서 API 키를 가져오는 함수
const getApiKey = () => localStorage.getItem("TMDb-Key");

// 특정 카테고리의 영화 데이터를 가져오는 함수
const fetchMovies = async (category, page = 1) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("API 키가 설정되지 않았습니다. 로그인 필요");
        return [];
    }
    try {
        const url = `${API_BASE_URL}${endpoints[category]}?api_key=${apiKey}&language=${language}&page=${page}`;
        const response = await axios.get(url);
        return response.data.results || []; // 영화 목록을 반환
    } catch (error) {
        console.error(`영화 데이터를 불러오는 중 오류가 발생했습니다 (${category}):`, error.message);
        return [];
    }
};

// 각 카테고리별로 데이터를 가져오는 함수들
const fetchPopularMovies = async (page = 1) => await fetchMovies('popular', page);
const fetchNowPlayingMovies = async (page = 1) => await fetchMovies('nowPlaying', page);
const fetchUpcomingMovies = async (page = 1) => await fetchMovies('upcoming', page);
const fetchTopRatedMovies = async (page = 1) => await fetchMovies('topRated', page);

export { fetchPopularMovies, fetchNowPlayingMovies, fetchUpcomingMovies, fetchTopRatedMovies };
