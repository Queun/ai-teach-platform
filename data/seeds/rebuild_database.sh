#!/bin/bash
# 数据库重建脚本
# 用于从种子数据重建数据库

set -e

CONTAINER_NAME="ai_edu_postgres_dev"
SEEDS_DIR="data/seeds"

echo "🔄 重建数据库..."

# 删除现有数据库（保留用户）
docker exec $CONTAINER_NAME psql -U strapi -d postgres -c "DROP DATABASE IF EXISTS ai_edu_platform;"
docker exec $CONTAINER_NAME psql -U strapi -d postgres -c "CREATE DATABASE ai_edu_platform;"

# 导入架构
echo "📊 导入数据库架构..."
docker exec -i $CONTAINER_NAME psql -U strapi -d ai_edu_platform < "$SEEDS_DIR/schema.sql"

# 导入系统数据
if [ -f "$SEEDS_DIR/strapi_system_data.sql" ]; then
    echo "🔧 导入Strapi系统数据..."
    docker exec -i $CONTAINER_NAME psql -U strapi -d ai_edu_platform < "$SEEDS_DIR/strapi_system_data.sql"
fi

# 导入内容数据（可选）
if [ -f "$SEEDS_DIR/content_data.sql" ]; then
    echo "📄 导入内容数据..."
    docker exec -i $CONTAINER_NAME psql -U strapi -d ai_edu_platform < "$SEEDS_DIR/content_data.sql"
fi

echo "✅ 数据库重建完成！"
