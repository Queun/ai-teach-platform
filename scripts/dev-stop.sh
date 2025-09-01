#!/bin/bash
# ==========================================
# AI教育平台 - 开发环境停止脚本
# ==========================================

set -e

echo "🛑 停止AI教育平台开发环境..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 选择停止模式
echo "请选择停止模式："
echo "1) 仅停止容器 (保留容器和数据)"
echo "2) 停止并删除容器 (保留数据卷)"
echo "3) 停止并清理所有数据 (包含数据卷)"

read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}🔧 仅停止容器...${NC}"
        docker compose -f docker-compose.dev.yml stop
        echo -e "${GREEN}✅ 容器已停止，可使用 'docker compose -f docker-compose.dev.yml start' 快速重启${NC}"
        ;;
    2)
        echo -e "${BLUE}🔧 停止并删除容器...${NC}"
        docker compose -f docker-compose.dev.yml down
        echo -e "${GREEN}✅ 容器已删除，数据卷已保留${NC}"
        echo -e "${YELLOW}💡 下次启动将使用新容器但保留所有数据${NC}"
        ;;
    3)
        echo -e "${YELLOW}⚠️  这将删除所有数据，包括数据库内容！${NC}"
        read -p "确认删除所有数据? (y/N): " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}🔧 停止并清理所有数据...${NC}"
            docker compose -f docker-compose.dev.yml down -v
            docker system prune -f --volumes
            echo -e "${GREEN}✅ 所有容器和数据已清理${NC}"
        else
            echo -e "${BLUE}🔧 仅停止并删除容器...${NC}"
            docker compose -f docker-compose.dev.yml down
            echo -e "${GREEN}✅ 已取消数据清理，仅删除了容器${NC}"
        fi
        ;;
    *)
        echo -e "${RED}❌ 无效选择，执行默认停止操作${NC}"
        docker compose -f docker-compose.dev.yml down
        ;;
esac

echo -e "\n${BLUE}📊 当前容器状态:${NC}"
docker ps -a --filter "name=ai_edu"

echo -e "\n${BLUE}💾 数据卷状态:${NC}"
docker volume ls | grep ai-edu || echo "未找到相关数据卷"

echo -e "\n${YELLOW}💡 重新启动提示:${NC}"
echo "   - 快速启动: './scripts/dev-start.sh'"
echo "   - 查看日志: './scripts/dev-logs.sh [服务名]'"