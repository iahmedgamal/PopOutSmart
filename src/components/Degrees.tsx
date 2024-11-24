import React from 'react'
import { FaTemperatureArrowDown, FaTemperatureArrowUp } from 'react-icons/fa6'
import { WeatherInfo } from '../query/api'

interface WeatherData {
     data: WeatherInfo

}
function Degrees({data}:WeatherData) {
  return (
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
  )
}

export default Degrees