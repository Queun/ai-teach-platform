# ==========================================
# Next.js Frontend Dockerfile
# 多阶段构建，优化生产镜像大小
# ==========================================

# 阶段1: Dependencies - 安装依赖
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

# 启用pnpm
RUN corepack enable pnpm

WORKDIR /app

# 复制package文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 阶段2: Builder - 构建应用
FROM node:20-alpine AS builder
RUN corepack enable pnpm

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# 阶段3: Runner - 生产运行环境
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建结果
COPY --from=builder /app/public ./public

# 设置正确的权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 复制构建文件和依赖
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 健康检查 - 在开发环境中禁用以加快启动速度  
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]