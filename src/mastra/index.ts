import { Mastra } from "@mastra/core";

// Suppress telemetry warning
if (typeof globalThis !== 'undefined') {
  (globalThis as any).___MASTRA_TELEMETRY___ = true;
}

import { LibSQLStore } from "@mastra/libsql";
import { weatherAgent, webResearcherAgent } from "./agents";
import { ConsoleLogger, LogLevel } from "@mastra/core/logger";
import { server } from "./mcp";

const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel || "info";

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    webResearcherAgent
  },
  mcpServers: {
    server
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  logger: new ConsoleLogger({
    level: LOG_LEVEL,
  }),
});
