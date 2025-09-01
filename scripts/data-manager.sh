#!/bin/bash
# ==========================================
# AI教育平台 - 数据管理快捷脚本
# ==========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo -e "${BLUE}AI教育平台 - 数据管理工具${NC}"
    echo "========================"
    echo "用法: ./scripts/data-manager.sh [命令]"
    echo ""
    echo "命令:"
    echo "  export     导出当前数据库为种子数据"
    echo "  rebuild    从种子数据重建数据库"
    echo "  backup     备份当前数据库"
    echo "  status     显示数据库状态"
    echo "  help       显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./scripts/data-manager.sh export   # 导出种子数据"
    echo "  ./scripts/data-manager.sh rebuild  # 重建数据库"
    echo "  ./scripts/data-manager.sh backup   # 备份数据库"
}

check_container() {
    CONTAINER_NAME="ai_edu_postgres_dev"
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        echo -e "${RED}❌ PostgreSQL容器未运行${NC}"
        echo "请先运行: ./scripts/dev-start.sh"
        exit 1
    fi
}

export_seeds() {
    echo -e "${BLUE}📤 导出种子数据...${NC}"
    ./scripts/database/export-seeds.sh
}

rebuild_database() {
    echo -e "${BLUE}🔄 重建数据库...${NC}"
    if [ ! -f "data/seeds/rebuild_database.sh" ]; then
        echo -e "${RED}❌ 重建脚本不存在，请先运行 export 命令${NC}"
        exit 1
    fi
    ./data/seeds/rebuild_database.sh
}

backup_database() {
    echo -e "${BLUE}💾 备份数据库...${NC}"
    ./scripts/backup-db.sh dev
}

show_status() {
    check_container
    echo -e "${BLUE}📊 数据库状态${NC}"
    echo "========================"
    
    # 容器状态
    echo "🐳 容器状态："
    docker ps --filter "name=ai_edu_postgres_dev" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # 表数量
    echo -e "\n📋 数据库表数量："
    TABLE_COUNT=$(docker exec ai_edu_postgres_dev psql -U strapi -d ai_edu_platform -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    echo "   公共表数量: $TABLE_COUNT"
    
    # 种子文件状态
    echo -e "\n📁 种子数据文件："
    if [ -d "data/seeds" ]; then
        ls -la data/seeds/ | grep -E '\.(sql|sh)$' | awk '{printf "   %s (%s)\n", $9, $5}'
    else
        echo "   种子数据目录不存在"
    fi
    
    # 数据卷信息
    echo -e "\n🗄️  数据卷："
    docker volume ls --filter "name=ai-edu-platform" --format "table {{.Name}}\t{{.Driver}}"
}

# 主逻辑
case "${1:-help}" in
    export)
        check_container
        export_seeds
        ;;
    rebuild)
        check_container
        rebuild_database
        ;;
    backup)
        check_container
        backup_database
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac