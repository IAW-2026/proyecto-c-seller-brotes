"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  city: string;
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
}

interface Props {
  cityName: string;
}

function getPickupAdvice(temp: number, description: string): string {
  const desc = description.toLowerCase();
  if (temp >= 35) return "Mucho calor — avisá a tus compradores que vengan temprano.";
  if (desc.includes("lluvia") || desc.includes("tormenta"))
    return "Hay lluvia — coordiná los retiros para que no se mojen las plantas.";
  if (temp <= 5) return "Mucho frío — protegé las plantas sensibles antes del retiro.";
  return "Buen día para tener los pedidos listos para retirar.";
}

export default function WeatherWidget({ cityName }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setWeather(data);
      })
      .catch(() => setError(true));
  }, [cityName]);

  if (error) return null; // falla silenciosamente

  if (!weather) {
    return (
      <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] px-4 py-3 text-sm text-[var(--color-gris-piedra)] animate-pulse">
        Cargando clima...
      </div>
    );
  }

  const advice = getPickupAdvice(weather.temp, weather.description);

  return (
    <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] px-4 py-3 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
          alt={weather.description}
          width={32}
          height={32}
        />
        <span className="font-semibold text-[var(--color-verde-profundo)]">
          {weather.city} — {weather.temp}°C
        </span>
        <span className="text-sm text-[var(--color-gris-piedra)] capitalize">
          {weather.description}
        </span>
      </div>
      <p className="text-sm text-gray-600">{advice}</p>
    </div>
  );
}
