# 🚀 远程部署指南

## 三种部署方式对比

### 方式一：Git克隆部署 ⭐推荐
- **优点**：包含完整配置，灵活性高，版本控制清晰
- **缺点**：首次部署需要构建镜像（约10-15分钟）
- **适用场景**：开发测试、需要频繁修改配置

### 方式二：Docker Hub镜像部署
- **优点**：部署速度极快（2-3分钟），镜像预构建
- **缺点**：需要单独管理配置文件，依赖镜像仓库
- **适用场景**：生产环境、稳定版本部署

### 方式三：混合部署 ⭐⭐推荐
- **优点**：结合前两者优点，配置完整且部署快速
- **缺点**：需要维护两个流程
- **适用场景**：生产环境的最佳选择

## 🔄 完整部署流程

### 步骤1：准备GitHub仓库
```bash
# 本地推送代码到GitHub
git add .
git commit -m "准备生产环境部署配置"
git push origin main
```

### 步骤2：设置Docker Hub（如果选择方式2或3）
```bash
# 本地构建并推送镜像
# 1. 登录Docker Hub
docker login

# 2. 编辑构建脚本中的用户名
nano scripts/build-and-push.sh
# 修改: DOCKER_USERNAME="yourusername" 为你的用户名

# 3. 构建并推送
./scripts/build-and-push.sh
```

### 步骤3：服务器部署
```bash
# 在服务器上执行一键部署
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ai-edu-platform/main/scripts/server-deploy.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh
```

## 📋 部署前检查清单

### GitHub配置
- [ ] 代码已推送到main分支
- [ ] 仓库地址已更新到脚本中
- [ ] GitHub Actions secrets已配置（如使用自动构建）

### Docker Hub配置（如需要）
- [ ] Docker Hub账号已创建
- [ ] 本地已登录Docker Hub
- [ ] 镜像构建脚本中用户名已修改

### 服务器准备
- [ ] 域名DNS已指向服务器IP
- [ ] 服务器防火墙已开放必要端口（80, 443, 3000, 1337）
- [ ] 服务器已安装Docker和Git

### 环境配置
- [ ] .env.docker.prod文件已准备
- [ ] 数据库密码已设置强密码
- [ ] Strapi密钥已生成随机值

## 🔧 部署后配置

### 1. SSL证书配置
```bash
cd /opt/ai-edu-platform
./scripts/setup-ssl.sh
```

### 2. Strapi初始化
1. 访问 `https://aijx.online/admin`
2. 创建管理员账户
3. 生成API Tokens：
   - Settings → API Tokens → Create new API Token
   - 复制Token到环境变量

### 3. 服务管理命令
```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 重启服务
docker compose restart

# 更新部署
git pull && docker compose up -d --build
```

## 🚨 常见问题解决

### 1. 镜像构建失败
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建
docker compose build --no-cache
```

### 2. 内存不足
```bash
# 监控资源使用
docker stats

# 清理未使用资源
docker system prune -f
```

### 3. SSL证书申请失败
```bash
# 检查域名解析
nslookup aijx.online

# 检查防火墙
sudo ufw status

# 手动申请证书
certbot certonly --manual -d aijx.online
```

## 📊 推荐的部署策略

**针对你的情况（2核2G阿里云轻量服务器）：**

1. **首次部署**：使用方式一（Git克隆）进行完整部署
2. **日常更新**：使用方式三（混合部署）快速更新
3. **紧急修复**：直接在服务器上git pull更新

**建议的工作流程：**
```bash
# 开发 → 测试 → 推送GitHub → 自动构建镜像 → 服务器部署
git push origin main
# GitHub Actions自动构建镜像
# 服务器执行更新
```

选择哪种方式？我推荐从**方式一**开始，等稳定后再切换到**方式三**！