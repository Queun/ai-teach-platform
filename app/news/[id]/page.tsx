"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useNewsArticle } from "@/hooks/useStrapi"
import { useInteraction } from "@/hooks/useInteraction"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { Calendar, Eye, Heart, Share2, Bookmark, MessageSquare, ArrowLeft } from "lucide-react"

export default function NewsDetailPage() {
  const params = useParams()
  const id = params.id as string

  // 使用 Strapi API 获取新闻数据
  const { data: newsData, loading, error } = useNewsArticle(id)

  // 使用互动功能 hook
  const {
    isLiked,
    isFavorited,
    stats,
    loading: interactionLoading,
    toggleLike,
    toggleFavorite,
    isAuthenticated
  } = useInteraction({
    targetType: 'news-article',
    targetId: id, // 直接使用字符串 ID
    initialStats: newsData?.attributes ? {
      likesCount: newsData.attributes.likesCount || 0,
      favoritesCount: newsData.attributes.favoritesCount || 0,
      commentsCount: 0 // 新闻页面不支持评论
    } : undefined
  })

  // 追踪浏览量 - 当页面加载完成且有新闻数据时增加浏览量
  useEffect(() => {
    if (newsData && id && !loading) {
      // 延迟一秒后追踪浏览量，避免用户快速跳转时重复计数
      const timer = setTimeout(async () => {
        try {
          const { trackView } = await import('@/lib/track-view')
          await trackView('news-articles', id)
        } catch (error) {
          console.error('Failed to track view:', error)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [newsData, id, loading])

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
      return JSON.stringify(content).substring(0, 1000) + '...';
    }
    return '';
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载新闻详情中...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !newsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">加载失败</h1>
          <p className="text-gray-600 mb-4">{error || '新闻未找到'}</p>
          <Button asChild>
            <Link href="/news">返回新闻列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 转换 Strapi 数据为组件所需格式
  const data = newsData.attributes || newsData
  const article = {
    id: newsData.id,
    title: data.title || '未命名文章',
    content: extractText(data.content || '暂无内容'),
    category: data.category || '资讯',
    author: {
      name: data.authorName || data.author || '未知作者',
      avatar: data.authorAvatar?.url 
        ? `http://localhost:1337${data.authorAvatar.url}` 
        : null,
      bio: data.authorBio || '暂无简介',
    },
    date: new Date(data.publishDate || data.createdAt || newsData.createdAt || Date.now()).toLocaleDateString('zh-CN'),
    views: data.views || 0,
    comments: data.commentCount || 0,
    bookmarks: data.bookmarks || 0,
    image: data.featuredImage?.url 
      ? `http://localhost:1337${data.featuredImage.url}` 
      : data.coverImage?.url 
      ? `http://localhost:1337${data.coverImage.url}` 
      : null,
    tags: data.tags || [],
    excerpt: extractText(data.excerpt || data.summary || ''),
    source: data.source || '',
    readTime: data.readTime || '5分钟',
    isBreaking: data.isBreaking || false,
    isFeatured: data.isFeatured || false
  }

  // Mock 相关文章数据 - 未来可以从 Strapi 获取
  const relatedArticles = [
    {
      id: 2,
      title: "AI教育工具最新趋势分析",
      category: article.category === '政策动态' ? "工具评测" : "政策动态",
      date: new Date(Date.now() - 604800000).toLocaleDateString('zh-CN'), // 7天前
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 3,
      title: "教育科技创新案例分享",
      category: "教学案例",
      date: new Date(Date.now() - 1209600000).toLocaleDateString('zh-CN'), // 14天前
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 4,
      title: "人工智能在教育领域的应用前景",
      category: "教育观点", 
      date: new Date(Date.now() - 1814400000).toLocaleDateString('zh-CN'), // 21天前
      image: "/placeholder.svg?height=150&width=200",
    },
  ]

  // 在组件内部添加这个简单的Markdown解析函数
  const parseSimpleMarkdown = (content: string) => {
    return (
      content
        // 处理标题
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-4 mt-8 text-gray-800">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-6 mt-8 text-gray-800">$1</h1>')

        // 处理粗体
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')

        // 处理列表项
        .replace(/^- (.*$)/gim, '<li class="mb-2 text-gray-700">$1</li>')

        // 处理段落（将连续的非标题、非列表行包装为段落）
        .split("\n\n")
        .map((paragraph) => {
          // 如果已经是HTML标签，直接返回
          if (paragraph.includes("<h") || paragraph.includes("<li") || paragraph.includes("<strong")) {
            return paragraph
          }
          // 如果是空行，跳过
          if (paragraph.trim() === "") {
            return ""
          }
          // 否则包装为段落
          return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraph.replace(/\n/g, "<br>")}</p>`
        })
        .join("\n")

        // 处理列表包装
        .replace(/(<li.*?<\/li>\s*)+/g, (match) => {
          return `<ul class="mb-6 ml-6 space-y-2 list-disc">${match}</ul>`
        })
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <Button variant="ghost" className="mb-4 sm:mb-6" asChild>
            <Link href="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回资讯列表
            </Link>
          </Button>

          {/* 文章头部 */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <Badge variant="secondary">{article.category}</Badge>
                {article.tags && article.tags.length > 0 && article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {typeof tag === 'string' ? tag : tag.name || tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold leading-tight mb-3 sm:mb-4">
                {article.title}
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <SmartAvatar 
                    name={article.author.name} 
                    src={article.author.avatar}
                    size="default"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <div>
                    <div className="font-medium text-sm sm:text-base">{article.author.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{article.author.bio}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                    {article.views} 阅读
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* 文章图片 */}
          <div className="mb-6 sm:mb-8">
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=384&width=800";
                }}
              />
            ) : (
              <div className="w-full h-48 sm:h-64 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📰</div>
                  <p>暂无配图</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-8">
              <Card className="mb-6 sm:mb-8">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: parseSimpleMarkdown(article.content),
                    }}
                  />
                </CardContent>
              </Card>

              {/* 互动按钮 */}
              <Card className="mb-6 sm:mb-8">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <Button
                        variant={isLiked ? "default" : "outline"}
                        onClick={toggleLike}
                        className="flex items-center gap-2 text-sm"
                        size="sm"
                        disabled={interactionLoading || !isAuthenticated}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                        {stats.likesCount} 点赞
                      </Button>
                      <Button
                        variant={isFavorited ? "default" : "outline"}
                        onClick={toggleFavorite}
                        className="flex items-center gap-2 text-sm"
                        size="sm"
                        disabled={interactionLoading || !isAuthenticated}
                      >
                        <Bookmark className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                        {stats.favoritesCount} 收藏
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 text-sm" size="sm">
                        <Share2 className="w-4 h-4" />
                        分享
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      评论功能暂不开放
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 评论功能因合规要求暂不开放 */}
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">评论功能暂不开放</h3>
                  <p className="text-sm">为确保内容合规，新闻资讯暂不支持评论功能</p>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className="lg:col-span-4">
              <div className="sticky top-16 sm:top-16 space-y-4 sm:space-y-6">
                {/* 作者信息 */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">作者信息</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <SmartAvatar 
                        name={article.author.name} 
                        src={article.author.avatar}
                        size="default"
                        className="w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{article.author.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 break-words leading-relaxed">
                          {article.author.bio}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-sm" size="sm">
                      关注作者
                    </Button>
                  </CardContent>
                </Card>

                {/* 相关文章 */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">相关文章</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    {relatedArticles.map((related) => (
                      <Link key={related.id} href={`/news/${related.documentId || related.id}`}>
                        <div className="group hover:bg-gray-50 p-2 sm:p-3 rounded-lg transition-colors cursor-pointer">
                          <div className="flex gap-3">
                            <img
                              src={related.image || "/placeholder.svg"}
                              alt={related.title}
                              className="w-16 sm:w-20 h-12 sm:h-16 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                                {related.title}
                              </h4>
                              <div className="flex flex-col gap-1">
                                <Badge variant="outline" className="text-xs w-fit">
                                  {related.category}
                                </Badge>
                                <span className="text-xs text-gray-500">{related.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* 热门标签 */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">热门标签</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {["AI教育", "教育政策", "教学案例", "工具评测", "教师发展"].map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-blue-50 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
