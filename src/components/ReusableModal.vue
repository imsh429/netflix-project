<template>
  <transition name="fade-zoom">
    <div v-if="visible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <slot></slot>
        <button class="close-btn" @click="closeModal">닫기</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ReusableModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 80%;
  max-width: 800px;
  background-color: black;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  border: none;
}
/* Transition 효과 */
.fade-zoom-enter-active, .fade-zoom-leave-active {
  transition: all 0.3s ease-out;
}

.fade-zoom-enter-from, .fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-zoom-enter-to, .fade-zoom-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* 모바일 대응 스타일 */
@media screen and (max-width: 768px) {
  .modal-content {
    width: 90%;
    padding: 10px;
    border-radius: 5px;
  }

  .close-btn {
    top: 5px;
    right: 5px;
    font-size: 16px;
  }
}
@media screen and (max-width: 480px) {
  .modal-content {
    width: 95%; /* 더 작은 화면에 맞게 크기 축소 */
    padding: 8px; /* 여백 줄임 */
    border-radius: 5px; /* 둥근 모서리 유지 */
  }

  .close-btn {
    top: 5px;
    right: 5px;
    font-size: 14px; /* 버튼 글씨 크기 더 줄임 */
  }
}
</style>
