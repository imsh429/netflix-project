<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <slot></slot>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseModal",
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  width: 90%;
  max-width: 600px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: black;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
