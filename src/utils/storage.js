// 추천 영화 목록을 Local Storage에서 가져오기
export function getWishlistMovies() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// 추천 영화 목록을 Local Storage에 저장하기
export function setWishlistMovies(movies) {
    localStorage.setItem("wishlist", JSON.stringify(movies));
}

// 추천 영화에 영화 추가
export function addMovieToWishlist(movie) {
    const movies = getWishlistMovies();
    if (!movies.find(m => m.id === movie.id)) {
        movies.push(movie);
        setWishlistMovies(movies);
    }
}

// 추천 영화에서 영화 삭제
export function removeMovieFromWishlist(movieId) {
    const movies = getWishlistMovies().filter(m => m.id !== movieId);
    setWishlistMovies(movies);
}

// 영화가 추천 영화에 있는지 확인
export function isMovieInWishlist(movieId) {
    return getWishlistMovies().some(m => m.id === movieId);
}

// API 키를 Local Storage에 저장
export function setApiKey(apiKey) {
    localStorage.setItem("TMDb-Key", apiKey);
}

// Local Storage에서 API 키 가져오기
export function getApiKey() {
    return localStorage.getItem("TMDb-Key");
}

// API 키 삭제
export function removeApiKey() {
    localStorage.removeItem("TMDb-Key");
}
