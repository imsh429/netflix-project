// src/Authentication.js

// 임시 사용자 데이터 저장용 (실제 앱에서는 백엔드 서버에서 처리)
const users = new Map();

function tryLogin(email, password, onSuccess, onError) {
    const user = users.get(email);
    if (user && user.password === password) {
        const token = "fake-jwt-token"; // 여기서는 가짜 JWT 토큰을 사용합니다.
        onSuccess(token);
    } else {
        onError();
    }
}

function tryRegister(email, password, onSuccess, onError) {
    if (users.has(email)) {
        onError(); // 이미 존재하는 사용자
    } else {
        users.set(email, { password });
        onSuccess();
    }
}

export { tryLogin, tryRegister };
