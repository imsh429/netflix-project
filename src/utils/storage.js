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

// 최근 검색어 가져오기
export function getRecentSearches() {
    return JSON.parse(localStorage.getItem("recentSearches")) || [];
}

// 최근 검색어 저장하기
export function addRecentSearch(query) {
    if (!query.trim()) return;
    const searches = getRecentSearches();
    // 중복 제거 및 최대 10개 제한
    const updatedSearches = [query, ...searches.filter(search => search !== query)].slice(0, 10);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
}

// 특정 검색어 삭제
export function removeRecentSearch(query) {
    const searches = getRecentSearches().filter(search => search !== query);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
}

// 최근 검색어 삭제
export function clearRecentSearches() {
    localStorage.removeItem("recentSearches");
}

// 로그인 상태 저장
export function setLoginStatus(isLoggedIn) {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
}

// 로그인 상태 가져오기
export function getLoginStatus() {
    return JSON.parse(localStorage.getItem("isLoggedIn")) || false;
}

// 로그아웃 시 로그인 상태 제거
export function clearLoginStatus() {
    localStorage.removeItem("isLoggedIn");
}
