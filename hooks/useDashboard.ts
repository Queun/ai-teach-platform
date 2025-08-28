'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import strapiService from '@/lib/strapi';
import { useAuth } from '@/contexts/AuthContext';

// =============
// 用户收藏Hook
// =============

export interface UseFavoritesProps {
  contentType?: 'ai-tool' | 'edu-resource' | 'news-article';
  pageSize?: number;
}

export interface UseFavoritesReturn {
  favorites: any[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  
  // 操作方法
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  removeFavorite: (actionId: string | number) => Promise<boolean>;
}

export function useFavorites({ 
  contentType, 
  pageSize = 10 
}: UseFavoritesProps = {}): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const initializeRef = useRef(false);

  // 使用AuthContext的认证状态
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // 获取收藏数据
  const fetchFavorites = useCallback(async (page = 1, reset = false) => {
    if (!user || !isAuthenticated) {
      return;
    }

    try {
      setError(null);
      if (page === 1 || reset) setLoading(true);
      
      const response = await strapiService.getUserFavorites(
        user.id,
        contentType,
        page,
        pageSize
      );

      if (reset || page === 1) {
        setFavorites(response.data);
      } else {
        setFavorites(prev => [...prev, ...response.data]);
      }

      setCurrentPage(page);
      setHasMore(response.hasMore);
      setTotalCount(response.meta.pagination.total);
    } catch (err: any) {
      console.error('获取收藏数据失败:', err);
      setError(err.message || '获取收藏列表失败');
    } finally {
      setLoading(false);
    }
  }, [user?.id, contentType, pageSize, isAuthenticated]); // 只依赖于稳定的属性

  // 加载更多
  const loadMore = useCallback(async () => {
    if (hasMore && !loading && user && isAuthenticated) {
      await fetchFavorites(currentPage + 1);
    }
  }, [hasMore, loading, currentPage, user?.id, isAuthenticated, fetchFavorites]);

  // 刷新数据
  const refresh = useCallback(async () => {
    if (user && isAuthenticated) {
      await fetchFavorites(1, true);
    }
  }, [user?.id, isAuthenticated, fetchFavorites]);

