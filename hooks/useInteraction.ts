'use client';

import { useState, useEffect, useCallback } from 'react';
import strapiService from '@/lib/strapi';
import type {
  UserInteractionState,
  InteractionStats
} from '@/types/strapi';

// 用户互动Hook的参数类型
export interface UseInteractionProps {
  targetType: 'ai-tool' | 'edu-resource' | 'news-article';
  targetId: number | string; // 支持字符串 ID
  initialStats?: InteractionStats;
}

// Hook返回值类型
export interface UseInteractionReturn {
  // 当前用户状态
  isLiked: boolean;
  isFavorited: boolean;
  
  // 统计数据
  stats: InteractionStats;
  
  // 加载状态
  loading: boolean;
  
  // 操作方法
  toggleLike: () => Promise<void>;
  toggleFavorite: () => Promise<void>;
  
  // 认证状态
  isAuthenticated: boolean;
  currentUser: any;
  
  // 刷新方法
  refresh: () => Promise<void>;
}

/**
 * 用户互动Hook
 * 
 * 功能：
 * 1. 管理用户的点赞/收藏状态
 * 2. 提供切换操作方法
 * 3. 实时更新统计数据
 * 4. 乐观UI更新
 * 5. 错误回滚机制
 * 
 * @param props 配置参数
 * @returns 互动状态和方法
 */
export function useInteraction({
  targetType,
  targetId,
  initialStats
}: UseInteractionProps): UseInteractionReturn {
  // 用户互动状态
  const [userState, setUserState] = useState<UserInteractionState>({
    isLiked: false,
    isFavorited: false
  });
  
  // 统计数据状态
  const [stats, setStats] = useState<InteractionStats>(
    initialStats || {
      likesCount: 0,
      favoritesCount: 0,
      commentsCount: 0
    }
  );
  
  // 加载状态
  const [loading, setLoading] = useState(true);
  
  // 用户认证状态
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 获取用户认证状态
  const checkAuthStatus = useCallback(async () => {
    try {
      const user = await strapiService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        return user;
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);
  
  // 获取用户互动状态和统计数据
  const fetchData = useCallback(async (user?: any) => {
    try {
      setLoading(true);
      
      // 获取互动统计数据
      const statsPromise = strapiService.getInteractionStats(targetType, targetId);
      
      // 如果用户已登录，获取用户互动状态
      let userStatePromise = Promise.resolve({ isLiked: false, isFavorited: false });
      if (user && user.id) {
        userStatePromise = strapiService.getUserInteraction(user.id, targetType, targetId);
      }
      
      const [statsResult, userStateResult] = await Promise.all([
        statsPromise,
        userStatePromise
      ]);
      
      // 更新状态
      setStats(statsResult);
      setUserState(userStateResult);
      
    } catch (error) {
      console.error('Error fetching interaction data:', error);
      
      // 使用初始值或默认值
      setStats(initialStats || { likesCount: 0, favoritesCount: 0, commentsCount: 0 });
      setUserState({ isLiked: false, isFavorited: false });
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId, initialStats]);
  
  // 刷新数据
  const refresh = useCallback(async () => {
    const user = await checkAuthStatus();
    await fetchData(user);
  }, [checkAuthStatus, fetchData]);
  
  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      const user = await checkAuthStatus();
      await fetchData(user);
    };
    
    initializeData();
  }, [targetType, targetId, checkAuthStatus, fetchData]);
  
  // 通用的操作方法
  const toggleAction = useCallback(async (
    actionType: 'like' | 'favorite',
    currentState: boolean,
    statKey: keyof InteractionStats
  ) => {
    // 检查认证状态
    if (!isAuthenticated || !currentUser) {
      console.warn('User not authenticated');
      // 可以在这里触发登录弹窗或跳转到登录页
      return;
    }
    
    // 乐观UI更新
    const newState = !currentState;
    const statsDelta = newState ? 1 : -1;
    
    // 更新用户状态
    setUserState(prev => ({
      ...prev,
      [actionType === 'like' ? 'isLiked' : 'isFavorited']: newState
    }));
    
    // 更新统计数据
    setStats(prev => ({
      ...prev,
      [statKey]: Math.max(0, prev[statKey] + statsDelta)
    }));
    
    try {
      // 调用真实API
      const result = await strapiService.toggleUserAction(
        actionType,
        targetType,
        targetId,
        currentUser.id
      );
      
      if (!result.success) {
        // API调用失败，回滚UI更新
        console.error(`Failed to ${actionType} content`);
        
        setUserState(prev => ({
          ...prev,
          [actionType === 'like' ? 'isLiked' : 'isFavorited']: currentState
        }));
        
        setStats(prev => ({
          ...prev,
          [statKey]: Math.max(0, prev[statKey] - statsDelta)
        }));
        
        return;
      }
      
      // 验证服务器返回的状态与本地状态一致
      const finalState = result.isActive;
      if (finalState !== newState) {
        setUserState(prev => ({
          ...prev,
          [actionType === 'like' ? 'isLiked' : 'isFavorited']: finalState
        }));
        
        // 重新计算统计数据（服务器状态为准）
        const correctionDelta = finalState ? 1 : -1;
        setStats(prev => ({
          ...prev,
          [statKey]: Math.max(0, prev[statKey] - statsDelta + correctionDelta)
        }));
      }
      
    } catch (error) {
      console.error(`Error toggling ${actionType}:`, error);
      
      // 错误时回滚UI更新
      setUserState(prev => ({
        ...prev,
        [actionType === 'like' ? 'isLiked' : 'isFavorited']: currentState
      }));
      
      setStats(prev => ({
        ...prev,
        [statKey]: Math.max(0, prev[statKey] - statsDelta)
      }));
    }
  }, [isAuthenticated, currentUser, targetType, targetId]);
  
  // 点赞切换
  const toggleLike = useCallback(() => {
    return toggleAction('like', userState.isLiked, 'likesCount');
  }, [toggleAction, userState.isLiked]);
  
  // 收藏切换
  const toggleFavorite = useCallback(() => {
    return toggleAction('favorite', userState.isFavorited, 'favoritesCount');
  }, [toggleAction, userState.isFavorited]);
  
  return {
    // 用户状态
    isLiked: userState.isLiked,
    isFavorited: userState.isFavorited,
    
    // 统计数据
    stats,
    
    // 加载状态
    loading,
    
    // 操作方法
    toggleLike,
    toggleFavorite,
    
    // 认证信息
    isAuthenticated,
    currentUser,
    
    // 工具方法
    refresh
  };
}

