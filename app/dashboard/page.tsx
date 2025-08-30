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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useFavorites, useInteractionHistory, useUserStats } from "@/hooks/useDashboard"
import { useAuth } from "@/contexts/AuthContext"
import strapiService from "@/lib/strapi"
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
  KeyRound,
  Smartphone,
  Send
} from "lucide-react"
import Link from "next/link"


export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [favoriteFilter, setFavoriteFilter] = useState<'all' | 'ai-tool' | 'edu-resource' | 'news-article'>('all')

  // 对话框状态
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)

  // 修改密码表单状态
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // 绑定手机号表单状态
  const [phoneForm, setPhoneForm] = useState({
    phoneNumber: '',
    verificationCode: ''
  })
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [phoneSuccess, setPhoneSuccess] = useState('')
  const [codeSending, setCodeSending] = useState(false)
  const [countdown, setCountdown] = useState(0)

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

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 对话框关闭时重置表单状态
  useEffect(() => {
    if (!passwordDialogOpen) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordError('')
      setPasswordSuccess('')
    }
  }, [passwordDialogOpen])

  useEffect(() => {
    if (!phoneDialogOpen) {
      setPhoneForm({ phoneNumber: '', verificationCode: '' })
      setPhoneError('')
      setPhoneSuccess('')
      setCountdown(0)
    }
  }, [phoneDialogOpen])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  // 处理修改密码
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('请填写所有字段')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('新密码与确认密码不一致')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('新密码长度至少6位')
      return
    }

    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      const result = await strapiService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      )

      if (result.success) {
        setPasswordSuccess(result.message || '密码修改成功')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        // 3秒后关闭对话框
        setTimeout(() => {
          setPasswordDialogOpen(false)
          setPasswordSuccess('')
        }, 3000)
      } else {
        setPasswordError(result.message || '密码修改失败')
      }
    } catch (error) {
      setPasswordError('密码修改失败，请重试')
    } finally {
      setPasswordLoading(false)
    }
  }

  // 发送验证码
  const handleSendVerificationCode = async () => {
    if (!phoneForm.phoneNumber) {
      setPhoneError('请输入手机号码')
      return
    }

    setCodeSending(true)
    setPhoneError('')

    try {
      const result = await strapiService.sendPhoneVerificationCode(phoneForm.phoneNumber)
      
      if (result.success) {
        setPhoneSuccess(result.message || '验证码已发送')
        setCountdown(60) // 60秒倒计时
        // 清除成功消息
        setTimeout(() => setPhoneSuccess(''), 3000)
      } else {
        setPhoneError(result.message || '验证码发送失败')
      }
    } catch (error) {
      setPhoneError('验证码发送失败，请重试')
    } finally {
      setCodeSending(false)
    }
  }

  // 处理绑定手机号
  const handleBindPhone = async () => {
    if (!phoneForm.phoneNumber || !phoneForm.verificationCode) {
      setPhoneError('请填写所有字段')
      return
    }

    setPhoneLoading(true)
    setPhoneError('')
    setPhoneSuccess('')

    try {
      const result = await strapiService.bindPhoneNumber(
        phoneForm.phoneNumber,
        phoneForm.verificationCode
      )

      if (result.success) {
        setPhoneSuccess(result.message || '手机号绑定成功')
        setPhoneForm({ phoneNumber: '', verificationCode: '' })
        // 3秒后关闭对话框
        setTimeout(() => {
          setPhoneDialogOpen(false)
          setPhoneSuccess('')
        }, 3000)
      } else {
        setPhoneError(result.message || '手机号绑定失败')
      }
    } catch (error) {
      setPhoneError('手机号绑定失败，请重试')
    } finally {
      setPhoneLoading(false)
    }
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
                  <SmartAvatar 
                    name={user?.username || (user as any)?.name || '用户'} 
                    src={(user as any)?.avatar?.url || (user as any)?.photo?.url || null}
                    size="xl"
                    className="w-16 h-16 text-lg"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">欢迎回来，{user?.username || (user as any)?.name || '用户'}</h1>
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
                            <Link href={item.contentUrl || '#'} className="hover:text-blue-600">
                              <p className="font-medium truncate">{item.contentTitle}</p>
                              <div className="flex flex-col gap-1">
                                <p className="text-sm text-gray-600">
                                  {item.actionText} • {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                                </p>
                                {/* 显示评论预览 */}
                                {item.type === 'comment' && item.commentPreview && (
                                  <p className="text-xs text-gray-500 italic bg-gray-50 px-2 py-1 rounded">
                                    "{item.commentPreview}"
                                  </p>
                                )}
                              </div>
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.actionType === 'like' && <Heart className="w-4 h-4 text-red-500" />}
                            {item.actionType === 'favorite' && <Bookmark className="w-4 h-4 text-blue-500" />}
                            {item.actionType === 'comment' && <MessageSquare className="w-4 h-4 text-green-500" />}
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
                            ) : item.actionType === 'favorite' ? (
                              <Bookmark className="w-5 h-5 text-blue-500" />
                            ) : (
                              <MessageSquare className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link href={item.contentUrl || '#'} className="hover:text-blue-600">
                                  <p className="font-medium truncate">{item.contentTitle}</p>
                                </Link>
                                <div className="space-y-1 mt-1">
                                  <p className="text-sm text-gray-600">
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
                                  {/* 显示评论内容预览 */}
                                  {item.type === 'comment' && item.commentPreview && (
                                    <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg italic border-l-4 border-green-300">
                                      "{item.commentPreview}"
                                    </p>
                                  )}
                                </div>
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
                      <Select value={favoriteFilter} onValueChange={(value: any) => setFavoriteFilter(value)}>
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
                        {/* 修改密码对话框 */}
                        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <KeyRound className="w-4 h-4" />
                              修改密码
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>修改密码</DialogTitle>
                              <DialogDescription>
                                请输入当前密码和新密码来更改您的账户密码
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="current-password">当前密码</Label>
                                <Input
                                  id="current-password"
                                  type="password"
                                  value={passwordForm.currentPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                  placeholder="请输入当前密码"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-password">新密码</Label>
                                <Input
                                  id="new-password"
                                  type="password"
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                  placeholder="请输入新密码（至少6位）"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirm-password">确认新密码</Label>
                                <Input
                                  id="confirm-password"
                                  type="password"
                                  value={passwordForm.confirmPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  placeholder="请再次输入新密码"
                                />
                              </div>
                              
                              {passwordError && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription className="text-red-600">
                                    {passwordError}
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              {passwordSuccess && (
                                <Alert className="border-green-200 bg-green-50">
                                  <AlertCircle className="h-4 w-4 text-green-600" />
                                  <AlertDescription className="text-green-700">
                                    {passwordSuccess}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setPasswordDialogOpen(false)
                                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                  setPasswordError('')
                                  setPasswordSuccess('')
                                }}
                                disabled={passwordLoading}
                              >
                                取消
                              </Button>
                              <Button onClick={handleChangePassword} disabled={passwordLoading}>
                                {passwordLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    修改中...
                                  </>
                                ) : (
                                  '确认修改'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* 绑定手机号对话框 */}
                        <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4" />
                              绑定手机号
                              {(user as any)?.phone && (
                                <Badge variant="secondary" className="ml-1">已绑定</Badge>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>绑定手机号</DialogTitle>
                              <DialogDescription>
                                {(user as any)?.phone ? 
                                  `当前绑定手机号：${(user as any).phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}` :
                                  '绑定手机号可用于账户安全验证和重要通知'
                                }
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="phone-number">手机号码</Label>
                                <Input
                                  id="phone-number"
                                  type="tel"
                                  value={phoneForm.phoneNumber}
                                  onChange={(e) => setPhoneForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                  placeholder="请输入手机号码"
                                  maxLength={11}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="verification-code">验证码</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="verification-code"
                                    type="text"
                                    value={phoneForm.verificationCode}
                                    onChange={(e) => setPhoneForm(prev => ({ ...prev, verificationCode: e.target.value }))}
                                    placeholder="请输入6位验证码"
                                    maxLength={6}
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="outline"
                                    onClick={handleSendVerificationCode}
                                    disabled={codeSending || countdown > 0 || !phoneForm.phoneNumber}
                                    className="whitespace-nowrap"
                                  >
                                    {codeSending ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        发送中
                                      </>
                                    ) : countdown > 0 ? (
                                      `${countdown}秒后重发`
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4 mr-1" />
                                        发送验证码
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-500">
                                  * 当前为演示模式，实际短信API需要网站过审后申请
                                </p>
                              </div>
                              
                              {phoneError && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription className="text-red-600">
                                    {phoneError}
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              {phoneSuccess && (
                                <Alert className="border-green-200 bg-green-50">
                                  <AlertCircle className="h-4 w-4 text-green-600" />
                                  <AlertDescription className="text-green-700">
                                    {phoneSuccess}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setPhoneDialogOpen(false)
                                  setPhoneForm({ phoneNumber: '', verificationCode: '' })
                                  setPhoneError('')
                                  setPhoneSuccess('')
                                  setCountdown(0)
                                }}
                                disabled={phoneLoading}
                              >
                                取消
                              </Button>
                              <Button onClick={handleBindPhone} disabled={phoneLoading}>
                                {phoneLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    绑定中...
                                  </>
                                ) : (
                                  '确认绑定'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
