#!/bin/bash
# ==========================================
# 服务器端一键部署脚本
# 支持Git和Docker Hub两种部署方式
# ==========================================

set -e

echo "🚀 AI教育平台一键部署脚本"
echo "=========================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="ai-edu-platform"
DOMAIN="aijx.online"
DEPLOY_DIR="/opt/${PROJECT_NAME}"

echo -e "${BLUE}请选择部署方式:${NC}"
echo "1) Git克隆部署 (推荐 - 包含配置文件)"
echo "2) Docker Hub镜像部署 (更快 - 需要单独配置)"
echo "3) 混合部署 (Git配置 + Docker Hub镜像)"
echo ""
read -p "请输入选择 (1-3): " deploy_method

case $deploy_method in
    1)
        echo -e "${BLUE}🔄 执行Git克隆部署...${NC}"
        
        # 下载Git部署脚本
        curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ai-edu-platform/main/scripts/git-deploy.sh -o /tmp/git-deploy.sh
        chmod +x /tmp/git-deploy.sh
        
        # 执行Git部署
        /tmp/git-deploy.sh
        ;;
        
    2)
        echo -e "${BLUE}🐳 执行Docker Hub镜像部署...${NC}"
        
        # 输入Docker Hub用户名
        read -p "请输入Docker Hub用户名: " docker_username
        read -p "请输入镜像标签 (默认: latest): " image_tag
        image_tag=${image_tag:-latest}
        
        # 创建部署目录
        sudo mkdir -p $DEPLOY_DIR
        cd $DEPLOY_DIR
        
        # 下载必要的配置文件
        echo -e "${BLUE}📥 下载配置文件...${NC}"
        curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ai-edu-platform/main/docker-compose.hub.yml -o docker-compose.yml
        curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ai-edu-platform/main/.env.docker.prod.example -o .env.docker.prod
        mkdir -p nginx/conf.d
        curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ai-edu-platform/main/nginx/nginx.conf -o nginx/nginx.conf
        curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ai-edu-platform/main/nginx/conf.d/https.conf -o nginx/conf.d/default.conf
        
        # 设置环境变量
        export DOCKER_USERNAME=$docker_username
        export IMAGE_TAG=$image_tag
        
        echo -e "${RED}❗ 请编辑 .env.docker.prod 文件填入真实配置${NC}"
        echo "   nano .env.docker.prod"
        read -p "按回车继续..."
        
        # 启动服务
        docker compose up -d
        ;;
        
    3)
        echo -e "${BLUE}🔀 执行混合部署...${NC}"
        
        # 先克隆配置
        echo -e "${BLUE}📥 克隆配置文件...${NC}"
        if [ ! -d "$DEPLOY_DIR" ]; then
            sudo mkdir -p $DEPLOY_DIR
            cd /opt
            sudo git clone https://github.com/YOUR_USERNAME/ai-edu-platform.git
        else
            cd $DEPLOY_DIR
            sudo git pull origin main
        fi
        
        cd $DEPLOY_DIR
        
        # 输入Docker Hub配置
        read -p "请输入Docker Hub用户名: " docker_username
        read -p "请输入镜像标签 (默认: latest): " image_tag
        image_tag=${image_tag:-latest}
        
        # 使用Docker Hub配置文件
        cp docker-compose.hub.yml docker-compose.yml
        
        # 设置环境变量
        export DOCKER_USERNAME=$docker_username
        export IMAGE_TAG=$image_tag
        
        echo -e "${RED}❗ 请检查并编辑 .env.docker.prod 文件${NC}"
        echo "   nano .env.docker.prod"
        read -p "按回车继续..."
        
        # 启动服务
        docker compose up -d
        ;;
        
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 10

# 显示服务状态
echo -e "${BLUE}📊 服务状态:${NC}"
cd $DEPLOY_DIR
docker compose ps

# 健康检查
echo -e "${BLUE}🏥 执行健康检查...${NC}"
if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
fi

if curl -sf http://localhost:1337/_health > /dev/null; then
    echo -e "${GREEN}✅ 后端服务正常${NC}"
else
    echo -e "${RED}❌ 后端服务异常${NC}"
fi

echo -e "\n${GREEN}🎉 部署完成！${NC}"
echo "=========================="
echo "🌐 临时访问地址:"
echo "   前端: http://$(curl -s ifconfig.me):3000"
echo "   后端: http://$(curl -s ifconfig.me):1337"
echo "   管理: http://$(curl -s ifconfig.me):1337/admin"
echo ""
echo "🔒 配置HTTPS:"
echo "   cd $DEPLOY_DIR && ./scripts/setup-ssl.sh"
echo ""
echo "📋 管理命令:"
echo "   查看日志: docker compose logs -f"
echo "   重启服务: docker compose restart"
echo "   停止服务: docker compose down"
echo "=========================="