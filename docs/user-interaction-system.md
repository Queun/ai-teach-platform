# 用户互动系统设计文档

> 版本：v1.0  
> 创建时间：2025年8月27日  
> 状态：开发中

## 系统概述

本文档记录了AI教育平台用户互动功能的完整设计和实现方案，包括点赞、收藏、评论等核心功能。

### 核心功能
- **点赞系统**：用户可对工具、资源、新闻进行点赞
- **收藏系统**：用户可收藏感兴趣的内容
- **评论系统**：支持评论和回复，包含审核机制
- **统计展示**：实时显示点赞数、收藏数、评论数

### 技术架构
- **后端**：Strapi 5 + PostgreSQL
- **前端**：Next.js 15 + React 19
- **认证**：Strapi Users & Permissions插件

## 数据模型设计

### 1. 扩展现有内容类型

对以下三个现有内容类型添加计数字段：
- `ai-tool`（AI工具）
- `edu-resource`（教育资源）  
- `news-article`（新闻资讯）

#### 新增字段：
```json
{
  "likesCount": {
    "type": "integer",
    "default": 0
  },
  "favoritesCount": {
    "type": "integer", 
    "default": 0
  },
  "commentsCount": {
    "type": "integer",
    "default": 0
  }
}
```

### 2. 新建内容类型

#### UserAction（用户行为记录）
**表名**：`user_actions`  
**用途**：记录用户的点赞和收藏行为

```json
{
  "kind": "collectionType",
  "collectionName": "user_actions",
  "info": {
    "singularName": "user-action",
    "pluralName": "user-actions", 
    "displayName": "User Action"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "actionType": {
      "type": "enumeration",
      "enum": ["like", "favorite"],
      "required": true
    },
    "targetType": {
      "type": "enumeration", 
      "enum": ["ai-tool", "edu-resource", "news-article"],
      "required": true
    },
    "targetId": {
      "type": "integer",
      "required": true
    },
    "users_permissions_user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "user_actions"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    }
  }
}
```

#### Comment（评论系统）
**表名**：`comments`  
**用途**：存储用户评论，支持回复和审核

```json
{
  "kind": "collectionType",
  "collectionName": "comments",
  "info": {
    "singularName": "comment",
    "pluralName": "comments",
    "displayName": "Comment"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "content": {
      "type": "text",
      "required": true
    },
    "targetType": {
      "type": "enumeration",
      "enum": ["ai-tool", "edu-resource", "news-article"],
      "required": true
    },
    "targetId": {
      "type": "integer", 
      "required": true
    },
    "users_permissions_user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "comments"
    },
    "parent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::comment.comment",
      "inversedBy": "replies"
    },
    "replies": {
      "type": "relation", 
      "relation": "oneToMany",
      "target": "api::comment.comment",
      "mappedBy": "parent"
    },
    "isHelpful": {
      "type": "integer",
      "default": 0
    }
  }
}
```

## Strapi配置详情

### 权限配置
**路径**：`Settings > Users & Permissions Plugin > Roles > Authenticated`

#### UserAction权限：
- ✅ Create（创建）
- ✅ Find（查询）
- ✅ FindOne（单个查询）  
- ✅ Update（更新，仅自己的）
- ✅ Delete（删除，仅自己的）

#### Comment权限：
- ✅ Create（创建，默认Draft状态）
- ✅ Find（查询已发布的）
- ✅ FindOne（单个查询）
- ❌ Update（不允许编辑评论）
- ❌ Delete（管理员操作）

### 特殊配置说明

1. **评论审核机制**：启用Draft/Publish，新评论默认为Draft状态，需管理员审核后发布
2. **用户权限**：利用Strapi 5的`me` endpoint，用户只能操作自己的数据
3. **关系查询**：评论支持`populate=parent,replies`获取完整评论树

## API接口规范

### 1. 用户行为接口

#### 获取用户对内容的互动状态
```
GET /api/user-actions?filters[users_permissions_user][id][$eq]={userId}&filters[targetType][$eq]={targetType}&filters[targetId][$eq]={targetId}

响应示例：
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "actionType": "like",
        "targetType": "ai-tool", 
        "targetId": 5,
        "isActive": true,
        "createdAt": "2025-08-27T10:00:00.000Z"
      }
    }
  ]
}
```

#### 创建用户行为（点赞/收藏）
```
POST /api/user-actions
Content-Type: application/json

{
  "data": {
    "actionType": "like",
    "targetType": "ai-tool",
    "targetId": 5,
    "users_permissions_user": 1
  }
}
```

