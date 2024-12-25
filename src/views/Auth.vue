<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <transition name="slide-fade" mode="out-in">
        <div
            :key="isSignUp ? 'signup' : 'signin'"
            class="auth-card"
        >
          <h2>{{ isSignUp ? '회원가입' : '로그인' }}</h2>
          <form @submit.prevent="handleSubmit">
            <input
                type="email"
                v-model="email"
                placeholder="이메일"
                required
                @blur="validateEmail"
            />
            <input
                type="password"
                v-model="password"
                placeholder="비밀번호"
                required
            />
            <div v-if="isSignUp">
              <input
                  type="password"
                  v-model="confirmPassword"
                  placeholder="비밀번호 확인"
                  required
              />
              <div class="checkbox-container">
                <input
                    type="checkbox"
                    v-model="agreedTerms"
                    required
                />
                <label>약관 동의</label>
              </div>
            </div>
            <div v-else class="checkbox-container">
              <input
                  type="checkbox"
                  v-model="rememberMe"
              />
              <label>Remember me</label>
            </div>
            <button type="submit" class="submit-button">
              {{ isSignUp ? '회원가입' : '로그인' }}
            </button>
          </form>
          <div v-on:click="kakaoLoginBtn">카카오로 로그인하기</div>
          <button
              type="button"
              class="toggle-button"
              @click="toggleMode"
          >
            {{ isSignUp ? '로그인으로 이동' : '회원가입' }}
          </button>
          <div
              v-if="errorMessage"
              class="error"
          >
            {{ errorMessage }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/services/AuthenticationService.js";

export default {
  name: "AuthPage",
  data() {
    return {
      isSignUp: this.$route.path === "/signup",
      email: localStorage.getItem("savedEmail") || "",
      password: localStorage.getItem("savedPassword") || "",
      confirmPassword: "",
      agreedTerms: false,
      rememberMe: localStorage.getItem("keepLogin") === "true", // keepLogin 상태 반영
      errorMessage: null,
    };
  },
  methods: {
    kakaoLoginBtn: function () {
  // 카카오 SDK 초기화
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.VUE_APP_KAKAO_API_KEY);
  }

  // 기존 토큰 제거
  if (window.Kakao.Auth.getAccessToken()) {
    window.Kakao.API.request({
      url: '/v1/user/unlink',
      success: function (response) {
        console.log(response);
      },
      fail: function (error) {
        console.log(error);
      },
    });
    window.Kakao.Auth.setAccessToken(undefined);
  }

  // 로그인 실행
  window.Kakao.Auth.login({
    success: (authObj) => {
      console.log('Access Token:', authObj.access_token);
      // 로컬스토리지에 Access Token 저장
      localStorage.setItem('kakaoAccessToken', authObj.access_token);

      // 사용자 정보 요청
      window.Kakao.API.request({
        url: '/v2/user/me',
        data: {
          property_keys: ['kakao_account.email', 'kakao_account.profile.nickname'],
        },
        success: (response) => {
          console.log(response);
          const userInfo = {
            id: response.id,
            email: response.kakao_account.email,
            nickname: response.kakao_account.profile.nickname,
          };
          // 로컬스토리지에 사용자 정보 저장
          localStorage.setItem("userId", userInfo.nickname); // 사용자 ID 저장
          alert(`환영합니다, ${userInfo.nickname}!`);
          this.$router.push('/'); // 로그인 후 메인 페이지로 리다이렉트
        },
        fail: (error) => {
          console.error('사용자 정보 요청 실패:', error);
          localStorage.removeItem('kakaoAccessToken'); // 실패 시 토큰 삭제
        },
      });
    },
    fail: (error) => {
      console.error('카카오 로그인 실패:', error);
    },
  });
},
    async handleSubmit() {
      if (this.isSignUp) {
        if (this.password !== this.confirmPassword) {
          this.errorMessage = "비밀번호가 일치하지 않습니다.";
          return;
        }

        if (!this.agreedTerms) {
          this.errorMessage = "약관에 동의해야 회원가입이 가능합니다.";
          return;
        }

        try {
          await register(this.email, this.password);
          alert("회원가입 성공!");
          this.$router.push("/signin");
        } catch (error) {
          this.errorMessage = error || "회원가입에 실패했습니다.";
        }
      } else {
        try {
          await login(this.email, this.password);
          if (this.rememberMe) {
            localStorage.setItem("savedEmail", this.email);
            localStorage.setItem("savedPassword", this.password);
            localStorage.setItem("keepLogin", "true");
          } else {
            // Remember me가 선택되지 않은 경우, 관련 정보 삭제
            localStorage.removeItem("savedEmail");
            localStorage.removeItem("savedPassword");
            localStorage.setItem("keepLogin", "false");
          }
          alert("로그인 성공!");
          this.$router.push("/");
        } catch (error) {
          this.errorMessage = error || "로그인에 실패했습니다.";
        }
      }
    },
    toggleMode() {
      this.isSignUp = !this.isSignUp;
      this.$router.push(this.isSignUp ? "/signup" : "/signin");
    },
  },

    validateEmail() {
      const emailPattern =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.email)) {
        this.errorMessage = "유효한 이메일 형식이 아닙니다.";
      }
    },
};
</script>

<style scoped>
/* Wrapper: Centering */
.auth-wrapper {
  display: grid;
  place-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
}

/* Container: Perspective for animation */
.auth-container {
  width: 90%;
  max-width: 400px;
  height: auto;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Card */
.auth-card {
  width: 100%;
}


/* Input Fields */
.auth-card input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.auth-card input:focus {
  border-color: #6a11cb;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
  outline: none;
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #2575fc, #6a11cb);
}

.submit-button:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #2575fc, #6a11cb);
}

/* Toggle Button */
.toggle-button {
  margin-top: 1rem;
  background: none;
  border: none;
  color: #6a11cb;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: color 0.3s ease, transform 0.3s ease;
}

.toggle-button:hover {
  color: #2575fc;
  transform: scale(1.1);
}

/* Error Message */
.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
}

/* Checkbox Container */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 라벨과 체크박스 간 간격 */
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.checkbox-container input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #6a11cb; /* 체크박스 색상 */
  cursor: pointer;
}

/* Animation: Slide Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s ease-in-out;
}

.slide-fade-enter {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
    box-shadow: none;
  }

  .submit-button {
    font-size: 0.9rem;
  }

  .toggle-button {
    font-size: 0.8rem;
  }
}
@media (min-width: 1024px) {
  .auth-container {
    max-width: 500px;
  }

  .submit-button {
    padding: 1rem;
    font-size: 1.2rem;
  }
}

@media (orientation: landscape) {
  .auth-wrapper {
    height: 100vh;
  }
}

</style>
