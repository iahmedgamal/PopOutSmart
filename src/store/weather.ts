import { WeatherInfo } from "../query/api";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WeatherState {
  weather: WeatherInfo | null;
  setWeather: (weather: WeatherInfo) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    devtools((set) => ({
      weather: null,
      setWeather: (weather) => set({ weather }),
    })),
    { name: "WeatherPersist" }
  )
);