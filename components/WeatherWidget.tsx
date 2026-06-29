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
  variant?: "default" | "sidebar";
}

function getPickupAdvice(
  temp: number,
  feelsLike: number,
  description: string
): string {
  const desc = description.toLowerCase();

  if (desc.includes("tormenta") || desc.includes("thunderstorm")) {
    return "⚡ Hay tormenta — avisá a tus compradores para reprogramar el retiro.";
  }
  if (desc.includes("lluvia") || desc.includes("llovizna") || desc.includes("rain") || desc.includes("drizzle")) {
    return "🌧️ Está lloviendo — coordiná los retiros bajo techo o cubrí bien las plantas.";
  }
  if (desc.includes("nieve") || desc.includes("snow")) {
    return "❄️ Está nevando — protegé las plantas sensibles antes de cualquier retiro.";
  }
  if (desc.includes("granizo") || desc.includes("hail")) {
    return "🌨️ Hay granizo — suspendé los retiros hasta que pase.";
  }
  if (desc.includes("niebla") || desc.includes("neblina") || desc.includes("fog") || desc.includes("mist")) {
    return "🌫️ Hay niebla — avisá a tus compradores que manejen con precaución al venir.";
  }
  if (desc.includes("viento") || desc.includes("wind") || desc.includes("ventoso")) {
    return "💨 Hay viento fuerte — asegurá las plantas más altas o frágiles antes del retiro.";
  }
  if (desc.includes("polvo") || desc.includes("dust") || desc.includes("arena")) {
    return "🌬️ Hay viento con polvo — cubrí las plantas antes del retiro.";
  }

  if (temp >= 38) return "🥵 Calor extremo — recomendá a tus compradores venir muy temprano y con bebida.";
  if (temp >= 32) return "☀️ Mucho calor — coordiná retiros para la mañana temprano o al atardecer.";
  if (temp >= 26) return "🌤️ Día cálido — recordá hidratar bien las plantas antes de que pasen a buscarlas.";
  if (temp >= 19) return "✅ Condiciones ideales para el retiro de plantas. ¡Buen día para vender!";
  if (temp >= 13) return "🌿 Clima fresco y agradable — perfecto para mover plantas sin que sufran.";
  if (temp >= 6)  return "🧥 Está fresco — avisá a tus compradores que vengan abrigados.";
  if (temp >= 0) {
    if (feelsLike <= -2) return "🥶 Frío con sensación bajo cero — protegé las plantas tropicales antes del retiro.";
    return "🌡️ Temperatura baja — guardá las plantas sensibles adentro hasta el momento del retiro.";
  }
  return "🧊 Helada — no hagas retiros hasta que suba la temperatura. Protegé todo lo que puedas.";
}

const LOADING_MESSAGES = [
  "Consultando el clima de tu ciudad...",
  "Cargando condiciones del día...",
  "Un momento, chequeando el tiempo...",
];

export default function WeatherWidget({ cityName, variant = "default" }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
  }, []);

  useEffect(() => {
    fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setWeather(data);
      })
      .catch(() => setError(true));
  }, [cityName]);

  if (error) return null;

  if (!weather) {
    if (variant === "sidebar") {
      return (
        <div className="text-xs text-white/50 animate-pulse px-1">
          🌤️ {loadingMsg}
        </div>
      );
    }
    return (
      <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] px-4 py-3 text-sm text-[var(--color-gris-piedra)] animate-pulse">
        🌤️ {loadingMsg}
      </div>
    );
  }

  const advice = getPickupAdvice(weather.temp, weather.feels_like, weather.description);

  if (variant === "sidebar") {
    return (
      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        <div className="flex items-center gap-1">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
            alt={weather.description}
            width={24}
            height={24}
          />
          <span className="text-sm font-semibold text-white">
            {weather.temp}°C
          </span>
          <span className="text-xs text-white/60 capitalize truncate">
            {weather.description}
          </span>
        </div>
        <p className="text-xs text-white/70 leading-snug">{advice}</p>
      </div>
    );
  }

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