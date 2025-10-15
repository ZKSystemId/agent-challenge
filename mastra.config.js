/**
 * Mastra Configuration for Windows Compatibility
 */

module.exports = {
  development: {
    port: 4111,
    logLevel: 'info',
    server: {
      host: 'localhost',
      port: 4111,
    },
    ui: {
      enabled: true,
      port: 3000,
    },
    agents: {
      path: './src/mastra/agents',
      autoLoad: true,
    },
    tools: {
      path: './src/mastra/tools',
      autoLoad: true,
    },
    mcp: {
      enabled: true,
      servers: ['./src/mastra/mcp'],
    },
    storage: {
      type: 'libsql',
      url: ':memory:',
    },
  },
  production: {
    port: process.env.PORT || 4111,
    logLevel: 'warn',
  },
};
