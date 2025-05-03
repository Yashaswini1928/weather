import { WeatherCondition } from "@shared/schema";
import { getWeatherIcon } from "@/lib/weather";

interface WeatherIconProps {
  condition: WeatherCondition;
  isDay?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function WeatherIcon({
  condition,
  isDay = true,
  className = "",
  size = "md"
}: WeatherIconProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl"
  };
  
  const iconClass = `material-icons ${sizeClasses[size]} ${className}`;
  const iconName = getWeatherIcon(condition, isDay);
  
  return (
    <span className={iconClass}>
      {iconName}
    </span>
  );
}
