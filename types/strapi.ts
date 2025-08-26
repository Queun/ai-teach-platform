// Strapi API 响应类型
export interface StrapiResponse<T> {
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

export interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}

// 媒体文件类型
export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string;
      caption: string;
      width: number;
      height: number;
      formats: any;
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string;
      provider: string;
      provider_metadata: any;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface StrapiMediaArray {
  data: Array<{
    id: number;
    attributes: {
      name: string;
      alternativeText: string;
      caption: string;
      width: number;
      height: number;
      formats: any;
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string;
      provider: string;
      provider_metadata: any;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

// AI工具内容类型
export interface AITool {
  id: number;
  attributes: {
    // 基础信息
    name: string;
    description: string;
    shortDesc: string;

    // 分类和标签
    category: string;
    tags: string[];
    difficulty: string; // 🔧 改为 string 类型，建议值：入门、进阶、专业

    // 链接和媒体
    officialUrl: string;
    tutorialUrl: string;
    logo: StrapiMedia;
    screenshots: StrapiMediaArray;

    // 评价统计
    rating: number;
    userRating: number;
    popularity: number;

    // 详细信息
    features: string[];
    pros: string[];
    cons: string[];
    pricing: string;
    platforms: string[];

    // 使用指南
    quickStart: string;
    detailedGuide: string;
    useCases: string[];

    // 管理字段
    isRecommended: boolean;
    isFeatured: boolean;
    sortOrder: number;
    // 🚨 删除 status - 使用 Strapi 内置发布状态

    // SEO和扩展
    seoTitle: string;
    seoDescription: string;
    customFields: any;
    // 🔧 统一 SEO 字段命名

    // 时间戳
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// 教育资源内容类型
export interface EduResource {
  id: number;
  attributes: {
    // 基础信息
    title: string;
    content: string;
    summary: string;

    // 分类
    category: string;
    subject: string;
    gradeLevel: string; // 🔧 改为 string 类型，建议值：幼儿园、小学、初中、高中、大学、成人教育
    tags: string[];

    // 作者信息
    authorName: string;
    authorTitle: string;
    authorSchool: string;
    authorAvatar: StrapiMedia;

    // 资源属性
    resourceType: string; // 🔧 改为 string 类型，建议值：课件、教案、试题、素材、工具、其他
    difficulty: string; // 🔧 改为 string 类型，建议值：入门、进阶、专业
    estimatedTime: string;

    // 媒体文件
    coverImage: StrapiMedia;
    attachments: StrapiMediaArray;
    videoUrl: string;

    // 统计数据
    downloads: number;
    views: number;
    likes: number;
    rating: number;

    // 教学相关
    objectives: string[];
    prerequisites: string[];
    materials: string[];

    // 管理
    isFeatured: boolean;
    // 🚨 删除 isPublished 和 publishDate - 使用 Strapi 内置

    // SEO
    seoTitle: string;
    seoDescription: string;

    // 扩展
    relatedTools: string[];
    feedback: any;
    customFields: any; // 🔧 统一为 customFields

    // 时间戳
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// 新闻资讯内容类型
export interface NewsArticle {
  id: number;
  attributes: {
    // 基础信息
    title: string;
    content: string;
    excerpt: string;

    // 分类
    category: string;
    tags: string[];
    source: string;

    // 媒体
    featuredImage: StrapiMedia;
    gallery: StrapiMediaArray;

    // 时间
    publishDate: string;
    lastModified: string;
    readTime: string;

    // 作者
    authorName: string;
    authorBio: string;
    authorAvatar: StrapiMedia;

    // 统计
    views: number;
    shares: number;

    // 状态管理
    // 🚨 删除 status - 使用 Strapi 内置发布状态
    isBreaking: boolean;
    isFeatured: boolean;
    priority: number;

    // SEO
    seoTitle: string; // 🔧 统一为 seoTitle
    seoDescription: string; // 🔧 统一为 seoDescription
    slug: string;

    // 关联
    relatedNews: string[];
    keywords: string[];
    customFields: any; // 🔧 统一为 customFields

    // 时间戳
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// API 查询参数类型
export interface StrapiQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  populate?: string | string[];
  fields?: string[];
  filters?: Record<string, any>;
}

// 具体查询参数类型
export interface ToolsQuery extends StrapiQuery {
  category?: string;
  featured?: boolean;
  difficulty?: string;
  recommended?: boolean;
}

export interface ResourcesQuery extends StrapiQuery {
  category?: string;
  subject?: string;
  difficulty?: string;
  gradeLevel?: string;
  resourceType?: string;
  featured?: boolean;
}

export interface NewsQuery extends StrapiQuery {
  category?: string;
  featured?: boolean;
  breaking?: boolean;
  source?: string;
}

// 搜索结果类型
export interface SearchResult {
  tools: AITool[];
  resources: EduResource[];
  news: NewsArticle[];
  total: number;
}

// API错误类型
export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}