<template>
  <div class="bg-black/30 fixed w-full h-full inset-0 flex items-center justify-center"
    @click.self="$emit('closeModal')"
  >
    <div class="p-12 pt-14 bg-white w-1/4 relative">
      <modal-cities-list class="flex flex-col gap-3 mb-3"
        :cities="cities"
        @deleteCity="deleteCity"
        @startDrag="startDrag"
        @closeModal="$emit('closeModal')"
        @drop="onDrop"
        @dragover.prevent="dragOver"
        @dragenter.prevent
        @dragend.prevent="dragEnd"
				ref="draggableList"
			/>
      <button class="flex justify-center items-center w-full h-10 p-2 border-2 border-dashed border-gray-300"
        v-if="!isInputVisible"
        @click="showInput"
      >
        <icon-plus />
      </button>
      <label class="flex flex-col text-black"
        v-if="isInputVisible"
      >
        <span class="mb-1">Add location</span>
        <input class="p-2 border-2 border-solid border-gray-300 rounded-md"
          v-model="cityName"
				  @input="showHints"
          ref="input"
          type="text"
          placeholder="Enter city name"
        >
      </label>
			<ul class="absolute w-[calc(100%-6rem)] top-[calc(100%-2.8rem)]"
				v-if="suggestions.length"
			>
				<template
					v-for="suggestion in suggestions"
					:key="suggestion.unrestricted_value"
				>
					<li class="p-2 bg-gray-700 hover:bg-gray-600 cursor-pointer transition"
						v-if="suggestion.data.city"
						@click="addCity(suggestion)"
					>
						{{ suggestion.data.city }}, {{ suggestion.data.country_iso_code }}
					</li>
				</template>
			</ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconPlus from '@/components/base/icons/IconPlus.vue';
import ModalCitiesList from '@/components/base/ModalCitiesList.vue';

import { CityInterface } from '@/types/CityInterface';

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import axios from 'axios';

defineEmits(['closeModal']);

const cityName = ref<String>('');
const input = ref<HTMLElement | any>();
const draggableList = ref();
const selectedDraggable = ref<HTMLElement | any>();
const isInputVisible = ref<Boolean>(false);
const timeout = ref();
const suggestions = ref<Array<Object>>([]);
const cities = ref<CityInterface[]>(JSON.parse(localStorage.getItem('cities') || '[]'));

const draggableItem = computed<HTMLElement | any>(() => draggableList.value.draggableItem);

watch(cities, (newArr, oldArr) => {
	if (newArr.length > oldArr.length) {
		draggableItem.value[cities.value.length - 1]._key = cities.value[cities.value.length - 1].id;
	}
});

const clearSearch = () => {
	cityName.value = '';
	suggestions.value = [];
	isInputVisible.value = false;
};

const showInput = () => {
  isInputVisible.value = true;
  nextTick(() => input.value?.focus());
};

const showHints = () => {
	clearTimeout(timeout.value);
	timeout.value = setTimeout(async () => {
		const response = await axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
			{
				query: cityName.value,
				language: 'en',
				locations: [{ country: '*' }],
				count: 5
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': 'Token f1509202ddfe0da7ac5ebffb01a2cbbc62ef77d8'
				}
			}
		);
		suggestions.value = response.data.suggestions;
	}, 500);
};

const addCity = (city: any) => {
	const newCity: CityInterface = {
		cityName: city.data.city,
		country: city.data.country_iso_code,
		lat: city.data.geo_lat,
		lon: city.data.geo_lon,
		id: city.data.geo_lon + city.data.geo_lat
	};
	cities.value.push(newCity);
	localStorage.setItem('cities', JSON.stringify(cities.value));
	clearSearch();
};

const deleteCity = (city: CityInterface) => {
	cities.value = cities.value.filter(item => item.lon + item.lat !== city.lon + city.lat);
	localStorage.setItem('cities', JSON.stringify(cities.value));
};

const getIndexOfEl = (condition: string): number => {
	return cities.value.findIndex(item => item.id === condition);
};

const startDrag = (event: any) => {
	event.dataTransfer.dropEffect = 'move';
	event.dataTransfer.effectAllowed = 'move';
	selectedDraggable.value = event.target;
};

const dragOver = (event: any) => {
	if (event.target !== selectedDraggable.value && event.target !== draggableList.value && event.target.classList.contains('item')) {
		let tempArr = cities.value.map(item => item);
		let temp = tempArr[getIndexOfEl(selectedDraggable.value._key)];
		tempArr[getIndexOfEl(selectedDraggable.value._key)] = tempArr[getIndexOfEl(event.target._key)];
		tempArr[getIndexOfEl(event.target._key)] = temp;
		cities.value = tempArr.map(item => item);
	} else {
		return;
	}
};

const dragEnd = () => {
	selectedDraggable.value = null;
};

const onDrop = () => {
	localStorage.setItem('cities', JSON.stringify(cities.value));
};

onMounted(() => {
	draggableItem.value.forEach((item: { _key: string; }, index: number) => item._key = cities.value[index].id);
});

onBeforeUnmount(() => clearTimeout(timeout.value));
</script>
