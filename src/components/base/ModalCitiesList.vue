<template>
  <div ref="draggableList">
    <button class="w-5 h-5 absolute top-5 right-5"
      @click="$emit('closeModal')"
    >
      <icon-cross />
    </button>
    <div class="flex items-center text-black bg-gray-300 p-2 w-full item"
      v-for="availableCity in cities"
      :key="availableCity.id"
      draggable="true"
      @dragstart="$emit('startDrag', $event)"
      ref="draggableItem"
    >
      <button class="w-5 h-5 cursor-grab">
        <icon-drag />
      </button>
      <span class="ml-2">
						{{ availableCity.cityName }}, {{ availableCity.country }}
					</span>
      <button class="w-5 h-5 ml-auto"
        @click="$emit('deleteCity', availableCity)"
      >
        <icon-delete />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconCross from '@/components/base/icons/IconCross.vue';
import IconDrag from '@/components/base/icons/IconDrag.vue';
import IconDelete from '@/components/base/icons/IconDelete.vue';

import { CityInterface } from '@/types/CityInterface';
import { ref } from 'vue';

defineProps<{
  cities: CityInterface[]
}>();
defineEmits(['deleteCity', 'startDrag', 'closeModal']);

const draggableItem = ref<HTMLElement | any>();

defineExpose({ draggableItem });
</script>