  // 删除收藏
  const removeFavorite = useCallback(async (actionId: string | number): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const success = await strapiService.removeUserAction(actionId);
      if (success) {
        // 从本地状态中移除
        setFavorites(prev => prev.filter(fav => fav.actionId !== actionId));
        setTotalCount(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }, [isAuthenticated]);

  // 初始化和数据获取
  useEffect(() => {
    // 等待认证加载完成
    if (authLoading) {
      return;
    }

    // 用户已认证，获取数据
    if (isAuthenticated && user && !initializeRef.current) {
      initializeRef.current = true;
      fetchFavorites(1, true);
    } else if (!isAuthenticated) {
      setLoading(false);
      setFavorites([]);
      setTotalCount(0);
    }
  }, [isAuthenticated, authLoading, user?.id, fetchFavorites]);
  
  // 当筛选参数变化时重新获取数据
  useEffect(() => {
    if (initializeRef.current && user && isAuthenticated) {
      fetchFavorites(1, true);
    }
  }, [contentType, pageSize, user?.id, isAuthenticated, fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    hasMore,
    totalCount,
    
    // 操作方法
    loadMore,
    refresh,
    removeFavorite
  };
}

// =============
// 用户互动历史Hook
// =============

export interface UseInteractionHistoryReturn {
  history: any[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  
  // 操作方法
  refresh: () => Promise<void>;
}

export function useInteractionHistory(limit = 50): UseInteractionHistoryReturn {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const initializeRef = useRef(false);

  // 使用AuthContext的认证状态
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // 获取互动历史数据
  const fetchHistory = useCallback(async () => {
    if (!user || !isAuthenticated) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const response = await strapiService.getUserInteractionHistory(
        user.id,
        limit
      );

      setHistory(response.data);
      setTotalCount(response.total);
    } catch (err: any) {
      console.error('获取历史数据失败:', err);
      setError(err.message || '获取互动历史失败');
    } finally {
      setLoading(false);
    }
  }, [user?.id, limit, isAuthenticated]);

  // 刷新数据
  const refresh = useCallback(async () => {
    if (user && isAuthenticated) {
      await fetchHistory();
    }
  }, [user?.id, isAuthenticated, fetchHistory]);

  // 初始化和数据获取
  useEffect(() => {
    // 等待认证加载完成
    if (authLoading) {
      return;
    }

    // 用户已认证，获取数据
    if (isAuthenticated && user && !initializeRef.current) {
      initializeRef.current = true;
      fetchHistory();
    } else if (!isAuthenticated) {
      setLoading(false);
      setHistory([]);
      setTotalCount(0);
    }
  }, [isAuthenticated, authLoading, user?.id, fetchHistory]);
  
  // 当limit变化时重新获取数据
  useEffect(() => {
    if (initializeRef.current && user && isAuthenticated) {
      fetchHistory();
    }
  }, [limit, user?.id, isAuthenticated, fetchHistory]);

  return {
    history,
    loading,
    error,
    totalCount,
    
    // 操作方法
    refresh
  };
}

// =============
// 用户统计数据Hook
// =============

export interface UseUserStatsReturn {
  stats: {
    likesCount: number;
    favoritesCount: number;
    commentsCount: number;
    totalInteractions: number;
  };
  loading: boolean;
  error: string | null;
  
  // 操作方法
  refresh: () => Promise<void>;
}

export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState({
    likesCount: 0,
    favoritesCount: 0,
    commentsCount: 0,
    totalInteractions: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializeRef = useRef(false);

  // 使用AuthContext的认证状态
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    if (!user || !isAuthenticated) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      // 首先尝试原始方法
      try {
        const response = await strapiService.getUserInteractionStats(user.id);
        setStats(response);
        return;
      } catch (primaryError) {
        // 尝试备选方案
        const response = await strapiService.getUserInteractionStatsAlternative(user.id);
        setStats(response);
      }
    } catch (err: any) {
      console.error('获取统计数据失败:', err);
      setError(err.message || '获取统计数据失败');
      // 设置默认值
      setStats({
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0,
        totalInteractions: 0
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  // 刷新数据
  const refresh = useCallback(async () => {
    if (user && isAuthenticated) {
      await fetchStats();
    }
  }, [user?.id, isAuthenticated, fetchStats]);

  // 初始化和数据获取
  useEffect(() => {
    // 等待认证加载完成
    if (authLoading) {
      return;
    }

    // 用户已认证，获取数据
    if (isAuthenticated && user && !initializeRef.current) {
      initializeRef.current = true;
      fetchStats();
    } else if (!isAuthenticated) {
      setLoading(false);
      setStats({
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0,
        totalInteractions: 0
      });
    }
  }, [isAuthenticated, authLoading, user?.id, fetchStats]);

  return {
    stats,
    loading,
    error,
    
    // 操作方法
    refresh
  };
}

// =============
// 综合Dashboard Hook (可选)
// =============

export interface UseDashboardReturn {
  favorites: any[];
  history: any[];
  stats: {
    likesCount: number;
    favoritesCount: number;
    commentsCount: number;
    totalInteractions: number;
  };
  
  loading: {
    favorites: boolean;
    history: boolean;
    stats: boolean;
  };
  
  error: {
    favorites: string | null;
    history: string | null;
    stats: string | null;
  };
  
  // 操作方法
  refreshAll: () => Promise<void>;
  removeFavorite: (actionId: string | number) => Promise<boolean>;
}

export function useDashboard(): UseDashboardReturn {
  const favoritesHook = useFavorites({ pageSize: 20 });
  const historyHook = useInteractionHistory(30);
  const statsHook = useUserStats();

  const refreshAll = useCallback(async () => {
    await Promise.all([
      favoritesHook.refresh(),
      historyHook.refresh(),
      statsHook.refresh()
    ]);
  }, [favoritesHook.refresh, historyHook.refresh, statsHook.refresh]);

  return {
    favorites: favoritesHook.favorites,
    history: historyHook.history,
    stats: statsHook.stats,
    
    loading: {
      favorites: favoritesHook.loading,
      history: historyHook.loading,
      stats: statsHook.loading
    },
    
    error: {
      favorites: favoritesHook.error,
      history: historyHook.error,
      stats: statsHook.error
    },
    
    // 操作方法
    refreshAll,
    removeFavorite: favoritesHook.removeFavorite
  };
}

export default useDashboard;