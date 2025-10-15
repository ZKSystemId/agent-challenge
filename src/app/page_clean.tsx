"use client";

import { useCoAgent, useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState, useEffect, Fragment, useRef } from "react";
import { AgentState as AgentStateSchema } from "@/mastra/agents";
import { z } from "zod";

type AgentState = z.infer<typeof AgentStateSchema>;

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: any[];
}

export default function NosanaAgentStudio() {
  const [currentAgent, setCurrentAgent] = useState<"weatherAgent" | "webResearcherAgent">("webResearcherAgent");
  const [currentModel, setCurrentModel] = useState('groq');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionTime, setSessionTime] = useState<string>("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [activeChat, setActiveChat] = useState<string>("1");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Research Nosana Network",
      timestamp: "Jul 8 at 8:51 AM",
      messages: []
    }
  ]);

  // Available models
  const availableModels = [
    { id: 'groq', name: 'Groq Llama 3.3', description: 'Fast & Free' },
    { id: 'openai', name: 'GPT-4', description: 'Most Intelligent' },
    { id: 'ollama', name: 'Qwen 2.5', description: 'Local' }
  ];

  // Set session time on client side only
  useEffect(() => {
    setSessionTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSessionTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewChat = () => {
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

  const handleChatSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    setInputMessage("");
    
    // Add user message
    setSearchResults(prev => [...prev, {
      source: "User",
      icon: "👤",
      query: message,
      result: message,
      timestamp: new Date().toISOString(),
      isUser: true
    }]);
    
    // Call API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model: currentModel })
      });
      
      const data = await response.json();
      
      if (data.response) {
        setSearchResults(prev => [...prev, {
          source: "AI Assistant",
          icon: "🧠",
          query: message,
          result: data.response,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-purple-600/10 to-purple-800/5 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-cyan-600/10 to-blue-800/5 blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-screen flex">
        
        {/* Left Sidebar */}
        <div className="w-64 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col">
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

          {/* Agents */}
          <div className="p-3 space-y-2 flex-1">
            <p className="text-xs text-gray-400 mb-3">Available Agents</p>
            
            <button
              onClick={() => setCurrentAgent("webResearcherAgent")}
              className={`w-full p-3 rounded-lg text-left flex items-center gap-2 ${
                currentAgent === "webResearcherAgent"
                  ? "bg-gradient-to-r from-purple-500/25 to-cyan-500/25 border border-purple-500/50"
                  : "hover:bg-white/5 border border-white/5"
              }`}>
              <span className="text-xl">🌐</span>
              <div>
                <p className="font-medium text-xs">Web Researcher</p>
                <p className="text-xs text-gray-400">Multi-source data</p>
              </div>
            </button>

            <button
              onClick={() => setCurrentAgent("weatherAgent")}
              className={`w-full p-3 rounded-lg text-left flex items-center gap-2 ${
                currentAgent === "weatherAgent"
                  ? "bg-gradient-to-r from-purple-500/25 to-cyan-500/25 border border-purple-500/50"
                  : "hover:bg-white/5 border border-white/5"
              }`}>
              <span className="text-xl">🌤️</span>
              <div>
                <p className="font-medium text-xs">Weather Agent</p>
                <p className="text-xs text-gray-400">Real-time weather</p>
              </div>
            </button>
          </div>

          {/* Status */}
          <div className="p-3 border-t border-white/10">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Model</span>
                <select 
                  value={currentModel}
                  onChange={(e) => setCurrentModel(e.target.value)}
                  className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id} className="bg-gray-900">
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
            <h2 className="text-lg font-semibold">
              {currentAgent === "webResearcherAgent" ? "🌐 Web Researcher" : "🌤️ Weather Agent"}
            </h2>
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="p-2 rounded-lg hover:bg-white/10">
              ☰
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {searchResults.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Hello! How can I help?</h3>
                  <p className="text-gray-400">Ask me anything...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {searchResults.map((result, idx) => (
                  <div key={idx} className={`flex gap-3 ${result.isUser ? 'justify-end' : ''}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      result.isUser 
                        ? 'bg-purple-500/20 border border-purple-500/50' 
                        : 'bg-black/40 border border-white/10'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span>{result.icon}</span>
                        <span className="text-sm font-medium">{result.source}</span>
                      </div>
                      <p className="text-sm">{result.result}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-black/40 p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit(inputMessage);
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500/50"
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleChatSubmit(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg disabled:opacity-50">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat History */}
        {showChatHistory && (
          <div className="w-64 bg-black/40 backdrop-blur-md border-l border-white/10">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-sm">Chat History</h3>
            </div>
            <div className="p-4 space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full p-3 rounded-lg text-left ${
                    activeChat === chat.id
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}>
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-400">{chat.timestamp}</p>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <button 
                onClick={handleNewChat}
                className="w-full p-2 bg-purple-500/20 rounded-lg text-sm">
                + New Chat
              </button>
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}
