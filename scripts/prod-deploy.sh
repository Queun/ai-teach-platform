#!/bin/bash
# ==========================================
# AI教育平台 - 生产环境部署脚本
# ==========================================

set -e

echo "🚀 部署AI教育平台到生产环境..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在服务器环境
if [ "$NODE_ENV" != "production" ] && [ "$DEPLOY_ENV" != "production" ]; then
    echo -e "${YELLOW}⚠️  警告: 当前环境非生产环境${NC}"
    read -p "确定要继续部署吗? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "部署已取消"
        exit 0
    fi
fi

# 检查必要的环境变量文件
if [ ! -f .env.docker.prod ]; then
    echo -e "${RED}❌ 未找到 .env.docker.prod 文件${NC}"
    echo "请从 .env.docker.prod.example 创建生产环境配置"
    exit 1
fi

# 检查Docker和Docker Compose
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker未运行，请先启动Docker${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose未安装${NC}"
    exit 1
fi

# 创建备份目录
mkdir -p backups

# 检查是否需要数据库备份
if docker compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
    echo -e "${YELLOW}💾 备份现有数据库...${NC}"
    BACKUP_FILE="backups/db_backup_$(date +%Y%m%d_%H%M%S).sql"
    docker compose -f docker-compose.prod.yml exec postgres pg_dump -U strapi ai_edu_platform > "$BACKUP_FILE"
    echo -e "${GREEN}✅ 数据库备份完成: $BACKUP_FILE${NC}"
fi

# 拉取最新镜像（如果使用远程镜像）
echo -e "${BLUE}📦 拉取最新镜像...${NC}"
docker compose -f docker-compose.prod.yml pull

# 构建应用镜像
echo -e "${BLUE}🔨 构建应用镜像...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

# 停止现有服务
echo -e "${YELLOW}🛑 停止现有服务...${NC}"
docker compose -f docker-compose.prod.yml down

# 启动新服务
echo -e "${BLUE}🚀 启动生产服务...${NC}"
docker compose -f docker-compose.prod.yml up -d

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 30

# 健康检查
echo -e "${BLUE}🏥 执行健康检查...${NC}"
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker compose -f docker-compose.prod.yml ps | grep -q "unhealthy\|Exit"; then
        echo -e "${YELLOW}⏳ 等待服务健康检查... (${attempt}/${max_attempts})${NC}"
        sleep 10
        attempt=$((attempt + 1))
    else
        break
    fi
done

# 检查最终状态
echo -e "${BLUE}📊 检查服务状态...${NC}"
docker compose -f docker-compose.prod.yml ps

# 验证关键服务
echo -e "${BLUE}🔍 验证关键服务...${NC}"

# 检查前端
if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
fi

# 检查后端
if curl -sf http://localhost:1337/_health > /dev/null; then
    echo -e "${GREEN}✅ 后端服务正常${NC}"
else
    echo -e "${RED}❌ 后端服务异常${NC}"
fi

# 部署后清理
echo -e "${BLUE}🧹 清理未使用的镜像...${NC}"
docker image prune -f

echo -e "\n${GREEN}🎉 部署完成！${NC}"
echo "=========================="
echo "🌐 前端: http://your-domain.com"
echo "🔥 后端API: http://your-domain.com/api"
echo "🔧 管理面板: http://your-domain.com/admin"
echo "=========================="
echo -e "${YELLOW}💡 重要提示:${NC}"
echo "   - 请更新DNS记录指向服务器IP"
echo "   - 配置SSL证书以启用HTTPS"
echo "   - 设置定期备份策略"
echo "   - 监控日志和性能指标"

echo -e "\n${BLUE}📋 后续步骤:${NC}"
echo "   1. 测试所有功能是否正常"
echo "   2. 配置监控和告警"
echo "   3. 设置自动化备份"
echo "   4. 配置CDN（如需要）"