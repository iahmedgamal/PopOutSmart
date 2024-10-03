import { useState } from 'react';

function App() {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'Sunny',
    uvIndex: 5,
    rainChance: 10,
  });

  const isGoodToGoOutside = weather.rainChance < 50 && weather.uvIndex < 7;

  const getRecommendation = () => {
    if (weather.temperature > 25) return 'Wear light clothes';
    if (weather.temperature <= 25 && weather.temperature > 15)
      return 'Wear a jacket';
    if (weather.temperature <= 15) return 'Wear a coat';
  };

  const needUmbrella = weather.rainChance > 30;

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-100'>
      <div className='w-full max-w-md p-6 text-center bg-white rounded-lg shadow-md'>
        <h1 className='mb-4 text-3xl font-bold'>PopOutSmart</h1>
        <h2 className='mb-2 text-2xl'>{weather.condition}</h2>
        <p className='mb-4 text-xl'>Temperature: {weather.temperature}°C</p>

        <div className='text-lg'>
          <p>
            <strong>What to Wear: </strong>
            {getRecommendation()}
          </p>
          <p>
            <strong>Umbrella Needed: </strong>
            {needUmbrella ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>UV Index: </strong>
            {weather.uvIndex}
          </p>
          <p>
            <strong>Is it good to go outside? </strong>
            {isGoodToGoOutside ? 'Yes' : 'No'}
          </p>
        </div>

        <button
          className='px-4 py-2 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
          onClick={() => {
            setWeather((prev) => ({
              ...prev,
              temperature: prev.temperature > 15 ? 10 : 30,
              condition: prev.condition === 'Sunny' ? 'Cloudy' : 'Sunny',
              rainChance: prev.rainChance > 30 ? 10 : 70,
              uvIndex: prev.uvIndex > 5 ? 3 : 8,
            }));
          }}>
          Toggle Weather
        </button>
      </div>
    </div>
  );
}

export default App;
