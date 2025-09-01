# 数据库数据管理策略

## 概述

考虑到WSL环境下的文件权限限制，以及Strapi数据的重要性，我们采用以下数据管理策略：

### 当前策略：外部卷 + 种子数据管理

1. **开发环境**：继续使用Docker外部卷 (`ai-edu-platform_postgres_data`)
2. **数据版本控制**：通过SQL种子脚本管理核心数据结构
3. **备份管理**：定期导出和自动备份

## 目录结构

```
data/
├── seeds/                          # 种子数据目录
│   ├── schema.sql                  # 数据库架构
│   ├── strapi_system_data.sql      # Strapi系统配置
│   ├── content_data.sql            # 内容数据
│   ├── rebuild_database.sh         # 数据库重建脚本
│   └── full_backup_*.sql           # 完整备份文件
├── postgres/                       # 数据文件目录（已备份）
└── .gitkeep                       # Git目录保持
```

## 核心脚本

### 1. 数据导出脚本
- **位置**: `scripts/database/export-seeds.sh`
- **功能**: 导出数据库架构和种子数据
- **使用**: `./scripts/database/export-seeds.sh`

### 2. 数据库重建脚本  
- **位置**: `data/seeds/rebuild_database.sh`
- **功能**: 从种子数据重建数据库
- **使用**: `./data/seeds/rebuild_database.sh`

## 数据管理工作流

### 开发环境初始化
```bash
# 1. 启动数据库
./scripts/dev-start.sh  # 选择选项1

# 2. 如果需要从种子数据重建
./data/seeds/rebuild_database.sh
```

### 数据备份和导出
```bash
# 导出种子数据（推荐定期执行）
./scripts/database/export-seeds.sh

# 手动备份
./scripts/backup-db.sh dev
```

### 数据恢复
```bash
# 从最新完整备份恢复
docker exec -i ai_edu_postgres_dev psql -U strapi -d ai_edu_platform < data/seeds/full_backup_YYYYMMDD_HHMMSS.sql

# 从种子数据重建（推荐用于开发环境初始化）
./data/seeds/rebuild_database.sh
```

## Git版本控制策略

### 包含在版本控制中
- ✅ `data/seeds/` - 种子数据脚本
- ✅ `scripts/database/` - 数据库管理脚本
- ✅ `data/.gitkeep` - 目录保持文件

### 排除在版本控制外
- ❌ `data/postgres/*` - 实际数据库文件
- ❌ `data/seeds/full_backup_*.sql` - 完整备份文件
- ❌ `.env.docker.dev` - 环境变量配置

## 最佳实践

1. **定期导出种子数据**：在重要功能开发完成后运行导出脚本
2. **测试数据库重建**：定期验证种子数据的完整性
3. **备份策略**：重要数据变更前先备份
4. **团队协作**：种子数据变更需要团队同步

## 优势

- ✅ **环境一致性**：新开发者可快速初始化相同的数据环境
- ✅ **数据安全**：多层备份保护（外部卷 + 种子脚本 + 完整备份）
- ✅ **版本控制**：核心数据结构可以版本化管理
- ✅ **WSL兼容**：避免文件权限问题
- ✅ **灵活性**：支持完整恢复和增量重建

## 注意事项

1. **权限问题**：WSL环境下直接绑定挂载可能遇到权限问题
2. **数据一致性**：种子数据需要定期更新以反映最新的数据结构
3. **敏感信息**：确保导出的数据中不包含敏感信息（已配置.gitignore）
4. **循环依赖**：某些Strapi表存在外键循环依赖，恢复时可能需要禁用触发器

## 故障排除

### 数据库启动失败
```bash
# 检查容器状态
docker compose -f docker-compose.dev.yml ps

# 查看日志
docker logs ai_edu_postgres_dev

# 重启服务
docker compose -f docker-compose.dev.yml restart postgres
```

### 权限错误
```bash
# 修复数据目录权限（如果使用绑定挂载）
docker run --rm -v "$(pwd)/data/postgres":/data postgres:15-alpine chown -R 999:999 /data
```

### 数据不一致
```bash
# 从最新备份恢复
./scripts/backup-db.sh dev
# 然后从备份文件恢复
```