# AI教育平台 - Docker部署指南

## 📋 概述

本文档提供了AI教育平台的完整Docker化部署方案，包括本地开发环境和生产环境的配置。

## 🏗️ 架构说明

项目采用微服务架构，专注于核心组件以确保开发生产环境一致性：

- **前端**: Next.js 15 + React 19 + TypeScript
- **后端**: Strapi 5 CMS + TypeScript  
- **数据库**: PostgreSQL 15
- **反向代理**: Nginx (生产环境)

**开发环境可选工具**:
- **数据库管理**: PgAdmin 4 (通过 `--profile with-tools` 启用)

**设计原则**: 我们移除了非必要组件以保持环境一致性和简化维护。开发和生产环境使用相同的核心技术栈。

## 📁 目录结构

```
ai-edu-platform/
├── Dockerfile                    # 前端Dockerfile
├── backend/Dockerfile            # 后端Dockerfile
├── docker-compose.dev.yml       # 开发环境配置
├── docker-compose.prod.yml      # 生产环境配置
├── nginx/                       # Nginx配置
├── scripts/                     # 部署脚本
├── .env.docker.dev.example      # 开发环境变量模板
├── .env.docker.prod.example     # 生产环境变量模板
└── backups/                     # 数据库备份目录
```

## 🔧 环境要求

- Docker Engine 20.10+
- Docker Compose V2
- 至少 4GB RAM (开发环境)
- 至少 8GB RAM (生产环境)

## 🚀 快速开始

### 1. 开发环境部署

#### 方式一：仅数据库模式（推荐）

**最佳开发体验**，提供最好的环境一致性：

```bash
# 1. 配置环境变量
cp .env.docker.dev.example .env.docker.dev
# 可根据需要调整配置

# 2. 启动数据库
./scripts/dev-start.sh
# 选择选项 1

# 3. 在新终端启动后端
cd backend && npm run dev

# 4. 在新终端启动前端  
pnpm dev
```

#### 方式二：数据库 + 管理工具

添加PgAdmin图形化数据库管理：

```bash
# 1. 配置环境变量
cp .env.docker.dev.example .env.docker.dev

# 2. 启动数据库和工具
./scripts/dev-start.sh
# 选择选项 2
```

#### 方式三：完整Docker栈

测试生产环境一致性，所有服务都在容器中：

```bash
# 1. 配置环境变量
cp .env.docker.dev.example .env.docker.dev

# 2. 启动完整栈
./scripts/dev-start.sh
# 选择选项 3
```

#### 开发环境访问地址

- 前端: http://localhost:3000
- 后端API: http://localhost:1337
- 数据库: localhost:5432
- PgAdmin: http://localhost:5050 (如果启用)

### 2. 生产环境部署

#### 服务器准备

```bash
# 1. 安装Docker和Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L \"https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. 创建项目目录
mkdir -p /opt/ai-edu-platform
cd /opt/ai-edu-platform

# 3. 上传项目文件
# 使用 git clone 或 scp 上传项目文件
```

#### 生产环境配置

```bash
# 1. 配置生产环境变量
cp .env.docker.prod.example .env.docker.prod
vim .env.docker.prod

# 重要: 修改以下配置
# - 所有密钥和密码
# - 域名配置
# - SSL证书路径
# - Strapi API Token
```

#### 部署执行

```bash
# 1. 设置环境变量
export NODE_ENV=production
export DEPLOY_ENV=production

# 2. 执行部署
./scripts/prod-deploy.sh

# 3. 验证部署
curl http://your-domain.com/api/health
curl http://your-domain.com/_health
```

## ⚙️ 配置说明

### 环境变量配置

#### 开发环境 (.env.docker.dev)

```bash
# 数据库配置
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi123
DATABASE_PORT=5432

# Strapi配置
STRAPI_PORT=1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api

# Token配置
NEXT_PUBLIC_STRAPI_TOKEN=your_readonly_token
```

#### 生产环境 (.env.docker.prod)

```bash
# 数据库配置（使用强密码）
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_secure_password_here

# Strapi核心密钥（必须修改）
STRAPI_APP_KEYS=key1,key2,key3,key4
STRAPI_API_TOKEN_SALT=your_salt_here
STRAPI_ADMIN_JWT_SECRET=your_jwt_secret
STRAPI_JWT_SECRET=your_jwt_secret

# 前端配置
NEXT_PUBLIC_STRAPI_URL=http://backend:1337/api
PUBLIC_FRONTEND_URL=https://your-domain.com

# SSL证书路径
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/private.key
```

### Docker Compose配置详解

#### 开发环境特性

- **数据持久化**: 使用命名数据卷
- **热重载**: 支持代码变更自动重载
- **开发工具**: 包含PgAdmin管理界面
- **灵活启动**: 支持多种启动模式

#### 生产环境特性

