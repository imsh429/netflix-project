<template>
  <transition name="fade">
    <div class="auth-container">
      <h2>회원가입</h2>
      <form @submit.prevent="handleRegister">
        <input type="email" v-model="email" placeholder="이메일" required @blur="validateEmail" />
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
  </transition>
</template>

<script>
import { register } from "@/services/AuthenticationService.js";
import { setApiKey } from "@/utils/storage.js";

export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      agreedTerms: false,
      errorMessage: null
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "비밀번호가 일치하지 않습니다.";
        return;
      }
      try {
        const response = await register(this.email, this.password);
        setApiKey(response);
        alert("회원가입 성공!");
        this.$router.push("/signin");
      } catch (error) {
        this.errorMessage = error;
      }
    },
    switchToSignIn() {
      this.$router.push("/signin");
    },
    validateEmail() {
      const emailPattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailPattern.test(this.email)) {
        this.errorMessage = "유효한 이메일 형식이 아닙니다.";
      }
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
