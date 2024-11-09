// src/Authentication.js

// 임시 사용자 데이터 저장용 (실제 앱에서는 백엔드 서버에서 처리)
const users = new Map();

function tryLogin(email, password, onSuccess, onError) {
    const user = users.get(email);
    if (user && user.password === password) {
        onSuccess(password); // API 키로 비밀번호를 반환하여 Local Storage에 저장
    } else {
        onError();
    }
}

function tryRegister(email, password, onSuccess, onError) {
    if (users.has(email)) {
        onError(); // 이미 존재하는 사용자
    } else {
        users.set(email, { password });
        onSuccess(password); // 회원가입 성공 시 비밀번호를 반환하여 API 키로 사용
    }
}

export { tryLogin, tryRegister };
