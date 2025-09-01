# Docker快速参考

## 🚀 开发环境

### 快速启动（3种模式）
```bash
# 方式1: 仅数据库（推荐 - 最佳开发体验）
./scripts/dev-start.sh  # 选择 1
# 然后在新终端: cd backend && npm run dev
# 再在新终端: pnpm dev

# 方式2: 数据库 + PgAdmin管理工具  
./scripts/dev-start.sh  # 选择 2

# 方式3: 完整Docker栈（测试生产一致性）
./scripts/dev-start.sh  # 选择 3
```

### 访问地址
- 前端: http://localhost:3000
- 后端: http://localhost:1337  
- 健康检查: http://localhost:3000/api/health, http://localhost:1337/_health
- PgAdmin: http://localhost:5050 (模式2/3时)

### 常用命令
```bash
# 查看日志
./scripts/dev-logs.sh

# 停止服务
./scripts/dev-stop.sh

# 备份数据
./scripts/backup-db.sh dev
```

## 🏭 生产环境

### 快速部署
```bash
# 1. 配置环境变量
cp .env.docker.prod.example .env.docker.prod
vim .env.docker.prod

# 2. 部署
export NODE_ENV=production
./scripts/prod-deploy.sh
```

### 维护命令
```bash
# 查看状态
docker compose -f docker-compose.prod.yml ps

# 重启服务
docker compose -f docker-compose.prod.yml restart [service]

# 查看日志
docker compose -f docker-compose.prod.yml logs -f

# 备份数据库
./scripts/backup-db.sh prod
```

## 🛠️ 数据管理

### 数据管理工具
```bash
# 查看数据库状态
./scripts/data-manager.sh status

# 导出种子数据
./scripts/data-manager.sh export

# 重建数据库
./scripts/data-manager.sh rebuild

# 备份数据库
./scripts/data-manager.sh backup
```

### 数据持久化策略
项目采用**外部卷 + 种子数据管理**的混合策略：
- 开发环境使用Docker外部卷确保数据持久性
- 通过SQL种子脚本管理核心数据结构
- 支持数据库完整重建和增量恢复

详细说明请参考：`data/DATA-MANAGEMENT.md`

## 🔧 故障排除

```bash
# 检查容器健康
docker compose -f docker-compose.prod.yml ps

# 查看资源使用
docker stats

# 测试服务连通性
curl http://localhost:3000/api/health
curl http://localhost:1337/_health
```

## 📁 重要文件

- `docker-compose.dev.yml` - 开发环境配置
- `docker-compose.prod.yml` - 生产环境配置  
- `.env.docker.dev` - 开发环境变量
- `.env.docker.prod` - 生产环境变量
- `docs/docker-setup.md` - 完整部署文档