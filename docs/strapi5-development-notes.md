# 🚀 Strapi 5 开发注意事项

## 📖 概述

本文档记录了在使用 Strapi 5.23.0 开发过程中遇到的关键问题和解决方案，帮助避免常见陷阱。

---

## ⚠️ 关键发现

### 1. 媒体字段数据结构变化 ✅ FIXED

**问题**: Strapi 5 中媒体字段的数据结构与预期不同

**错误认知**:
```typescript
// ❌ 以为数据结构是这样的
item.attributes.logo.data.attributes.url
item.attributes.screenshots.data[0].attributes.url
```

**实际结构**:
```typescript
// ✅ 实际数据结构是这样的
item.logo.url
item.screenshots[0].url
```

**解决方案**: 在使用 `populate: '*'` 时，媒体字段直接在根级别，无需深度嵌套访问。

**修复状态**: ✅ 已修复所有页面的媒体字段访问 (2024-08-26)
- tools页面列表和详情页面
- news页面列表和详情页面  
- resources页面列表和详情页面

### 2. 中文枚举字段兼容性

**问题**: Strapi 5 不支持纯中文的枚举字段值

**解决方案**: 
- 将所有枚举字段改为 `Text` 类型
- 在前端进行值的验证和约束
- 保持更大的灵活性

**字段类型变更**:
```yaml
# 变更前
category: enumeration(['人工智能', '机器学习'])

# 变更后  
category: text
```

### 3. Strapi 保留字段冲突

**问题**: 某些字段名与 Strapi 内置字段冲突

**冲突字段**:
- `status` → 改为 `currentStatus`
- `publishedAt` → 改为 `publishDate`
- `createdAt`, `updatedAt` → 系统自动管理

### 4. API populate 参数配置

**关键发现**: 
- 初期遇到 `400 Bad Request - Invalid populate keys` 错误
- 重启 Strapi 服务后，`populate: '*'` 参数生效
- 建议在开发阶段使用 `populate: '*'` 获取所有关联数据

**最佳实践**:
```typescript
// 开发阶段
populate: '*'

// 生产环境优化
populate: ['logo', 'screenshots', 'coverImage']
```

### 5. ⚠️ CRITICAL: documentId vs id 的区别

**重大发现**: Strapi 5 引入了 `documentId` 概念，用于 API 访问的唯一标识符

**数据结构**:
```json
{
  "data": {
    "id": 10,                           // 内部数据库ID (数字)
    "documentId": "dnvb6f24y33blyzxw4qmkgrj",  // API访问ID (字符串)
    "name": "AI工具名称",
    // ... 其他字段
  }
}
```

**API 端点访问**:
```typescript
// ❌ 错误 - 使用数字ID会返回404
GET /api/ai-tools/10

// ✅ 正确 - 使用documentId访问成功
GET /api/ai-tools/dnvb6f24y33blyzxw4qmkgrj
```

**前端链接生成**:
```typescript
// ❌ 错误方式 - 会导致详情页面404
<Link href={`/tools/${tool.id}`}>查看详情</Link>

// ✅ 正确方式 - 优先使用documentId
<Link href={`/tools/${tool.documentId || tool.id}`}>查看详情</Link>
```

**影响范围**: 
- 所有详情页面路由 (`/tools/[id]`, `/resources/[id]`, `/news/[id]`)
- 列表页面中的链接生成
- API获取单个资源的请求

**修复检查列表**:
- [ ] 工具列表页面 (`/app/tools/page.tsx`)
- [ ] 资源列表页面 (`/app/resources/page.tsx`) 
- [ ] 新闻列表页面 (`/app/news/page.tsx`)
- [ ] 主页链接 (`/app/page.tsx`)
- [ ] 详情页面中的相关项目链接

---

## 🛠️ 开发工作流程

### 1. 字段定义最佳实践

**推荐字段配置**:
```yaml
# 媒体字段
logo: media (single)
screenshots: media (multiple)
coverImage: media (single)

# 文本字段 (替代枚举)
category: text
difficulty: text
status: text (避免使用 status，改用 currentStatus)

# 布尔字段
isFeatured: boolean
isRecommended: boolean

# 时间字段
publishDate: datetime (避免使用 publishedAt)
```

### 2. 权限配置步骤

1. **Public 权限快速测试**:
   ```
   Settings → Roles & Permissions → Public
   勾选所有内容类型的 find 和 findOne
   ```

2. **API Token 生产配置**:
   ```
   Settings → API Tokens → Create new API Token
   Type: Read-only
   Duration: Unlimited
   ```

### 3. 前端集成注意事项

