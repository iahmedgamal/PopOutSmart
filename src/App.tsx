import React, { useState, useEffect } from "react";
import { getSavedCityName, useWeatherOverViewQuery } from "./query";
import "./App.css";
import Degrees from "./components/Degrees";
import WeatherClothingAdvisor from "./components/ClothingRecommendations";
import LocationInput from "./components/LocationInput";
import Country from "./components/Country";

function App() {
  
  
  const [cityName, setCityName] = useState<string | null>(localStorage.getItem("cityName") || "Sofia");
  const [fetchCityName, setFetchCityName] = useState<string | null>(cityName);
  const { isFetching, data } = useWeatherOverViewQuery(fetchCityName);

  useEffect(() => {
    const savedCityName = getSavedCityName();
    if (savedCityName) {
      setCityName(savedCityName);
    }
  }, []);
  const handleCitySelect = (selectedCityName: string) => {

    setCityName(selectedCityName);
  };

  useEffect(() => {
    setFetchCityName(cityName);
  }, [cityName]);

  if (isFetching || (!data && cityName && cityName !="")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="p-1 m-1">
      <LocationInput onSelect={handleCitySelect} />
      <Country data={data} />
      <Degrees data={data} />
      <WeatherClothingAdvisor data={data} />
    </div>
  );
}

export default App;
