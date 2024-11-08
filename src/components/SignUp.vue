<template>
  <div class="auth-container">
    <h2>회원가입</h2>
    <form @submit.prevent="handleRegister">
      <input type="email" v-model="email" placeholder="이메일" required />
      <input type="password" v-model="password" placeholder="비밀번호" required />
      <input type="password" v-model="confirmPassword" placeholder="비밀번호 확인" required />
      <div>
        <input type="checkbox" v-model="agreedTerms" required /> <label>약관 동의</label>
      </div>
      <button type="submit">회원가입</button>
      <button @click="switchToSignIn">로그인으로 이동</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { register } from "@/services/AuthenticationService.js";
export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      agreedTerms: false,
      errorMessage: null,
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "비밀번호가 일치하지 않습니다.";
        return;
      }
      try {
        await register(this.email, this.password);
        this.$router.push("/signin");
      } catch (error) {
        this.errorMessage = error;
      }
    },
    switchToSignIn() {
      this.$router.push("/signin");
    },
  },
};
</script>

<style scoped>
/* 스타일 설정 */
</style>
