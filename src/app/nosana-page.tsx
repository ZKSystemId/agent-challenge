"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState, useEffect } from "react";
import { AgentState as AgentStateSchema } from "@/mastra/agents";
import { z } from "zod";

type AgentState = z.infer<typeof AgentStateSchema>;

export default function NosanaAgentStudio() {
  const [currentAgent, setCurrentAgent] = useState<"weatherAgent" | "webResearcherAgent">("webResearcherAgent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(true);

  // Shared State
  const { state, setState } = useCoAgent<AgentState>({
    name: currentAgent,
    initialState: {
      proverbs: [],
    },
  });

  // Web Researcher Actions
  useCopilotAction({
    name: "wikipediaTool",
    description: "Search Wikipedia for information.",
    available: "frontend",
    parameters: [
      { name: "query", type: "string", required: true },
    ],
    render: ({ args, result, status }) => {
      if (status === "complete") {
        setSearchResults(prev => [...prev, {
          source: "Wikipedia",
          icon: "📚",
          query: args.query,
          result: result,
          timestamp: new Date().toISOString()
        }]);
      }
      return null;
    },
  });

  useCopilotAction({
    name: "coingeckoTool",
    description: "Search CoinGecko for cryptocurrency information.",
    available: "frontend",
    parameters: [
      { name: "query", type: "string", required: true },
    ],
    render: ({ args, result, status }) => {
      if (status === "complete") {
        setSearchResults(prev => [...prev, {
          source: "CoinGecko",
          icon: "🪙",
          query: args.query,
          result: result,
          timestamp: new Date().toISOString()
        }]);
      }
      return null;
    },
  });

  useCopilotAction({
    name: "redditTool",
    description: "Search Reddit for posts.",
    available: "frontend",
    parameters: [
      { name: "query", type: "string", required: true },
    ],
    render: ({ args, result, status }) => {
      if (status === "complete") {
        setSearchResults(prev => [...prev, {
          source: "Reddit",
          icon: "💬",
          query: args.query,
          result: result,
          timestamp: new Date().toISOString()
        }]);
      }
      return null;
    },
  });

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-black/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
                    N
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Nosana Agent Studio
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
                >
                  {showChat ? "Hide Chat" : "Show Chat"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Agent Selection */}
            <div className="lg:col-span-1 space-y-6">
              {/* Agent Selector Card */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold mb-4">Select Agent</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentAgent("webResearcherAgent")}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                      currentAgent === "webResearcherAgent"
                        ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/50"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">🌐</span>
                    <div className="text-left">
                      <p className="font-semibold">Web Researcher</p>
                      <p className="text-sm text-gray-400">Multi-source aggregation</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setCurrentAgent("weatherAgent")}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                      currentAgent === "weatherAgent"
                        ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/50"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">🌤️</span>
                    <div className="text-left">
                      <p className="font-semibold">Weather Agent</p>
                      <p className="text-sm text-gray-400">Real-time weather data</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Agent Status */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold mb-4">Agent Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-500">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Model</span>
                    <span className="text-sm">qwen3:8b</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Endpoint</span>
                    <span className="text-sm">Nosana</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Queries</span>
                    <span className="text-sm">{searchResults.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Queries</h2>
                <div className="space-y-2">
                  {[
                    "Research Nosana Network",
                    "Bitcoin price analysis",
                    "Solana latest news",
                    "Web3 trends 2024"
                  ].map((query) => (
                    <button
                      key={query}
                      onClick={() => {
                        setSearchQuery(query);
                        // Trigger search through chat
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Header */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Research Results</h2>
                  {searchResults.length > 0 && (
                    <button
                      onClick={() => setSearchResults([])}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <p className="text-gray-400 mb-2">No research results yet</p>
                    <p className="text-sm text-gray-500">Start a conversation with the agent to begin research</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">{result.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-purple-400">{result.source}</h3>
                              <span className="text-xs text-gray-500">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">Query: "{result.query}"</p>
                            <div className="text-sm text-gray-200 bg-black/30 rounded-lg p-3">
                              {result.result}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              {searchResults.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Searches</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {searchResults.length}
                    </p>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4">
                    <p className="text-gray-400 text-sm mb-1">Data Sources</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {new Set(searchResults.map(r => r.source)).size}
                    </p>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4">
                    <p className="text-gray-400 text-sm mb-1">Active Agent</p>
                    <p className="text-lg font-bold text-green-400">
                      {currentAgent === "webResearcherAgent" ? "Web" : "Weather"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <CopilotSidebar
          clickOutsideToClose={false}
          defaultOpen={true}
          labels={{
            title: "AI Research Assistant",
            initial: `🎯 Welcome to Nosana Agent Studio!\n\n${
              currentAgent === "webResearcherAgent"
                ? "🌐 **Web Researcher Agent Active**\n\nI can help you research any topic using:\n• Wikipedia for background info\n• CoinGecko for crypto data\n• Reddit for community insights\n\nTry asking:\n• 'Research Nosana Network'\n• 'What is Bitcoin current price?'\n• 'Find Solana discussions on Reddit'"
                : "🌤️ **Weather Agent Active**\n\nI can provide weather information for any location.\n\nTry asking:\n• 'Weather in San Francisco'\n• 'Current temperature in Tokyo'\n• 'Weather forecast for London'"
            }`
          }}
          style={{
            "--copilot-kit-primary-color": "#a855f7"
          } as CopilotKitCSSProperties}
        />
      )}
    </main>
  );
}
