<template>
  <header class="flex justify-between items-center w-2/5 mx-auto py-3">
    <h1 class="text-2xl font-semibold">Weather App</h1>
    <button class="w-5 h-5"
      @click="isModalActive = true"
    >
      <icon-cog />
    </button>
    <transition name="modal">
      <modal-cities
        v-if="isModalActive"
        @closeModal="closeModal"
      />
    </transition>
  </header>
</template>

<script setup lang="ts">
import IconCog from "@/components/base/icons/IconCog.vue";
import ModalCities from "@/components/base/ModalCities.vue";
import { ref } from 'vue';

const emits = defineEmits(['updateCities']);

const isModalActive = ref<Boolean>(false);

const closeModal = () => {
  isModalActive.value = false;
	emits('updateCities');
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
