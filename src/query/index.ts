import { QueryClient, useQuery } from "@tanstack/react-query";
import { getWeatherOverView, WeatherInfo } from "./api";
import { useWeatherStore } from "../store/weather";

// Create a client
export const queryClient = new QueryClient();

export function useWeatherOverViewQuery(cityName: string) {
  console.log("useWeatherOverViewQuery", cityName);
  const setWeather = useWeatherStore((state) => state.setWeather);

  return useQuery({
    queryKey: ["weather", cityName],
    queryFn: () => getWeatherOverView(cityName),
    select: (data: WeatherInfo) => {
      setWeather(data);
      return data;
    },
  });
}
