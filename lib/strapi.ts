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
        if (value !== undefined) {
          // 特殊处理：过滤null值（用于获取顶级评论）
          if (value === null) {
            searchParams.set(`filters[${key}][$null]`, 'true');
          }
          // 对于特殊字段使用精确匹配
          else if (key === 'users_permissions_user' || key === 'targetId' || key === 'targetType' || key === 'actionType' || key === 'isActive' || key === 'parent') {
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
      sort: 'publishedAt:desc'
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

        // 🔥 关键修改：同步更新内容的统计数据
        await this.syncContentStats(targetType, targetId);

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
        
        // 🔥 关键修改：同步更新内容的统计数据
        await this.syncContentStats(targetType, targetId);
        
        return { success: true, isActive: true };
      }
    } catch (error) {
      console.error('Error toggling user action:', error);
      return { success: false, isActive: false };
    }
  }

  // 同步内容的统计数据
  async syncContentStats(
    targetType: 'ai-tool' | 'edu-resource' | 'news-article',
    targetId: number | string
  ): Promise<boolean> {
    try {
      // 获取最新的互动统计数据
      const stats = await this.getInteractionStats(targetType, targetId);
      
      // 映射 targetType 到对应的 API 端点
      const contentTypeMap = {
        'ai-tool': 'ai-tools',
        'edu-resource': 'edu-resources', 
        'news-article': 'news-articles'
      } as const;
      
      const contentApiType = contentTypeMap[targetType];
      
      // 更新内容的统计字段
      const result = await this.updateContentStats(contentApiType, targetId, {
        likesCount: stats.likesCount,
        favoritesCount: stats.favoritesCount,
        commentsCount: stats.commentsCount
      });
      
      if (result) {
        console.log(`✅ 已同步 ${targetType} ${targetId} 的统计数据:`, stats);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ 同步统计数据失败 ${targetType} ${targetId}:`, error);
      return false;
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
    contentId: number | string, // 支持字符串ID（documentId）
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
    targetId: number | string,
    page = 1,
    pageSize = 10,
    includeUnpublished = false // 新增参数：是否包含未发布的评论（用于管理员审核）
  ): Promise<StrapiResponse<Comment>> {
    try {
      const queryParams = this.buildQueryParams({
        filters: {
          targetType,
          targetId,
          parent: null // 只获取顶级评论（没有父评论的评论）
        },
        populate: ['users_permissions_user', 'replies', 'replies.users_permissions_user'],
        sort: 'likesCount:desc,createdAt:desc', // 先按点赞数降序，再按创建时间降序
        page,
        pageSize,
        // 根据参数决定是否包含草稿评论
        publicationState: includeUnpublished ? 'preview' : 'live'
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
    targetId: number | string,
    userId: number,
    parentId?: number | string // 支持字符串 ID
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
        commentData.parent = {
          connect: [parentId]
        };
      }

      // 创建评论为草稿状态，需要审核后发布
      const response: StrapiSingleResponse<Comment> = await this.request('/comments?status=draft', {
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

  // 审核评论（发布草稿评论）
  async approveComment(commentId: number | string): Promise<{ success: boolean }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      await this.request(`/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            publishedAt: new Date().toISOString() // 设置发布时间
          }
        })
      });

      return { success: true };
    } catch (error) {
      console.error('Error approving comment:', error);
      return { success: false };
    }
  }

  // 拒绝评论（删除草稿评论）
  async rejectComment(commentId: number | string): Promise<{ success: boolean }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      await this.request(`/comments/${commentId}`, {
        method: 'DELETE'
      });

      return { success: true };
    } catch (error) {
      console.error('Error rejecting comment:', error);
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

  // 修改密码
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    if (!this.userToken) {
      return { success: false, message: '请先登录' };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, message: '新密码与确认密码不一致' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: '新密码长度至少6位' };
    }

    try {
      await this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword
        })
      });

      return { success: true, message: '密码修改成功' };
    } catch (error: any) {
      console.error('Change password error:', error);
      const errorMessage = error.message || '密码修改失败';
      
      // 处理常见的错误消息
      if (errorMessage.includes('current password')) {
        return { success: false, message: '当前密码不正确' };
      }
      if (errorMessage.includes('password')) {
        return { success: false, message: '密码格式不正确' };
      }
      
      return { success: false, message: errorMessage };
    }
  }

  // 绑定手机号 (预留接口)
  async bindPhoneNumber(
    phoneNumber: string,
    verificationCode: string
  ): Promise<{ success: boolean; message?: string }> {
    if (!this.userToken) {
      return { success: false, message: '请先登录' };
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return { success: false, message: '请输入正确的手机号码' };
    }

    if (!verificationCode || verificationCode.length !== 6) {
      return { success: false, message: '请输入6位验证码' };
    }

    try {
      // TODO: 实现真正的手机号绑定逻辑
      // 当前返回模拟响应，等待短信API申请完成后实现
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络请求

      // 更新用户信息
      const response = await this.request('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          phone: phoneNumber
        })
      });

      return { success: true, message: '手机号绑定成功' };
    } catch (error: any) {
      console.error('Bind phone error:', error);
      return { success: false, message: error.message || '手机号绑定失败' };
    }
  }

  // 发送手机验证码 (预留接口)
  async sendPhoneVerificationCode(phoneNumber: string): Promise<{ success: boolean; message?: string }> {
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return { success: false, message: '请输入正确的手机号码' };
    }

    try {
      // TODO: 实现真正的短信发送逻辑
      // 当前返回模拟响应，等待短信API申请完成后实现
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络请求
      
      return { success: true, message: '验证码已发送，请查收短信' };
    } catch (error: any) {
      console.error('Send verification code error:', error);
      return { success: false, message: error.message || '验证码发送失败' };
    }
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

  // 获取用户互动历史 (综合点赞、收藏和评论，按时间排序)
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
      // 并行获取用户的点赞/收藏记录和评论记录
      const [actionsResponse, commentsResponse] = await Promise.allSettled([
        this.request(`/user-actions?${this.buildQueryParams({
          filters: {
            users_permissions_user: userId,
            isActive: true
          },
          sort: 'createdAt:desc',
          pageSize: Math.floor(limit * 0.7), // 分配70%给actions
          populate: '*'
        })}`),
        this.request(`/comments?${this.buildQueryParams({
          filters: {
            users_permissions_user: userId
          },
          sort: 'createdAt:desc',
          pageSize: Math.floor(limit * 0.3), // 分配30%给评论
          populate: '*',
          publicationState: 'live' // 只获取已发布的评论
        })}`)
      ]);

      let allInteractions: any[] = [];

      // 处理用户行为记录
      if (actionsResponse.status === 'fulfilled') {
        const actionHistories = await Promise.all(
          actionsResponse.value.data.map(async (action: any) => {
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
                type: 'action',
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
                type: 'action',
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
        allInteractions = [...allInteractions, ...actionHistories];
      }

      // 处理评论记录
      if (commentsResponse.status === 'fulfilled') {
        const commentHistories = await Promise.all(
          commentsResponse.value.data.map(async (comment: any) => {
            const commentData = comment.attributes || comment;
            const targetType = commentData.targetType;
            const targetId = commentData.targetId;
            const createdAt = commentData.createdAt;
            const content = commentData.content;
            
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
                id: comment.id || comment.documentId,
                type: 'comment',
                actionType: 'comment',
                targetType,
                targetId,
                contentTitle,
                contentUrl,
                createdAt,
                actionText: '评论了',
                commentContent: content,
                commentPreview: content.length > 50 ? content.substring(0, 50) + '...' : content
              };
            } catch (error) {
              console.warn(`Failed to fetch content for comment ${targetType}:${targetId}`, error);
              return {
                id: comment.id || comment.documentId,
                type: 'comment',
                actionType: 'comment',
                targetType,
                targetId,
                contentTitle: '内容已删除或不可访问',
                contentUrl: '#',
                createdAt,
                actionText: '评论了',
                commentContent: content,
                commentPreview: content.length > 50 ? content.substring(0, 50) + '...' : content
              };
            }
          })
        );
        allInteractions = [...allInteractions, ...commentHistories];
      }

      // 按创建时间降序排序，取前limit条
      const sortedInteractions = allInteractions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      // 计算总数
      const totalActions = actionsResponse.status === 'fulfilled' ? 
        (actionsResponse.value.meta?.pagination?.total || 0) : 0;
      const totalComments = commentsResponse.status === 'fulfilled' ? 
        (commentsResponse.value.meta?.pagination?.total || 0) : 0;

      return {
        data: sortedInteractions,
        total: totalActions + totalComments
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
      const [likesResponse, favoritesResponse, commentsResponse] = await Promise.all([
        this.request(`/user-actions?${this.buildQueryParams({
          filters: {
            users_permissions_user: userId,
            actionType: 'like',
            isActive: true
          },
          pageSize: 1
        })}`).catch(err => {
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
          return { meta: { pagination: { total: 0 } } };
        }),
        this.request(`/comments?${this.buildQueryParams({
          filters: {
            users_permissions_user: userId
          },
          pageSize: 1,
          publicationState: 'live' // 只统计已发布的评论
        })}`).catch(err => {
          return { meta: { pagination: { total: 0 } } };
        })
      ]);

      const likesCount = likesResponse?.meta?.pagination?.total || 0;
      const favoritesCount = favoritesResponse?.meta?.pagination?.total || 0;
      const commentsCount = commentsResponse?.meta?.pagination?.total || 0;
      
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
      // 通过获取实际的用户数据来计算统计
      const [favoritesResponse, likesResponse, commentsResponse] = await Promise.all([
        this.getUserFavorites(userId, undefined, 1, 1).catch(() => ({ meta: { pagination: { total: 0 } } })),
        this.getUserLikes(userId, undefined, 1, 1).catch(() => ({ meta: { pagination: { total: 0 } } })),
        this.request(`/comments?${this.buildQueryParams({
          filters: {
            users_permissions_user: userId
          },
          pageSize: 1,
          publicationState: 'live' // 只统计已发布的评论
        })}`).catch(() => ({ meta: { pagination: { total: 0 } } }))
      ]);
      
      const favoritesCount = favoritesResponse.meta?.pagination?.total || 0;
      const likesCount = likesResponse.meta?.pagination?.total || 0;
      const commentsCount = commentsResponse.meta?.pagination?.total || 0;
      
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

  // =============
  // 浏览量追踪功能
  // =============

  // 增加浏览量
  async incrementViews(
    contentType: 'ai-tools' | 'edu-resources' | 'news-articles',
    contentId: number | string
  ): Promise<boolean> {
    try {
      // 首先获取当前内容的浏览量
      const contentResponse = await this.request(`/${contentType}/${contentId}?populate=*`);
      const currentViews = contentResponse.data?.attributes?.views || contentResponse.data?.views || 0;

      // 更新浏览量
      await this.request(`/${contentType}/${contentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            views: currentViews + 1
          }
        })
      });

      return true;
    } catch (error: any) {
      // 如果错误是 "Invalid key views"，说明该内容类型没有 views 字段
      if (error.message?.includes('Invalid key views')) {
        console.warn(`⚠️  ${contentType} 没有 views 字段，跳过浏览量更新`);
        return false;
      }
      
      console.error('Error incrementing views:', error);
      return false;
    }
  }

  // 批量增加浏览量（可用于统计多个内容的浏览情况）
  async batchIncrementViews(
    items: Array<{
      contentType: 'ai-tools' | 'edu-resources' | 'news-articles';
      contentId: number | string;
    }>
  ): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    const promises = items.map(async (item) => {
      try {
        const success = await this.incrementViews(item.contentType, item.contentId);
        if (success) {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }
    });

    await Promise.allSettled(promises);

    return { successful, failed };
  }

  // 获取浏览量统计（可选功能，用于管理面板）
  async getViewsStats(
    contentType: 'ai-tools' | 'edu-resources' | 'news-articles',
    dateRange?: {
      startDate: string;
      endDate: string;
    }
  ): Promise<{
    totalViews: number;
    averageViews: number;
    topContent: Array<{
      id: number | string;
      title: string;
      views: number;
    }>;
  }> {
    try {
      // 获取所有内容及其浏览量
      const response = await this.request(`/${contentType}?sort=views:desc&populate=*&pagination[pageSize]=100`);

      const contents = response.data || [];
      let totalViews = 0;
      const topContent = [];

      for (const content of contents.slice(0, 10)) { // 只取前10个
        const data = content.attributes || content;
        const views = data.views || 0;
        totalViews += views;
        
        topContent.push({
          id: content.documentId || content.id,
          title: data.name || data.title || '未知内容',
          views
        });
      }

      const averageViews = contents.length > 0 ? totalViews / contents.length : 0;

      return {
        totalViews,
        averageViews: Math.round(averageViews * 100) / 100, // 保留两位小数
        topContent
      };
    } catch (error) {
      console.error('Error getting views stats:', error);
      return {
        totalViews: 0,
        averageViews: 0,
        topContent: []
      };
    }
  }

  // 评论点赞功能
  async toggleCommentLike(
    commentId: number | string,
    userId: number
  ): Promise<{ success: boolean; isActive?: boolean }> {
    if (!this.userToken) {
      throw new Error('User authentication required');
    }

    try {
      // 检查是否已经点赞过这个评论
      const existingResponse = await this.request(
        `/user-actions?filters[users_permissions_user][id][$eq]=${userId}&filters[actionType][$eq]=comment-like&filters[targetType][$eq]=comment&filters[targetId][$eq]=${commentId}`
      );

      let isActive = false;
      let userActionId = null;

      if (existingResponse.data && existingResponse.data.length > 0) {
        // 已存在记录，切换状态
        const existingAction = existingResponse.data[0];
        userActionId = existingAction.documentId || existingAction.id;
        // 修复：兼容不同的数据结构
        const currentIsActive = existingAction.attributes?.isActive ?? existingAction.isActive ?? true;
        isActive = !currentIsActive;

        await this.request(`/user-actions/${userActionId}`, {
          method: 'PUT',
          body: JSON.stringify({
            data: { isActive }
          })
        });
      } else {
        // 创建新的点赞记录
        isActive = true;
        await this.request('/user-actions', {
          method: 'POST',
          body: JSON.stringify({
            data: {
              actionType: 'comment-like',
              targetType: 'comment',
              targetId: commentId,
              users_permissions_user: userId,
              isActive: true
            }
          })
        });
      }

      // 更新评论的点赞数
      if (isActive) {
        // 点赞：增加评论的 likesCount
        await this.updateCommentStats(commentId, 1);
      } else {
        // 取消点赞：减少评论的 likesCount
        await this.updateCommentStats(commentId, -1);
      }

      return { success: true, isActive };
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return { success: false };
    }
  }

  // 更新评论统计数据
  private async updateCommentStats(commentId: number | string, likesCountDelta: number): Promise<void> {
    try {
      // 获取当前评论数据
      const commentResponse = await this.request(`/comments/${commentId}`);
      const currentLikesCount = commentResponse.data.likesCount || commentResponse.data.attributes?.likesCount || 0;
      const newLikesCount = Math.max(0, currentLikesCount + likesCountDelta);

      // 只有当点赞数真正发生变化时才更新
      if (newLikesCount !== currentLikesCount) {
        // 更新评论的点赞数
        await this.request(`/comments/${commentId}`, {
          method: 'PUT',
          body: JSON.stringify({
            data: {
              likesCount: newLikesCount
            }
          })
        });
      }
    } catch (error) {
      console.error('Error updating comment stats:', error);
    }
  }

  // 获取用户对评论的点赞状态
  async getUserCommentLikes(
    userId: number,
    commentIds: (number | string)[]
  ): Promise<Record<string, boolean>> {
    if (!this.userToken || commentIds.length === 0) {
      return {};
    }

    try {
      const filters = commentIds.map(id => `filters[targetId][$in][]=${id}`).join('&');
      const response = await this.request(
        `/user-actions?filters[users_permissions_user][id][$eq]=${userId}&filters[actionType][$eq]=comment-like&filters[targetType][$eq]=comment&filters[isActive][$eq]=true&${filters}`
      );

      const likeMap: Record<string, boolean> = {};
      commentIds.forEach(id => {
        likeMap[String(id)] = false;
      });

      if (response.data) {
        response.data.forEach((action: any) => {
          // 修复：兼容不同的数据结构
          const isActive = action.attributes?.isActive ?? action.isActive ?? false;
          const targetId = action.attributes?.targetId ?? action.targetId;
          if (isActive && targetId) {
            likeMap[String(targetId)] = true;
          }
        });
      }

      return likeMap;
    } catch (error) {
      console.error('Error fetching user comment likes:', error);
      return {};
    }
  }
}

// 导出单例实例
export const strapiService = new StrapiService();
export default strapiService;