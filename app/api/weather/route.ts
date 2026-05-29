// app/api/weather/route.ts
// Llama a OpenWeatherMap desde el servidor para no exponer la API key al cliente.

import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";

const OWM_API_KEY = process.env.OPENWEATHER_API_KEY;
const OWM_BASE = "https://api.openweathermap.org/data/2.5";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");

  if (!city) {
    return apiError("city param requerido", 400);
  }

  if (!OWM_API_KEY) {
    return apiError("OPENWEATHER_API_KEY no configurada", 500);
  }

  try {
    const url = `${OWM_BASE}/weather?q=${encodeURIComponent(city)},AR&appid=${OWM_API_KEY}&units=metric&lang=es`;
    const res = await fetch(url, { next: { revalidate: 900 } });

    if (!res.ok) {
      return apiError("Ciudad no encontrada", res.status);
    }

    const data = await res.json();

    return NextResponse.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
    });
  } catch (error) {
    console.error("[GET /api/weather]", error);
    return apiError("Error interno al obtener el clima", 500);
  }
}