**媒体 URL 构建**:
```typescript
// ✅ 正确方式
const imageUrl = `http://localhost:1337${item.logo?.url}`;

// ❌ 错误方式  
const imageUrl = `http://localhost:1337${item.attributes?.logo?.data?.attributes?.url}`;
```

**类型定义更新**:
```typescript
export interface AITool {
  id: number;
  name: string;
  description: string;
  // 媒体字段直接在根级别
  logo?: {
    id: number;
    name: string;
    url: string;
    // ... 其他属性
  };
  screenshots?: Array<{
    id: number;
    name: string; 
    url: string;
  }>;
}
```

---

## 🐛 常见错误排查

### 错误 1: 400 Bad Request - Invalid populate keys

**原因**: populate 参数中的字段名与实际内容类型不匹配，或服务未重启

**解决方案**:
1. 检查字段名是否正确
2. 重启 Strapi 服务
3. 临时使用 `populate: '*'` 进行测试

### 错误 2: 媒体资源无法显示

**排查步骤**:
1. 确认媒体文件已成功上传
2. 检查 API 响应中是否包含媒体字段
3. 验证媒体字段的数据结构
4. 确保 URL 构建正确

**调试代码**:
```typescript
// 临时调试代码
console.log('Media debug:', {
  hasLogo: !!item.logo,
  logoUrl: item.logo?.url,
  hasScreenshots: !!item.screenshots,
  screenshotsCount: item.screenshots?.length
});
```

### 错误 3: CORS 跨域问题

**解决方案**: 检查 Strapi 的 `config/middlewares.ts` 配置

### 错误 4: 详情页面返回 404 Not Found

**症状**: 从列表页面点击"查看详情"时，详情页面显示 "Not Found" 错误

**根本原因**: 使用了数字 `id` 而不是 `documentId` 来访问 API

**错误示例**:
```javascript
// Console Error:
// Error: Not Found  
// lib\strapi.ts (55:15) @ StrapiService.request

// API请求: GET /api/ai-tools/10 → 404 Not Found
// 应该是: GET /api/ai-tools/dnvb6f24y33blyzxw4qmkgrj → 200 OK
```

**解决步骤**:
1. 检查列表页面的链接生成代码
2. 确保使用 `item.documentId || item.id` 而不是 `item.id`
3. 验证API token是否正确配置
4. 测试API端点直接访问

**快速验证**:
```bash
# 测试数字ID (会失败)
curl -X GET "http://localhost:1337/api/ai-tools/10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 测试documentId (会成功)  
curl -X GET "http://localhost:1337/api/ai-tools/dnvb6f24y33blyzxw4qmkgrj" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 开发清单

### Strapi 后端配置
- [ ] 内容类型字段定义（避免保留字段）
- [ ] 使用 Text 类型替代中文枚举
- [ ] 配置 Public 权限或 API Token
- [ ] 上传测试媒体文件
- [ ] 验证 API 端点可访问

### 前端集成
- [ ] 更新 TypeScript 类型定义
- [ ] 正确访问媒体字段（根级别）
- [ ] 配置环境变量（API URL 和 Token）
- [ ] 实现错误处理和加载状态
- [ ] 测试所有内容类型的数据获取

### 测试验证
- [ ] API 端点直接访问测试
- [ ] 前端测试页面显示正常
- [ ] 媒体资源正确加载
- [ ] 错误状态正确处理

---

## 🎯 最佳实践总结

1. **先配置 Public 权限进行快速测试**，确保 API 连通后再配置 Token
2. **避免使用 Strapi 保留字段名**，提前检查字段冲突
3. **中文内容使用 Text 类型**，避免枚举类型的兼容性问题  
4. **媒体字段访问使用根级别路径**，不要假设嵌套结构
5. **开发阶段使用 `populate: '*'`**，生产环境再优化具体字段
6. **⭐ 始终使用 `documentId` 而不是 `id` 进行API访问**，这是Strapi 5的重要变化
7. **在链接生成时使用 `item.documentId || item.id`**，确保向后兼容
8. **遇到404错误时首先检查是否使用了正确的ID类型**
9. **遇到问题时重启 Strapi 服务**，很多配置需要重启生效

---

**记录时间**: 2025-08-26 (最后更新: documentId 重大发现)  
**Strapi 版本**: 5.23.0  
**Next.js 版本**: 15.2.4

## 📝 更新日志

### 2025-08-26 晚间更新
- ⚠️ **CRITICAL**: 发现并记录了 Strapi 5 中 `documentId` vs `id` 的重要区别
- 修复了所有页面中使用数字ID导致的404错误问题
- 完成了详情页面链接的全面修复
- 更新了错误排查指南和最佳实践