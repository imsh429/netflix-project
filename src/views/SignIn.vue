<template>
  <div class="auth-container">
    <h2>로그인</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="이메일" required />
      <input type="password" v-model="password" placeholder="비밀번호" required />
      <div>
        <input type="checkbox" v-model="rememberMe" /> <label>Remember me</label>
      </div>
      <button type="submit">로그인</button>
      <button @click="switchToSignUp">회원가입으로 이동</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { login } from "@/services/AuthenticationService.js";
export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      errorMessage: null,
    };
  },
  methods: {
    async handleLogin() {
      try {
        await login(this.email, this.password);
        if (this.rememberMe) localStorage.setItem("rememberedEmail", this.email);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error;
      }
    },
    switchToSignUp() {
      this.$router.push("/signup");
    },
  },
  mounted() {
    this.email = localStorage.getItem("rememberedEmail") || "";
  },
};
</script>

<style scoped>
/* 스타일 설정 */
</style>
