import React, { useState, useEffect } from "react";
import { useWeatherOverViewQuery } from "./query";
import "./App.css";
import Degrees from "./components/Degrees";
import WeatherClothingAdvisor from "./components/ClothingRecommendations";
import LocationInput from "./components/LocationInput";
import Country from "./components/Country";

function App() {
  const defaultLocation = { lat: 30.0444, lon: 31.2357 }; // Default to Cairo's coordinates
  const [location, setLocation] = useState<{ lat: number; lon: number }>(
    JSON.parse(localStorage.getItem("location") || JSON.stringify(defaultLocation))
  );

  useEffect(() => {
    localStorage.setItem("defaultLocation", JSON.stringify(defaultLocation));
  }, []);
  const [fetchLocation, setFetchLocation] = useState<{ lat: number; lon: number } | null>(location);
  const { data } = useWeatherOverViewQuery(fetchLocation?.lat, fetchLocation?.lon);

  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const getSavedLocation = (): { lat: number; lon: number } | null => {
    const saved = localStorage.getItem("location");
    return saved ? JSON.parse(saved) : null;
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    const selectedLocation = { lat, lon };
    localStorage.setItem("location", JSON.stringify(selectedLocation));
    setLocation(selectedLocation || defaultLocation);
  };

  const handleReset = () => {
    localStorage.removeItem("location");
    localStorage.removeItem("WeatherPersist");
    setLocation(defaultLocation);
    setFetchLocation(defaultLocation);
  };

  useEffect(() => {
    setFetchLocation(location);
  }, [location]);

  return (
    <div className="p-1 m-1">
      <button 
        className="absolute top-0 left-0 m-4 p-1 bg-red-500 text-white rounded text-xs" 
        onClick={handleReset}
      >
        Reset
      </button>
      <LocationInput onSelect={handleLocationSelect} />
      {data ? (
        <>
          <Country data={data} />
          <Degrees data={data} />
          <WeatherClothingAdvisor data={data} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
