<template>
  <ul class="flex justify-between items-center gap-3 flex-wrap">
    <template
			v-for="city in cities"
			:key="city.lat + city.lon"
		>
			<weather-item
				v-if="city"
				:city="city"
			/>
		</template>
  </ul>
</template>

<script setup lang="ts">
import WeatherItem from "@/components/base/WeatherItem.vue";

import { CityInterface } from '@/types/CityInterface';

defineProps<{
	cities: CityInterface[]
}>();
</script>
