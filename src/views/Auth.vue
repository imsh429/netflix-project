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
      rememberMe: false,
      errorMessage: null,
    };
  },
  methods: {
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Container: Perspective for animation */
.auth-container {
  position: relative;
  width: 400px;
  height: 520px;
  perspective: 1000px;
}

/* Card */
.auth-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
}

/* Title */
.auth-card h2 {
  font-family: "Poppins", sans-serif;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 1rem;
}

.checkbox-container input {
  margin-right: 0.5rem;
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
</style>
