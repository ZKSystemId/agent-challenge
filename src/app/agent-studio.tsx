"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState, useEffect, Fragment } from "react";
import { AgentState as AgentStateSchema } from "@/mastra/agents";
import { z } from "zod";

type AgentState = z.infer<typeof AgentStateSchema>;

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: any[];
}

export default function AgentStudio() {
  const [currentAgent, setCurrentAgent] = useState<"weatherAgent" | "webResearcherAgent">("webResearcherAgent");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Research Nosana Network",
      timestamp: "Jul 8 at 8:51 AM",
      messages: []
    },
    {
      id: "2",
      title: "Bitcoin Price Analysis",
      timestamp: "Jul 8 at 9:04 AM",
      messages: []
    },
    {
      id: "3",
      title: "Solana Latest Updates",
      timestamp: "Jul 8 at 5:23 PM",
      messages: []
    }
  ]);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [showChatHistory, setShowChatHistory] = useState(true);

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
      if (status === "complete" && result) {
        setSearchResults(prev => [...prev, {
          source: "Wikipedia",
          icon: "📚",
          query: args.query,
          result: result,
          timestamp: new Date().toISOString()
        }]);
      }
      return <Fragment />;
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
      if (status === "complete" && result) {
        setSearchResults(prev => [...prev, {
          source: "CoinGecko",
          icon: "🪙",
          query: args.query,
          result: result,
          timestamp: new Date().toISOString()
        }]);
      }
      return <Fragment />;
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
      if (status === "complete" && result) {
        setSearchResults(prev => [...prev, {
          source: "Reddit",
          icon: "💬",
          query: args.query,
          result: result,
          timestamp: new Date().toISOString()
        }]);
      }
      return <Fragment />;
    },
  });

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Research Session",
      timestamp: new Date().toLocaleString(),
      messages: []
    };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setSearchResults([]);
  };

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 h-screen flex">
        {/* Left Sidebar - Agent Info */}
        <div className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
                N
              </div>
              <div>
                <h1 className="font-bold text-lg">Nosana</h1>
                <p className="text-xs text-gray-400">Agent Studio</p>
              </div>
            </div>
          </div>

          {/* Agent Selector */}
          <div className="p-4 space-y-2">
            <p className="text-sm text-gray-400 mb-3">Agents</p>
            
            <button
              onClick={() => setCurrentAgent("webResearcherAgent")}
              className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                currentAgent === "webResearcherAgent"
                  ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50"
                  : "hover:bg-white/5"
              }`}
            >
              <span className="text-xl">🌐</span>
              <div>
                <p className="font-medium text-sm">Web Researcher</p>
                <p className="text-xs text-gray-400">Multi-source data</p>
              </div>
            </button>

            <button
              onClick={() => setCurrentAgent("weatherAgent")}
              className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                currentAgent === "weatherAgent"
                  ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50"
                  : "hover:bg-white/5"
              }`}
            >
              <span className="text-xl">🌤️</span>
              <div>
                <p className="font-medium text-sm">Weather Agent</p>
                <p className="text-xs text-gray-400">Real-time weather</p>
              </div>
            </button>
          </div>

          {/* Agent Details */}
          <div className="mt-auto p-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Model</span>
                <span className="text-xs">qwen2:1.5b</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Memory</span>
                <span className="text-xs text-green-400">8 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {currentAgent === "webResearcherAgent" ? "🌐 Web Researcher Agent" : "🌤️ Weather Agent"}
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                Online
              </span>
            </div>
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {searchResults.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hello, what is your function?</h3>
                  <p className="text-gray-400 mb-6">
                    I'm a {currentAgent === "webResearcherAgent" ? "Web Research" : "Weather"} expert in analyzing data 
                    from multiple sources. I use specialized tools to provide comprehensive insights and analysis.
                  </p>
                  <p className="text-sm text-gray-500">
                    You can ask me to:
                  </p>
                  <div className="mt-4 space-y-2 text-left max-w-sm mx-auto">
                    {currentAgent === "webResearcherAgent" ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-400">•</span>
                          <span>Research any topic from Wikipedia</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-400">•</span>
                          <span>Get cryptocurrency data from CoinGecko</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-400">•</span>
                          <span>Find discussions on Reddit</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-400">•</span>
                          <span>Get current weather for any location</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-400">•</span>
                          <span>Check temperature and humidity</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-400">•</span>
                          <span>View weather conditions</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{result.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-purple-400">{result.source}</h4>
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

          {/* Chat Input */}
          <div className="border-t border-white/10 p-4">
            <CopilotSidebar
              clickOutsideToClose={false}
              defaultOpen={true}
              labels={{
                title: "",
                initial: ""
              }}
            />
          </div>
        </div>

        {/* Right Sidebar - Chat History */}
        {showChatHistory && (
          <div className="w-80 bg-black/40 backdrop-blur-md border-l border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <button
                onClick={createNewChat}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="text-sm text-gray-400 mb-3">Chat History</p>
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    activeChat === chat.id
                      ? "bg-white/10 border border-purple-500/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <p className="font-medium text-sm mb-1">{chat.title}</p>
                  <p className="text-xs text-gray-500">{chat.timestamp}</p>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <button className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors">
                Show more...
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
