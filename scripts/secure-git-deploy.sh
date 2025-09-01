#!/bin/bash
# ==========================================
# 安全Git部署脚本
# 使用SSH密钥认证，避免token暴露
# ==========================================

set -e

echo "🚀 AI教育平台Git安全部署"
echo "=========================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置变量
PROJECT_NAME="ai-edu-platform"
DOMAIN="aijx.online"
DEPLOY_DIR="/opt/${PROJECT_NAME}"
BACKUP_DIR="/opt/backups"

# 动态获取GitHub配置
GITHUB_USER=""
REPO_NAME="ai-edu-platform"

echo -e "${BLUE}📋 部署信息:${NC}"
echo "   项目: ${PROJECT_NAME}"
echo "   域名: ${DOMAIN}"
echo "   部署目录: ${DEPLOY_DIR}"
echo ""

# 检查是否为root用户
if [[ $EUID -eq 0 ]]; then
    SUDO=""
    echo -e "${YELLOW}⚠️  检测到root用户，建议使用普通用户运行${NC}"
else
    SUDO="sudo"
fi

# 获取GitHub用户名
read -p "请输入您的GitHub用户名: " GITHUB_USER
if [ -z "$GITHUB_USER" ]; then
    echo -e "${RED}❌ GitHub用户名不能为空${NC}"
    exit 1
fi

# 构建仓库地址
GIT_REPO="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"

echo -e "${BLUE}📋 将从以下仓库部署:${NC}"
echo "   仓库: ${GIT_REPO}"
echo ""

# 1. 检查必要工具
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
    rm get-docker.sh
    echo -e "${YELLOW}⚠️  Docker安装完成，请重新登录以使权限生效${NC}"
    echo "然后重新运行此脚本"
    exit 1
fi

# 检查Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${YELLOW}📦 安装Docker Compose...${NC}"
    $SUDO apt install -y docker-compose-plugin
fi

# 2. 配置SSH密钥
echo -e "${BLUE}🔑 配置SSH密钥认证...${NC}"
SSH_DIR="$HOME/.ssh"
SSH_KEY="$SSH_DIR/id_ed25519"

# 创建SSH目录
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

# 生成SSH密钥（如果不存在）
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${YELLOW}🔐 生成SSH密钥...${NC}"
    ssh-keygen -t ed25519 -C "deploy@${DOMAIN}" -f "$SSH_KEY" -N ""
    chmod 600 "$SSH_KEY"
    chmod 644 "${SSH_KEY}.pub"
    
    echo -e "${GREEN}✅ SSH密钥生成完成${NC}"
    echo -e "${BLUE}📋 请将以下公钥添加到GitHub Deploy Keys:${NC}"
    echo "-------------------------------------------"
    cat "${SSH_KEY}.pub"
    echo "-------------------------------------------"
    echo ""
    echo -e "${YELLOW}步骤:${NC}"
    echo "1. 访问: https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/keys"
    echo "2. 点击 'Add deploy key'"
    echo "3. 标题: ${DOMAIN}-deploy"
    echo "4. 粘贴上方公钥内容"
    echo "5. 不需要勾选 'Allow write access'"
    echo ""
    read -p "完成后按回车继续..."
fi

# 测试SSH连接
echo -e "${BLUE}🔗 测试GitHub SSH连接...${NC}"
ssh-keyscan github.com >> "$SSH_DIR/known_hosts" 2>/dev/null
if ssh -T git@github.com -o StrictHostKeyChecking=no 2>&1 | grep -q "successfully authenticated"; then
    echo -e "${GREEN}✅ GitHub SSH连接正常${NC}"
else
    echo -e "${RED}❌ GitHub SSH连接失败${NC}"
    echo "请检查:"
    echo "1. Deploy Key是否正确添加到GitHub"
    echo "2. 网络是否能访问GitHub"
    echo "3. SSH密钥权限是否正确"
    exit 1
fi

# 3. 创建部署目录
echo -e "${BLUE}📁 准备部署目录...${NC}"
$SUDO mkdir -p "$DEPLOY_DIR"
$SUDO mkdir -p "$BACKUP_DIR"
$SUDO chown "$USER:$USER" "$DEPLOY_DIR"
$SUDO chown "$USER:$USER" "$BACKUP_DIR"

# 4. 备份现有部署（如果存在）
if [ -d "${DEPLOY_DIR}/.git" ]; then
    echo -e "${YELLOW}💾 备份现有部署...${NC}"
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    cp -r "$DEPLOY_DIR" "${BACKUP_DIR}/${BACKUP_NAME}"
    echo -e "${GREEN}✅ 备份完成: ${BACKUP_DIR}/${BACKUP_NAME}${NC}"
fi

