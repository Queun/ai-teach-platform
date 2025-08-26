'use client';

import { useState, useEffect, useCallback } from 'react';
import strapiService from '@/lib/strapi';
import type {
  AITool,
  EduResource,
  NewsArticle,
  ToolsQuery,
  ResourcesQuery,
  NewsQuery,
  SearchResult,
  StrapiResponse,
  StrapiSingleResponse
} from '@/types/strapi';

// 通用状态类型
interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  } | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

// =============
// AI工具相关Hooks
// =============

export function useTools(params: ToolsQuery = {}): UseListState<AITool> {
  const [state, setState] = useState<{
    data: AITool[];
    loading: boolean;
    error: string | null;
    pagination: any;
  }>({
    data: [],
    loading: true,
    error: null,
    pagination: null
  });

  const fetchData = useCallback(async (append = false) => {
    try {
      if (!append) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      const response = await strapiService.getTools(params);
      
      setState(prev => ({
        data: append ? [...prev.data, ...response.data] : response.data,
        loading: false,
        error: null,
        pagination: response.meta.pagination
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取AI工具数据失败'
      }));
    }
  }, [JSON.stringify(params)]);

  const loadMore = useCallback(async () => {
    if (state.pagination && state.pagination.page < state.pagination.pageCount) {
      const nextPageParams = {
        ...params,
        page: state.pagination.page + 1
      };
      
      try {
        const response = await strapiService.getTools(nextPageParams);
        setState(prev => ({
          data: [...prev.data, ...response.data],
          loading: false,
          error: null,
          pagination: response.meta.pagination
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '加载更多数据失败'
        }));
      }
    }
  }, [params, state.pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: () => fetchData(false),
    loadMore,
    hasMore: state.pagination ? state.pagination.page < state.pagination.pageCount : false
  };
}

export function useTool(id: string | number): UseDataState<AITool> {
  const [state, setState] = useState<{
    data: AITool | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await strapiService.getToolById(id);
      setState({
        data: response.data,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '获取AI工具详情失败'
      });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData
  };
}

export function useFeaturedTools(limit = 6): UseListState<AITool> {
  return useTools({
    featured: true,
    pageSize: limit,
    sort: 'sortOrder:asc'
  });
}

// =============
// 教育资源相关Hooks
// =============

export function useResources(params: ResourcesQuery = {}): UseListState<EduResource> {
  const [state, setState] = useState<{
    data: EduResource[];
    loading: boolean;
    error: string | null;
    pagination: any;
  }>({
    data: [],
    loading: true,
    error: null,
    pagination: null
  });

  const fetchData = useCallback(async (append = false) => {
    try {
      if (!append) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      const response = await strapiService.getResources(params);
      
      setState(prev => ({
        data: append ? [...prev.data, ...response.data] : response.data,
        loading: false,
        error: null,
        pagination: response.meta.pagination
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取教育资源数据失败'
      }));
    }
  }, [JSON.stringify(params)]);

  const loadMore = useCallback(async () => {
    if (state.pagination && state.pagination.page < state.pagination.pageCount) {
      const nextPageParams = {
        ...params,
        page: state.pagination.page + 1
      };
      
      try {
        const response = await strapiService.getResources(nextPageParams);
        setState(prev => ({
          data: [...prev.data, ...response.data],
          loading: false,
          error: null,
          pagination: response.meta.pagination
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '加载更多数据失败'
        }));
      }
    }
  }, [params, state.pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: () => fetchData(false),
    loadMore,
    hasMore: state.pagination ? state.pagination.page < state.pagination.pageCount : false
  };
}

export function useResource(id: string | number): UseDataState<EduResource> {
  const [state, setState] = useState<{
    data: EduResource | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await strapiService.getResourceById(id);
      setState({
        data: response.data,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '获取教育资源详情失败'
      });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData
  };
}

// =============
// 新闻资讯相关Hooks
// =============

export function useNews(params: NewsQuery = {}): UseListState<NewsArticle> {
  const [state, setState] = useState<{
    data: NewsArticle[];
    loading: boolean;
    error: string | null;
    pagination: any;
  }>({
    data: [],
    loading: true,
    error: null,
    pagination: null
  });

  const fetchData = useCallback(async (append = false) => {
    try {
      if (!append) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      const response = await strapiService.getNews(params);
      
      setState(prev => ({
        data: append ? [...prev.data, ...response.data] : response.data,
        loading: false,
        error: null,
        pagination: response.meta.pagination
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取新闻数据失败'
      }));
    }
  }, [JSON.stringify(params)]);

  const loadMore = useCallback(async () => {
    if (state.pagination && state.pagination.page < state.pagination.pageCount) {
      const nextPageParams = {
        ...params,
        page: state.pagination.page + 1
      };
      
      try {
        const response = await strapiService.getNews(nextPageParams);
        setState(prev => ({
          data: [...prev.data, ...response.data],
          loading: false,
          error: null,
          pagination: response.meta.pagination
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '加载更多数据失败'
        }));
      }
    }
  }, [params, state.pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: () => fetchData(false),
    loadMore,
    hasMore: state.pagination ? state.pagination.page < state.pagination.pageCount : false
  };
}

export function useNewsArticle(id: string | number): UseDataState<NewsArticle> {
  const [state, setState] = useState<{
    data: NewsArticle | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await strapiService.getNewsById(id);
      setState({
        data: response.data,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '获取新闻详情失败'
      });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData
  };
}

// =============
// 搜索功能Hook
// =============

export function useSearch() {
  const [state, setState] = useState<{
    data: SearchResult;
    loading: boolean;
    error: string | null;
  }>({
    data: { tools: [], resources: [], news: [], total: 0 },
    loading: false,
    error: null
  });

  const search = useCallback(async (query: string, type?: 'tools' | 'resources' | 'news') => {
    if (!query.trim()) {
      setState({
        data: { tools: [], resources: [], news: [], total: 0 },
        loading: false,
        error: null
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const results = await strapiService.search(query, type);
      setState({
        data: results,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '搜索失败'
      }));
    }
  }, []);

  const clearSearch = useCallback(() => {
    setState({
      data: { tools: [], resources: [], news: [], total: 0 },
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    search,
    clearSearch
  };
}

// =============
// 统计数据Hook
// =============

export function useStats() {
  const [state, setState] = useState<{
    data: { tools: number; resources: number; news: number };
    loading: boolean;
    error: string | null;
  }>({
    data: { tools: 0, resources: 0, news: 0 },
    loading: true,
    error: null
  });

  const fetchStats = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const stats = await strapiService.getStats();
      setState({
        data: stats,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: { tools: 0, resources: 0, news: 0 },
        loading: false,
        error: error instanceof Error ? error.message : '获取统计数据失败'
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...state,
    refetch: fetchStats
  };
}

// =============
// 资源分类统计Hook
// =============

interface CategoryStats {
  category: string;
  count: number;
  label: string;
  icon: string;
}

export function useResourceCategories(): UseListState<CategoryStats> {
  const [state, setState] = useState<{
    data: CategoryStats[];
    loading: boolean;
    error: string | null;
    pagination: null;
  }>({
    data: [],
    loading: true,
    error: null,
    pagination: null
  });

  const fetchCategories = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // 获取所有资源以分析分类
      const response = await strapiService.getResources({ 
        pageSize: 100,
        fields: ['category']
      });
      
      // 统计分类数量
      const categoryMap = new Map<string, number>();
      response.data.forEach(resource => {
        const category = resource.category || 'uncategorized';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      
      // 分类标签和图标映射
      const categoryLabels: Record<string, { label: string; icon: string }> = {
        'teaching-guides': { label: '教学指南', icon: '📖' },
        'ai-tools': { label: 'AI工具评测', icon: '🤖' },
        'case-studies': { label: '教学案例', icon: '💡' },
        'templates': { label: '教学模板', icon: '📄' },
        'research': { label: '学术研究', icon: '🔬' },
        'course-materials': { label: '课程资料', icon: '📚' },
        'lesson-plans': { label: '教案设计', icon: '📝' },
        'assessment': { label: '评估工具', icon: '📊' },
        'multimedia': { label: '多媒体资源', icon: '🎬' },
        'uncategorized': { label: '其他', icon: '📋' }
      };
      
      // 生成分类统计数据
      const categories: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
        label: categoryLabels[category]?.label || category,
        icon: categoryLabels[category]?.icon || '📋'
      }));
      
      // 按数量排序
      categories.sort((a, b) => b.count - a.count);
      
      // 添加"全部"选项
      const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
      const allCategories = [
        { category: 'all', count: totalCount, label: '全部资源', icon: '📚' },
        ...categories
      ];
      
      setState({
        data: allCategories,
        loading: false,
        error: null,
        pagination: null
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取资源分类失败'
      }));
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...state,
    refetch: fetchCategories,
    loadMore: async () => {}, // 分类数据不需要分页加载
    hasMore: false
  };
}

// =============
// 工具分类统计Hook
// =============

interface ToolCategoryStats {
  category: string;
  count: number;
  label: string;
  icon: string;
}

export function useToolCategories(): UseListState<ToolCategoryStats> {
  const [state, setState] = useState<{
    data: ToolCategoryStats[];
    loading: boolean;
    error: string | null;
    pagination: null;
  }>({
    data: [],
    loading: true,
    error: null,
    pagination: null
  });

  const fetchCategories = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // 获取所有工具以分析分类
      const response = await strapiService.getTools({ 
        pageSize: 100,
        fields: ['category']
      });
      
      // 统计分类数量
      const categoryMap = new Map<string, number>();
      response.data.forEach(tool => {
        const category = tool.category || 'other';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      
      // 分类标签和图标映射
      const categoryLabels: Record<string, { label: string; icon: string }> = {
        'content-creation': { label: '内容创作', icon: '✍️' },
        'assessment': { label: '评估测试', icon: '📊' },
        'communication': { label: '交流互动', icon: '💬' },
        'multimedia': { label: '多媒体', icon: '🎨' },
        'analytics': { label: '数据分析', icon: '📈' },
        'language': { label: '语言学习', icon: '🔤' },
        'math': { label: '数学计算', icon: '🔢' },
        'presentation': { label: '演示展示', icon: '📽️' },
        'research': { label: '研究辅助', icon: '🔬' },
        'productivity': { label: '效率提升', icon: '⚡' },
        'other': { label: '其他工具', icon: '🔧' }
      };
      
      // 生成分类统计数据
      const categories: ToolCategoryStats[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
        label: categoryLabels[category]?.label || category,
        icon: categoryLabels[category]?.icon || '🔧'
      }));
      
      // 按数量排序
      categories.sort((a, b) => b.count - a.count);
      
      // 添加"全部"选项
      const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
      const allCategories = [
        { category: 'all', count: totalCount, label: '全部工具', icon: '🌐' },
        ...categories
      ];
      
      setState({
        data: allCategories,
        loading: false,
        error: null,
        pagination: null
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取工具分类失败'
      }));
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...state,
    refetch: fetchCategories,
    loadMore: async () => {}, // 分类数据不需要分页加载
    hasMore: false
  };
}

// =============
// 新闻分类统计Hook
// =============

interface NewsCategoryStats {
  category: string;
  count: number;
  label: string;
  icon: string;
}

export function useNewsCategories(): UseListState<NewsCategoryStats> {
  const [state, setState] = useState<{
    data: NewsCategoryStats[];
    loading: boolean;
    error: string | null;
    pagination: null;
  }>({
    data: [],
    loading: true,
    error: null,
    pagination: null
  });

  const fetchCategories = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // 获取所有新闻以分析分类
      const response = await strapiService.getNews({ 
        pageSize: 100,
        fields: ['category']
      });
      
      // 统计分类数量
      const categoryMap = new Map<string, number>();
      response.data.forEach(article => {
        const category = article.category || 'general';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      
      // 分类标签和图标映射
      const categoryLabels: Record<string, { label: string; icon: string }> = {
        // 英文分类键名
        'policy': { label: '政策动态', icon: '📋' },
        'tools': { label: '工具评测', icon: '🔧' },
        'cases': { label: '教学案例', icon: '💡' },
        'opinions': { label: '教育观点', icon: '💭' },
        'events': { label: '活动通知', icon: '📅' },
        'research': { label: '研究报告', icon: '📊' },
        'technology': { label: '技术前沿', icon: '🚀' },
        'interview': { label: '人物访谈', icon: '🎤' },
        'trend': { label: '行业趋势', icon: '📈' },
        'general': { label: '综合资讯', icon: '📰' },
        
        // 中文分类名（直接支持您的Strapi数据）
        '政策法规': { label: '政策法规', icon: '📋' },
        '政策动态': { label: '政策动态', icon: '📋' },
        '工具评测': { label: '工具评测', icon: '🔧' },
        '教学案例': { label: '教学案例', icon: '💡' },
        '教育观点': { label: '教育观点', icon: '💭' },
        '活动通知': { label: '活动通知', icon: '📅' },
        '研究报告': { label: '研究报告', icon: '📊' },
        '技术前沿': { label: '技术前沿', icon: '🚀' },
        '人物访谈': { label: '人物访谈', icon: '🎤' },
        '行业趋势': { label: '行业趋势', icon: '📈' },
        '行业动态': { label: '行业动态', icon: '📈' },
        '综合资讯': { label: '综合资讯', icon: '📰' },
        '资讯': { label: '综合资讯', icon: '📰' }
      };
      
      // 生成分类统计数据
      const categories: NewsCategoryStats[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
        label: categoryLabels[category]?.label || category,
        icon: categoryLabels[category]?.icon || '📰'
      }));
      
      // 按数量排序
      categories.sort((a, b) => b.count - a.count);
      
      // 添加"全部"选项
      const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
      const allCategories = [
        { category: 'all', count: totalCount, label: '全部资讯', icon: '📰' },
        ...categories
      ];
      
      setState({
        data: allCategories,
        loading: false,
        error: null,
        pagination: null
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取新闻分类失败'
      }));
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...state,
    refetch: fetchCategories,
    loadMore: async () => {}, // 分类数据不需要分页加载
    hasMore: false
  };
}