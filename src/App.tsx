import WeatherClothingAdvisor from "./components/ClothingRecommendations";
import { useWeatherOverViewQuery } from "./query";

function WeatherApp() {
  const { isFetching, data } = useWeatherOverViewQuery();

  if (isFetching || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="p-3 m-3 ">
      <h1 className="text-3xl font-semibold">Pop Out Smart ☁️</h1>
      <h2 className="text-2xl font-semibold">
        {data.name}, {data.sys.country}
      </h2>
      <WeatherClothingAdvisor data={data} />
    </div>
  );
}

export default WeatherApp;
