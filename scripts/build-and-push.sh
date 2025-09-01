#!/bin/bash
# ==========================================
# Docker镜像构建和推送脚本
# 构建镜像并推送到Docker Hub
# ==========================================

set -e

echo "🐳 构建和推送Docker镜像到Hub..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量（请修改为你的Docker Hub用户名）
DOCKER_USERNAME="yourusername"  # 请替换为你的Docker Hub用户名
IMAGE_TAG="${1:-latest}"
REGISTRY="${DOCKER_REGISTRY:-docker.io}"

echo -e "${BLUE}📋 构建信息:${NC}"
echo "   Docker Hub用户名: ${DOCKER_USERNAME}"
echo "   镜像标签: ${IMAGE_TAG}"
echo "   注册表: ${REGISTRY}"
echo ""

# 检查Docker登录状态
echo -e "${BLUE}🔐 检查Docker Hub登录状态...${NC}"
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}请先登录Docker Hub:${NC}"
    echo "docker login"
    exit 1
fi

# 构建后端镜像
echo -e "${BLUE}🔨 构建Strapi后端镜像...${NC}"
docker build \
    -t "${DOCKER_USERNAME}/ai-edu-backend:${IMAGE_TAG}" \
    -t "${DOCKER_USERNAME}/ai-edu-backend:latest" \
    --platform linux/amd64 \
    ./backend

# 构建前端镜像
echo -e "${BLUE}🔨 构建Next.js前端镜像...${NC}"
docker build \
    -t "${DOCKER_USERNAME}/ai-edu-frontend:${IMAGE_TAG}" \
    -t "${DOCKER_USERNAME}/ai-edu-frontend:latest" \
    --platform linux/amd64 \
    .

# 推送镜像到Docker Hub
echo -e "${BLUE}📤 推送后端镜像到Docker Hub...${NC}"
docker push "${DOCKER_USERNAME}/ai-edu-backend:${IMAGE_TAG}"
docker push "${DOCKER_USERNAME}/ai-edu-backend:latest"

echo -e "${BLUE}📤 推送前端镜像到Docker Hub...${NC}"
docker push "${DOCKER_USERNAME}/ai-edu-frontend:${IMAGE_TAG}"
docker push "${DOCKER_USERNAME}/ai-edu-frontend:latest"

# 清理本地镜像（可选）
read -p "是否清理本地构建镜像以节省空间? (y/N): " cleanup
if [[ $cleanup =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧹 清理本地镜像...${NC}"
    docker image rm "${DOCKER_USERNAME}/ai-edu-backend:${IMAGE_TAG}" || true
    docker image rm "${DOCKER_USERNAME}/ai-edu-frontend:${IMAGE_TAG}" || true
    docker image prune -f
fi

echo -e "\n${GREEN}🎉 镜像构建和推送完成！${NC}"
echo "=========================="
echo "🐳 后端镜像: ${DOCKER_USERNAME}/ai-edu-backend:${IMAGE_TAG}"
echo "🐳 前端镜像: ${DOCKER_USERNAME}/ai-edu-frontend:${IMAGE_TAG}"
echo "=========================="

echo -e "\n${BLUE}📋 服务器部署命令:${NC}"
echo "export DOCKER_USERNAME=${DOCKER_USERNAME}"
echo "export IMAGE_TAG=${IMAGE_TAG}"
echo "docker compose -f docker-compose.hub.yml up -d"