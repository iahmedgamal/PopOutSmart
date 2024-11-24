import WeatherClothingAdvisor from "./components/ClothingRecommendations";
import { useWeatherOverViewQuery } from "./query";
import { FaTemperatureArrowUp } from "react-icons/fa6";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import "./App.css";
import React from "react";

function App() {
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
    <div className="p-1 m-1">
      <h2 className="text-2xl font-semibold mb-2">  
        {data.name}, {data.sys.country}
      </h2>

      
      <div className="flex items-center justify-between  m-3">
        <div className="flex items-center text-red-400">
          <FaTemperatureArrowUp className="text-2xl mr-1" /> max
          <span>({Math.round(data.main.temp_max)}°C)</span>
        </div>
    
        <div className="flex items-center text-blue-300">
          <FaTemperatureArrowDown className="text-2xl mr-1" /> low
          <span> ({Math.round(data.main.temp_min)}°C) </span>
        </div>
        <div className="flex items-center text-green-600 text-2xl">
        
        </div>
      </div>


      <WeatherClothingAdvisor data={data} />
    </div>
  );
}

export default App;
