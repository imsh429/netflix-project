import { tryLogin, tryRegister } from "../Authentication.js";

const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        tryLogin(
            email,
            password,
            (tmdbKey) => {
                // 로그인 성공 시 입력한 비밀번호를 TMDb-Key로 저장
                localStorage.setItem("TMDb-Key", tmdbKey);
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

const logout = () => {
    localStorage.removeItem("TMDb-Key"); // 세션 키만 삭제
};

export { login, register, isLoggedIn, logout };
