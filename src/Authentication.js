// src/Authentication.js

function tryLogin(email, password, onSuccess, onError) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[email] && users[email] === password) {
        onSuccess(password);
    } else {
        onError();
    }
}

function tryRegister(email, password, onSuccess, onError) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[email]) {
        onError(); // 이미 존재하는 사용자
    } else {
        users[email] = password;
        localStorage.setItem("users", JSON.stringify(users));
        onSuccess(); // 성공 시 아무 데이터 반환 필요 없음
    }
}

export { tryLogin, tryRegister };
