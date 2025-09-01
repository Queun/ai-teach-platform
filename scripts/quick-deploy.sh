#!/bin/bash
# ==========================================
# AI教育平台一键部署脚本
# 简化版 - 适用于 aijx.online
# ==========================================

set -e

echo "🚀 AI教育平台一键部署"
echo "==================="
echo "目标服务器: aijx.online (阿里云 2核2GB)"
echo ""

# 下载并运行主部署脚本
echo "📥 下载最新部署脚本..."
curl -fsSL https://raw.githubusercontent.com/Queun/ai-edu-platform/main/scripts/secure-git-deploy.sh -o /tmp/deploy.sh
chmod +x /tmp/deploy.sh

echo "🔐 启动安全Git部署..."
/tmp/deploy.sh

# 清理临时文件
rm -f /tmp/deploy.sh

echo ""
echo "🎉 一键部署完成！"
echo "📋 后续操作："
echo "   1. 配置SSL: cd /opt/ai-edu-platform && ./scripts/setup-ssl.sh"
echo "   2. 访问网站: https://aijx.online"