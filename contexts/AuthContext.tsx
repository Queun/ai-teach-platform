'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import strapiService from '@/lib/strapi';
import type { User } from '@/types/strapi';

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider组件的Props
interface AuthProviderProps {
  children: ReactNode;
}

// 本地存储的Token键名
const TOKEN_KEY = 'strapi_jwt';
const USER_KEY = 'strapi_user';

/**
 * 认证Provider组件
 * 
 * 功能：
 * 1. 管理用户登录状态
 * 2. 提供登录/登出方法
 * 3. 自动从localStorage恢复登录状态
 * 4. 监听token变化并同步到Strapi服务
 * 5. 提供测试模式预设登录功能（仅开发环境）
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 计算认证状态
  const isAuthenticated = !!user;
  
  // 从localStorage恢复用户状态
  const restoreUserSession = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);
      
      if (token && userData) {
        // 设置token到Strapi服务
        strapiService.setUserToken(token);
        
        try {
          // 验证token是否仍然有效
          const currentUser = await strapiService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Token无效，清除本地存储
            clearUserSession();
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          clearUserSession();
        }
      }
    } catch (error) {
      console.error('Error restoring user session:', error);
      clearUserSession();
    } finally {
      setIsLoading(false);
    }
  };
  
  // 清除用户会话
  const clearUserSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    strapiService.setUserToken(null);
    setUser(null);
  };
  
  // 保存用户会话
  const saveUserSession = (userData: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    strapiService.setUserToken(token);
    setUser(userData);
  };
  
  // 登录方法
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const result = await strapiService.login(email, password);
      
      if (result && result.jwt) {
        saveUserSession(result.user, result.jwt);
        return { success: true };
      } else {
        return { success: false, error: '登录失败，请检查账号密码' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || '登录失败，请稍后重试' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 注册方法
  const register = async (userData: { username: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      
      const result = await strapiService.register(userData);
      
      if (result && result.jwt) {
        // 注册成功后自动登录
        saveUserSession(result.user, result.jwt);
        return { success: true };
      } else {
        return { success: false, error: '注册失败，请稍后重试' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || '注册失败，请稍后重试' 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // 登出方法
  const logout = () => {
    clearUserSession();
    strapiService.logout();
  };
  
  // 刷新用户信息
  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    try {
      const currentUser = await strapiService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } else {
        clearUserSession();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      clearUserSession();
    }
  };
  
  // 初始化时恢复用户状态
  useEffect(() => {
    restoreUserSession();
  }, []);
  
  // 监听localStorage变化（跨标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        if (e.newValue === null) {
          // Token被清除，登出用户
          setUser(null);
          strapiService.setUserToken(null);
        } else if (e.key === TOKEN_KEY) {
          // Token更新，重新验证
          restoreUserSession();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 使用认证Hook
 * 
 * @returns 认证状态和方法
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthProvider;