import WeatherClothingAdvisor from "./components/ClothingRecommendations";
import { useWeatherOverViewQuery } from "./query";
import { FaTemperatureArrowUp, FaTemperatureArrowDown } from "react-icons/fa6";

const App = () => {
  const { isFetching, data } = useWeatherOverViewQuery();

  if (isFetching || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="animate-pulse text-white/80">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-800 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Pop Out Smart ☁️
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-medium">
              {data.name}, {data.sys.country}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center">
              <div className="flex items-center justify-center space-x-2 bg-red-400/10 rounded-lg p-2">
                <FaTemperatureArrowUp className="text-red-400" />
                <span className="text-red-400">
                  {Math.round(data.main.temp_max)}°C
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 bg-blue-400/10 rounded-lg p-2">
                <FaTemperatureArrowDown className="text-blue-300" />
                <span className="text-blue-300">
                  {Math.round(data.main.temp_min)}°C
                </span>
              </div>
            </div>
          </div>
        </header>

        <main>
          <WeatherClothingAdvisor data={data} />
        </main>
      </div>
    </div>
  );
};

export default App;