<template>
  <li class="flex-auto min-w-[350px] w-2/5 h-72 py-1 px-3 border-2 border-solid border-gray-400 rounded-md"
			v-if="cityInfo.icon"
	>
    <div class="text-xl font-semibold text-center">{{ cityInfo.cityName || weatherData.name }}, {{ cityInfo.country || weatherData.sys.country }}</div>
		<div class="flex justify-between items-center mt-5">
			<img
				:src="`http://openweathermap.org/img/wn/${cityInfo.icon}@2x.png`"
				alt="Weather"
			>
			<div class="text-5xl font-extrabold">{{ cityInfo.temp.toFixed(0) }}&#176;</div>
		</div>
		<div class="flex justify-between items-center flex-wrap gap-2 mt-5">
			<div class="text-xl text-center w-[45%]">Wind: {{ cityInfo.wind.speed }} {{ degToDirection }}</div>
			<div class="text-xl text-center w-[45%]">Pressure: {{ cityInfo.pressure }}hPA</div>
			<div class="text-xl text-center w-[45%]">Humidity: {{ cityInfo.humidity }}%</div>
			<div class="text-xl text-center w-[45%]">Visibility: {{ metersToKm }}km</div>
		</div>
  </li>
</template>

<script setup lang="ts">
import { CityInterface } from '@/types/CityInterface';
import { WeatherCityInterface } from '@/types/WeatherCityInterface';

import { computed, onBeforeMount, ref } from 'vue';

import axios from 'axios';

const props = defineProps<{
	city: CityInterface
}>();

const weatherData = ref<any>({});

const cityInfo = computed((): WeatherCityInterface => {
	return {
		...props.city,
		icon: weatherData.value.weather?.[0].icon,
		wind: {
			deg: weatherData.value.wind?.deg,
			speed: weatherData.value.wind?.speed
		},
		temp: weatherData.value.main?.temp,
		humidity: weatherData.value.main?.humidity,
		pressure: weatherData.value.main?.pressure,
		visibility: weatherData.value.visibility
	};
});

const degToDirection = computed((): string => {
	let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
	return  compassSector[(cityInfo.value.wind.deg / 22.5).toFixed(0) as unknown as number];
});

const metersToKm = computed((): number => {
	return (cityInfo.value.visibility / 1000).toFixed(0) as unknown as number;
});

onBeforeMount(() => {
	axios
		.get(`https://api.openweathermap.org/data/2.5/weather?lat=${props.city.lat}&lon=${props.city.lon}&units=metric&appid=ec763a8c59faf1a2e71a937d33584393`)
		.then(response => weatherData.value = response.data)
		.then(() => {
			const cities: CityInterface[] = JSON.parse(localStorage.getItem('cities') || '[]');
			const cityToChange: CityInterface | undefined = cities.find(item => item.lat + item.lon === props.city.lat + props.city.lon);
			if (cityToChange !== undefined) {
				cityToChange.cityName = weatherData.value.name;
				cityToChange.country = weatherData.value.sys.country;
				localStorage.setItem('cities', JSON.stringify(cities));
			}
		});
});
</script>
