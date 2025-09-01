#!/bin/bash
# ==========================================
# AI教育平台 - 数据库备份脚本
# ==========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
BACKUP_DIR="backups"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)

# 检查环境参数
ENVIRONMENT=${1:-dev}

if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    BACKUP_PREFIX="prod_backup"
elif [ "$ENVIRONMENT" = "dev" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    BACKUP_PREFIX="dev_backup"
else
    echo -e "${RED}❌ 无效环境参数，请使用 'dev' 或 'prod'${NC}"
    exit 1
fi

BACKUP_FILE="${BACKUP_DIR}/${BACKUP_PREFIX}_${DATE}.sql"

echo -e "${BLUE}📦 开始备份${ENVIRONMENT}环境数据库...${NC}"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 检查容器是否运行
if ! docker compose -f "$COMPOSE_FILE" ps postgres | grep -q "Up"; then
    echo -e "${RED}❌ PostgreSQL容器未运行${NC}"
    exit 1
fi

# 执行备份
echo -e "${YELLOW}💾 导出数据库...${NC}"
if docker compose -f "$COMPOSE_FILE" exec postgres pg_dump -U strapi -h localhost ai_edu_platform > "$BACKUP_FILE"; then
    echo -e "${GREEN}✅ 备份完成: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ 备份失败${NC}"
    exit 1
fi

# 压缩备份文件
echo -e "${YELLOW}🗜️  压缩备份文件...${NC}"
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# 显示备份文件信息
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo -e "${GREEN}📊 备份文件大小: $BACKUP_SIZE${NC}"

# 清理旧备份
echo -e "${YELLOW}🧹 清理 ${RETENTION_DAYS} 天前的旧备份...${NC}"
find "$BACKUP_DIR" -name "${BACKUP_PREFIX}_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# 显示当前备份列表
echo -e "${BLUE}📋 当前备份列表:${NC}"
ls -lh "$BACKUP_DIR"/${BACKUP_PREFIX}_*.sql.gz 2>/dev/null || echo "无备份文件"

echo -e "\n${GREEN}🎉 数据库备份完成！${NC}"
echo "备份文件: $BACKUP_FILE"