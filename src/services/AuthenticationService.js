// src/services/AuthenticationService.js
import { tryLogin, tryRegister } from "../Authentication.js";

const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        tryLogin(
            email,
            password,
            (token) => {
                localStorage.setItem("TMDb-Key", token);
                localStorage.setItem("userId", email); // 로그인 성공 시 userId 저장
                resolve("로그인 성공");
            },
            () => reject("로그인 실패: 잘못된 아이디 또는 비밀번호입니다.")
        );
    });
};

const register = async (email, password) => {
    return new Promise((resolve, reject) => {
        tryRegister(
            email,
            password,
            () => resolve("회원가입 성공"),
            () => reject("회원가입 실패: 이미 존재하는 아이디입니다.")
        );
    });
};

// 로그인 상태 확인 함수
const isLoggedIn = () => !!localStorage.getItem("TMDb-Key");

// 로그아웃 함수 추가
const logout = () => {
    localStorage.removeItem("TMDb-Key");
    localStorage.removeItem("userId");
};

export { login, register, isLoggedIn, logout };
