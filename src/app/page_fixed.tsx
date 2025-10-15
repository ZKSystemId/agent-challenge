"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  source: string;
  icon: string;
  query: string;
  result: string;
  timestamp: string;
  isUser?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
  agent: "weatherAgent" | "webResearcherAgent";
}

export default function NosanaAgentStudio() {
  const [currentAgent, setCurrentAgent] = useState<"weatherAgent" | "webResearcherAgent">("webResearcherAgent");
  const [currentModel, setCurrentModel] = useState('groq');
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTime, setSessionTime] = useState<string>("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat sessions with proper structure
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Research Nosana Network",
      timestamp: "Jul 8 at 8:51 AM",
      messages: [],
      agent: "webResearcherAgent"
    },
    {
      id: "2",
      title: "Bitcoin Price Analysis",
      timestamp: "Jul 8 at 9:04 AM",
      messages: [],
      agent: "webResearcherAgent"
    },
    {
      id: "3",
      title: "Weather in Tokyo",
      timestamp: "Jul 8 at 5:23 PM",
      messages: [],
      agent: "weatherAgent"
    }
  ]);

  // Get current chat session
  const currentChatSession = chatSessions.find(session => session.id === activeChat);
  const currentMessages = currentChatSession?.messages || [];

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

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // Switch agent when switching to a chat with different agent
  useEffect(() => {
    if (currentChatSession) {
      setCurrentAgent(currentChatSession.agent);
    }
  }, [activeChat, currentChatSession]);

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Session",
      timestamp: new Date().toLocaleString(),
      messages: [],
      agent: currentAgent
    };
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const handleChatSwitch = (chatId: string) => {
    setActiveChat(chatId);
    // Clear input when switching chats
    setInputMessage("");
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat switch
    
    if (chatSessions.length === 1) {
      // Don't delete if it's the last chat, just clear messages
      setChatSessions(prev => prev.map(session => 
        session.id === chatId ? { ...session, messages: [] } : session
      ));
    } else {
      // Delete the chat
      setChatSessions(prev => prev.filter(session => session.id !== chatId));
      // If deleting active chat, switch to first available
      if (chatId === activeChat) {
        const remaining = chatSessions.filter(s => s.id !== chatId);
        if (remaining.length > 0) {
          setActiveChat(remaining[0].id);
        }
      }
    }
  };

  const updateChatTitle = (message: string) => {
    // Update the title based on first message
    setChatSessions(prev => prev.map(session => {
      if (session.id === activeChat && session.messages.length === 0) {
        return { ...session, title: message.slice(0, 30) + (message.length > 30 ? '...' : '') };
      }
      return session;
    }));
  };

  const handleChatSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    setInputMessage("");
    
    // Update title if this is the first message
    if (currentMessages.length === 0) {
      updateChatTitle(message);
    }
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      source: "User",
      icon: "👤",
      query: message,
      result: message,
      timestamp: new Date().toISOString(),
      isUser: true
    };
    
    // Add user message to current chat
    setChatSessions(prev => prev.map(session => {
      if (session.id === activeChat) {
        return { ...session, messages: [...session.messages, userMessage] };
      }
      return session;
    }));
    
    // Simulate API response based on agent type
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      let responseMessage: Message;
      
      if (currentAgent === "weatherAgent") {
        // Weather agent response
        responseMessage = {
          id: (Date.now() + 1).toString(),
          source: "Weather Agent",
          icon: "🌤️",
          query: message,
          result: `Weather information for "${message}":\n🌡️ Temperature: 25°C\n☁️ Condition: Partly Cloudy\n💨 Wind: 10 km/h\n💧 Humidity: 65%`,
          timestamp: new Date().toISOString()
        };
      } else {
        // Web researcher response
        let result = "";
        const query = message.toLowerCase();
        
        if (query.includes("nosana")) {
          result = "Nosana Network is a decentralized GPU grid for AI inference, offering cost-effective computational power for running AI models. It leverages blockchain technology to create a marketplace connecting GPU providers with AI developers.";
        } else if (query.includes("bitcoin") || query.includes("btc")) {
          result = `Bitcoin (BTC) is currently trading at $${(45000 + Math.random() * 5000).toFixed(2)}. It's the world's first and largest cryptocurrency by market cap, created by Satoshi Nakamoto in 2008.`;
        } else if (query.includes("ethereum") || query.includes("eth")) {
          result = `Ethereum (ETH) is trading at $${(2500 + Math.random() * 500).toFixed(2)}. It's a decentralized platform that runs smart contracts and is the second-largest cryptocurrency by market cap.`;
        } else if (query.includes("solana") || query.includes("sol")) {
          result = `Solana (SOL) is currently at $${(50 + Math.random() * 20).toFixed(2)}. It's a high-performance blockchain supporting builders around the world creating crypto apps.`;
        } else if (query.includes("help") || query.includes("what can you do")) {
          result = "I'm a Web Research Agent that can help you with:\n• Cryptocurrency prices and information\n• Blockchain technology research\n• General web queries\n• Market analysis\n\nTry asking about Bitcoin, Ethereum, Solana, or Nosana!";
        } else {
          result = `Based on my research for "${message}", here's what I found: This is a comprehensive topic that involves multiple aspects. The current trends show significant interest in this area, with various developments happening in the field. Further research may provide more specific insights.`;
        }
        
        responseMessage = {
          id: (Date.now() + 1).toString(),
          source: "Web Researcher",
          icon: "🌐",
          query: message,
          result: result,
          timestamp: new Date().toISOString()
        };
      }
      
      // Add AI response to current chat
      setChatSessions(prev => prev.map(session => {
        if (session.id === activeChat) {
          return { ...session, messages: [...session.messages, responseMessage] };
        }
        return session;
      }));
      
    } catch (error) {
      console.error("Error:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        source: "System",
        icon: "⚠️",
        query: message,
        result: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString()
      };
      
      setChatSessions(prev => prev.map(session => {
        if (session.id === activeChat) {
          return { ...session, messages: [...session.messages, errorMessage] };
        }
        return session;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setInputMessage(query);
    handleChatSubmit(query);
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
              className={`w-full p-3 rounded-lg text-left flex items-center gap-2 transition-all ${
                currentAgent === "webResearcherAgent"
                  ? "bg-gradient-to-r from-purple-500/25 to-cyan-500/25 border border-purple-500/50"
                  : "hover:bg-white/5 border border-white/5"
              }`}>
              <span className="text-xl">🌐</span>
              <div>
                <p className="font-medium text-xs">Web Researcher</p>
                <p className="text-xs text-gray-400">Multi-source data</p>
              </div>
              {currentAgent === "webResearcherAgent" && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setCurrentAgent("weatherAgent")}
              className={`w-full p-3 rounded-lg text-left flex items-center gap-2 transition-all ${
                currentAgent === "weatherAgent"
                  ? "bg-gradient-to-r from-purple-500/25 to-cyan-500/25 border border-purple-500/50"
                  : "hover:bg-white/5 border border-white/5"
              }`}>
              <span className="text-xl">🌤️</span>
              <div>
                <p className="font-medium text-xs">Weather Agent</p>
                <p className="text-xs text-gray-400">Real-time weather</p>
              </div>
              {currentAgent === "weatherAgent" && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Quick Actions */}
            <div className="mt-4 p-3 bg-black/30 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Quick Actions</p>
              <div className="space-y-2">
                {currentAgent === "webResearcherAgent" ? (
                  <>
                    <button 
                      onClick={() => handleQuickAction("What is Nosana Network?")}
                      className="w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10">
                      🔍 Research Nosana
                    </button>
                    <button 
                      onClick={() => handleQuickAction("Bitcoin price")}
                      className="w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10">
                      💰 BTC Price
                    </button>
                    <button 
                      onClick={() => handleQuickAction("Latest Solana news")}
                      className="w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10">
                      📰 Solana News
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleQuickAction("Weather in New York")}
                      className="w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10">
                      🏙️ New York Weather
                    </button>
                    <button 
                      onClick={() => handleQuickAction("Weather in Tokyo")}
                      className="w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10">
                      🗾 Tokyo Weather
                    </button>
                    <button 
                      onClick={() => handleQuickAction("Weather in London")}
                      className="w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10">
                      🇬🇧 London Weather
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-3 border-t border-white/10">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Model</span>
                <select 
                  value={currentModel}
                  onChange={(e) => setCurrentModel(e.target.value)}
                  className="text-xs bg-white/10 text-white px-2 py-1 rounded cursor-pointer">
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id} className="bg-gray-900">
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Messages</span>
                <span className="text-xs text-white">{currentMessages.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {currentAgent === "webResearcherAgent" ? "🌐 Web Researcher" : "🌤️ Weather Agent"}
              </h2>
              <span className="text-xs text-gray-400">Session: {currentChatSession?.title}</span>
            </div>
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showChatHistory ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl mb-4">
                    {currentAgent === "webResearcherAgent" ? "🔍" : "☁️"}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {currentAgent === "webResearcherAgent" ? "Hello! How can I help?" : "Check the Weather"}
                  </h3>
                  <p className="text-gray-400">
                    {currentAgent === "webResearcherAgent" 
                      ? "Ask me anything about crypto, blockchain, or general research..."
                      : "Tell me a location to get weather information..."
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.isUser ? 'justify-end' : ''}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30' 
                        : 'bg-black/40 border border-white/10'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{msg.icon}</span>
                        <span className="text-sm font-medium">{msg.source}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.result}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="max-w-[80%] p-4 rounded-lg bg-black/40 border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                        <span className="text-sm">Processing...</span>
                      </div>
                    </div>
                  </div>
                )}
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
                  placeholder={currentAgent === "webResearcherAgent" 
                    ? "Ask about crypto, blockchain, or any topic..." 
                    : "Enter a location for weather info..."
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleChatSubmit(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat History Sidebar */}
        {showChatHistory && (
          <div className="w-64 bg-black/40 backdrop-blur-md border-l border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Chat History</h3>
              <span className="text-xs text-gray-400">{chatSessions.length} sessions</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleChatSwitch(session.id)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-all group ${
                    activeChat === session.id
                      ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">
                          {session.agent === "weatherAgent" ? "🌤️" : "🌐"}
                        </span>
                        <p className="text-sm font-medium truncate">{session.title}</p>
                      </div>
                      <p className="text-xs text-gray-400">{session.timestamp}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.messages.length} messages
                      </p>
                    </div>
                    {session.id !== "1" && ( // Don't allow deleting the first chat
                      <button
                        onClick={(e) => handleDeleteChat(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <button 
                onClick={handleNewChat}
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg text-sm hover:from-purple-500/30 hover:to-cyan-500/30 transition-all">
                + New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
