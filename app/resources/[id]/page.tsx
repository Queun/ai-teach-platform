"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useResource } from "@/hooks/useStrapi"
import { useInteraction } from "@/hooks/useInteraction"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  ArrowLeft,
  Star,
  Heart,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle,
  Eye,
  Users,
  Calendar,
  FileText,
  Award,
  Clock,
  BookOpen,
  Play,
  ExternalLink,
  Share2,
  Menu,
} from "lucide-react"
import { CommentSection } from "@/components/comments/CommentSection"

export default function ResourceDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [activeSection, setActiveSection] = useState("overview")
  const [userRating, setUserRating] = useState(0)
  const [showMobileNav, setShowMobileNav] = useState(false)

  // 使用 Strapi API 获取资源数据
  const { data: resourceData, loading, error } = useResource(id)
  
  // 使用互动Hook管理点赞/收藏状态
  const {
    isLiked,
    isFavorited: isBookmarked,
    stats,
    loading: interactionLoading,
    toggleLike,
    toggleFavorite,
    isAuthenticated
  } = useInteraction({
    targetType: 'edu-resource',
    targetId: id, // 直接使用字符串 ID
    initialStats: resourceData?.attributes ? {
      likesCount: resourceData.attributes.likesCount || 0,
      favoritesCount: resourceData.attributes.favoritesCount || 0,
      commentsCount: resourceData.attributes.commentsCount || 0
    } : undefined
  })

  // 监听滚动位置，更新导航状态
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "content", "author", "reviews", "related"]
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 追踪浏览量 - 当页面加载完成且有资源数据时增加浏览量
  useEffect(() => {
    if (resourceData && id && !loading) {
      // 延迟一秒后追踪浏览量，避免用户快速跳转时重复计数
      const timer = setTimeout(async () => {
        try {
          const { trackView } = await import('@/lib/track-view')
          await trackView('edu-resources', id)
        } catch (error) {
          console.error('Failed to track view:', error)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [resourceData, id, loading])

  // 平滑滚动到指定区域
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 100
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  // 辅助函数：安全地提取文本内容
  const extractText = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object') {
      if (Array.isArray(content)) {
        return content.map(item => extractText(item)).join('');
      }
      if (content.type === 'text') {
        return content.text || '';
      }
      if (content.children) {
        return extractText(content.children);
      }
      if (content.content) {
        return extractText(content.content);
      }
      return JSON.stringify(content).substring(0, 500) + '...';
    }
    return '';
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载资源详情中...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !resourceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">加载失败</h1>
          <p className="text-gray-600 mb-4">{error || '资源未找到'}</p>
          <Button asChild>
            <Link href="/resources">返回资源库</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 转换 Strapi 数据为组件所需格式
  const data = resourceData.attributes || resourceData
  const resource = {
    id: resourceData.id,
    title: data.title || '未命名资源',
    summary: extractText(data.summary || '暂无摘要'),
    content: extractText(data.content || '暂无内容'),
    category: data.category || '教学资源',
    author: {
      name: data.authorName || '未知作者',
      avatar: data.authorAvatar?.url 
        ? `http://localhost:1337${data.authorAvatar.url}` 
        : null,
      title: data.authorTitle || '教育工作者',
      bio: data.authorBio || '暂无简介',
    },
    tags: data.tags || [],
    reviewCount: data.reviewCount || 0,
    views: data.views || 0,
    difficulty: data.difficulty || '入门',
    estimatedTime: data.estimatedTime || '未知',
    resourceType: data.resourceType || '文档',
    subject: data.subject || '',
    gradeLevel: data.gradeLevel || '',
    createdAt: new Date(data.createdAt || resourceData.createdAt || Date.now()).toLocaleDateString('zh-CN'),
    updatedAt: new Date(data.publishedAt || data.createdAt || Date.now()).toLocaleDateString('zh-CN'),
    featured: data.isFeatured || false,
    resourceUrl: data.attachments?.[0]?.url 
      ? `http://localhost:1337${data.attachments[0].url}` 
      : null,
    coverImage: data.coverImage?.url 
      ? `http://localhost:1337${data.coverImage.url}` 
      : null,
  }

  // Mock 评价数据 - 未来可以从 Strapi 获取
  const reviews = [
    {
      id: 1,
      user: {
        name: "王老师",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "小学数学教师",
      },
      rating: 5,
      date: "2024-05-25",
      title: "非常实用的教学资源",
      content: "这个资源帮助我设计了更生动的数学课程，学生们的参与度明显提高了。",
      helpful: 18,
      verified: true,
    },
    {
      id: 2,
      user: {
        name: "刘教授",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "教育学研究员",
      },
      rating: 4,
      date: "2024-05-20",
      title: "质量很高的内容",
      content: "内容专业性强，理论与实践结合得很好，推荐给同行使用。",
      helpful: 12,
      verified: true,
    },
  ]

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 9, percentage: 15 },
    { stars: 3, count: 3, percentage: 5 },
    { stars: 2, count: 2, percentage: 3 },
    { stars: 1, count: 1, percentage: 2 },
  ]

  const navigationItems = [
    { id: "overview", label: "概述", icon: BookOpen },
    { id: "content", label: "内容详情", icon: FileText },
    { id: "author", label: "作者信息", icon: Users },
    { id: "reviews", label: "用户评价", icon: Star },
    { id: "related", label: "相关资源", icon: Award },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/resources">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回资源库
            </Link>
          </Button>

          <div className="lg:flex lg:gap-8">
            {/* 左侧导航 - 桌面端固定定位，移动端隐藏 */}
            <aside className="hidden lg:block lg:w-64 lg:shrink-0">
              <div className="sticky top-16 space-y-6">
                {/* 资源基本信息卡片 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      {resource.coverImage && (
                        <div className="w-full h-32 mb-4 overflow-hidden rounded-lg">
                          <img 
                            src={resource.coverImage} 
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h2 className="text-lg font-bold mb-2 line-clamp-2">{resource.title}</h2>
                      <div className="flex gap-2 justify-center">
                        <Badge variant="outline">{resource.difficulty}</Badge>
                        {resource.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Award className="w-3 h-3 mr-1" />
                            精选
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {resource.resourceUrl && (
                        <Button size="lg" className="w-full" asChild>
                          <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            下载资源
                          </a>
                        </Button>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleFavorite}
                          disabled={interactionLoading || !isAuthenticated}
                          className={isBookmarked ? "bg-blue-50 border-blue-200" : ""}
                          title={!isAuthenticated ? "请先登录" : isBookmarked ? "取消收藏" : "收藏"}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleLike}
                          disabled={interactionLoading || !isAuthenticated}
                          className={isLiked ? "bg-red-50 border-red-200" : ""}
                          title={!isAuthenticated ? "请先登录" : isLiked ? "取消点赞" : "点赞"}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">类型</span>
                        <span className="font-medium">{resource.resourceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">浏览量</span>
                        <span className="font-medium">{resource.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">更新时间</span>
                        <span className="font-medium">{resource.updatedAt}</span>
                      </div>
                      {resource.estimatedTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">预计用时</span>
                          <span className="font-medium">{resource.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 导航菜单 */}
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-1">
                      {navigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                              activeSection === item.id
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        )
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* 右侧主要内容 */}
            <main className="w-full lg:flex-1 space-y-12">
              {/* 移动端顶部快捷操作栏 */}
              <div className="lg:hidden mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      {resource.coverImage && (
                        <div className="w-24 h-16 mx-auto mb-3 overflow-hidden rounded-lg">
                          <img 
                            src={resource.coverImage} 
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex gap-2 justify-center mb-3">
                        <Badge variant="outline">{resource.difficulty}</Badge>
                        {resource.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Award className="w-3 h-3 mr-1" />
                            精选
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {resource.resourceUrl && (
                        <Button size="lg" className="w-full" asChild>
                          <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            下载资源
                          </a>
                        </Button>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleFavorite}
                          disabled={interactionLoading || !isAuthenticated}
                          className={isBookmarked ? "bg-blue-50 border-blue-200" : ""}
                          title={!isAuthenticated ? "请先登录" : isBookmarked ? "取消收藏" : "收藏"}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleLike}
                          disabled={interactionLoading || !isAuthenticated}
                          className={isLiked ? "bg-red-50 border-red-200" : ""}
                          title={!isAuthenticated ? "请先登录" : isLiked ? "取消点赞" : "点赞"}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* 移动端快速统计信息 */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{resource.views}</div>
                        <div className="text-gray-600">浏览</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">{resource.reviewCount}</div>
                        <div className="text-gray-600">评价</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* 概述部分 */}
              <section id="overview" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
                        <CardDescription className="text-base">{resource.summary}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 标签 */}
                    {resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {/* 资源统计 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Eye className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">{resource.views}</div>
                        <div className="text-sm text-gray-600">浏览量</div>
                      </div>
                      <div className="text-center p-4 bg-pink-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Heart className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="text-2xl font-bold text-pink-600">{stats.likesCount}</div>
                        <div className="text-sm text-gray-600">点赞数</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Bookmark className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{stats.favoritesCount}</div>
                        <div className="text-sm text-gray-600">收藏数</div>
                      </div>
                    </div>

                    <Separator />

                    {/* 资源信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">资源信息</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">分类</span>
                            <Badge variant="secondary">{resource.category}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">类型</span>
                            <span>{resource.resourceType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">难度</span>
                            <Badge variant="outline">{resource.difficulty}</Badge>
                          </div>
                          {resource.subject && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">学科</span>
                              <span>{resource.subject}</span>
                            </div>
                          )}
                          {resource.gradeLevel && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">年级</span>
                              <span>{resource.gradeLevel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">发布信息</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">发布时间</span>
                            <span>{resource.createdAt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">更新时间</span>
                            <span>{resource.updatedAt}</span>
                          </div>
                          {resource.estimatedTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">预计用时</span>
                              <span>{resource.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 内容详情部分 */}
              <section id="content" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      内容详情
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      {resource.content ? (
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {resource.content}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>暂无详细内容</p>
                          <p className="text-sm mt-2">请下载资源查看完整内容</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 作者信息部分 */}
              <section id="author" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      作者信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <SmartAvatar 
                        name={resource.author.name} 
                        src={resource.author.avatar}
                        size="xl"
                        className="w-16 h-16"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{resource.author.name}</h3>
                        <p className="text-gray-600 mb-3">{resource.author.title}</p>
                        {resource.author.bio && (
                          <p className="text-gray-700 leading-relaxed">{resource.author.bio}</p>
                        )}
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            联系作者
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users className="w-4 h-4 mr-2" />
                            查看更多资源
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 用户评价部分 */}
              <section id="reviews" className="scroll-mt-24">
                <CommentSection 
                  targetType="edu-resource" 
                  targetId={id} 
                  showTitle={true}
                  className=""
                />
              </section>

              {/* 相关资源部分 */}
              <section id="related" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      相关资源
                    </CardTitle>
                    <CardDescription>您可能也感兴趣的其他资源</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>暂无相关资源推荐</p>
                      <p className="text-sm mt-2">系统正在为您寻找相关内容</p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </main>
          </div>
        </div>
      </div>
      
      {/* 移动端浮动导航按钮 */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={showMobileNav} onOpenChange={setShowMobileNav}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full w-14 h-14 shadow-lg">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-96 rounded-t-xl">
            <div className="p-4">
              <h3 className="font-semibold mb-4">页面导航</h3>
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id)
                        setShowMobileNav(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}