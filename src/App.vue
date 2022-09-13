<template>
  <div class="main min-h-[100vh] bg-slate-800 text-white">
    <app-header @updateCities="updateCities" />
		<app-body :cities="cities" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppBody from '@/components/AppBody.vue';

import { onMounted, ref } from 'vue';

import { CityInterface } from '@/types/CityInterface';

const cities = ref<CityInterface[]>(JSON.parse(localStorage.getItem('cities') || '[]'));

const updateCities = () => {
	cities.value = JSON.parse(localStorage.getItem('cities') || '[]');
};

onMounted(() => {
	if (!cities.value.length) {
		navigator.geolocation.getCurrentPosition(res => {
			cities.value.push({
				id: `${res.coords.longitude + res.coords.latitude}`,
				lat: `${res.coords.latitude}`,
				lon: `${res.coords.longitude}`
			});
			localStorage.setItem('cities', JSON.stringify(cities.value));
		});
	}
});
</script>
