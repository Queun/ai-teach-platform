#!/bin/bash
# ==========================================
# AI教育平台 - 开发环境日志查看脚本
# ==========================================

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}📋 AI教育平台开发环境日志${NC}"

# 如果提供了服务名参数，只显示该服务的日志
if [ $# -gt 0 ]; then
    echo -e "${BLUE}🔍 显示 $1 服务日志...${NC}"
    docker compose -f docker-compose.dev.yml logs -f $1
else
    # 显示所有服务的日志
    echo -e "${BLUE}🔍 显示所有服务日志...${NC}"
    echo "提示: 使用 Ctrl+C 退出日志查看"
    docker compose -f docker-compose.dev.yml logs -f
fi