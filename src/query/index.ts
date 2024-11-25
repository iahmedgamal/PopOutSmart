import { QueryClient, useQuery } from "@tanstack/react-query";
import { getWeatherOverView, WeatherInfo } from "./api";
import { useWeatherStore } from "../store/weather";

// Create a client
export const queryClient = new QueryClient();

export function useWeatherOverViewQuery(lat: number, lon: number) {
  console.log("useWeatherOverViewQuery", lat, lon);
  const setWeather = useWeatherStore((state) => state.setWeather);

  // Save latitude and longitude to local storage
  if (typeof window !== "undefined") {
    localStorage.setItem("lat", lat.toString());
    localStorage.setItem("lon", lon.toString());
  }

  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeatherOverView(lat, lon),
    select: (data: WeatherInfo) => {
      setWeather(data);
      return data;
    },
  });
}

// Function to get the latitude and longitude from local storage
export function getSavedCoordinates(): { lat: number | null, lon: number | null } {
  if (typeof window !== "undefined") {
    const lat = localStorage.getItem("lat");
    const lon = localStorage.getItem("lon");
    return {
      lat: lat ? parseFloat(lat) : null,
      lon: lon ? parseFloat(lon) : null,
    };
  }
  return { lat: null, lon: null };
}
