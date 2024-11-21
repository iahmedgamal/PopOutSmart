import React from "react";
import { FaUmbrella, FaRegSun, FaWind, FaRegSnowflake } from "react-icons/fa";
import { GiCircleCage } from "react-icons/gi"; // For the AlertCircle icon
import { WeatherInfo } from "../query/api";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ClothingRecommendations {
  topLayer: string;
  bottomLayer: string;
  accessories: string[];
  umbrella: boolean;
  alert: string | null;
}

interface WeatherClothingAdvisorProps {
  data: WeatherInfo;
}

interface WeatherAlertProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WeatherAlert = ({
  icon,
  title,
  description,
}: WeatherAlertProps) => (
  <Alert>
    {icon}
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
);

const WeatherOverview: React.FC<{ description: string; feelsLike: number }> = ({
  description,
  feelsLike,
}) => (
  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <span>{description}</span>
    <span>•</span>
    <span>Feels like {Math.round(feelsLike)}°C</span>
  </div>
);

const ClothingRecommendationSection: React.FC<{
  recommendations: ClothingRecommendations;
}> = ({ recommendations }) => (
  <div className="space-y-3">
    <div>
      <h3 className="font-semibold">Top:</h3>
      <p>{recommendations.topLayer}</p>
    </div>
    <div>
      <h3 className="font-semibold">Bottom:</h3>
      <p>{recommendations.bottomLayer}</p>
    </div>

    {recommendations.accessories.length > 0 && (
      <div>
        <h3 className="font-semibold">Don't forget:</h3>
        <ul className="list-disc list-inside">
          {recommendations.accessories.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

function getClothingRecommendations(
  weatherData: WeatherInfo
): ClothingRecommendations {
  const temp = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const windSpeed = weatherData.wind.speed;
  const description = weatherData.weather[0].description.toLowerCase();
  const humidity = weatherData.main.humidity;

  const recommendations: ClothingRecommendations = {
    topLayer: "",
    bottomLayer: "",
    accessories: [],
    umbrella: false,
    alert: null,
  };

  // Temperature-based recommendations
  if (feelsLike <= 0) {
    recommendations.topLayer =
      "Heavy winter coat, thermal underlayer, and warm sweater";
    recommendations.bottomLayer = "Warm pants or thermal leggings";
    recommendations.accessories.push("Winter hat", "Gloves", "Scarf");
  } else if (feelsLike <= 10) {
    recommendations.topLayer = "Warm coat or jacket with a sweater";
    recommendations.bottomLayer = "Warm pants";
    recommendations.accessories.push("Light scarf", "Light gloves");
  } else if (feelsLike <= 18) {
    recommendations.topLayer = "Light jacket or cardigan";
    recommendations.bottomLayer = "Regular pants or jeans";
  } else if (feelsLike <= 25) {
    recommendations.topLayer = "Long sleeve shirt or light sweater";
    recommendations.bottomLayer = "Light pants or long skirt";
  } else {
    recommendations.topLayer = "Light, breathable clothing";
    recommendations.bottomLayer = "Shorts or light skirt";
    recommendations.accessories.push("Sun hat");
  }

  // Weather condition specific additions
  if (description.includes("rain") || description.includes("drizzle")) {
    recommendations.umbrella = true;
    recommendations.accessories.push("Waterproof shoes");
    if (temp < 15) {
      recommendations.topLayer = `Waterproof ${recommendations.topLayer}`;
    }
  }

  if (description.includes("snow")) {
    recommendations.accessories.push("Waterproof boots");
    recommendations.alert =
      "Heavy snow expected - consider winter boots with good traction";
  }

  // Wind considerations
  if (windSpeed > 5.5) {
    recommendations.accessories.push("Wind-resistant outer layer");
  }

  // Sun protection
  if (description.includes("clear") && temp > 20) {
    recommendations.accessories.push("Sunglasses", "Sunscreen");
  }

  // Humidity considerations
  if (humidity > 80 && temp > 20) {
    recommendations.alert =
      "High humidity - choose lightweight, breathable fabrics";
  }

  return recommendations;
}

const WeatherClothingAdvisor: React.FC<WeatherClothingAdvisorProps> = ({
  data,
}) => {
  const recommendations = getClothingRecommendations(data);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>Today's Outfit Recommendations</div>
            <div className="text-2xl">{Math.round(data.main.temp)}°C</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WeatherOverview
            description={data.weather[0].description}
            feelsLike={data.main.feels_like}
          />

          <ClothingRecommendationSection recommendations={recommendations} />

          {recommendations.umbrella && (
            <WeatherAlert
              icon={<FaUmbrella className="h-4 w-4" />}
              title="Bring an umbrella!"
              description="Rain is expected today."
            />
          )}

          {recommendations.alert && (
            <WeatherAlert
              icon={<GiCircleCage className="h-4 w-4" />}
              title="Weather Alert"
              description={recommendations.alert}
            />
          )}

          {data.wind.speed > 5.5 && (
            <WeatherAlert
              icon={<FaWind className="h-4 w-4" />}
              title="Windy Conditions"
              description="Consider wearing wind-resistant clothing today."
            />
          )}

          {data.weather[0].description.includes("clear") &&
            data.main.temp > 20 && (
              <WeatherAlert
                icon={<FaRegSun className="h-4 w-4" />}
                title="Sun Protection Needed"
                description="Don't forget sunscreen and sunglasses!"
              />
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherClothingAdvisor;
