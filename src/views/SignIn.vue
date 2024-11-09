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
      email: localStorage.getItem("savedEmail") || "", // Remember me 기능으로 저장된 이메일 불러오기
      password: "",
      rememberMe: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const message = await login(this.email, this.password);
        alert(message); // 성공 메시지
        if (this.rememberMe) {
          localStorage.setItem("savedEmail", this.email); // Remember me가 체크된 경우 이메일 저장
        } else {
          localStorage.removeItem("savedEmail"); // 체크 해제된 경우 이메일 제거
        }
        this.$router.push("/"); // 로그인 성공 시 메인 페이지로 이동
      } catch (error) {
        alert(error); // 실패 메시지
      }
    },
    switchToSignUp() {
      this.$router.push("/signup");
    },
    validateEmail() {
      // 이메일 형식 확인 로직
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.email)) {
        alert("이메일 형식이 올바르지 않습니다.");
      }
    },
  },
};
</script>
