# syntax=docker/dockerfile:1

FROM node:lts AS build

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Disable Analytics/Telemetry
ENV DISABLE_TELEMETRY=true
ENV POSTHOG_DISABLED=true
ENV MASTRA_TELEMETRY_DISABLED=true
# Ensure logs are visible (disable buffering)
WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application
RUN DISABLE_ESLINT=1 NEXT_TELEMETRY_DISABLED=1 \
    pnpm build && \
    (pnpm build:agent || echo "Agent build warning ignored")

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Install pnpm
RUN corepack enable
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application and necessary files
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.js ./next.config.js
COPY --from=build /app/tailwind.config.js ./tailwind.config.js
COPY --from=build /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Set production environment
ENV NODE_ENV=production \
    NODE_OPTIONS="--enable-source-maps" \
    PORT=3000 \
    AGENT_PORT=4111

USER nextjs

EXPOSE 3000
EXPOSE 4111

# Start both services
CMD ["pnpm", "start"]
