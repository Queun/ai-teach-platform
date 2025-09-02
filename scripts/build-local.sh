#!/bin/bash

# ==========================================
# AI教育平台 - 本地构建脚本
# 构建Docker镜像并导出用于服务器部署
# ==========================================

set -e

echo "🚀 AI教育平台本地构建开始"
echo "================================"

# 检查是否在项目根目录
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ 错误：Docker未运行，请先启动Docker"
    exit 1
fi

echo "🔨 步骤1: 构建后端镜像..."
docker build -t ai-edu-backend:latest ./backend

echo "🔨 步骤2: 构建前端镜像..."
docker build -t ai-edu-frontend:latest .

echo "📦 步骤3: 导出后端镜像..."
docker save ai-edu-backend:latest | gzip > ai-edu-backend.tar.gz

echo "📦 步骤4: 导出前端镜像..."
docker save ai-edu-frontend:latest | gzip > ai-edu-frontend.tar.gz

echo "📊 步骤5: 生成构建信息..."
cat > build-info.txt << EOF
AI教育平台构建信息
==================

构建时间: $(date)
Git提交: $(git rev-parse HEAD 2>/dev/null || echo "unknown")

镜像文件:
- 后端镜像: ai-edu-backend.tar.gz ($(ls -lh ai-edu-backend.tar.gz | awk '{print $5}'))
- 前端镜像: ai-edu-frontend.tar.gz ($(ls -lh ai-edu-frontend.tar.gz | awk '{print $5}'))

服务器部署步骤:
1. 上传镜像文件到服务器
2. 运行: chmod +x scripts/deploy-server.sh
3. 运行: ./scripts/deploy-server.sh

访问地址:
- 前端: http://your-server:3000
- 后端API: http://your-server:1337
- 管理面板: http://your-server:1337/admin
EOF

echo ""
echo "✅ 构建完成！"
echo "📋 构建信息已保存到 build-info.txt"
echo ""
echo "📦 生成的文件:"
echo "  - ai-edu-backend.tar.gz"
echo "  - ai-edu-frontend.tar.gz"
echo "  - build-info.txt"
echo ""
echo "🚀 下一步:"
echo "  1. 将镜像文件上传到服务器"
echo "  2. 在服务器上运行 scripts/deploy-server.sh"