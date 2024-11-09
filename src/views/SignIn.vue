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
        <button @click="switchToSignUp">회원가입으로 이동</button>
      </form>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <toast :message="toastMessage" v-if="showToast" />
    </div>
  </transition>
</template>

<script>
import { login } from "@/services/AuthenticationService.js";
import toast from "@/components/Toast.vue";
import { setApiKey } from "@/utils/storage.js";

export default {
  name: "SignIn",
  components: { toast },
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      errorMessage: null,
      toastMessage: "",
      showToast: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await login(this.email, this.password);  // TMDB API key로 로그인
        setApiKey(response);  // API 키를 Local Storage에 저장
        if (this.rememberMe) localStorage.setItem("rememberedEmail", this.email);
        this.toastMessage = "로그인 성공!";
        this.showToast = true;
        setTimeout(() => this.$router.push("/"), 1500);  // Redirect after showing toast
      } catch (error) {
        this.errorMessage = error;
      }
    },
    switchToSignUp() {
      this.$router.push("/signup");
    },
    validateEmail() {
      const emailPattern = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
      if (!emailPattern.test(this.email)) {
        this.errorMessage = "유효한 이메일 형식이 아닙니다.";
      }
    },
  },
  mounted() {
    this.email = localStorage.getItem("rememberedEmail") || "";
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
