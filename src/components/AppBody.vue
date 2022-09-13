<template>
  <main class="container mx-auto mt-10 pb-10 w-2/5">
    <weather-list :cities="cities" />
  </main>
</template>

<script setup lang="ts">
import WeatherList from "@/components/base/WeatherList.vue";

import { CityInterface } from '@/types/CityInterface';

defineProps<{
	cities: CityInterface[]
}>();
</script>
