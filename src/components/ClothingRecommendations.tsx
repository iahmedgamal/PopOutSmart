import React from 'react';

// Simplified types
interface WeatherInfo {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{ description: string }>;
  wind: { speed: number };
}

function getRecommendations(weatherData: WeatherInfo) {
  const temp = weatherData.main.feels_like;
  const description = weatherData.weather[0].description.toLowerCase();
  
  let clothing = {
    outfit: '',
    extras: [] as string[],
    alerts: [] as string[]
  };
  
  // Simple temperature-based outfit
  if (temp <= 0) {
    clothing.outfit = "Heavy winter coat, thermal layers, warm pants";
    clothing.extras.push("Winter hat", "Gloves", "Scarf");
  } else if (temp <= 10) {
    clothing.outfit = "Warm coat, sweater, warm pants";
    clothing.extras.push("Light scarf");
  } else if (temp <= 18) {
    clothing.outfit = "Light jacket, regular pants";
  } else if (temp <= 25) {
    clothing.outfit = "Long sleeve shirt, light pants";
  } else {
    clothing.outfit = "Light, breathable clothing";
    clothing.extras.push("Sun hat");
  }
  
  // Weather conditions
  if (description.includes("rain")) {
    clothing.extras.push("Umbrella", "Waterproof shoes");
    clothing.alerts.push("Rain expected - stay dry!");
  }
  
  if (weatherData.wind.speed > 5.5) {
    clothing.extras.push("Wind-resistant layer");
    clothing.alerts.push("Windy conditions today");
  }
  
  if (description.includes("clear") && temp > 20) {
    clothing.extras.push("Sunscreen", "Sunglasses");
    clothing.alerts.push("Don't forget sun protection!");
  }
  
  return clothing;
}

const WeatherClothingAdvisor = ({ data }: { data: WeatherInfo }) => {
  const { outfit, extras, alerts } = getRecommendations(data);
  
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-bold text-gray-800">What to Wear Today</h2>
        <div className="text-2xl font-bold text-green-700">
          {Math.round(data.main.temp)}°C
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        {data.weather[0].description} • Feels like {Math.round(data.main.feels_like)}°C
      </div>
      
      <div className="space-y-4 mt-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Recommended Outfit</h3>
          <p className="text-gray-700">{outfit}</p>
        </div>
        
        {extras.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Don't Forget</h3>
            <ul className="list-disc list-inside text-gray-700">
              {extras.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {alerts.map((alert, i) => (
          <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-3">
            <p className="text-blue-700">{alert}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherClothingAdvisor;