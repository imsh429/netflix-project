<template>
  <transition name="fade">
    <div class="auth-container">
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="이메일" required @blur="validateEmail" />
        <input type="password" v-model="password" placeholder="비밀번호" required />
        <div>
          <input type="checkbox" v-model="rememberMe" /> <label>Remember me</label>
        </div>
        <button type="submit">로그인</button>
        <button @click="switchToSignUp">회원가입</button>
      </form>
    </div>
  </transition>
</template>

<script>
import { login } from "@/services/AuthenticationService";

export default {
  data() {
    return {
      email: localStorage.getItem("savedEmail") || "",
      password: localStorage.getItem("savedPassword") || "",
      rememberMe: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const message = await login(this.email, this.password);
        alert(message);
        if (this.rememberMe) {
          localStorage.setItem("savedEmail", this.email);
          localStorage.setItem("savedPassword", this.password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }
        this.$router.push("/");
      } catch (error) {
        alert(error);
      }
    },
    switchToSignUp() {
      this.$router.push("/signup");
    },
    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.email)) {
        alert("이메일 형식이 올바르지 않습니다.");
      }
    },
  },
};
</script>
