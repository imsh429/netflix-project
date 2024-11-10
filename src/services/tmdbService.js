import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const language = 'ko-KR';
const endpoints = {
    popular: '/movie/popular',         // 인기 영화
    nowPlaying: '/movie/now_playing',  // 현재 상영 중인 영화
    upcoming: '/movie/upcoming',       // 개봉 예정 영화
    topRated: '/movie/top_rated',      // 높은 평점 영화
    discover: '/discover/movie'        // 영화 검색/필터링
};

// Local Storage에서 API 키를 가져오는 함수
const getApiKey = () => localStorage.getItem("TMDb-Key");

// 특정 카테고리와 추가 필터로 영화 데이터를 가져오는 함수
const fetchMovies = async (category, page = 1, additionalParams = {}) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("API 키가 설정되지 않았습니다. 로그인 필요");
        return [];
    }
    try {
        // 추가적인 필터링 파라미터를 URL에 포함
        const queryParams = new URLSearchParams({
            api_key: apiKey,
            language,
            page,
            ...additionalParams,
        }).toString();

        const url = `${API_BASE_URL}${endpoints[category]}?${queryParams}`;
        const response = await axios.get(url);
        return response.data.results || []; // 영화 목록을 반환
    } catch (error) {
        console.error(`영화 데이터를 불러오는 중 오류가 발생했습니다 (${category}):`, error.message);
        return [];
    }
};

// 장르별 영화 데이터를 가져오는 함수
const fetchMoviesByGenre = async (genreId, page = 1) => {
    return await fetchMovies('discover', page, { with_genres: genreId });
};

// 평점별 영화 데이터를 가져오는 함수
const fetchMoviesByRating = async (rating, page = 1) => {
    return await fetchMovies('discover', page, { 'vote_average.gte': rating });
};

// 장르와 평점별 영화 데이터를 가져오는 함수
const fetchMoviesByGenreAndRating = async (genreId, rating, page = 1) => {
    return await fetchMovies('discover', page, { with_genres: genreId, 'vote_average.gte': rating });
};

// 각 카테고리별로 데이터를 가져오는 함수들
const fetchPopularMovies = async (page = 1) => await fetchMovies('popular', page);
const fetchNowPlayingMovies = async (page = 1) => await fetchMovies('nowPlaying', page);
const fetchUpcomingMovies = async (page = 1) => await fetchMovies('upcoming', page);
const fetchTopRatedMovies = async (page = 1) => await fetchMovies('topRated', page);

export {
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTopRatedMovies,
    fetchMoviesByGenre,
    fetchMoviesByRating,
    fetchMoviesByGenreAndRating
};
