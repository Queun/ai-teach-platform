# AI教育平台部署指南

## 🎯 最终方案：Git安全部署

经过优化，我们使用**Git安全部署**方案，提供最佳的安全性和便利性平衡。

### 为什么选择Git部署？

1. **🔐 安全性**：SSH密钥认证，零token暴露风险
2. **📁 完整性**：代码、配置、脚本统一管理
3. **🛠️ 灵活性**：服务器端可直接调试修改
4. **💰 成本效益**：私有仓库免费，无额外费用
5. **🔄 简单更新**：git pull即可更新部署

## 🚀 超简单部署

### 方式一：终极一键部署（推荐）

在服务器上运行这一个命令即可：

```bash
curl -fsSL https://raw.githubusercontent.com/Queun/ai-teach-platform/main/scripts/quick-deploy.sh | bash
```

### 方式二：直接运行主脚本

```bash
curl -fsSL https://raw.githubusercontent.com/Queun/ai-teach-platform/main/scripts/secure-git-deploy.sh | bash
```

### 方式三：手动部署

```bash
git clone git@github.com:Queun/ai-teach-platform.git /opt/ai-edu-platform
cd /opt/ai-edu-platform
./scripts/secure-git-deploy.sh
```

### 📁 简化的脚本结构

经过清理，scripts目录现在包含：

**🚀 部署脚本**
- `quick-deploy.sh` - 终极一键部署（推荐使用）
- `secure-git-deploy.sh` - 主要的安全Git部署脚本
- `setup-ssl.sh` - SSL证书自动配置

**⚙️ 生产管理**
- `prod-deploy.sh` - 生产环境启动脚本
- `backup-db.sh` - 数据库备份工具

**🔧 开发工具**
- `dev-start.sh` - 开发环境启动
- `dev-stop.sh` - 开发环境停止
- `dev-logs.sh` - 开发日志查看
- `data-manager.sh` - 数据管理工具

**📊 数据脚本**
- 各种.js文件 - 数据库维护和统计脚本

### 服务器要求

- **操作系统**：Ubuntu 20.04 LTS 或更新版本
- **配置**：最低 2核2GB（推荐 2核4GB）
- **域名**：已解析到服务器IP（如：aijx.online）
- **端口**：开放 80、443、22 端口

### GitHub仓库设置

1. **确保仓库是私有的**（保护代码安全）
2. **准备Deploy Key**：
   - 脚本会自动生成SSH密钥
   - 按提示将公钥添加到GitHub Deploy Keys
   - 位置：`https://github.com/Queun/ai-teach-platform/settings/keys`

## 🔧 部署流程详解

### 自动化步骤

部署脚本会自动完成以下操作：

1. **环境检查和安装**
   - 安装Docker和Docker Compose
   - 安装Git和其他必要工具
   - 配置防火墙规则

2. **SSH密钥配置**
   - 自动生成ED25519密钥
   - 显示公钥供你添加到GitHub
   - 测试GitHub连接

3. **代码部署**
   - 克隆或更新仓库代码
   - 创建备份（如果是更新部署）
   - 设置正确的文件权限

4. **环境配置**
   - 自动生成安全的`.env.docker.prod`配置
   - 创建随机密码和密钥
   - 配置域名和SSL设置

5. **服务启动**
   - 使用Docker Compose启动所有服务
   - 执行健康检查
   - 显示访问地址

### 手动确认步骤

部署过程中需要你手动确认的步骤：

1. **添加Deploy Key到GitHub**（一次性设置）
2. **确认环境配置**（可选修改）
3. **等待服务启动**（约30-60秒）

## 🔐 SSL证书配置

部署完成后，运行以下命令配置SSL：

```bash
cd /opt/ai-edu-platform
./scripts/setup-ssl.sh
```

## 📊 服务管理

### 查看服务状态
```bash
cd /opt/ai-edu-platform
docker compose -f docker-compose.prod.yml ps
```

### 查看日志
```bash
# 查看所有服务日志
docker compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f backend
```

### 重启服务
```bash
docker compose -f docker-compose.prod.yml restart
```

### 停止服务
```bash
docker compose -f docker-compose.prod.yml down
```

### 更新部署
```bash
cd /opt/ai-edu-platform
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## 🌐 访问地址

部署完成后的访问地址：

- **生产地址**：https://aijx.online
- **管理后台**：https://aijx.online/admin
- **临时地址**：http://YOUR_SERVER_IP:3000

## 🔧 故障排除

### 常见问题

1. **GitHub SSH连接失败**
   - 检查Deploy Key是否正确添加
   - 确认SSH密钥权限：`chmod 600 ~/.ssh/id_ed25519`
   - 测试连接：`ssh -T git@github.com`

2. **Docker权限问题**
   - 重新登录服务器：`exit` 然后重新SSH登录
   - 或者将用户加入docker组：`sudo usermod -aG docker $USER`

3. **端口被占用**
   - 检查端口占用：`sudo netstat -tlnp | grep :80`
   - 停止冲突服务：`sudo systemctl stop apache2` 或 `sudo systemctl stop nginx`

4. **域名解析问题**
   - 检查DNS解析：`nslookup aijx.online`
   - 确认域名已指向服务器IP

### 日志位置

- **应用日志**：`docker compose logs`
- **Nginx日志**：容器内 `/var/log/nginx/`
- **系统日志**：`/var/log/syslog`

## 📋 配置文件说明

### .env.docker.prod

生产环境的核心配置文件，包含：
- 数据库连接信息
- Strapi安全密钥
- 域名和SSL配置
- Next.js环境变量

**注意**：此文件包含敏感信息，权限设置为600。

### docker-compose.prod.yml

生产环境的服务编排文件，针对2GB服务器优化：
- 资源限制配置
- 健康检查设置
- 数据卷持久化
- 网络配置

## 🎉 部署成功

部署成功后，你将看到：

- ✅ 所有服务正常运行
- 🌐 网站可以正常访问
- 🔐 HTTPS证书自动配置
- 📊 管理后台可以登录

恭喜！你的AI教育平台已成功部署！