#### 取消用户行为（取消点赞/收藏）
```
PUT /api/user-actions/{id}

{
  "data": {
    "isActive": false
  }
}
```

### 2. 评论接口

#### 获取内容的评论列表
```
GET /api/comments?filters[targetType][$eq]={targetType}&filters[targetId][$eq]={targetId}&populate=users_permissions_user,parent,replies&publicationState=live

响应示例：
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "content": "这个工具真的很实用！",
        "targetType": "ai-tool",
        "targetId": 5,
        "isHelpful": 12,
        "createdAt": "2025-08-27T10:00:00.000Z",
        "users_permissions_user": {
          "data": {
            "id": 1,
            "attributes": {
              "username": "test",
              "email": "test@example.com"
            }
          }
        }
      }
    }
  ]
}
```

#### 创建评论
```
POST /api/comments

{
  "data": {
    "content": "评论内容",
    "targetType": "ai-tool",
    "targetId": 5,
    "users_permissions_user": 1,
    "parent": null  // 如果是回复，传入父评论ID
  }
}
```

### 3. 内容计数更新接口

#### 更新内容统计数据
```
PUT /api/{content-type}/{id}

{
  "data": {
    "likesCount": 15,
    "favoritesCount": 8,
    "commentsCount": 3
  }
}
```

## 前端实现计划

### 1. API服务层扩展

**文件**：`lib/strapi.ts`

```typescript
// 新增用户互动相关API方法
class StrapiService {
  // 获取用户互动状态
  async getUserInteraction(userId: number, targetType: string, targetId: number) {
    return this.request(`/user-actions?filters[users_permissions_user][id][$eq]=${userId}&filters[targetType][$eq]=${targetType}&filters[targetId][$eq]=${targetId}`);
  }

  // 创建/更新用户行为
  async toggleUserAction(actionType: 'like' | 'favorite', targetType: string, targetId: number, userId: number) {
    // 实现逻辑
  }

  // 获取评论列表
  async getComments(targetType: string, targetId: number) {
    return this.request(`/comments?filters[targetType][$eq]=${targetType}&filters[targetId][$eq]=${targetId}&populate=users_permissions_user,parent,replies&publicationState=live`);
  }

  // 创建评论
  async createComment(content: string, targetType: string, targetId: number, userId: number, parentId?: number) {
    // 实现逻辑
  }
}
```

### 2. React Hook封装

**文件**：`hooks/useInteraction.ts`

```typescript
// 用户互动状态管理Hook
export function useInteraction(targetType: string, targetId: number) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  // 切换点赞状态
  const toggleLike = async () => {
    // 乐观UI更新 + API调用
  };
  
  // 切换收藏状态
  const toggleFavorite = async () => {
    // 乐观UI更新 + API调用
  };
  
  return {
    isLiked, 
    isFavorited,
    likesCount,
    favoritesCount,
    toggleLike,
    toggleFavorite
  };
}
```

### 3. 组件改造方案

**现有组件位置**：
- `app/tools/[id]/page.tsx` (第286-292, 338-352行)
- `app/resources/[id]/page.tsx` (第278-296行)
- `app/news/[id]/page.tsx` (类似结构)

**改造要点**：
1. 将静态状态 `isLiked`, `isBookmarked` 替换为动态Hook
2. 添加用户认证检查
3. 实现乐观UI更新
4. 集成真实评论数据

## 测试配置

### 测试用户
- **用户名**：test  
- **密码**：123456
- **ID**：待确认（创建后获取）

### 测试场景
1. 未登录用户：显示登录提示
2. 已登录用户：正常互动功能
3. 点赞/取消点赞：实时计数更新
4. 收藏/取消收藏：状态同步
5. 评论发布：审核流程验证
6. 评论回复：层级关系正确

## 部署注意事项

### 1. 数据库迁移
- 确保Strapi重启后新字段生效
- 现有内容的计数字段初始化为0

### 2. 权限验证
- 验证用户只能操作自己的数据
- 确认评论审核流程正常

### 3. 性能优化
- 考虑添加数据库索引：`(targetType, targetId)`, `(users_permissions_user, actionType)`
- API响应缓存策略

## 后续扩展计划

### 短期优化（1-2周）
- [ ] 评论点赞功能
- [ ] 用户互动历史页面
- [ ] 邮件通知（评论审核通过）
- [ ] 移动端优化

### 长期规划（1-2个月）  
- [ ] 评论举报机制
- [ ] 用户声誉系统
- [ ] 内容推荐算法集成
- [ ] 数据分析面板

---

## 更新日志

- **2025-08-27**：初始文档创建，完成数据模型设计和Strapi配置