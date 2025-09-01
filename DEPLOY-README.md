# 🚀 AI教育平台 - 简化部署指南

## 一键部署命令

在你的服务器上运行：

```bash
curl -fsSL https://raw.githubusercontent.com/Queun/ai-edu-platform/main/scripts/quick-deploy.sh | bash
```

就这么简单！🎉

## 📋 清理后的脚本说明

### 🎯 核心部署脚本
- **`quick-deploy.sh`** - 终极一键部署（服务器管理员使用）
- **`secure-git-deploy.sh`** - 主要部署逻辑（自动SSH配置）
- **`setup-ssl.sh`** - SSL证书配置

### 🗑️ 已删除的重复脚本
- ~~`deploy-setup.sh`~~ - 被secure-git-deploy.sh替代
- ~~`git-deploy.sh`~~ - 老版本，有安全隐患
- ~~`server-deploy.sh`~~ - 过于复杂的多选择版本
- ~~`docker-hub-deploy.sh`~~ - 决定使用Git部署
- ~~`one-click-deploy.sh`~~ - 不完整的模板
- ~~`build-and-push.sh`~~ - Docker Hub相关，不需要

## 🔄 更新部署

在服务器上运行：
```bash
cd /opt/ai-edu-platform
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## 📞 技术支持

如有问题，请查阅 `docs/deployment-guide.md` 获取详细说明。