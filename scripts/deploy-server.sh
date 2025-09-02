#!/bin/bash

# ==========================================
# AI教育平台 - 服务器部署脚本
# 加载预构建镜像并启动服务
# ==========================================

set -e

# 检测并设置正确的 docker compose 命令
if command -v docker-compose > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ 错误：未找到 docker-compose 或 docker compose 命令"
    exit 1
fi

echo "🚀 AI教育平台服务器部署开始"
echo "================================"
echo "ℹ️  使用命令: $DOCKER_COMPOSE"

# 配置变量
BACKEND_IMAGE="ai-edu-backend.tar.gz"
FRONTEND_IMAGE="ai-edu-frontend.tar.gz"
BACKUP_FILE="manual_backup_20250901_103241.sql"

# 检查必要文件
echo "🔍 检查必要文件..."

if [ ! -f "$BACKEND_IMAGE" ]; then
    echo "❌ 错误：未找到后端镜像文件 $BACKEND_IMAGE"
    echo "请先上传镜像文件到服务器"
    exit 1
fi

if [ ! -f "$FRONTEND_IMAGE" ]; then
    echo "❌ 错误：未找到前端镜像文件 $FRONTEND_IMAGE"
    echo "请先上传镜像文件到服务器"
    exit 1
fi

if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ 错误：未找到 docker-compose.prod.yml"
    exit 1
fi

if [ ! -f ".env.production" ]; then
    echo "⚠️  警告：未找到 .env.production 文件"
    echo "请确保已设置环境变量或创建 .env 文件"
fi

# 加载镜像
echo "📥 步骤1: 加载Docker镜像..."
docker load < "$BACKEND_IMAGE"
docker load < "$FRONTEND_IMAGE"

echo "🛑 步骤2: 停止旧服务（如存在）..."
$DOCKER_COMPOSE -f docker-compose.prod.yml down || true

echo "🗄️ 步骤3: 启动PostgreSQL数据库..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d postgres

echo "⏳ 步骤4: 等待数据库就绪..."
timeout=60
while [ $timeout -gt 0 ]; do
    if docker exec ai_edu_postgres_prod pg_isready -U strapi -d ai_edu_platform > /dev/null 2>&1; then
        echo "✅ 数据库已就绪"
        break
    fi
    echo "⏳ 等待数据库启动... (剩余 $timeout 秒)"
    sleep 2
    timeout=$((timeout-2))
done

if [ $timeout -le 0 ]; then
    echo "❌ 数据库启动超时"
    exit 1
fi

# 可选：恢复数据库备份
if [ -f "$BACKUP_FILE" ]; then
    echo "📊 步骤5: 恢复数据库备份..."
    
    # 复制备份文件到容器
    docker cp "$BACKUP_FILE" ai_edu_postgres_prod:/backups/
    
    # 恢复数据库
    docker exec -i ai_edu_postgres_prod psql -U strapi -d ai_edu_platform -f "/backups/$BACKUP_FILE"
    
    echo "✅ 数据库备份恢复完成"
else
    echo "ℹ️  跳过数据库备份恢复（未找到 $BACKUP_FILE）"
fi

echo "🚀 步骤6: 启动后端服务..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d backend

echo "⏳ 等待后端服务启动..."
sleep 15

# 检查后端服务
if docker ps | grep -q "ai_edu_backend_prod"; then
    echo "✅ 后端服务启动成功"
else
    echo "❌ 后端服务启动失败，查看日志:"
    docker logs ai_edu_backend_prod --tail 20
    exit 1
fi

echo "🌐 步骤7: 启动前端服务..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d frontend

echo "⏳ 等待前端服务启动..."
sleep 10

# 检查前端服务
if docker ps | grep -q "ai_edu_frontend_prod"; then
    echo "✅ 前端服务启动成功"
else
    echo "❌ 前端服务启动失败，查看日志:"
    docker logs ai_edu_frontend_prod --tail 20
fi

echo ""
echo "🎉 部署完成！"
echo "================================"
echo "📊 服务状态："
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

echo ""
echo "🌐 访问地址："
echo "  - 前端网站: http://$(hostname -I | awk '{print $1}'):3000"
echo "  - 后端API: http://$(hostname -I | awk '{print $1}'):1337"
echo "  - 管理面板: http://$(hostname -I | awk '{print $1}'):1337/admin"

echo ""
echo "🔧 常用命令："
echo "  查看日志: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f [service]"
echo "  重启服务: $DOCKER_COMPOSE -f docker-compose.prod.yml restart [service]"
echo "  停止服务: $DOCKER_COMPOSE -f docker-compose.prod.yml down"
echo "  查看状态: $DOCKER_COMPOSE -f docker-compose.prod.yml ps"