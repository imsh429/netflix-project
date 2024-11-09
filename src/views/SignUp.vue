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
      <toast :message="toastMessage" v-if="showToast" />
    </div>
  </transition>
</template>

<script>
import { register } from "@/services/AuthenticationService.js";
import toast from "@/components/Toast.vue";
import { setApiKey } from "@/utils/storage.js";

export default {
  name: "SignUp",
  components: { toast },
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      agreedTerms: false,
      errorMessage: null,
      toastMessage: "",
      showToast: false,
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "비밀번호가 일치하지 않습니다.";
        return;
      }
      try {
        const response = await register(this.email, this.password);  // TMDB API로 회원가입
        setApiKey(response);  // API 키를 Local Storage에 저장
        this.toastMessage = "회원가입 성공!";
        this.showToast = true;
        setTimeout(() => this.$router.push("/signin"), 1500);  // Redirect after showing toast
      } catch (error) {
        this.errorMessage = error;
      }
    },
    switchToSignIn() {
      this.$router.push("/signin");
    },
    validateEmail() {
      const emailPattern = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
      if (!emailPattern.test(this.email)) {
        this.errorMessage = "유효한 이메일 형식이 아닙니다.";
      }
    },
  },
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
