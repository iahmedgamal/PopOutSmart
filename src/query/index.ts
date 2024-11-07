import { QueryClient, useQuery } from "@tanstack/react-query";
import { getWeatherOverView, WeatherInfo } from "./api";
import { useWeatherStore } from "../store/weather";

// Create a client
export const queryClient = new QueryClient();

export function useWeatherOverViewQuery() {
  const setWeather = useWeatherStore((state) => state.setWeather);

  return useQuery({
    queryKey: ["weather"],
    queryFn: getWeatherOverView,
    select: (data: WeatherInfo) => {
      setWeather(data);
      return data;
    },
 
  });
}