/**
 * 评论Hook
 * 
 * 功能：
 * 1. 获取和管理评论列表
 * 2. 发布新评论
 * 3. 回复评论
 * 4. 分页加载
 */
export interface UseCommentsProps {
  targetType: 'ai-tool' | 'edu-resource' | 'news-article';
  targetId: number | string; // 支持字符串 ID
  pageSize?: number;
}

export interface UseCommentsReturn {
  comments: any[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  
  // 操作方法
  createComment: (content: string, parentId?: number) => Promise<boolean>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  
  // 认证状态
  isAuthenticated: boolean;
}

export function useComments({
  targetType,
  targetId,
  pageSize = 10
}: UseCommentsProps): UseCommentsReturn {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // 检查认证状态
  const checkAuthStatus = useCallback(async () => {
    try {
      const user = await strapiService.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      return user;
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);
  
  // 获取评论列表
  const fetchComments = useCallback(async (page = 1, reset = false) => {
    try {
      setError(null);
      if (page === 1) setLoading(true);
      
      const response = await strapiService.getComments(
        targetType,
        targetId,
        page,
        pageSize
      );
      
      if (reset || page === 1) {
        setComments(response.data);
      } else {
        setComments(prev => [...prev, ...response.data]);
      }
      
      setCurrentPage(page);
      setHasMore(page < response.meta.pagination.pageCount);
    } catch (err: any) {
      setError(err.message || '获取评论失败');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId, pageSize]);
  
  // 创建评论
  const createComment = useCallback(async (
    content: string,
    parentId?: number
  ): Promise<boolean> => {
    if (!isAuthenticated || !currentUser) {
      setError('请先登录');
      return false;
    }
    
    try {
      const result = await strapiService.createComment(
        content,
        targetType,
        targetId,
        currentUser.id,
        parentId
      );
      
      if (result.success) {
        // 评论创建成功，刷新评论列表
        await fetchComments(1, true);
        return true;
      } else {
        setError('评论发布失败');
        return false;
      }
    } catch (err: any) {
      setError(err.message || '评论发布失败');
      return false;
    }
  }, [isAuthenticated, currentUser, targetType, targetId, fetchComments]);
  
  // 加载更多
  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await fetchComments(currentPage + 1);
    }
  }, [hasMore, loading, currentPage, fetchComments]);
  
  // 刷新评论
  const refresh = useCallback(async () => {
    await fetchComments(1, true);
  }, [fetchComments]);
  
  // 初始化
  useEffect(() => {
    const initialize = async () => {
      await checkAuthStatus();
      await fetchComments(1, true);
    };
    
    initialize();
  }, [targetType, targetId, checkAuthStatus, fetchComments]);
  
  return {
    comments,
    loading,
    error,
    hasMore,
    
    // 操作方法
    createComment,
    loadMore,
    refresh,
    
    // 认证状态
    isAuthenticated
  };
}

export default useInteraction;