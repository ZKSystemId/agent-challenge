import { createTool } from '@mastra/core';
import { z } from 'zod';

export const weatherTool = createTool({
  id: 'weather-fetcher',
  description: 'Fetch current weather data for any city using OpenWeatherMap API',
  inputSchema: z.object({
    city: z.string().describe('City name (e.g., Jakarta, New York, London)'),
  }),
  execute: async ({ context }) => {
    const { city } = context;
    
    try {
      // Using OpenMeteo API (free, no API key required)
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
        { cache: 'no-store' }
      );
      
      if (!geoResponse.ok) {
        throw new Error(`Geocoding API error: ${geoResponse.status}`);
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        return {
          success: false,
          error: `City "${city}" not found`,
        };
      }
      
      const location = geoData.results[0];
      const { latitude, longitude, name, country } = location;
      
      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`,
        { cache: 'no-store' }
      );
      
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      const current = weatherData.current_weather;
      
      // Weather code descriptions
      const weatherCodes: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
      };
      
      return {
        success: true,
        location: `${name}, ${country}`,
        temperature: current.temperature,
        windSpeed: current.windspeed,
        windDirection: current.winddirection,
        weatherCode: current.weathercode,
        description: weatherCodes[current.weathercode] || 'Unknown',
        time: current.time,
        timestamp: new Date().toISOString(),
        source: 'OpenMeteo API',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