# 5. 克隆或更新仓库
if [ -d "${DEPLOY_DIR}/.git" ]; then
    echo -e "${BLUE}🔄 更新现有仓库...${NC}"
    cd "$DEPLOY_DIR"
    
    # 确保远程仓库地址正确
    git remote set-url origin "$GIT_REPO"
    
    # 获取最新代码
    git fetch origin
    git reset --hard origin/main
    git pull origin main
else
    echo -e "${BLUE}📥 克隆仓库...${NC}"
    rm -rf "$DEPLOY_DIR"
    git clone "$GIT_REPO" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

echo -e "${GREEN}✅ 代码更新完成${NC}"
echo "   提交: $(git log --oneline -1)"
echo "   分支: $(git branch --show-current)"

# 6. 检查和创建环境配置
echo -e "${BLUE}🔧 检查环境配置...${NC}"

# 生产环境配置
if [ ! -f ".env.docker.prod" ]; then
    echo -e "${YELLOW}📝 创建生产环境配置...${NC}"
    cat > .env.docker.prod << EOF
# AI教育平台生产环境配置
# 请根据实际情况修改以下配置

# 数据库配置
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=ai_edu_platform
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=aijx2024_SecureDB_$(openssl rand -hex 8)

# Strapi配置
STRAPI_HOST=0.0.0.0
STRAPI_PORT=1337
STRAPI_APP_KEYS=$(openssl rand -hex 16),$(openssl rand -hex 16),$(openssl rand -hex 16),$(openssl rand -hex 16)
STRAPI_API_TOKEN_SALT=$(openssl rand -hex 16)
STRAPI_ADMIN_JWT_SECRET=$(openssl rand -hex 32)
STRAPI_TRANSFER_TOKEN_SALT=$(openssl rand -hex 16)
STRAPI_JWT_SECRET=$(openssl rand -hex 32)
STRAPI_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Next.js配置
NEXT_PUBLIC_STRAPI_URL=https://${DOMAIN}/api
NEXT_PUBLIC_APP_NAME="AI教育平台"
NEXT_PUBLIC_APP_DESCRIPTION="专业的AI教育工具平台"

# 域名配置
VIRTUAL_HOST=${DOMAIN}
LETSENCRYPT_HOST=${DOMAIN}
LETSENCRYPT_EMAIL=admin@${DOMAIN}

# 其他配置
NODE_ENV=production
EOF
    echo -e "${GREEN}✅ 生产环境配置已创建${NC}"
    echo -e "${RED}❗ 请检查并修改 .env.docker.prod 中的配置${NC}"
    echo "   特别是邮箱地址和域名配置"
fi

# 7. 设置文件权限
echo -e "${BLUE}🔐 设置文件权限...${NC}"
find scripts -name "*.sh" -exec chmod +x {} \;
chmod 600 .env.docker.prod

# 8. 启动生产环境
echo -e "${BLUE}🚀 启动生产环境...${NC}"

# 检查是否有生产部署脚本
if [ -f "scripts/prod-deploy.sh" ]; then
    ./scripts/prod-deploy.sh
else
    # 使用docker-compose直接启动
    if [ -f "docker-compose.prod.yml" ]; then
        docker compose -f docker-compose.prod.yml --env-file .env.docker.prod up -d
    else
        echo -e "${RED}❌ 未找到生产环境配置文件${NC}"
        exit 1
    fi
fi

# 9. 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 15

# 10. 健康检查
echo -e "${BLUE}🏥 执行健康检查...${NC}"
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
fi

if curl -sf http://localhost:1337/admin > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务正常${NC}"
else
    echo -e "${RED}❌ 后端服务异常${NC}"
fi

echo -e "\n${GREEN}🎉 Git部署完成！${NC}"
echo "=========================="
echo "📁 部署目录: ${DEPLOY_DIR}"
echo "💾 备份目录: ${BACKUP_DIR}"
echo "🔑 SSH密钥: ${SSH_KEY}"
echo "=========================="

# 显示访问地址
echo -e "\n${BLUE}🌐 访问地址:${NC}"
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "获取失败")
echo "   临时地址: http://${PUBLIC_IP}:3000"
echo "   生产地址: https://${DOMAIN} (需配置SSL)"

# 显示后续操作
echo -e "\n${BLUE}📋 后续操作:${NC}"
echo "   1. 配置SSL证书: cd ${DEPLOY_DIR} && ./scripts/setup-ssl.sh"
echo "   2. 查看服务状态: docker compose -f docker-compose.prod.yml ps"
echo "   3. 查看日志: docker compose -f docker-compose.prod.yml logs -f"
echo "   4. 重新部署: 重新运行此脚本"
echo ""
echo -e "${BLUE}📋 管理命令:${NC}"
echo "   停止服务: docker compose -f docker-compose.prod.yml down"
echo "   重启服务: docker compose -f docker-compose.prod.yml restart"
echo "   更新部署: git pull && docker compose -f docker-compose.prod.yml up -d --build"