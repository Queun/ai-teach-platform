#!/bin/bash
# ==========================================
# SSL证书申请和配置脚本
# 使用Let's Encrypt为aijx.online申请免费SSL证书
# ==========================================

set -e

echo "🔐 为aijx.online申请SSL证书..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查域名解析
echo -e "${BLUE}🔍 检查域名解析...${NC}"
if ! nslookup aijx.online | grep -q "$(curl -s ifconfig.me)"; then
    echo -e "${YELLOW}⚠️  警告: 域名可能未正确指向当前服务器IP${NC}"
    echo "当前服务器IP: $(curl -s ifconfig.me)"
    echo "请确保域名DNS记录已正确配置"
    read -p "是否继续? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# 安装certbot (如果未安装)
echo -e "${BLUE}📦 检查Certbot安装状态...${NC}"
if ! command -v certbot &> /dev/null; then
    echo "安装Certbot..."
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        apt update && apt install -y certbot python3-certbot-nginx
    elif [ -f /etc/redhat-release ]; then
        # CentOS/RHEL/阿里云
        yum install -y epel-release
        yum install -y certbot python3-certbot-nginx
    else
        echo -e "${RED}❌ 不支持的系统，请手动安装certbot${NC}"
        exit 1
    fi
fi

# 创建证书目录
mkdir -p /etc/letsencrypt
mkdir -p ./ssl

# 临时启动简单HTTP服务器进行验证
echo -e "${BLUE}🌐 启动临时验证服务器...${NC}"
docker run --rm -d --name certbot-nginx \
  -p 80:80 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  nginx:alpine

# 申请证书
echo -e "${BLUE}🔐 申请SSL证书...${NC}"
certbot certonly \
  --webroot \
  --webroot-path=/usr/share/nginx/html \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  --staging \
  -d aijx.online \
  -d www.aijx.online

# 停止临时服务器
docker stop certbot-nginx

# 如果成功，申请正式证书
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 测试证书申请成功，申请正式证书...${NC}"
    certbot certonly \
      --webroot \
      --webroot-path=/usr/share/nginx/html \
      --email your-email@example.com \
      --agree-tos \
      --no-eff-email \
      --force-renewal \
      -d aijx.online \
      -d www.aijx.online
    
    echo -e "${GREEN}✅ SSL证书申请成功！${NC}"
    echo "证书位置: /etc/letsencrypt/live/aijx.online/"
else
    echo -e "${RED}❌ SSL证书申请失败${NC}"
    exit 1
fi

echo -e "${BLUE}🔄 设置自动续期...${NC}"
# 添加到crontab进行自动续期
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker compose -f /path/to/your/docker-compose.prod.yml restart nginx") | crontab -

echo -e "${GREEN}🎉 SSL配置完成！${NC}"
echo "现在可以启动HTTPS版本的服务了"