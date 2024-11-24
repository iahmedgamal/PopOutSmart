import React from 'react'
import { WeatherInfo } from '../query/api'

interface WeatherData {
    data: WeatherInfo

}
function Country({data}:WeatherData) {
  return (
    <h2 className="text-2xl font-semibold mb-2">
    {data.name}, {data.sys.country}
  </h2>

  )
}

export default Country

