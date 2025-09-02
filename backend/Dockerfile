# ==========================================
# Strapi Backend Dockerfile
# 多阶段构建，优化生产镜像大小
# ==========================================

# 阶段1: Dependencies - 安装依赖
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装所有依赖（包括dev依赖，构建时需要）
RUN npm ci && npm cache clean --force

# 阶段2: Builder - 构建应用
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用 - Strapi需要源代码来构建管理面板
ENV NODE_ENV=production
RUN npm run build

# 阶段3: Runner - 生产运行环境
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV STRAPI_DISABLE_UPDATE_NOTIFICATION true
ENV STRAPI_TELEMETRY_DISABLED true

RUN addgroup --system --gid 1001 strapi
RUN adduser --system --uid 1001 strapi

# 安装运行时依赖
RUN apk add --no-cache dumb-init

# 复制构建结果和依赖
COPY --from=deps --chown=strapi:strapi /app/node_modules ./node_modules
COPY --from=builder --chown=strapi:strapi /app/dist ./dist
COPY --from=builder --chown=strapi:strapi /app/src ./src
COPY --from=builder --chown=strapi:strapi /app/config ./config
COPY --from=builder --chown=strapi:strapi /app/database ./database
COPY --from=builder --chown=strapi:strapi /app/public ./public
COPY --from=builder --chown=strapi:strapi /app/package*.json ./

# 为运行时安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 创建必要的目录并设置权限
RUN mkdir -p public/uploads && chown -R strapi:strapi public/uploads
RUN mkdir -p .cache && chown -R strapi:strapi .cache

USER strapi

EXPOSE 1337

# 健康检查 - 在开发环境中禁用以加快启动速度
# HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
#   CMD curl -f http://localhost:1337/_health || wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# 使用dumb-init确保信号正确处理
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]