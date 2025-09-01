#!/bin/bash
# ==========================================
# 服务器端Git部署脚本
# 从GitHub拉取项目并部署到生产环境
# ==========================================

set -e

echo "🚀 从Git仓库部署AI教育平台..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="ai-edu-platform"
GIT_REPO="https://github.com/YOUR_USERNAME/ai-edu-platform.git"  # 请替换为你的仓库地址
DEPLOY_DIR="/opt/${PROJECT_NAME}"
BACKUP_DIR="/opt/backups"

# 检查是否为root用户或有sudo权限
if [[ $EUID -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
fi

echo -e "${BLUE}📋 部署信息:${NC}"
echo "   项目: ${PROJECT_NAME}"
echo "   仓库: ${GIT_REPO}"
echo "   部署目录: ${DEPLOY_DIR}"
echo ""

# 检查必要工具
echo -e "${BLUE}🔍 检查系统环境...${NC}"

# 检查Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📦 安装Git...${NC}"
    $SUDO apt update && $SUDO apt install -y git
fi

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 安装Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    $SUDO sh get-docker.sh
    $SUDO usermod -aG docker $USER
    echo -e "${YELLOW}⚠️  请重新登录以使Docker权限生效${NC}"
fi

# 检查Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${YELLOW}📦 安装Docker Compose...${NC}"
    $SUDO apt install -y docker-compose-plugin
fi

# 创建部署目录
echo -e "${BLUE}📁 准备部署目录...${NC}"
$SUDO mkdir -p $DEPLOY_DIR
$SUDO mkdir -p $BACKUP_DIR
$SUDO chown $USER:$USER $DEPLOY_DIR

# 备份现有部署
if [ -d "${DEPLOY_DIR}/.git" ]; then
    echo -e "${YELLOW}💾 备份现有部署...${NC}"
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    $SUDO cp -r $DEPLOY_DIR "${BACKUP_DIR}/${BACKUP_NAME}"
    echo -e "${GREEN}✅ 备份完成: ${BACKUP_DIR}/${BACKUP_NAME}${NC}"
fi

# 克隆或更新仓库
cd /opt
if [ -d "${DEPLOY_DIR}/.git" ]; then
    echo -e "${BLUE}🔄 更新现有仓库...${NC}"
    cd $DEPLOY_DIR
    git fetch origin
    git reset --hard origin/main
    git pull origin main
else
    echo -e "${BLUE}📥 克隆仓库...${NC}"
    $SUDO rm -rf $DEPLOY_DIR
    git clone $GIT_REPO $DEPLOY_DIR
    cd $DEPLOY_DIR
fi

echo -e "${GREEN}✅ 代码更新完成${NC}"
echo "   提交: $(git log --oneline -1)"
echo "   分支: $(git branch --show-current)"

# 检查环境配置
echo -e "${BLUE}🔧 检查环境配置...${NC}"
if [ ! -f ".env.docker.prod" ]; then
    echo -e "${YELLOW}⚠️  创建生产环境配置...${NC}"
    cp .env.docker.prod.example .env.docker.prod
    echo -e "${RED}❗ 请编辑 .env.docker.prod 文件填入真实配置${NC}"
    echo "   nano ${DEPLOY_DIR}/.env.docker.prod"
    read -p "按回车继续..."
fi

# 设置权限
echo -e "${BLUE}🔐 设置文件权限...${NC}"
$SUDO chown -R $USER:docker $DEPLOY_DIR
chmod +x scripts/*.sh

# 部署应用
echo -e "${BLUE}🚀 启动生产环境...${NC}"
./scripts/prod-deploy.sh

echo -e "\n${GREEN}🎉 Git部署完成！${NC}"
echo "=========================="
echo "🌐 访问地址: https://aijx.online"
echo "📁 部署目录: ${DEPLOY_DIR}"
echo "💾 备份目录: ${BACKUP_DIR}"
echo "=========================="

# 显示后续操作提示
echo -e "\n${BLUE}📋 后续操作:${NC}"
echo "   1. 配置SSL证书: ./scripts/setup-ssl.sh"
echo "   2. 监控服务状态: docker compose -f docker-compose.prod.yml ps"
echo "   3. 查看日志: docker compose -f docker-compose.prod.yml logs -f"
echo "   4. 更新部署: 重新运行此脚本"