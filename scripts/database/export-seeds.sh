#!/bin/bash
# ==========================================
# 数据库种子数据导出脚本
# 用于将当前数据库的架构和基础数据导出为SQL脚本
# ==========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 开始导出数据库种子数据...${NC}"

# 检查PostgreSQL容器是否运行
CONTAINER_NAME="ai_edu_postgres_dev"
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}❌ PostgreSQL容器 $CONTAINER_NAME 未运行${NC}"
    echo "请先运行: docker compose -f docker-compose.dev.yml up -d postgres"
    exit 1
fi

# 创建导出目录
EXPORT_DIR="data/seeds"
mkdir -p "$EXPORT_DIR"

echo -e "${YELLOW}📊 导出数据库架构...${NC}"
# 导出数据库架构（只有结构，不包含数据）
docker exec $CONTAINER_NAME pg_dump -U strapi -d ai_edu_platform --schema-only --no-privileges --no-owner > "$EXPORT_DIR/schema.sql"

echo -e "${YELLOW}📋 导出Strapi系统数据...${NC}"
# 导出Strapi核心系统表数据（内容类型、权限、用户等）
STRAPI_TABLES=(
    "strapi_core_store_settings"
    "strapi_database_schema" 
    "strapi_migrations"
    "strapi_api_tokens"
    "admin_permissions"
    "admin_roles"
    "admin_users"
    "admin_users_roles_links"
    "up_permissions"
    "up_roles"
    "up_users"
    "up_users_role_links"
)

for table in "${STRAPI_TABLES[@]}"; do
    if docker exec $CONTAINER_NAME psql -U strapi -d ai_edu_platform -t -c "SELECT to_regclass('$table')" | grep -q "$table"; then
        echo "  导出表: $table"
        docker exec $CONTAINER_NAME pg_dump -U strapi -d ai_edu_platform --data-only --table="$table" >> "$EXPORT_DIR/strapi_system_data.sql"
    else
        echo "  跳过不存在的表: $table"
    fi
done

echo -e "${YELLOW}📄 导出内容数据...${NC}"
# 导出业务内容数据（可选择性导出）
CONTENT_TABLES=(
    "tools"
    "resources" 
    "news"
    "categories"
    "tags"
)

# 创建内容数据SQL文件
echo "-- 内容数据种子脚本" > "$EXPORT_DIR/content_data.sql"
echo "-- 生成时间: $(date)" >> "$EXPORT_DIR/content_data.sql"
echo "" >> "$EXPORT_DIR/content_data.sql"

for table in "${CONTENT_TABLES[@]}"; do
    if docker exec $CONTAINER_NAME psql -U strapi -d ai_edu_platform -t -c "SELECT to_regclass('$table')" | grep -q "$table"; then
        echo "  导出内容表: $table"
        echo "-- 数据表: $table" >> "$EXPORT_DIR/content_data.sql"
        docker exec $CONTAINER_NAME pg_dump -U strapi -d ai_edu_platform --data-only --table="$table" >> "$EXPORT_DIR/content_data.sql"
        echo "" >> "$EXPORT_DIR/content_data.sql"
    else
        echo "  跳过不存在的内容表: $table"
    fi
done

# 生成完整的数据库导出（用于备份）
echo -e "${YELLOW}💾 生成完整数据库备份...${NC}"
BACKUP_FILE="$EXPORT_DIR/full_backup_$(date +%Y%m%d_%H%M%S).sql"
docker exec $CONTAINER_NAME pg_dump -U strapi -d ai_edu_platform > "$BACKUP_FILE"

# 创建数据库重建脚本
echo -e "${YELLOW}🔧 生成数据库重建脚本...${NC}"
cat > "$EXPORT_DIR/rebuild_database.sh" << 'EOF'
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
EOF

chmod +x "$EXPORT_DIR/rebuild_database.sh"

echo -e "${GREEN}✅ 数据导出完成！${NC}"
echo "========================"
echo "📁 导出文件位置："
echo "   - 数据库架构: $EXPORT_DIR/schema.sql"
echo "   - 系统数据: $EXPORT_DIR/strapi_system_data.sql"  
echo "   - 内容数据: $EXPORT_DIR/content_data.sql"
echo "   - 完整备份: $BACKUP_FILE"
echo "   - 重建脚本: $EXPORT_DIR/rebuild_database.sh"
echo ""
echo -e "${BLUE}💡 使用方法：${NC}"
echo "   - 重建数据库: ./$EXPORT_DIR/rebuild_database.sh"
echo "   - 恢复完整备份: docker exec -i $CONTAINER_NAME psql -U strapi -d ai_edu_platform < $BACKUP_FILE"