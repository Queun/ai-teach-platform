# 数据库批量填充工具使用说明

## 概述

这套工具帮助您快速为爱教学平台的 Strapi 后端填充示例数据，包括：
- 30个 AI 工具数据
- 20个教育资源数据  
- 15个新闻文章数据
- 相关的媒体文件（占位图片）

## 前置条件

1. **确保在 backend 目录下操作**
   ```bash
   cd backend
   ```

2. **Strapi 后端正在运行**
   ```bash
   npm run develop
   ```

3. **获取 API Token**
   - 访问 Strapi 管理面板：http://localhost:1337/admin
   - 进入 Settings > API Tokens
   - 创建新的 API Token，类型选择 "Full access"
   - 复制生成的 Token

4. **安装依赖**
   ```bash
   npm install
   ```

## 使用方法

### ⚠️ 重要：在 backend 目录下执行

确保您当前在 `backend/` 目录下：

```bash
cd backend  # 如果还没有进入 backend 目录
pwd         # 应该显示 ...ai-edu-platform/backend
```

### 方法一：一键完整填充（推荐）

```bash
# 设置 API Token 并执行完整填充
STRAPI_API_TOKEN=your_token_here npm run seed
```

### 方法二：交互式填充

```bash
# 交互式模式，会提示确认
STRAPI_API_TOKEN=your_token_here npm run seed:interactive
```

### 方法三：清除现有数据后重新填充

```bash
# 警告：这会删除现有的所有内容数据
STRAPI_API_TOKEN=your_token_here npm run seed:clear
```

## 分步执行

如果需要分步执行，可以使用以下命令：

### 仅上传媒体文件
```bash
STRAPI_API_TOKEN=your_token_here npm run seed:media
```

### 仅导入数据（跳过媒体）
```bash  
STRAPI_API_TOKEN=your_token_here npm run seed:data
```

## 高级选项

### 使用原始脚本

```bash
# 完整填充
STRAPI_API_TOKEN=your_token_here node scripts/seed-database.js

# 跳过媒体文件上传
STRAPI_API_TOKEN=your_token_here node scripts/seed-database.js --skip-media

# 跳过数据导入
STRAPI_API_TOKEN=your_token_here node scripts/seed-database.js --skip-data

# 清除现有数据
STRAPI_API_TOKEN=your_token_here node scripts/seed-database.js --clear

# 查看帮助
node scripts/seed-database.js --help
```

## 目录结构

```
backend/
├── scripts/                 # 数据填充脚本
│   ├── seed-database.js     # 主脚本
│   ├── upload-media.js      # 媒体上传
│   ├── import-data.js       # 数据导入
│   └── README.md            # 此文档
├── data/                    # 示例数据文件
│   ├── ai-tools.json
│   ├── edu-resources.json
│   ├── news-articles.json
│   └── media-map.json       # (生成的媒体映射)
└── package.json             # 包含种子命令
```

## 数据内容

### AI工具数据 (30个)
包括 ChatGPT、Claude、Midjourney、Canva 等热门 AI 工具，每个工具包含：
- 详细的中文描述和使用指南
- 功能特性、优缺点分析
- 教育应用场景和使用案例
- 定价信息和平台支持
- SEO 优化内容

### 教育资源数据 (20个)  
涵盖多个教学领域的资源，包括：
- AI辅助教学方法
- 学科教学设计（数学、物理、英语等）
- 教学管理和评价
- 创新教学模式（项目化学习、STEAM等）

### 新闻文章数据 (15个)
AI教育领域的热点新闻，包括：
- 技术发展动态
- 政策法规更新  
- 教育创新实践
- 行业趋势分析

## 故障排查

### 常见问题

1. **找不到脚本错误**
   ```bash
   Error: Cannot find module './scripts/seed-database.js'
   ```
   **解决方案**：确保您在 `backend/` 目录下执行命令

2. **API Token 无效**
   - 检查 Token 是否正确复制
   - 确认 Token 类型为 "Full access"
   - 检查 Token 是否已过期

3. **连接失败**
   - 确认 Strapi 服务正在运行
   - 检查端口 1337 是否被占用
   - 验证防火墙设置

4. **权限不足**
   - 确认 API Token 有创建和上传权限
   - 检查内容类型的权限设置

5. **内容类型不存在**
   - 确认已创建 ai-tools、edu-resources、news-articles 内容类型
   - 检查字段名称是否与架构匹配

### 查看详细日志

脚本会在 `data/` 目录下生成以下文件：
- `media-map.json` - 媒体文件映射关系
- `import-results.json` - 详细的导入结果

## Windows 用户注意

如果在 Windows 环境下使用，请使用以下格式：

```cmd
# CMD
cd backend
set STRAPI_API_TOKEN=your_token_here && npm run seed

# PowerShell  
cd backend
$env:STRAPI_API_TOKEN="your_token_here"; npm run seed
```

## 验证结果

填充完成后：

1. 访问 Strapi 管理面板：http://localhost:1337/admin
2. 检查各个内容类型的数据是否正确导入
3. 验证媒体文件是否正确关联
4. 启动前端应用查看显示效果

## 技术细节

- 脚本会自动生成 SVG 格式的占位图片
- 支持媒体文件与内容的自动关联
- 包含完整的错误处理和进度显示
- 数据结构完全匹配 Strapi 内容类型架构

## 获取帮助

如有问题，可以：
1. 查看脚本生成的日志文件
2. 检查 Strapi 后端的控制台输出
3. 使用 `--help` 参数查看详细选项说明