"use client";

import { useState, useEffect, useRef } from "react";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
}

export default function NosanaAgentStudio() {
  const [currentAgent, setCurrentAgent] = useState<"weatherAgent" | "webResearcherAgent">("weatherAgent");
  const [selectedModel, setSelectedModel] = useState("Groq Llama 3.3");
  const [responses, setResponses] = useState(6);
  const [status, setStatus] = useState<"Online" | "Offline">("Online");
  const [inputMessage, setInputMessage] = useState("");
  const [weatherData, setWeatherData] = useState({
    location: "Tempat Tinggal Alfian, Indonesia",
    temperature: 27,
    tempF: 80,
    condition: "Clear",
    windSpeed: "8 km/h ESE",
    humidity: 76,
    visibility: "10 km",
    precipitation: "0.0 mm",
    cloudCover: 12,
    feelsLike: 29,
    feelsLikeF: 85,
    uvIndex: 0,
    weatherAPI: "100%"
  });

  const [chatHistory] = useState<ChatHistory[]>([
    { id: "1", title: "btc price", timestamp: "10/12/2025, 12:44:35 AM" },
    { id: "2", title: "npm react", timestamp: "10/12/2025, 12:42:53 AM" },
    { id: "3", title: "Weather in Tokyo", timestamp: "10/12/2025, 12:42:46 AM" },
    { id: "4", title: "Bitcoin price", timestamp: "10/12/2025, 12:42:42 AM" },
    { id: "5", title: "Latest tech news", timestamp: "10/12/2025, 12:42:31 AM" },
    { id: "6", title: "Bitcoin price", timestamp: "10/12/2025, 12:42:22 AM" },
    { id: "7", title: "What is blockchain?", timestamp: "Jul 8 at 8:51 AM" }
  ]);

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0e0f11] border-r border-gray-800">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <div>
              <h1 className="font-bold text-white">Nosana</h1>
              <p className="text-xs text-gray-400">Agent Studio</p>
            </div>
          </div>
        </div>

        {/* Available Agents */}
        <div className="p-4">
          <h3 className="text-xs text-gray-400 mb-3">Available Agents</h3>
          
          {/* Web Researcher */}
          <button
            onClick={() => setCurrentAgent("webResearcherAgent")}
            className={`w-full p-3 rounded-lg mb-2 text-left transition-all ${
              currentAgent === "webResearcherAgent" 
                ? "bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30" 
                : "hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🌐</span>
              </div>
              <div>
                <p className="text-sm font-medium">Web Researcher</p>
                <p className="text-xs text-gray-400">Multi-source intelligence</p>
              </div>
            </div>
          </button>

          {/* Weather Agent */}
          <button
            onClick={() => setCurrentAgent("weatherAgent")}
            className={`w-full p-3 rounded-lg mb-2 text-left transition-all ${
              currentAgent === "weatherAgent" 
                ? "bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30" 
                : "hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🌤️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Weather Agent</p>
                <p className="text-xs text-gray-400">Real-time forecasting</p>
              </div>
              {currentAgent === "weatherAgent" && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
          </button>

          {/* More Coming Soon */}
          <div className="p-3 rounded-lg border border-dashed border-gray-700 mt-3">
            <div className="flex items-center gap-2">
              <span>🚀</span>
              <p className="text-xs text-gray-400">More Tools Coming Soon</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Data Analysis • Image Generation •<br/>
              Code Assistant • Translation
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="p-4 mt-auto border-t border-gray-800">
          <h3 className="text-xs text-gray-400 mb-3">Configuration</h3>
          
          {/* AI Model Selector */}
          <div className="mb-3">
            <label className="text-xs text-gray-400">AI Model</label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm"
            >
              <option>Groq Llama 3.3</option>
              <option>GPT-4</option>
              <option>Claude 3</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-400">Responses</p>
              <p className="text-lg font-bold">{responses}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Status</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${status === "Online" ? "bg-green-500" : "bg-red-500"}`}></div>
                <p className="text-sm">{status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌤️</span>
            <h2 className="text-lg font-semibold">Weather Agent</h2>
            <span className="text-xs text-gray-400">12:46:44 AM</span>
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">226ms</span>
          </div>
          <button className="text-gray-400 hover:text-white">
            ☰
          </button>
        </header>

        {/* Weather Content */}
        {currentAgent === "weatherAgent" ? (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-2xl">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="text-gray-400">Location:</span>
                  <span>{weatherData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌡️</span>
                  <span className="text-gray-400">Temperature:</span>
                  <span>{weatherData.temperature}°C ({weatherData.tempF}°F)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>☁️</span>
                  <span className="text-gray-400">Condition:</span>
                  <span>{weatherData.condition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💨</span>
                  <span className="text-gray-400">Wind Speed:</span>
                  <span>{weatherData.windSpeed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💧</span>
                  <span className="text-gray-400">Humidity:</span>
                  <span>{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👁️</span>
                  <span className="text-gray-400">Visibility:</span>
                  <span>{weatherData.visibility}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌧️</span>
                  <span className="text-gray-400">Precipitation:</span>
                  <span>{weatherData.precipitation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>☁️</span>
                  <span className="text-gray-400">Cloud Cover:</span>
                  <span>{weatherData.cloudCover}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌡️</span>
                  <span className="text-gray-400">Feels Like:</span>
                  <span>{weatherData.feelsLike}°C ({weatherData.feelsLikeF}°F)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>☀️</span>
                  <span className="text-gray-400">UV Index:</span>
                  <span>{weatherData.uvIndex}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 bg-purple-500/10 rounded-lg">
                  <span>🔌</span>
                  <span className="text-gray-400">Weather in API ({weatherData.weatherAPI})</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl mb-2">🌐 Web Researcher</p>
              <p className="text-gray-400">Ready to search the web...</p>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
            <button className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat History */}
      <div className="w-80 bg-[#0e0f11] border-l border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-semibold">Chat History</h3>
        </div>
        <div className="p-2">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left p-3 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <p className="text-sm font-medium">{chat.title}</p>
              <p className="text-xs text-gray-400">{chat.timestamp}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
