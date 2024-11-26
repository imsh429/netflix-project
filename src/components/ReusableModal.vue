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
</style>
