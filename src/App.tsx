import WeatherClothingAdvisor from "./components/ClothingRecommendations";
import { useWeatherOverViewQuery } from "./query";
import { FaTemperatureArrowUp } from "react-icons/fa6";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import "./App.css";

function WeatherApp() {
  const { isFetching, data } = useWeatherOverViewQuery();

  if (isFetching || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading weather data...</p>
      </div>
    );
  }

  console.log(data);

  return (
    <div className="p-3 m-3">
      <h1 className="text-3xl font-semibold mb-4">Pop Out Smart ☁️</h1>
      <h2 className="text-2xl font-semibold mb-2">
        {data.name}, {data.sys.country}
      </h2>

      
      <span className="flex items-center justify-between ">
        <div className="flex items-center">
          <FaTemperatureArrowUp className="text-2xl mr-1" />
          <span>{data.main.temp_max}°C</span>
        </div>
        <div className="flex items-center">
          <FaTemperatureArrowDown className="text-2xl mr-1" />
          <span>{data.main.temp_min}°C</span>
        </div>
      </span>


      <WeatherClothingAdvisor data={data} />
    </div>
  );
}

export default WeatherApp;
