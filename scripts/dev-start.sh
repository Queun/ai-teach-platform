#!/bin/bash
# ==========================================
# AI教育平台 - 开发环境启动脚本
# ==========================================

set -e

echo "🚀 启动AI教育平台开发环境..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker未运行，请先启动Docker${NC}"
    exit 1
fi

# 检查环境变量文件
if [ ! -f .env.docker.dev ]; then
    echo -e "${YELLOW}⚠️  未找到 .env.docker.dev 文件${NC}"
    echo "正在从模板创建..."
    cp .env.docker.dev.example .env.docker.dev
    echo -e "${GREEN}✅ 已创建 .env.docker.dev，请检查并修改配置${NC}"
fi

# 选择启动模式
echo "请选择启动模式："
echo "1) 仅数据库 (推荐 - 前后端本地运行，环境一致性最佳)"
echo "2) 数据库 + 管理工具 (包含PgAdmin数据库管理)"  
echo "3) 完整Docker栈 (所有服务都在容器中，测试生产环境一致性)"

read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}🔧 启动数据库服务...${NC}"
        docker compose -f docker-compose.dev.yml up -d postgres
        ;;
    2)
        echo -e "${BLUE}🔧 启动数据库和管理工具...${NC}"
        docker compose -f docker-compose.dev.yml --profile with-tools up -d postgres pgadmin
        ;;
    3)
        echo -e "${BLUE}🔧 启动完整Docker栈...${NC}"
        docker compose -f docker-compose.dev.yml --profile full-stack up -d
        ;;
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 5

# 检查服务状态
echo -e "${BLUE}📊 检查服务状态...${NC}"
docker compose -f docker-compose.dev.yml ps

# 显示访问地址
echo -e "\n${GREEN}🎉 开发环境启动成功！${NC}"
echo "=========================="
echo "📊 数据库: localhost:5432"
echo "   用户名: strapi"
echo "   密码: strapi123"

if [ "$choice" == "2" ] || [ "$choice" == "3" ]; then
    echo "🔧 PgAdmin: http://localhost:5050"
    echo "   邮箱: admin@ai-edu.local"
    echo "   密码: admin123"
fi

if [ "$choice" == "3" ]; then
    echo "🔥 后端API: http://localhost:1337"
    echo "   健康检查: http://localhost:1337/_health"
    echo "🌐 前端: http://localhost:3000"
    echo "   健康检查: http://localhost:3000/api/health"
fi

echo "=========================="
echo -e "${YELLOW}💡 使用提示:${NC}"
echo "   - 停止服务: './scripts/dev-stop.sh'"
echo "   - 查看日志: './scripts/dev-logs.sh [服务名]'"
echo "   - 备份数据: './scripts/backup-db.sh dev'"
echo "   - 数据保存在命名卷中，停止容器不会丢失数据"

# 根据不同模式给出相应提示
case $choice in
    1)
        echo -e "\n${BLUE}🔧 推荐的本地开发流程:${NC}"
        echo "   1. 在新终端启动后端: cd backend && npm run dev"
        echo "   2. 在新终端启动前端: pnpm dev"
        echo "   3. 这样可以获得最佳的热重载体验"
        ;;
    2)
        echo -e "\n${BLUE}💡 数据库管理:${NC}"
        echo "   - 可通过PgAdmin图形界面管理数据库"
        echo "   - 连接信息: Host=postgres, Port=5432, DB=ai_edu_platform"
        ;;
    3)
        echo -e "\n${BLUE}🔍 完整栈模式:${NC}"
        echo "   - 所有服务运行在容器中，模拟生产环境"
        echo "   - 代码修改会自动重载"
        echo "   - 适合测试Docker配置和服务间通信"
        ;;
esac