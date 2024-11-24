import { QueryClient, useQuery } from "@tanstack/react-query";
import { getWeatherOverView, WeatherInfo } from "./api";
import { useWeatherStore } from "../store/weather";

// Create a client
export const queryClient = new QueryClient();

export function useWeatherOverViewQuery(cityName: string) {
  console.log("useWeatherOverViewQuery", cityName);
  const setWeather = useWeatherStore((state) => state.setWeather);

  // Save city name to local storage
  if (typeof window !== "undefined") {
    localStorage.setItem("cityName", cityName);
  }

  return useQuery({
    queryKey: ["weather", cityName],
    queryFn: () => getWeatherOverView(cityName),
    select: (data: WeatherInfo) => {
      setWeather(data);
      return data;
    },
  });
}

// Function to get the city name from local storage
export function getSavedCityName(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("cityName");
  }
  return null;
}
