// App.tsx

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useWeatherOverViewQuery } from "./query";
import "./App.css";
import Degrees from "./components/Degrees";
import WeatherClothingAdvisor from "./components/ClothingRecommendations";
import LocationInput from "./components/LocationInput";
import Country from "./components/Country";
import Model from "./recommend/weather-model";  

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
  console.log(data)

  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);


  useEffect(() => {
    if (data) {
      fetch('https://pop-out-smart-server.vercel.app/save-weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => console.log('Weather data saved:', data))
        .catch(error => console.error('Error saving weather data:', error));
    }
  }, [data]); 

  const getSavedLocation = (): { lat: number; lon: number } | null => {
    const saved = localStorage.getItem("location");
    return saved ? JSON.parse(saved) : null;
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    console.log("Selected location", lat, lon);
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
        <nav>
          <ul className="flex space-x-4 mb-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/model">Model</Link>
            </li>
          </ul>
        </nav>
        <button
          className="absolute top-0 left-0 m-4 p-1 bg-red-500 text-white rounded text-xs"
          onClick={handleReset}
        >
          Reset
        </button>
        <LocationInput onSelect={handleLocationSelect} />
        <Routes>
          <Route path="/" element={
            data ? (
              <>
                <Country data={data} />
                <Degrees data={data} />
                <WeatherClothingAdvisor data={data} />
              </>
            ) : (
              <p>Loading...</p>
            )
          } />
          <Route path="/model" element={<Model data={data} />} />
        </Routes>
      </div>
  );
}

export default App;
