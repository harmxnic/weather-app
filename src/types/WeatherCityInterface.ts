import { CityInterface } from '@/types/CityInterface';

interface Wind {
  deg: number;
  speed: number;
}

export interface WeatherCityInterface extends CityInterface{
  icon: string;
  visibility: number;
  temp: number;
  pressure: number;
  wind: Wind;
  humidity: number;
}
