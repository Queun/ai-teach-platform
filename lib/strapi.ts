import type {
  StrapiResponse,
  StrapiSingleResponse,
  AITool,
  EduResource,
  NewsArticle,
  ToolsQuery,
  ResourcesQuery,
  NewsQuery,
  StrapiQuery,
  SearchResult,
  StrapiError
} from '@/types/strapi';

class StrapiService {
  private baseURL: string;
  private apiToken: string | null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
    this.apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN || null;
  }

  // 通用请求方法
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // 添加API Token认证（如果存在）
    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data as StrapiError;
        console.error('Strapi API Error Details:', {
          url,
          status: response.status,
          error: data,
          hasToken: !!this.apiToken
        });
        throw new Error(error.error?.message || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`Strapi API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // 构建查询参数
  private buildQueryParams(params: StrapiQuery = {}): string {
    const searchParams = new URLSearchParams();

    // 分页
    if (params.page) searchParams.set('pagination[page]', params.page.toString());
    if (params.pageSize) searchParams.set('pagination[pageSize]', params.pageSize.toString());

    // 排序
    if (params.sort) searchParams.set('sort', params.sort);

    // 填充关联数据
    if (params.populate) {
      if (Array.isArray(params.populate)) {
        params.populate.forEach(field => searchParams.append('populate', field));
      } else {
        searchParams.set('populate', params.populate);
      }
    }

    // 字段选择
    if (params.fields) {
      params.fields.forEach(field => searchParams.append('fields', field));
    }

    // 过滤器
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            searchParams.set(`filters[${key}][$eq]`, value.toString());
          } else if (typeof value === 'string') {
            searchParams.set(`filters[${key}][$containsi]`, value);
          } else {
            searchParams.set(`filters[${key}][$eq]`, value.toString());
          }
        }
      });
    }

    return searchParams.toString();
  }

  // =============
  // AI工具相关API
  // =============

  async getTools(params: ToolsQuery = {}): Promise<StrapiResponse<AITool>> {
    const filters: Record<string, any> = {};
    
    if (params.category) filters.category = params.category;
    if (params.featured !== undefined) filters.isFeatured = params.featured;
    if (params.difficulty) filters.difficulty = params.difficulty;
    if (params.recommended !== undefined) filters.isRecommended = params.recommended;

    const queryParams = this.buildQueryParams({
      ...params,
      filters,
      populate: '*'  // 暂时使用 * 来获取所有关联数据
    });

    return this.request(`/ai-tools?${queryParams}`);
  }

  async getToolById(id: string | number): Promise<StrapiSingleResponse<AITool>> {
    return this.request(`/ai-tools/${id}?populate=*`);
  }

  async getToolBySlug(slug: string): Promise<StrapiResponse<AITool>> {
    const queryParams = this.buildQueryParams({
      filters: { slug },
      populate: '*'
    });
    return this.request(`/ai-tools?${queryParams}`);
  }

  async getFeaturedTools(limit = 6): Promise<StrapiResponse<AITool>> {
    return this.getTools({
      featured: true,
      pageSize: limit,
      sort: 'sortOrder:asc'
    });
  }

  async getPopularTools(limit = 12): Promise<StrapiResponse<AITool>> {
    return this.getTools({
      pageSize: limit,
      sort: 'popularity:desc'
    });
  }

  // =============
  // 教育资源相关API
  // =============

  async getResources(params: ResourcesQuery = {}): Promise<StrapiResponse<EduResource>> {
    const filters: Record<string, any> = {};
    
    if (params.category) filters.category = params.category;
    if (params.subject) filters.subject = params.subject;
    if (params.difficulty) filters.difficulty = params.difficulty;
    if (params.gradeLevel) filters.gradeLevel = params.gradeLevel;
    if (params.resourceType) filters.resourceType = params.resourceType;
    if (params.featured !== undefined) filters.isFeatured = params.featured;

    const queryParams = this.buildQueryParams({
      ...params,
      filters,
      populate: '*'  // 获取所有关联数据包括媒体
    });

    return this.request(`/edu-resources?${queryParams}`);
  }

  async getResourceById(id: string | number): Promise<StrapiSingleResponse<EduResource>> {
    return this.request(`/edu-resources/${id}?populate=*`);
  }

  async getFeaturedResources(limit = 6): Promise<StrapiResponse<EduResource>> {
    return this.getResources({
      featured: true,
      pageSize: limit,
      sort: 'publishDate:desc'
    });
  }

  async getRecentResources(limit = 12): Promise<StrapiResponse<EduResource>> {
    return this.getResources({
      pageSize: limit,
      sort: 'createdAt:desc'
    });
  }

  // =============
  // 新闻资讯相关API
  // =============

  async getNews(params: NewsQuery = {}): Promise<StrapiResponse<NewsArticle>> {
    const filters: Record<string, any> = {};
    
    if (params.category) filters.category = params.category;
    if (params.featured !== undefined) filters.isFeatured = params.featured;
    if (params.breaking !== undefined) filters.isBreaking = params.breaking;
    if (params.source) filters.source = params.source;

    const queryParams = this.buildQueryParams({
      ...params,
      filters,
      populate: '*'  // 获取所有关联数据包括媒体
    });

    return this.request(`/news-articles?${queryParams}`);
  }

  async getNewsById(id: string | number): Promise<StrapiSingleResponse<NewsArticle>> {
    return this.request(`/news-articles/${id}?populate=*`);
  }

  async getNewsBySlug(slug: string): Promise<StrapiResponse<NewsArticle>> {
    const queryParams = this.buildQueryParams({
      filters: { slug },
      populate: '*'
    });
    return this.request(`/news-articles?${queryParams}`);
  }

  async getFeaturedNews(limit = 3): Promise<StrapiResponse<NewsArticle>> {
    return this.getNews({
      featured: true,
      pageSize: limit,
      sort: 'publishDate:desc'
    });
  }

  async getBreakingNews(limit = 5): Promise<StrapiResponse<NewsArticle>> {
    return this.getNews({
      breaking: true,
      pageSize: limit,
      sort: 'priority:desc,publishDate:desc'
    });
  }

  async getLatestNews(limit = 12): Promise<StrapiResponse<NewsArticle>> {
    return this.getNews({
      pageSize: limit,
      sort: 'publishDate:desc'
    });
  }

  // =============
  // 搜索功能
  // =============

  async search(query: string, type?: 'tools' | 'resources' | 'news'): Promise<SearchResult> {
    const results: SearchResult = {
      tools: [],
      resources: [],
      news: [],
      total: 0
    };

    try {
      const searchPromises: Promise<any>[] = [];

      if (!type || type === 'tools') {
        searchPromises.push(
          this.getTools({
            filters: {
              $or: [
                { name: query },
                { description: query },
                { shortDesc: query }
              ]
            },
            pageSize: 10
          })
        );
      }

      if (!type || type === 'resources') {
        searchPromises.push(
          this.getResources({
            filters: {
              $or: [
                { title: query },
                { content: query },
                { summary: query }
              ]
            },
            pageSize: 10
          })
        );
      }

      if (!type || type === 'news') {
        searchPromises.push(
          this.getNews({
            filters: {
              $or: [
                { title: query },
                { content: query },
                { excerpt: query }
              ]
            },
            pageSize: 10
          })
        );
      }

      const responses = await Promise.allSettled(searchPromises);

      let resultIndex = 0;
      if (!type || type === 'tools') {
        const toolsResult = responses[resultIndex];
        if (toolsResult.status === 'fulfilled') {
          results.tools = toolsResult.value.data;
          results.total += toolsResult.value.meta.pagination.total;
        }
        resultIndex++;
      }

      if (!type || type === 'resources') {
        const resourcesResult = responses[resultIndex];
        if (resourcesResult.status === 'fulfilled') {
          results.resources = resourcesResult.value.data;
          results.total += resourcesResult.value.meta.pagination.total;
        }
        resultIndex++;
      }

      if (!type || type === 'news') {
        const newsResult = responses[resultIndex];
        if (newsResult.status === 'fulfilled') {
          results.news = newsResult.value.data;
          results.total += newsResult.value.meta.pagination.total;
        }
      }

      return results;
    } catch (error) {
      console.error('Search error:', error);
      return results;
    }
  }

  // =============
  // 统计和工具方法
  // =============

  async getStats() {
    try {
      const [toolsResponse, resourcesResponse, newsResponse] = await Promise.all([
        this.getTools({ pageSize: 1 }),
        this.getResources({ pageSize: 1 }),
        this.getNews({ pageSize: 1 })
      ]);

      return {
        tools: toolsResponse.meta.pagination.total,
        resources: resourcesResponse.meta.pagination.total,
        news: newsResponse.meta.pagination.total
      };
    } catch (error) {
      console.error('Stats error:', error);
      return { tools: 0, resources: 0, news: 0 };
    }
  }

  // 获取媒体文件完整URL
  getMediaUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.baseURL.replace('/api', '')}${url}`;
  }

  // 格式化媒体对象
  formatMedia(media: any) {
    if (!media?.data) return null;
    return {
      ...media.data.attributes,
      url: this.getMediaUrl(media.data.attributes.url)
    };
  }

  // 格式化媒体数组
  formatMediaArray(mediaArray: any) {
    if (!mediaArray?.data) return [];
    return mediaArray.data.map((item: any) => ({
      ...item.attributes,
      url: this.getMediaUrl(item.attributes.url)
    }));
  }
}

// 导出单例实例
export const strapiService = new StrapiService();
export default strapiService;