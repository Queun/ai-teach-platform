● AI教育平台完整开发执行策略（最终版）

  项目概览

  项目名称: 爱教学 - AI赋能教育资源平台技术架构: Next.js前端 + Strapi后端 + PostgreSQL数据库 +
  Docker容器化开发模式: 混合模式（应用本地运行 + 数据库容器化）目标: 为教育工作者提供AI工具与资源的专业策展平台

  ---
  技术栈确认

  前端技术栈

  - Next.js 15.2.4 + React 19 + TypeScript
  - Tailwind CSS + shadcn/ui组件库
  - 支持深色/浅色主题切换
  - 响应式设计，移动端友好

  后端技术栈

  - Strapi v4（无头CMS + 管理后台）
  - PostgreSQL 15（Docker容器运行）
  - RESTful API + GraphQL（可选）

  开发工具

  - Docker + Docker Compose
  - 环境变量管理
  - 热重载开发环境

  ---
  项目目录结构

  ai-edu-platform/
  ├── app/                    # Next.js前端（现有）
  ├── components/             # 组件库（现有）
  ├── lib/                   # 工具函数（现有）
  ├── backend/               # Strapi后端（待创建）
  ├── docker-compose.dev.yml # 开发环境配置
  ├── docker-compose.prod.yml# 生产环境配置
  ├── README.md              # 项目文档
  └── docs/                  # 详细文档

  ---
  详细执行计划

  阶段一：Docker基础环境搭建（预计1天）

  1.1 创建开发环境Docker配置
  # docker-compose.dev.yml
  version: '3.8'
  services:
    postgres:
      image: postgres:15-alpine
      container_name: ai_edu_postgres
      environment:
        POSTGRES_DB: ai_edu_platform
        POSTGRES_USER: strapi
        POSTGRES_PASSWORD: strapi123
        POSTGRES_INITDB_ARGS: '--encoding=UTF-8 --lc-collate=C --lc-ctype=C'
      ports:
        - "5432:5432"
      volumes:
        - postgres_data:/var/lib/postgresql/data
      restart: unless-stopped

  volumes:
    postgres_data:

  1.2 验证Docker环境
  # 启动数据库
  docker-compose -f docker-compose.dev.yml up -d

  # 验证连接
  docker exec -it ai_edu_postgres psql -U strapi -d ai_edu_platform -c "SELECT version();"

  阶段二：Strapi后端项目初始化（预计1-2天）

  2.1 创建Strapi项目
  # 在项目根目录执行
  npx create-strapi-app@latest backend --quickstart --no-run
  cd backend
  npm install pg

  2.2 数据库配置
  // backend/config/database.js
  module.exports = ({ env }) => ({
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'ai_edu_platform'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi123'),
        ssl: env.bool('DATABASE_SSL', false),
      },
    },
  });

  2.3 环境变量配置
  # backend/.env
  # 数据库配置
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_NAME=ai_edu_platform
  DATABASE_USERNAME=strapi
  DATABASE_PASSWORD=strapi123

  # Strapi配置
  HOST=0.0.0.0
  PORT=1337
  APP_KEYS=key1,key2,key3,key4
  API_TOKEN_SALT=api-token-salt
  ADMIN_JWT_SECRET=admin-jwt-secret
  JWT_SECRET=jwt-secret
  TRANSFER_TOKEN_SALT=transfer-token-salt

  # 环境配置
  NODE_ENV=development

  2.4 CORS配置
  // backend/config/middlewares.js
  module.exports = [
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': ["'self'", 'data:', 'blob:', 'https:'],
            'media-src': ["'self'", 'data:', 'blob:'],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        enabled: true,
        headers: '*',
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
      }
    },
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];

  阶段三：内容类型设计（预计2-3天）

  3.1 AI工具内容类型（ai-tool）
  {
    // 基础信息
    name: { type: "string", required: true }, // 工具名称
    description: { type: "richtext" }, // 详细描述
    shortDesc: { type: "text" }, // 简短介绍

    // 分类和标签
    category: { type: "string" }, // 主分类
    tags: { type: "json" }, // 标签数组
    difficulty: { type: "string" }, // 难度级别

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
    pricing: { type: "string" }, // 定价信息
    platforms: { type: "json" }, // 支持平台

    // 使用指南
    quickStart: { type: "richtext" }, // 快速指南
    detailedGuide: { type: "richtext" }, // 详细指南
    useCases: { type: "json" }, // 使用场景

    // 管理字段
    isRecommended: { type: "boolean", default: false },
    isFeatured: { type: "boolean", default: false },
    sortOrder: { type: "integer", default: 0 },
    publication_state: { type: "string", default: "draft" },

    // SEO和扩展
    seoTitle: { type: "string" },
    seoDescription: { type: "text" },
    customFields: { type: "json" },

    // 时间戳（自动）
    publishedAt: { type: "datetime" }
  }

  3.2 教育资源内容类型（edu-resource）
  {
    // 基础信息
    title: { type: "string", required: true },
    content: { type: "richtext" },
    summary: { type: "text" }, // 摘要

    // 分类
    category: { type: "string" }, // 主分类
    subject: { type: "string" }, // 学科
    gradeLevel: { type: "string" }, // 年级
    tags: { type: "json" }, // 标签

    // 作者信息
    authorName: { type: "string" },
    authorTitle: { type: "string" },
    authorSchool: { type: "string" },
    authorAvatar: { type: "media", multiple: false },

    // 资源属性
    resourceType: { type: "string" }, // 资源类型
    difficulty: { type: "string" },
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
    publication_state: { type: "string", default: "draft" },
    isFeatured: { type: "boolean", default: false },
    lastUpdated: { type: "datetime" },

    // SEO
    seoTitle: { type: "string" },
    seoDescription: { type: "text" },

    // 扩展
    relatedTools: { type: "json" }, // 关联工具
    feedback: { type: "json" }, // 反馈数据
    customData: { type: "json" }
  }

  3.3 新闻资讯内容类型（news-article）
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
    lastModified: { type: "datetime" },
    readTime: { type: "string" },

    // 作者
    authorName: { type: "string" },
    authorBio: { type: "text" },
    authorAvatar: { type: "media", multiple: false },

    // 统计
    views: { type: "integer", default: 0 },
    shares: { type: "integer", default: 0 },

    // 状态
    publication_state: { type: "string", default: "draft" },
    isBreaking: { type: "boolean", default: false },
    isFeatured: { type: "boolean", default: false },
    priority: { type: "integer", default: 0 },

    // SEO
    metaTitle: { type: "string" },
    metaDescription: { type: "text" },
    slug: { type: "uid", targetField: "title" },

    // 关联
    relatedNews: { type: "json" },
    keywords: { type: "json" },
    customFields: { type: "json" }
  }

  阶段四：前端API集成（预计3-4天）

  4.1 创建API服务层
  // lib/strapi.ts
  interface StrapiResponse<T> {
    data: T[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }

  interface StrapiSingleResponse<T> {
    data: T;
    meta: {};
  }

  class StrapiService {
    private baseURL: string;

    constructor() {
      this.baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
    }

    // 通用请求方法
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    }

    // AI工具相关
    async getTools(params?: {
      page?: number;
      pageSize?: number;
      category?: string;
      featured?: boolean;
      sort?: string;
    }): Promise<StrapiResponse<AITool>> {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('pagination[page]', params.page.toString());
      if (params?.pageSize) searchParams.set('pagination[pageSize]', params.pageSize.toString());
      if (params?.category) searchParams.set('filters[category][$eq]', params.category);
      if (params?.featured) searchParams.set('filters[isFeatured][$eq]', 'true');
      if (params?.sort) searchParams.set('sort', params.sort);

      return this.request(`/ai-tools?${searchParams.toString()}&populate=*`);
    }

    async getToolById(id: string): Promise<StrapiSingleResponse<AITool>> {
      return this.request(`/ai-tools/${id}?populate=*`);
    }

    // 教育资源相关
    async getResources(params?: {
      page?: number;
      pageSize?: number;
      category?: string;
      subject?: string;
      difficulty?: string;
    }): Promise<StrapiResponse<EduResource>> {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('pagination[page]', params.page.toString());
      if (params?.pageSize) searchParams.set('pagination[pageSize]', params.pageSize.toString());
      if (params?.category) searchParams.set('filters[category][$eq]', params.category);
      if (params?.subject) searchParams.set('filters[subject][$eq]', params.subject);
      if (params?.difficulty) searchParams.set('filters[difficulty][$eq]', params.difficulty);

      return this.request(`/edu-resources?${searchParams.toString()}&populate=*`);
    }

    async getResourceById(id: string): Promise<StrapiSingleResponse<EduResource>> {
      return this.request(`/edu-resources/${id}?populate=*`);
    }

    // 新闻资讯相关
    async getNews(params?: {
      page?: number;
      pageSize?: number;
      category?: string;
      featured?: boolean;
    }): Promise<StrapiResponse<NewsArticle>> {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('pagination[page]', params.page.toString());
      if (params?.pageSize) searchParams.set('pagination[pageSize]', params.pageSize.toString());
      if (params?.category) searchParams.set('filters[category][$eq]', params.category);
      if (params?.featured) searchParams.set('filters[isFeatured][$eq]', 'true');

      return this.request(`/news-articles?${searchParams.toString()}&populate=*`);
    }

    async getNewsById(id: string): Promise<StrapiSingleResponse<NewsArticle>> {
      return this.request(`/news-articles/${id}?populate=*`);
    }

    // 搜索功能
    async search(query: string, type?: 'ai-tools' | 'edu-resources' | 'news-articles') {
      const endpoints = type ? [type] : ['ai-tools', 'edu-resources', 'news-articles'];
      const results = await Promise.all(
        endpoints.map(endpoint =>
          this.request(`/${endpoint}?filters[$or][0][title][$containsi]=${query}&filters[$or][1][name][$containsi]=
  ${query}&populate=*`)
        )
      );
      return results;
    }
  }

  export const strapiService = new StrapiService();

  4.2 类型定义
  // types/strapi.ts
  export interface AITool {
    id: number;
    attributes: {
      name: string;
      description: string;
      shortDesc: string;
      category: string;
      tags: string[];
      difficulty: string;
      officialUrl: string;
      tutorialUrl: string;
      rating: number;
      userRating: number;
      popularity: number;
      features: string[];
      pros: string[];
      cons: string[];
      pricing: string;
      platforms: string[];
      isRecommended: boolean;
      isFeatured: boolean;
      logo: {
        data: {
          attributes: {
            url: string;
            alternativeText: string;
          };
        };
      };
      screenshots: {
        data: Array<{
          attributes: {
            url: string;
            alternativeText: string;
          };
        }>;
      };
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }

  export interface EduResource {
    id: number;
    attributes: {
      title: string;
      content: string;
      summary: string;
      category: string;
      subject: string;
      gradeLevel: string;
      tags: string[];
      authorName: string;
      authorTitle: string;
      authorSchool: string;
      resourceType: string;
      difficulty: string;
      estimatedTime: string;
      downloads: number;
      views: number;
      likes: number;
      rating: number;
      isPublished: boolean;
      isFeatured: boolean;
      coverImage: {
        data: {
          attributes: {
            url: string;
            alternativeText: string;
          };
        };
      };
      attachments: {
        data: Array<{
          attributes: {
            url: string;
            name: string;
          };
        }>;
      };
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }

  export interface NewsArticle {
    id: number;
    attributes: {
      title: string;
      content: string;
      excerpt: string;
      category: string;
      tags: string[];
      source: string;
      readTime: string;
      authorName: string;
      authorBio: string;
      views: number;
      shares: number;
      isBreaking: boolean;
      isFeatured: boolean;
      priority: number;
      slug: string;
      featuredImage: {
        data: {
          attributes: {
            url: string;
            alternativeText: string;
          };
        };
      };
      publishDate: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }

  4.3 React Hooks封装
  // hooks/useStrapi.ts
  import { useState, useEffect } from 'react';
  import { strapiService } from '@/lib/strapi';
  import type { AITool, EduResource, NewsArticle } from '@/types/strapi';

  export function useTools(params?: Parameters<typeof strapiService.getTools>[0]) {
    const [data, setData] = useState<AITool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await strapiService.getTools(params);
          setData(response.data);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [JSON.stringify(params)]);

    return { data, loading, error };
  }

  export function useResources(params?: Parameters<typeof strapiService.getResources>[0]) {
    const [data, setData] = useState<EduResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await strapiService.getResources(params);
          setData(response.data);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [JSON.stringify(params)]);

    return { data, loading, error };
  }

  export function useNews(params?: Parameters<typeof strapiService.getNews>[0]) {
    const [data, setData] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await strapiService.getNews(params);
          setData(response.data);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [JSON.stringify(params)]);

    return { data, loading, error };
  }

  4.4 环境变量配置
  # .env.local (前端项目根目录)
  NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api

  阶段五：生产环境Docker化（预计2天）

  5.1 Strapi生产Dockerfile
  # backend/Dockerfile
  FROM node:18-alpine AS dependencies
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production && npm cache clean --force

  FROM node:18-alpine AS build
  WORKDIR /app
  COPY . .
  COPY --from=dependencies /app/node_modules ./node_modules
  RUN npm run build

  FROM node:18-alpine AS runtime
  RUN apk add --no-cache dumb-init
  WORKDIR /app
  RUN addgroup --system --gid 1001 strapi
  RUN adduser --system --uid 1001 strapi
  COPY --from=build --chown=strapi:strapi /app .
  USER strapi
  EXPOSE 1337
  ENV NODE_ENV production
  CMD ["dumb-init", "npm", "start"]

  5.2 Next.js生产Dockerfile
  # Dockerfile (前端根目录)
  FROM node:18-alpine AS base

  FROM base AS dependencies
  RUN apk add --no-cache libc6-compat
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production && npm cache clean --force

  FROM base AS build
  WORKDIR /app
  COPY --from=dependencies /app/node_modules ./node_modules
  COPY . .
  ENV NEXT_TELEMETRY_DISABLED 1
  RUN npm run build

  FROM base AS runtime
  WORKDIR /app
  ENV NODE_ENV production
  ENV NEXT_TELEMETRY_DISABLED 1

  RUN addgroup --system --gid 1001 nodejs
  RUN adduser --system --uid 1001 nextjs

  COPY --from=build /app/public ./public
  COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

  USER nextjs
  EXPOSE 3000
  ENV PORT 3000
  ENV HOSTNAME "0.0.0.0"

  CMD ["node", "server.js"]

  5.3 生产环境Docker Compose
  # docker-compose.prod.yml
  version: '3.8'

  services:
    postgres:
      image: postgres:15-alpine
      environment:
        POSTGRES_DB: ai_edu_platform
        POSTGRES_USER: strapi
        POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      volumes:
        - postgres_data:/var/lib/postgresql/data
      restart: unless-stopped
      networks:
        - app_network

    backend:
      build: ./backend
      environment:
        NODE_ENV: production
        DATABASE_HOST: postgres
        DATABASE_PASSWORD: ${DATABASE_PASSWORD}
        JWT_SECRET: ${JWT_SECRET}
        ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      depends_on:
        - postgres
      restart: unless-stopped
      networks:
        - app_network

    frontend:
      build: .
      environment:
        NEXT_PUBLIC_STRAPI_URL: http://backend:1337/api
      depends_on:
        - backend
      ports:
        - "3000:3000"
      restart: unless-stopped
      networks:
        - app_network

  volumes:
    postgres_data:

  networks:
    app_network:
      driver: bridge

  阶段六：高级功能开发（预计3-4天）

  6.1 搜索功能实现
  - 前端搜索界面组件
  - 实时搜索建议
  - 搜索结果页面
  - 搜索历史记录

  6.2 用户系统扩展
  - Strapi用户认证集成
  - 用户资料页面
  - 收藏功能
  - 浏览历史

  6.3 推荐系统
  - 基于分类的相关推荐
  - 热门内容推荐
  - 个性化推荐（基于用户行为）

  ---
  开发工作流程

  日常开发命令

  # 启动开发环境
  docker-compose -f docker-compose.dev.yml up -d  # 启动数据库
  cd backend && npm run develop                    # 启动Strapi
  npm run dev                                      # 启动Next.js

  # 停止环境
  docker-compose -f docker-compose.dev.yml down

  生产部署命令

  # 构建镜像
  docker-compose -f docker-compose.prod.yml build

  # 启动生产环境
  docker-compose -f docker-compose.prod.yml up -d

  # 查看日志
  docker-compose -f docker-compose.prod.yml logs -f

  ---
  里程碑检查点

  - 第1周末: Docker环境 + Strapi基础搭建完成，管理后台可用
  - 第2周末: 三个核心内容类型创建完成，示例数据录入
  - 第3周末: 前端API集成完成，所有页面显示真实数据
  - 第4周末: 搜索功能、用户系统、生产环境Docker化完成

  ---
  注意事项和最佳实践

  开发注意事项

  1. 数据库备份: 定期备份开发数据库数据
  2. 环境变量: 敏感信息使用环境变量，不提交到Git
  3. API限流: 生产环境需要考虑API限流和缓存
  4. 图片优化: 使用Strapi的图片处理功能优化性能

  内容管理最佳实践

  1. 内容规范: 制定内容录入规范和模板
  2. 标签体系: 建立统一的标签分类体系
  3. SEO优化: 所有内容都填写SEO相关字段
  4. 定期维护: 定期更新和维护内容质量

  性能优化

  1. 图片懒加载: 前端实现图片懒加载
  2. API缓存: 实现适当的API响应缓存
  3. CDN集成: 生产环境集成CDN加速
  4. 数据库索引: 为常用查询字段添加索引

  ---
  未来扩展规划

  短期扩展（1-2个月）

  - 用户评分和评论系统
  - 内容订阅和通知功能
  - 数据统计和分析面板
  - 移动端APP开发

  长期扩展（3-6个月）

  - 社区功能（论坛、问答）
  - AI工具集成和测试
  - 在线学习路径规划
  - 多语言支持

  这个完整的执行策略涵盖了从环境搭建到功能开发的所有细节，为项目的成功实施提供了详细的指导。