FROM node:20-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 10002 appgroup && \
    adduser -u 10002 -G appgroup -s /bin/sh -D appuser
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/server.js ./
COPY --from=builder /build/public ./public
RUN chown -R appuser:appgroup /app
USER 10002
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "server.js"]

