"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFavorites, useInteractionHistory, useUserStats } from "@/hooks/useDashboard"
import { useAuth } from "@/contexts/AuthContext"
import {
  BookOpen,
  MessageSquare,
  Download,
  TrendingUp,
  Settings,
  LogOut,
  Eye,
  Heart,
  Bookmark,
  ExternalLink,
  Star,
  Clock,
  Trash2,
  Filter,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar,
  Zap,
  Award,
} from "lucide-react"
import Link from "next/link"


export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [favoriteFilter, setFavoriteFilter] = useState<'all' | 'ai-tool' | 'edu-resource' | 'news-article'>('all')

  // 使用Dashboard相关的Hooks
  const favoritesHook = useFavorites({ 
    contentType: favoriteFilter === 'all' ? undefined : favoriteFilter, 
    pageSize: 12 
  })
  const historyHook = useInteractionHistory(30)
  const statsHook = useUserStats()

  useEffect(() => {
    // 检查认证状态
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // 检查URL参数中的tab参数
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      if (tabParam && ['overview', 'history', 'favorites', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam)
      }
    }
  }, [isAuthenticated, isLoading, router])

  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  // 显示加载状态或认证检查
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证登录状态...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在跳转到登录页面...</p>
        </div>
      </div>
    )
  }

  // 使用真实的统计数据，如果还在加载则使用默认值
  const stats = {
    resourcesViewed: statsHook.loading ? 0 : (statsHook.stats.totalInteractions || 0),
    toolsUsed: statsHook.loading ? 0 : (statsHook.stats.likesCount || 0),
    discussionsJoined: statsHook.loading ? 0 : (statsHook.stats.commentsCount || 0),
    articlesRead: statsHook.loading ? 0 : (statsHook.stats.favoritesCount || 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 用户信息头部 */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback className="text-lg">{(user?.username || user?.name)?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">欢迎回来，{user?.username || user?.name}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">数据概览</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
              <TabsTrigger value="favorites">我的收藏</TabsTrigger>
              <TabsTrigger value="settings">账户设置</TabsTrigger>
            </TabsList>

            {/* 数据概览 */}
            <TabsContent value="overview" className="space-y-6">
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">总互动数</p>
                        <div className="flex items-center gap-2">
                          {statsHook.loading ? (
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                          ) : (
                            <p className="text-2xl font-bold text-blue-600">{stats.resourcesViewed}</p>
                          )}
                        </div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">点赞数量</p>
                        <div className="flex items-center gap-2">
                          {statsHook.loading ? (
                            <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                          ) : (
                            <p className="text-2xl font-bold text-green-600">{stats.toolsUsed}</p>
                          )}
                        </div>
                      </div>
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">评论数量</p>
                        <div className="flex items-center gap-2">
                          {statsHook.loading ? (
                            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                          ) : (
                            <p className="text-2xl font-bold text-purple-600">{stats.discussionsJoined}</p>
                          )}
                        </div>
                      </div>
                      <MessageSquare className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">收藏数量</p>
                        <div className="flex items-center gap-2">
                          {statsHook.loading ? (
                            <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
                          ) : (
                            <p className="text-2xl font-bold text-orange-600">{stats.articlesRead}</p>
                          )}
                        </div>
                      </div>
                      <Bookmark className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 最近活动 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>最近活动</CardTitle>
                      <CardDescription>您最近在平台上的互动记录</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={historyHook.refresh} 
                      disabled={historyHook.loading}
                    >
                      {historyHook.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {historyHook.loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-600">加载中...</span>
                    </div>
                  ) : historyHook.error ? (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {historyHook.error}
                      </AlertDescription>
                    </Alert>
                  ) : historyHook.history.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-600">暂无活动记录</h3>
                      <p className="text-gray-500 mb-4">开始探索内容，您的互动记录将在这里显示</p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" asChild>
                          <Link href="/tools">探索AI工具</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/resources">浏览资源</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historyHook.history.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <Link href={item.contentUrl} className="hover:text-blue-600">
                              <p className="font-medium truncate">{item.contentTitle}</p>
                              <p className="text-sm text-gray-600">
                                {item.actionText} • {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                              </p>
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.actionType === 'like' && <Heart className="w-4 h-4 text-red-500" />}
                            {item.actionType === 'favorite' && <Bookmark className="w-4 h-4 text-blue-500" />}
                            <Badge variant="outline" className="text-xs">
                              {item.targetType === 'ai-tool' ? 'AI工具' : 
                               item.targetType === 'edu-resource' ? '教育资源' : '新闻'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 历史记录 */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>互动历史</CardTitle>
                      <CardDescription>您在平台上的所有点赞和收藏记录 ({historyHook.totalCount} 项)</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={historyHook.refresh} 
                      disabled={historyHook.loading}
                    >
                      {historyHook.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {historyHook.loading && historyHook.history.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-600">加载历史记录中...</span>
                    </div>
                  ) : historyHook.error ? (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {historyHook.error}
                      </AlertDescription>
                    </Alert>
                  ) : historyHook.history.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-600">暂无互动记录</h3>
                      <p className="text-gray-500 mb-4">开始探索内容，您的互动历史将在这里显示</p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" asChild>
                          <Link href="/tools">探索AI工具</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/resources">浏览教育资源</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historyHook.history.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            {item.actionType === 'like' ? (
                              <Heart className="w-5 h-5 text-red-500" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link href={item.contentUrl} className="hover:text-blue-600">
                                  <p className="font-medium truncate">{item.contentTitle}</p>
                                </Link>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.actionText}
                                  <span className="mx-2">•</span>
                                  <time dateTime={item.createdAt}>
                                    {new Date(item.createdAt).toLocaleString('zh-CN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </time>
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {item.targetType === 'ai-tool' ? '🔧 AI工具' : 
                                 item.targetType === 'edu-resource' ? '📚 教育资源' : 
                                 '📰 新闻'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {historyHook.history.length >= 30 && (
                        <div className="text-center pt-4 border-t">
                          <p className="text-sm text-gray-500 mb-3">
                            显示最近 30 条记录，查看完整历史请访问对应页面
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button size="sm" variant="outline" asChild>
                              <Link href="/tools">工具页面</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href="/resources">资源页面</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href="/news">新闻页面</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 我的收藏 */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>我的收藏</CardTitle>
                      <CardDescription>
                        您收藏的AI工具、教育资源和新闻文章 ({favoritesHook.totalCount} 项)
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={favoriteFilter} onValueChange={setFavoriteFilter}>
                        <SelectTrigger className="w-40">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部类型</SelectItem>
                          <SelectItem value="ai-tool">AI工具</SelectItem>
                          <SelectItem value="edu-resource">教育资源</SelectItem>
                          <SelectItem value="news-article">新闻文章</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={favoritesHook.refresh} 
                        disabled={favoritesHook.loading}
                      >
                        {favoritesHook.loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {favoritesHook.loading && favoritesHook.favorites.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-600">加载收藏内容中...</span>
                    </div>
                  ) : favoritesHook.error ? (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {favoritesHook.error}
                      </AlertDescription>
                    </Alert>
                  ) : favoritesHook.favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-600">
                        {favoriteFilter === 'all' ? '暂无收藏内容' : '该类型暂无收藏'}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {favoriteFilter === 'all' 
                          ? '开始浏览内容，收藏您感兴趣的内容' 
                          : '在对应页面中收藏该类型的内容'
                        }
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" asChild>
                          <Link href="/tools">探索AI工具</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/resources">浏览教育资源</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/news">阅读新闻资讯</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoritesHook.favorites.map((item, index) => {
                          const data = item.attributes || item;
                          const contentType = item.contentType;
                          let title, description, url, category;
                          
                          // 根据内容类型提取信息
                          if (contentType === 'ai-tool') {
                            title = data.name || '未知工具';
                            description = data.shortDesc || data.description || '暂无描述';
                            url = `/tools/${item.documentId || item.id}`;
                            category = data.category || 'AI工具';
                          } else if (contentType === 'edu-resource') {
                            title = data.title || '未知资源';
                            description = data.summary || data.content?.substring(0, 100) || '暂无描述';
                            url = `/resources/${item.documentId || item.id}`;
                            category = data.category || '教育资源';
                          } else if (contentType === 'news-article') {
                            title = data.title || '未知文章';
                            description = data.excerpt || data.content?.substring(0, 100) || '暂无摘要';
                            url = `/news/${item.documentId || item.id}`;
                            category = data.category || '新闻文章';
                          }

                          return (
                            <Card key={index} className="group hover:shadow-lg transition-all duration-200">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                      <CardTitle className="text-base leading-tight hover:text-blue-600 transition-colors">
                                        <Link href={url} className="line-clamp-2">
                                          {title}
                                        </Link>
                                      </CardTitle>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {category}
                                        </Badge>
                                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                      const success = await favoritesHook.removeFavorite(item.actionId);
                                      if (!success) {
                                        // 可以在这里添加错误提示
                                        console.error('删除收藏失败');
                                      }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <CardDescription className="line-clamp-3 text-sm mb-3">
                                  {description}
                                </CardDescription>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(item.favoritedAt).toLocaleDateString('zh-CN')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Link href={url} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700">
                                      <span>查看详情</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {/* 加载更多按钮 */}
                      {favoritesHook.hasMore && (
                        <div className="text-center mt-6">
                          <Button 
                            variant="outline" 
                            onClick={favoritesHook.loadMore}
                            disabled={favoritesHook.loading}
                          >
                            {favoritesHook.loading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                加载中...
                              </>
                            ) : (
                              '加载更多'
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 账户设置 */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>账户设置</CardTitle>
                  <CardDescription>管理您的个人信息和偏好设置</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">个人信息</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">用户名</label>
                          <p className="text-gray-900">{user?.username || '未设置'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">邮箱</label>
                          <p className="text-gray-900">{user?.email || '未设置'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">用户类型</label>
                          <p className="text-gray-900">教育工作者</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">注册时间</label>
                          <p className="text-gray-900">
                            {user?.createdAt 
                              ? new Date(user.createdAt).toLocaleDateString('zh-CN') 
                              : '未知'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">安全设置</h3>
                      <div className="space-y-3">
                        <Button variant="outline">修改密码</Button>
                        <Button variant="outline">绑定手机号</Button>
                        <Button variant="outline">两步验证</Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">通知设置</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>邮件通知</span>
                          <Button variant="outline" size="sm">
                            开启
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>新资源推荐</span>
                          <Button variant="outline" size="sm">
                            开启
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>社区互动提醒</span>
                          <Button variant="outline" size="sm">
                            开启
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
