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
  StrapiError,
  UserAction,
  Comment,
  UserInteractionState,
  InteractionStats
} from '@/types/strapi';

class StrapiService {
  private baseURL: string;
  private apiToken: string | null;
  private userToken: string | null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
    this.apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN || null;
    this.userToken = null;
  }

  // 设置用户认证Token
  setUserToken(token: string | null) {
    this.userToken = token;
  }

  // 获取当前用户Token
  getUserToken(): string | null {
    return this.userToken;
  }

  // 通用请求方法
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // 添加认证Token（用户Token优先）
    if (this.userToken) {
      headers['Authorization'] = `Bearer ${this.userToken}`;
    } else if (this.apiToken) {
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
          // 对于特殊字段使用精确匹配
          if (key === 'users_permissions_user' || key === 'targetId' || key === 'targetType' || key === 'actionType' || key === 'isActive') {
            searchParams.set(`filters[${key}][$eq]`, value.toString());
          } else if (typeof value === 'boolean') {
            searchParams.set(`filters[${key}][$eq]`, value.toString());
          } else if (typeof value === 'string') {
            // 对于文本字段使用包含搜索
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

  // =============
  // 用户互动功能
  // =============

  // 获取用户对特定内容的互动状态
  async getUserInteraction(
    userId: number, 
    targetType: 'ai-tool' | 'edu-resource' | 'news-article', 
    targetId: number | string // 支持字符串 ID
  ): Promise<UserInteractionState> {
    if (!this.userToken) {
      return { isLiked: false, isFavorited: false };
    }

    try {
      const queryParams = this.buildQueryParams({
        filters: {
          users_permissions_user: userId,
          targetType: targetType,
          targetId: targetId.toString(),
          isActive: true
        }
      });

      const response = await this.request(`/user-actions?${queryParams}`);
      
      // 解析用户的互动状态
      const userInteraction: UserInteractionState = {
        isLiked: false,
        isFavorited: false
      };

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((action: any) => {
          const actionType = action.attributes?.actionType || action.actionType;
          if (actionType === 'like') {
            userInteraction.isLiked = true;
          } else if (actionType === 'favorite') {
            userInteraction.isFavorited = true;
          }
        });
      }
      
      return userInteraction;
    } catch (error) {
      console.error('Error fetching user interaction:', error);
      // 返回默认值而不是抛出错误
      return { isLiked: false, isFavorited: false };
    }
  }

  // 切换用户行为（点赞/收藏）
  async toggleUserAction(
    actionType: 'like' | 'favorite',
    targetType: 'ai-tool' | 'edu-resource' | 'news-article',
    targetId: number | string, // 支持字符串 ID
    userId: number
  ): Promise<{ success: boolean; isActive: boolean }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      // 获取当前用户信息以获取documentId
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Unable to get current user');
      }

      const userDocumentId = currentUser.documentId || currentUser.id;

      // 首先查询是否已存在此用户对此内容的该类型互动（包括所有状态）
      const queryParams = this.buildQueryParams({
        filters: {
          users_permissions_user: userId,
          targetType: targetType,
          targetId: targetId.toString(),
          actionType: actionType
        }
      });

      const existingResponse = await this.request(`/user-actions?${queryParams}`);
      
      if (existingResponse.data && existingResponse.data.length > 0) {
        // 存在记录，找到最新的记录或活跃的记录
        const existingAction = existingResponse.data[0]; // 假设返回的是按时间排序的
        const currentIsActive = existingAction.attributes?.isActive ?? existingAction.isActive ?? true;
        const newIsActive = !currentIsActive;
        
        // 更新现有记录
        await this.request(`/user-actions/${existingAction.documentId || existingAction.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            data: {
              isActive: newIsActive
            }
          })
        });

        return { success: true, isActive: newIsActive };
      } else {
        // 不存在记录，创建新的互动记录
        const response = await this.request('/user-actions', {
          method: 'POST',
          body: JSON.stringify({
            data: {
              actionType,
              targetType,
              targetId: targetId.toString(),
              users_permissions_user: {
                connect: [userDocumentId]
              },
              isActive: true
            }
          })
        });
        
        return { success: true, isActive: true };
      }
    } catch (error) {
      console.error('Error toggling user action:', error);
      return { success: false, isActive: false };
    }
  }

  // 获取内容的互动统计
  async getInteractionStats(
    targetType: 'ai-tool' | 'edu-resource' | 'news-article',
    targetId: number | string // 支持字符串 ID
  ): Promise<InteractionStats> {
    try {
      // 使用标准 REST API 查询所有活跃的互动记录
      const queryParams = this.buildQueryParams({
        filters: {
          targetType: targetType,
          targetId: targetId.toString(),
          isActive: true
        }
      });

      const response = await this.request(`/user-actions?${queryParams}`);
      
      // 统计不同类型的互动数量
      const stats: InteractionStats = {
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0 // 评论数暂时设为0，后续会从 comments 表获取
      };

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((action: any) => {
          const actionType = action.attributes?.actionType || action.actionType;
          if (actionType === 'like') {
            stats.likesCount++;
          } else if (actionType === 'favorite') {
            stats.favoritesCount++;
          }
        });
      }

      // TODO: 获取评论数量（从 comments 表）
      // 这里先返回基础统计，评论数量会在后续实现评论功能时添加
      
      return stats;
    } catch (error) {
      console.error('Error fetching interaction stats:', error);
      // 返回默认值而不是抛出错误
      return {
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0
      };
    }
  }

  // 更新内容的统计数据
  async updateContentStats(
    contentType: 'ai-tools' | 'edu-resources' | 'news-articles',
    contentId: number,
    stats: Partial<InteractionStats>
  ): Promise<boolean> {
    try {
      await this.request(`/${contentType}/${contentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: stats
        })
      });
      return true;
    } catch (error) {
      console.error('Error updating content stats:', error);
      return false;
    }
  }

  // 获取评论列表
  async getComments(
    targetType: 'ai-tool' | 'edu-resource' | 'news-article',
    targetId: number,
    page = 1,
    pageSize = 10
  ): Promise<StrapiResponse<Comment>> {
    try {
      const queryParams = this.buildQueryParams({
        filters: {
          targetType,
          targetId
        },
        populate: ['users_permissions_user', 'parent', 'replies'],
        sort: 'createdAt:desc',
        page,
        pageSize,
        publicationState: 'live'
      });

      return await this.request(`/comments?${queryParams}`);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: pageSize,
            pageCount: 0,
            total: 0
          }
        }
      };
    }
  }

  // 创建评论
  async createComment(
    content: string,
    targetType: 'ai-tool' | 'edu-resource' | 'news-article',
    targetId: number,
    userId: number,
    parentId?: number
  ): Promise<{ success: boolean; comment?: Comment }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      const commentData: any = {
        content,
        targetType,
        targetId,
        users_permissions_user: userId
      };

      if (parentId) {
        commentData.parent = parentId;
      }

      const response: StrapiSingleResponse<Comment> = await this.request('/comments', {
        method: 'POST',
        body: JSON.stringify({
          data: commentData
        })
      });

      return {
        success: true,
        comment: response.data
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      return { success: false };
    }
  }

  // 获取用户的互动历史
  async getUserActions(
    userId: number,
    actionType?: 'like' | 'favorite',
    page = 1,
    pageSize = 20
  ): Promise<StrapiResponse<UserAction>> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      const filters: any = {
        users_permissions_user: userId,
        isActive: true
      };

      if (actionType) {
        filters.actionType = actionType;
      }

      const queryParams = this.buildQueryParams({
        filters,
        sort: 'createdAt:desc',
        page,
        pageSize
      });

      return await this.request(`/user-actions?${queryParams}`);
    } catch (error) {
      console.error('Error fetching user actions:', error);
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: pageSize,
            pageCount: 0,
            total: 0
          }
        }
      };
    }
  }

  // 用户认证相关
  async login(email: string, password: string): Promise<{ user: any; jwt: string } | null> {
    try {
      const response = await this.request('/auth/local', {
        method: 'POST',
        body: JSON.stringify({
          identifier: email,
          password
        })
      });

      if (response.jwt) {
        this.setUserToken(response.jwt);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // 用户注册
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: any; jwt: string } | null> {
    try {
      const response = await this.request('/auth/local/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.jwt) {
        this.setUserToken(response.jwt);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<any | null> {
    if (!this.userToken) {
      return null;
    }

    try {
      const user = await this.request('/users/me');
      console.log('Current user data:', user); // 添加日志查看用户数据结构
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  // 登出
  logout() {
    this.userToken = null;
  }

  // =============
  // Dashboard数据获取方法
  // =============

  // 获取用户收藏的内容 (支持按类型筛选)
  async getUserFavorites(
    userId: number, 
    contentType?: 'ai-tool' | 'edu-resource' | 'news-article',
    page = 1,
    pageSize = 20
  ): Promise<{
    data: any[];
    meta: any;
    hasMore: boolean;
  }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      const filters: any = {
        users_permissions_user: userId,
        actionType: 'favorite',
        isActive: true
      };

      if (contentType) {
        filters.targetType = contentType;
      }

      const queryParams = this.buildQueryParams({
        filters,
        sort: 'createdAt:desc',
        page,
        pageSize,
        populate: '*'
      });

      const response = await this.request(`/user-actions?${queryParams}`);
      
      // 获取每个收藏对应的内容详情
      const favoriteContents = await Promise.all(
        response.data.map(async (action: any) => {
          const targetType = action.attributes?.targetType || action.targetType;
          const targetId = action.attributes?.targetId || action.targetId;
          
          try {
            let contentResponse;
            switch (targetType) {
              case 'ai-tool':
                contentResponse = await this.getToolById(targetId);
                break;
              case 'edu-resource':
                contentResponse = await this.getResourceById(targetId);
                break;
              case 'news-article':
                contentResponse = await this.getNewsById(targetId);
                break;
              default:
                return null;
            }

            return {
              ...contentResponse.data,
              contentType: targetType,
              favoritedAt: action.attributes?.createdAt || action.createdAt,
              actionId: action.id || action.documentId
            };
          } catch (error) {
            console.warn(`Failed to fetch content for ${targetType}:${targetId}`, error);
            return null;
          }
        })
      );

      // 过滤掉获取失败的内容
      const validContents = favoriteContents.filter(content => content !== null);

      return {
        data: validContents,
        meta: response.meta,
        hasMore: response.meta.pagination.page < response.meta.pagination.pageCount
      };
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: pageSize,
            pageCount: 0,
            total: 0
          }
        },
        hasMore: false
      };
    }
  }

  // 获取用户点赞的内容 (支持按类型筛选)
  async getUserLikes(
    userId: number, 
    contentType?: 'ai-tool' | 'edu-resource' | 'news-article',
    page = 1,
    pageSize = 20
  ): Promise<{
    data: any[];
    meta: any;
    hasMore: boolean;
  }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      const filters: any = {
        users_permissions_user: userId,
        actionType: 'like',
        isActive: true
      };

      if (contentType) {
        filters.targetType = contentType;
      }

      const queryParams = this.buildQueryParams({
        filters,
        sort: 'createdAt:desc',
        page,
        pageSize,
        populate: '*'
      });

      const response = await this.request(`/user-actions?${queryParams}`);
      
      // 获取每个点赞对应的内容详情
      const likedContents = await Promise.all(
        response.data.map(async (action: any) => {
          const targetType = action.attributes?.targetType || action.targetType;
          const targetId = action.attributes?.targetId || action.targetId;
          
          try {
            let contentResponse;
            switch (targetType) {
              case 'ai-tool':
                contentResponse = await this.getToolById(targetId);
                break;
              case 'edu-resource':
                contentResponse = await this.getResourceById(targetId);
                break;
              case 'news-article':
                contentResponse = await this.getNewsById(targetId);
                break;
              default:
                return null;
            }

            return {
              ...contentResponse.data,
              contentType: targetType,
              likedAt: action.attributes?.createdAt || action.createdAt,
              actionId: action.id || action.documentId
            };
          } catch (error) {
            console.warn(`Failed to fetch content for ${targetType}:${targetId}`, error);
            return null;
          }
        })
      );

      // 过滤掉获取失败的内容
      const validContents = likedContents.filter(content => content !== null);

      return {
        data: validContents,
        meta: response.meta,
        hasMore: response.meta.pagination.page < response.meta.pagination.pageCount
      };
    } catch (error) {
      console.error('Error fetching user likes:', error);
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: pageSize,
            pageCount: 0,
            total: 0
          }
        },
        hasMore: false
      };
    }
  }

  // 获取用户互动历史 (综合点赞和收藏，按时间排序)
  async getUserInteractionHistory(
    userId: number,
    limit = 50
  ): Promise<{
    data: any[];
    total: number;
  }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      const queryParams = this.buildQueryParams({
        filters: {
          users_permissions_user: userId,
          isActive: true
        },
        sort: 'createdAt:desc',
        pageSize: limit,
        populate: '*'
      });

      const response = await this.request(`/user-actions?${queryParams}`);
      
      // 获取每个互动对应的内容详情
      const interactionHistory = await Promise.all(
        response.data.map(async (action: any) => {
          const targetType = action.attributes?.targetType || action.targetType;
          const targetId = action.attributes?.targetId || action.targetId;
          const actionType = action.attributes?.actionType || action.actionType;
          const createdAt = action.attributes?.createdAt || action.createdAt;
          
          try {
            let contentResponse;
            let contentTitle = '未知内容';
            let contentUrl = '#';
            
            switch (targetType) {
              case 'ai-tool':
                contentResponse = await this.getToolById(targetId);
                if (contentResponse?.data) {
                  const data = contentResponse.data.attributes || contentResponse.data;
                  contentTitle = data.name || '未知工具';
                  contentUrl = `/tools/${contentResponse.data.documentId || contentResponse.data.id}`;
                }
                break;
              case 'edu-resource':
                contentResponse = await this.getResourceById(targetId);
                if (contentResponse?.data) {
                  const data = contentResponse.data.attributes || contentResponse.data;
                  contentTitle = data.title || '未知资源';
                  contentUrl = `/resources/${contentResponse.data.documentId || contentResponse.data.id}`;
                }
                break;
              case 'news-article':
                contentResponse = await this.getNewsById(targetId);
                if (contentResponse?.data) {
                  const data = contentResponse.data.attributes || contentResponse.data;
                  contentTitle = data.title || '未知新闻';
                  contentUrl = `/news/${contentResponse.data.documentId || contentResponse.data.id}`;
                }
                break;
            }

            return {
              id: action.id || action.documentId,
              actionType,
              targetType,
              targetId,
              contentTitle,
              contentUrl,
              createdAt,
              actionText: actionType === 'like' ? '点赞了' : '收藏了'
            };
          } catch (error) {
            console.warn(`Failed to fetch content for ${targetType}:${targetId}`, error);
            return {
              id: action.id || action.documentId,
              actionType,
              targetType,
              targetId,
              contentTitle: '内容已删除或不可访问',
              contentUrl: '#',
              createdAt,
              actionText: actionType === 'like' ? '点赞了' : '收藏了'
            };
          }
        })
      );

      return {
        data: interactionHistory,
        total: response.meta.pagination.total
      };
    } catch (error) {
      console.error('Error fetching user interaction history:', error);
      return {
        data: [],
        total: 0
      };
    }
  }

  // 获取用户个人统计数据
  async getUserInteractionStats(userId: number): Promise<{
    likesCount: number;
    favoritesCount: number;
    commentsCount: number;
    totalInteractions: number;
  }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      // 并行获取不同类型的互动统计
      const [likesResponse, favoritesResponse] = await Promise.all([
        this.request(`/user-actions?${this.buildQueryParams({
          filters: {
            users_permissions_user: userId,
            actionType: 'like',
            isActive: true
          },
          pageSize: 1
        })}`).catch(err => {
          console.warn('获取likes统计失败:', err.message);
          return { meta: { pagination: { total: 0 } } };
        }),
        this.request(`/user-actions?${this.buildQueryParams({
          filters: {
            users_permissions_user: userId,
            actionType: 'favorite',
            isActive: true
          },
          pageSize: 1
        })}`).catch(err => {
          console.warn('获取favorites统计失败:', err.message);
          return { meta: { pagination: { total: 0 } } };
        })
      ]);

      const likesCount = likesResponse?.meta?.pagination?.total || 0;
      const favoritesCount = favoritesResponse?.meta?.pagination?.total || 0;
      
      // TODO: 评论数量暂时设为0，等评论功能完善后再实现
      const commentsCount = 0;
      
      return {
        likesCount,
        favoritesCount,
        commentsCount,
        totalInteractions: likesCount + favoritesCount + commentsCount
      };
    } catch (error) {
      console.error('获取用户统计数据失败:', error);
      // 返回默认值而不是抛出错误
      return {
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0,
        totalInteractions: 0
      };
    }
  }

  // 获取用户个人统计数据 (备选方案：通过实际数据计算)
  async getUserInteractionStatsAlternative(userId: number): Promise<{
    likesCount: number;
    favoritesCount: number;
    commentsCount: number;
    totalInteractions: number;
  }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      // 通过获取实际的用户收藏数据来计算统计
      const favoritesResponse = await this.getUserFavorites(userId, undefined, 1, 1);
      const likesResponse = await this.getUserLikes(userId, undefined, 1, 1);
      
      const favoritesCount = favoritesResponse.meta?.pagination?.total || 0;
      const likesCount = likesResponse.meta?.pagination?.total || 0;
      const commentsCount = 0; // TODO: 实现评论统计
      
      return {
        likesCount,
        favoritesCount,
        commentsCount,
        totalInteractions: likesCount + favoritesCount + commentsCount
      };
    } catch (error) {
      console.error('备选统计方案失败:', error);
      return {
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0,
        totalInteractions: 0
      };
    }
  }

  // 删除收藏/取消点赞 (通过设置isActive为false)
  async removeUserAction(actionId: string | number): Promise<boolean> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      await this.request(`/user-actions/${actionId}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            isActive: false
          }
        })
      });
      return true;
    } catch (error) {
      console.error('Error removing user action:', error);
      return false;
    }
  }
}

// 导出单例实例
export const strapiService = new StrapiService();
export default strapiService;