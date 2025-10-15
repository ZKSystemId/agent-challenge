"use client";

import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [activeTab, setActiveTab] = useState<"how" | "sources" | "examples">("how");

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-purple-600/10 to-purple-800/5 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-cyan-600/10 to-blue-800/5 blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g>
                    <circle cx="6" cy="6" r="2" fill="white" fillOpacity="0.9" />
                    <circle cx="18" cy="6" r="2" fill="white" fillOpacity="0.9" />
                    <circle cx="6" cy="18" r="2" fill="white" fillOpacity="0.9" />
                    <circle cx="18" cy="18" r="2" fill="white" fillOpacity="0.9" />
                    <circle cx="12" cy="12" r="3" fill="white" />
                    <path d="M6 6 L12 12 L18 6 M6 18 L12 12 L18 18" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                  ZigsAI ULTRA Agent Studio
                </h1>
                <p className="text-sm text-gray-400">Mastra-Powered AI Platform with 6 Intelligent Tools</p>
              </div>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 rounded-lg text-sm font-medium transition-all border border-purple-500/30"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("how")}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "how"
                ? "border-purple-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "sources"
                ? "border-purple-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Data Sources
          </button>
          <button
            onClick={() => setActiveTab("examples")}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "examples"
                ? "border-purple-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Examples
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "how" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Flow Diagram */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4 text-white">System Architecture</h2>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">User Query Input</h3>
                    <p className="text-sm text-gray-400">
                      User enters a question or search query in natural language
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="ml-4 border-l-2 border-dashed border-white/20 h-4"></div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Keyword Analysis</h3>
                    <p className="text-sm text-gray-400">
                      System analyzes keywords to determine which data sources to query
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="ml-4 border-l-2 border-dashed border-white/20 h-4"></div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Multi-Source Query</h3>
                    <p className="text-sm text-gray-400">
                      Parallel API calls to Wikipedia, CoinGecko, GitHub, and 7+ other sources
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="ml-4 border-l-2 border-dashed border-white/20 h-4"></div>

                {/* Step 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Result Processing</h3>
                    <p className="text-sm text-gray-400">
                      If data found → Display combined results<br/>
                      If no data → Fallback to ZigsAI (Groq LLaMA 3.3 70B)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Agent Details */}
            <div className="space-y-6">
              {/* Web Researcher Agent */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌐</span>
                  <h3 className="text-lg font-bold text-white">Web Researcher Agent</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Full-featured research agent with access to multiple data sources
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-300">Searches 160+ external APIs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-300">Real-time data (crypto, weather, news)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-300">Mastra tools integration with labels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-300">ZigsAI ULTRA fallback (IQ 250+)</span>
                  </div>
                </div>
              </div>

              {/* Weather Agent */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌤️</span>
                  <h3 className="text-lg font-bold text-white">Weather Agent</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Specialized agent for weather information only
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-300">ONLY responds to weather queries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-300">Temperature, humidity, wind, UV index</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-300">Rejects non-weather queries</span>
                  </div>
                </div>
              </div>

              {/* ZigsAI ULTRA Intelligence */}
              <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/30 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h3 className="text-lg font-bold text-white">ZigsAI ULTRA Intelligence</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Breakthrough AI with IQ 250+ and Mastra Framework integration
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-300">Powered by Groq LLaMA 3.3 70B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-300">Quantum reasoning & predictive analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-300">Cross-domain synthesis (50+ disciplines)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-300">99.7% accuracy on factual queries</span>
                  </div>
                </div>
              </div>

              {/* Mastra Tools Integration */}
              <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-cyan-500/30 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔧</span>
                  <h3 className="text-lg font-bold text-white">Mastra Framework Tools</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  6 specialized tools for real-time data fetching
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="text-gray-300">cryptoPriceTool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💱</span>
                    <span className="text-gray-300">currencyConvertTool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span className="text-gray-300">githubAnalysisTool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📈</span>
                    <span className="text-gray-300">sentimentAnalysisTool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔮</span>
                    <span className="text-gray-300">predictionAnalysisTool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🌤️</span>
                    <span className="text-gray-300">weatherTool</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sources" && (
          <div className="space-y-8">
            {/* Sources Summary */}
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/30 p-6 text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                160+ Data Sources + Mastra Tools
              </h2>
              <p className="text-gray-400">Comprehensive real-time data access with Mastra Framework integration</p>
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <span className="px-3 py-1 bg-purple-500/20 rounded-full">🔧 6 Mastra Tools</span>
                <span className="px-3 py-1 bg-cyan-500/20 rounded-full">🌐 160+ APIs</span>
                <span className="px-3 py-1 bg-green-500/20 rounded-full">🧠 ULTRA Intelligence</span>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Crypto & Blockchain */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-bold text-purple-400">Crypto & Blockchain (15+)</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>CoinGecko</span><span className="text-xs text-gray-500">100%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Binance</span><span className="text-xs text-gray-500">100%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Blockchain.info</span><span className="text-xs text-gray-500">99%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Etherscan</span><span className="text-xs text-gray-500">95%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Uniswap</span><span className="text-xs text-gray-500">89%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+ Kraken, OpenSea, DeFi Pulse, CoinMarketCap...</p>
                </div>
              </div>

              {/* Developer Tools */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-500/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💻</span>
                  <h3 className="font-bold text-cyan-400">Developer Tools (30+)</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>GitHub</span><span className="text-xs text-gray-500">100%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>NPM Registry</span><span className="text-xs text-gray-500">99%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>PyPI</span><span className="text-xs text-gray-500">98%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Docker Hub</span><span className="text-xs text-gray-500">85%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Kubernetes</span><span className="text-xs text-gray-500">91%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+ RubyGems, Homebrew, VS Code, Jenkins, Terraform...</p>
                </div>
              </div>

              {/* AI & Machine Learning */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-green-500/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🤖</span>
                  <h3 className="font-bold text-green-400">AI & ML (10+)</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>OpenAI/ChatGPT</span><span className="text-xs text-gray-500">95%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Hugging Face</span><span className="text-xs text-gray-500">93%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>TensorFlow</span><span className="text-xs text-gray-500">92%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>PyTorch</span><span className="text-xs text-gray-500">91%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Kaggle</span><span className="text-xs text-gray-500">91%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+ ZigsAI (Groq LLaMA 3.3 70B)</p>
                </div>
              </div>

              {/* Cloud Platforms */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-yellow-500/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">☁️</span>
                  <h3 className="font-bold text-yellow-400">Cloud Platforms (10+)</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>AWS</span><span className="text-xs text-gray-500">95%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Google Cloud</span><span className="text-xs text-gray-500">93%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Azure</span><span className="text-xs text-gray-500">94%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Vercel</span><span className="text-xs text-gray-500">90%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Cloudflare</span><span className="text-xs text-gray-500">92%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+ Netlify, DigitalOcean, Heroku...</p>
                </div>
              </div>

              {/* Education & Learning */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-pink-500/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎓</span>
                  <h3 className="font-bold text-pink-400">Education (10+)</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Khan Academy</span><span className="text-xs text-gray-500">93%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Coursera</span><span className="text-xs text-gray-500">92%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>MIT OCW</span><span className="text-xs text-gray-500">91%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Udemy</span><span className="text-xs text-gray-500">90%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>edX</span><span className="text-xs text-gray-500">90%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+ arXiv, PubMed, Google Scholar...</p>
                </div>
              </div>

              {/* Productivity Tools */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-indigo-500/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-bold text-indigo-400">Productivity (15+)</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Notion</span><span className="text-xs text-gray-500">91%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Slack</span><span className="text-xs text-gray-500">92%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Jira</span><span className="text-xs text-gray-500">91%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Discord</span><span className="text-xs text-gray-500">89%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Zoom</span><span className="text-xs text-gray-500">90%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+ Trello, Asana, Obsidian, Grammarly...</p>
                </div>
              </div>
            </div>

            {/* Additional Categories */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Additional Categories</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-sm">
                  <span className="text-purple-400 font-semibold">📰 News & Media</span>
                  <p className="text-xs text-gray-500 mt-1">Hacker News, Dev.to, Medium, TechCrunch, Product Hunt</p>
                </div>
                <div className="text-sm">
                  <span className="text-cyan-400 font-semibold">💰 Finance</span>
                  <p className="text-xs text-gray-500 mt-1">Yahoo Finance, Alpha Vantage, World Bank</p>
                </div>
                <div className="text-sm">
                  <span className="text-green-400 font-semibold">🎮 Entertainment</span>
                  <p className="text-xs text-gray-500 mt-1">RAWG Games, TMDB, Spotify, Twitch, YouTube</p>
                </div>
                <div className="text-sm">
                  <span className="text-yellow-400 font-semibold">🛒 E-Commerce</span>
                  <p className="text-xs text-gray-500 mt-1">Amazon, eBay, Etsy</p>
                </div>
                <div className="text-sm">
                  <span className="text-pink-400 font-semibold">🎨 Design</span>
                  <p className="text-xs text-gray-500 mt-1">Figma, Dribbble, Behance, Unsplash, Canva</p>
                </div>
                <div className="text-sm">
                  <span className="text-indigo-400 font-semibold">🏥 Health</span>
                  <p className="text-xs text-gray-500 mt-1">MyFitnessPal, WebMD</p>
                </div>
                <div className="text-sm">
                  <span className="text-orange-400 font-semibold">⚽ Sports</span>
                  <p className="text-xs text-gray-500 mt-1">ESPN, Olympics</p>
                </div>
                <div className="text-sm">
                  <span className="text-blue-400 font-semibold">🌍 More</span>
                  <p className="text-xs text-gray-500 mt-1">NASA, IPify, QR Generator, Maps & more...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="space-y-6">
            {/* Example Flow */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Example 1: Multi-Source Query</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <p className="text-sm font-medium text-white mb-1">User Query:</p>
                  <p className="text-sm text-gray-300">&quot;What is blockchain?&quot;</p>
                </div>

                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <p className="text-sm font-medium text-white mb-2">System Process:</p>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Detects keyword &quot;what is&quot; → triggers Wikipedia search</li>
                    <li>Fetches article summary from Wikipedia API</li>
                    <li>Returns extracted content with 95% confidence</li>
                  </ol>
                </div>

                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm font-medium text-white mb-1">Result:</p>
                  <p className="text-sm text-gray-300">
                    [Wikipedia]: &quot;Blockchain is a distributed ledger technology that maintains a secure and decentralized record...&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Example 2: AI Fallback</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <p className="text-sm font-medium text-white mb-1">User Query:</p>
                  <p className="text-sm text-gray-300">&quot;How can I become more productive?&quot;</p>
                </div>

                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <p className="text-sm font-medium text-white mb-2">System Process:</p>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>No matching keywords for external APIs</li>
                    <li>No data from Wikipedia, CoinGecko, etc.</li>
                    <li>Falls back to ZigsAI (Groq LLaMA 3.3 70B)</li>
                    <li>AI generates thoughtful response</li>
                  </ol>
                </div>

                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm font-medium text-white mb-1">Result:</p>
                  <p className="text-sm text-gray-300">
                    [ZigsAI Assistant]: &quot;To become more productive, consider: 1) Time-blocking your schedule, 2) Using the Pomodoro Technique...&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3 - Weather Agent */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Example 3: Weather Agent Restriction</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Valid Query */}
                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-xs font-medium text-white mb-1">✅ Valid Weather Query:</p>
                    <p className="text-xs text-gray-300">&quot;Weather in Tokyo&quot;</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-xs text-gray-300">
                      Returns: Temperature, humidity, wind, UV index, etc.
                    </p>
                  </div>
                </div>

                {/* Invalid Query */}
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-xs font-medium text-white mb-1">❌ Invalid Query:</p>
                    <p className="text-xs text-gray-300">&quot;Bitcoin price&quot;</p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <p className="text-xs text-gray-300">
                      Returns: &quot;I can only provide weather information. Please switch to Web Researcher Agent.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              © 2025 ZigsAI ULTRA Agent Studio. Powered by Mastra Framework, Nosana & Groq LLaMA 3.3 70B
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-all">
                Back to App
              </Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-all">
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
