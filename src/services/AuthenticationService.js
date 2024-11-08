// src/services/AuthenticationService.js
import { tryLogin, tryRegister } from "../Authentication.js";

const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        tryLogin(
            email,
            password,
            (token) => {
                localStorage.setItem("TMDb-Key", token);
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

const isLoggedIn = () => !!localStorage.getItem("TMDb-Key");

export { login, register, isLoggedIn };