- **多阶段构建**: 优化镜像大小
- **健康检查**: 自动监控服务状态
- **资源限制**: 防止资源耗尽
- **反向代理**: Nginx处理静态文件和负载均衡
- **安全配置**: 移除开发工具和调试信息

## 🛠️ 管理脚本

### 开发环境脚本

```bash
# 启动开发环境
./scripts/dev-start.sh

# 停止开发环境
./scripts/dev-stop.sh

# 查看服务日志
./scripts/dev-logs.sh [服务名]

# 备份开发数据库
./scripts/backup-db.sh dev
```

### 生产环境脚本

```bash
# 部署生产环境
./scripts/prod-deploy.sh

# 备份生产数据库
./scripts/backup-db.sh prod

# 查看生产日志
docker compose -f docker-compose.prod.yml logs -f [服务名]

# 重启生产服务
docker compose -f docker-compose.prod.yml restart [服务名]
```

## 📊 监控和维护

### 健康检查端点

- **前端**: `GET /api/health`
- **后端**: `GET /_health`
- **Nginx**: `GET /health`

### 日志管理

```bash
# 查看所有服务日志
docker compose -f docker-compose.prod.yml logs

# 查看特定服务日志
docker compose -f docker-compose.prod.yml logs backend

# 实时跟踪日志
docker compose -f docker-compose.prod.yml logs -f frontend

# 查看最后100行日志
docker compose -f docker-compose.prod.yml logs --tail=100 backend
```

### 数据备份

```bash
# 手动备份
./scripts/backup-db.sh prod

# 设置自动备份（添加到crontab）
0 2 * * * /opt/ai-edu-platform/scripts/backup-db.sh prod

# 恢复备份
docker compose -f docker-compose.prod.yml exec postgres psql -U strapi -d ai_edu_platform < backup.sql
```

## 🔒 安全配置

### SSL/HTTPS配置

1. 获取SSL证书（推荐Let's Encrypt）
2. 更新nginx配置启用HTTPS
3. 配置HTTP到HTTPS重定向
4. 启用HSTS安全头

### 防火墙配置

```bash
# 只开放必要端口
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 敏感信息保护

- 使用环境变量存储密钥
- 定期轮换API Token
- 限制数据库访问权限
- 启用Strapi管理面板2FA

## 🚨 故障排除

### 常见问题

#### 1. 服务启动失败

```bash
# 检查容器状态
docker compose -f docker-compose.prod.yml ps

# 查看详细日志
docker compose -f docker-compose.prod.yml logs [服务名]

# 重启失败服务
docker compose -f docker-compose.prod.yml restart [服务名]
```

#### 2. 数据库连接失败

```bash
# 检查数据库容器状态
docker compose -f docker-compose.prod.yml exec postgres pg_isready

# 检查网络连通性
docker compose -f docker-compose.prod.yml exec backend ping postgres

# 验证数据库凭据
docker compose -f docker-compose.prod.yml exec postgres psql -U strapi -d ai_edu_platform -c \"SELECT version();\"
```

#### 3. 前端无法访问后端

```bash
# 检查网络配置
docker network ls
docker network inspect ai-edu-platform_ai_edu_network

# 检查环境变量
docker compose -f docker-compose.prod.yml exec frontend env | grep STRAPI

# 测试内部连接
docker compose -f docker-compose.prod.yml exec frontend curl http://backend:1337/_health
```

#### 4. 静态文件404错误

```bash
# 检查文件上传目录权限
docker compose -f docker-compose.prod.yml exec backend ls -la public/uploads

# 重新构建前端镜像
docker compose -f docker-compose.prod.yml build --no-cache frontend

# 检查Nginx配置
docker compose -f docker-compose.prod.yml exec nginx nginx -t
```

### 性能优化

#### 1. 数据库优化

```bash
# 查看数据库大小
docker compose -f docker-compose.prod.yml exec postgres psql -U strapi -d ai_edu_platform -c \"SELECT pg_size_pretty(pg_database_size('ai_edu_platform'));\"

# 分析查询性能
docker compose -f docker-compose.prod.yml exec postgres psql -U strapi -d ai_edu_platform -c \"SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;\"
```

#### 2. 资源监控

```bash
# 查看容器资源使用
docker stats

# 查看系统资源
htop
df -h
free -h
```

## 📚 其他资源

### 相关文档

- [Next.js Docker部署](https://nextjs.org/docs/deployment#docker-image)
- [Strapi Docker部署](https://docs.strapi.io/dev-docs/deployment/docker)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)

### 开发工具

- **数据库管理**: PgAdmin (http://localhost:5050)
- **API测试**: Postman, Insomnia
- **日志分析**: Docker logs, ELK Stack
- **监控**: Prometheus + Grafana

---

## ❓ 获取帮助

如果遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查项目日志文件
3. 参考官方文档
4. 在项目仓库提Issue

**维护者**: AI教育平台开发团队  
**最后更新**: 2024年8月31日