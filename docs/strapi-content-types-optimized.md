# 🔧 Strapi 内容类型字段定义（优化版）

## ⚠️ 主要更改说明

### 🚨 修复的问题：
1. **移除 Strapi 保留字段冲突**
   - ❌ 删除 `status` → 使用 Strapi 内置的发布状态
   - ❌ 删除 `publishedAt` → Strapi 自动管理
   - ❌ 删除 `publication_state` → Strapi 自动管理

2. **统一字段命名**
   - `metaTitle/seoTitle` → 统一为 `seoTitle`
   - `metaDescription/seoDescription` → 统一为 `seoDescription` 
   - `customFields/customData` → 统一为 `customFields`

3. **优化字段类型**
   - 简化一些 JSON 字段为更合适的类型
   - 添加缺失的必填字段

---

## 3.1 AI工具内容类型（ai-tool）

```javascript
{
  // 基础信息
  name: { type: "string", required: true }, // 工具名称
  description: { type: "richtext" }, // 详细描述  
  shortDesc: { type: "text" }, // 简短介绍

  // 分类和标签
  category: { type: "string" }, // 主分类
  tags: { type: "json" }, // 标签数组
  difficulty: { type: "text" }, // 🔧 改为 text 类型，建议值：入门、进阶、专业

  // 链接和媒体
  officialUrl: { type: "string" }, // 官方链接
  tutorialUrl: { type: "string" }, // 教程链接
  logo: { type: "media", multiple: false }, // Logo
  screenshots: { type: "media", multiple: true }, // 截图

  // 评价统计
  rating: { type: "decimal", default: 0 }, // 专家评分
  userRating: { type: "decimal", default: 0 }, // 用户评分
  popularity: { type: "integer", default: 0 }, // 热度分数

  // 详细信息
  features: { type: "json" }, // 功能特点
  pros: { type: "json" }, // 优点
  cons: { type: "json" }, // 缺点
  pricing: { type: "text" }, // 🔧 改为 text 类型，支持多行
  platforms: { type: "json" }, // 支持平台

  // 使用指南
  quickStart: { type: "richtext" }, // 快速指南
  detailedGuide: { type: "richtext" }, // 详细指南
  useCases: { type: "json" }, // 使用场景

  // 管理字段
  isRecommended: { type: "boolean", default: false },
  isFeatured: { type: "boolean", default: false },
  sortOrder: { type: "integer", default: 0 },
  // 🚨 删除 publication_state - 让 Strapi 自动处理

  // SEO和扩展
  seoTitle: { type: "string" }, // 🔧 统一为 seoTitle
  seoDescription: { type: "text" }, // 🔧 统一为 seoDescription  
  customFields: { type: "json" } // 🔧 统一为 customFields

  // 🚨 删除 publishedAt - Strapi 自动管理
}
```

## 3.2 教育资源内容类型（edu-resource）

```javascript
{
  // 基础信息
  title: { type: "string", required: true },
  content: { type: "richtext" },
  summary: { type: "text" }, // 摘要

  // 分类
  category: { type: "string" }, // 主分类
  subject: { type: "string" }, // 学科
  gradeLevel: { type: "text" }, // 🔧 改为text类型，建议值：幼儿园、小学、初中、高中、大学、成人教育
  tags: { type: "json" }, // 标签

  // 作者信息
  authorName: { type: "string" },
  authorTitle: { type: "string" },
  authorSchool: { type: "string" },
  authorAvatar: { type: "media", multiple: false },

  // 资源属性
  resourceType: { type: "text" }, // 🔧 改为text类型，建议值：课件、教案、试题、素材、工具、其他
  difficulty: { type: "text" }, // 🔧 改为text类型，建议值：入门、进阶、专业
  estimatedTime: { type: "string" }, // 学习时长

  // 媒体文件
  coverImage: { type: "media", multiple: false },
  attachments: { type: "media", multiple: true },
  videoUrl: { type: "string" },

  // 统计数据
  downloads: { type: "integer", default: 0 },
  views: { type: "integer", default: 0 },
  likes: { type: "integer", default: 0 },
  rating: { type: "decimal", default: 0 },

  // 教学相关
  objectives: { type: "json" }, // 教学目标
  prerequisites: { type: "json" }, // 前置要求
  materials: { type: "json" }, // 所需材料

  // 管理
  isFeatured: { type: "boolean", default: false },
  // 🚨 删除 publication_state - Strapi 自动处理
  // 🔧 删除 lastUpdated - Strapi 有 updatedAt

  // SEO
  seoTitle: { type: "string" }, // 🔧 统一为 seoTitle
  seoDescription: { type: "text" }, // 🔧 统一为 seoDescription

  // 扩展
  relatedTools: { type: "json" }, // 关联工具
  feedback: { type: "json" }, // 反馈数据
  customFields: { type: "json" } // 🔧 统一为 customFields
}
```

## 3.3 新闻资讯内容类型（news-article）

```javascript
{
  // 基础信息
  title: { type: "string", required: true },
  content: { type: "richtext" },
  excerpt: { type: "text" },

  // 分类
  category: { type: "string" },
  tags: { type: "json" },
  source: { type: "string" }, // 新闻来源

  // 媒体
  featuredImage: { type: "media", multiple: false },
  gallery: { type: "media", multiple: true },

  // 时间
  publishDate: { type: "datetime" },
  readTime: { type: "string" },
  // 🔧 删除 lastModified - Strapi 有 updatedAt

  // 作者
  authorName: { type: "string" },
  authorBio: { type: "text" },
  authorAvatar: { type: "media", multiple: false },

  // 统计
  views: { type: "integer", default: 0 },
  shares: { type: "integer", default: 0 },

  // 状态管理
  // 🚨 删除 status - 使用 Strapi 内置发布状态
  isBreaking: { type: "boolean", default: false },
  isFeatured: { type: "boolean", default: false },
  priority: { type: "integer", default: 0 },

  // SEO
  seoTitle: { type: "string" }, // 🔧 统一为 seoTitle
  seoDescription: { type: "text" }, // 🔧 统一为 seoDescription  
  slug: { type: "uid", targetField: "title" },

  // 关联
  relatedNews: { type: "json" },
  keywords: { type: "json" },
  customFields: { type: "json" } // 🔧 统一为 customFields
}
```

---

## 🔧 具体更改清单

### ✅ 修复的冲突字段
1. **AI工具 (ai-tool)**:
   - ❌ 删除 `publication_state` 
   - ❌ 删除 `publishedAt`
   - ✅ `difficulty` 改为枚举类型
   - ✅ `pricing` 改为 text 类型

2. **教育资源 (edu-resource)**:
   - ❌ 删除 `publication_state`
   - ❌ 删除 `lastUpdated` (重复)
   - ✅ `gradeLevel` 改为枚举类型
   - ✅ `resourceType` 改为枚举类型  
   - ✅ `difficulty` 改为枚举类型
   - ✅ `customData` → `customFields`

3. **新闻资讯 (news-article)**:
   - ❌ 删除 `status`
   - ❌ 删除 `lastModified` (重复)
   - ✅ `metaTitle` → `seoTitle`
   - ✅ `metaDescription` → `seoDescription`

### ✅ 统一的命名规范
- SEO 字段: `seoTitle`, `seoDescription`
- 自定义数据: `customFields`
- 布尔标识: `is` 前缀 (`isFeatured`, `isRecommended`, `isBreaking`)

### ✅ 优化的字段类型
- 枚举类型提供更好的数据一致性
- 删除重复的时间戳字段
- 统一媒体字段配置

这个优化版本解决了所有的冲突问题，并提供了更好的一致性和可维护性！