import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const language = 'ko-KR';

// endpoint 이용해 요청할 API 주소 구성
const endpoints = {
    popular: '/movie/popular',         // 인기 영화
    nowPlaying: '/movie/now_playing',  // 현재 상영 중인 영화
    upcoming: '/movie/upcoming',       // 개봉 예정 영화
    topRated: '/movie/top_rated',      // 높은 평점 영화
    discover: '/discover/movie'        // 영화 검색/필터링
};

// Local Storage 에서 API 키를 가져오는 함수
const getApiKey = () => localStorage.getItem("TMDb-Key");

// 특정 카테고리의 영화 데이터 가져오는 '공통'함수
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

// 영화 상세 정보를 가져오는 함수
const fetchMovieDetails = async (movieId) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("API 키가 설정되지 않았습니다. 로그인 필요");
        return null;
    }
    try {
        const url = `${API_BASE_URL}/movie/${movieId}?api_key=${apiKey}&language=${language}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`영화 상세 정보를 가져오는 중 오류가 발생했습니다 (movieId: ${movieId}):`, error.message);
        return null;
    }
};


// Search filter (위 filtering movies 함수에 인자 전달)
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

// 검색어에 따라 영화를 가져오는 함수
const fetchMoviesByQuery = async (query, page = 1) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("API 키가 설정되지 않았습니다. 로그인 필요");
        return [];
    }
    try {
        const url = `${API_BASE_URL}/search/movie?api_key=${apiKey}&language=${language}&query=${encodeURIComponent(query)}&page=${page}`;
        const response = await axios.get(url);
        return response.data.results || []; // 검색 결과 목록을 반환
    } catch (error) {
        console.error(`영화 검색 중 오류가 발생했습니다 (query: ${query}):`, error.message);
        return [];
    }
};


// main 화면에 사용될  인기영화, 지금 상영중 영화 등
const fetchPopularMovies = async (page = 1) => await fetchMovies('popular', page);
const fetchNowPlayingMovies = async (page = 1) => await fetchMovies('nowPlaying', page);
const fetchUpcomingMovies = async (page = 1) => await fetchMovies('upcoming', page);
const fetchTopRatedMovies = async (page = 1) => await fetchMovies('topRated', page);

// 영화 예고편 정보를 가져오는 함수
const fetchMovieTrailer = async (movieId) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("API 키가 설정되지 않았습니다. 로그인 필요");
        return null;
    }
    try {
        const url = `${API_BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`;
        const response = await axios.get(url);

        // TMDB API에서 'Trailer' 타입의 YouTube 영상을 찾음
        const trailers = response.data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
        return trailers.length ? trailers[0].key : null; // 예고편이 있으면 첫 번째 YouTube 영상의 키를 반환
    } catch (error) {
        console.error(`예고편 데이터를 불러오는 중 오류가 발생했습니다 (movieId: ${movieId}):`, error.message);
        return null;
    }
};

export {
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTopRatedMovies,
    fetchMoviesByGenre,
    fetchMoviesByRating,
    fetchMoviesByGenreAndRating,
    fetchMovieTrailer,
    fetchMovieDetails,
    fetchMoviesByQuery
};
