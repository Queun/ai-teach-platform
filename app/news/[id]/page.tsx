"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useNewsArticle } from "@/hooks/useStrapi"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Eye, Heart, Share2, Bookmark, MessageSquare, ArrowLeft, ThumbsUp, Send } from "lucide-react"

export default function NewsDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [comment, setComment] = useState("")

  // 使用 Strapi API 获取新闻数据
  const { data: newsData, loading, error } = useNewsArticle(id)

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
    likes: data.likes || 0,
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

  // Mock 评论数据 - 未来可以从 Strapi 获取
  const comments = [
    {
      id: 1,
      author: "张老师",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "非常有价值的内容，对我的工作很有帮助！",
      date: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN'), // 1天前
      likes: 12,
    },
    {
      id: 2,
      author: "李教授",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "写得很详细，期待更多这样的分享。",
      date: new Date(Date.now() - 172800000).toLocaleDateString('zh-CN'), // 2天前
      likes: 8,
    },
    {
      id: 3,
      author: "王主任",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "感谢分享，很实用的内容！",
      date: new Date(Date.now() - 259200000).toLocaleDateString('zh-CN'), // 3天前
      likes: 15,
    },
  ]

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
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
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
                        onClick={() => setIsLiked(!isLiked)}
                        className="flex items-center gap-2 text-sm"
                        size="sm"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                        {article.likes + (isLiked ? 1 : 0)} 点赞
                      </Button>
                      <Button
                        variant={isBookmarked ? "default" : "outline"}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className="flex items-center gap-2 text-sm"
                        size="sm"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                        {article.bookmarks + (isBookmarked ? 1 : 0)} 收藏
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 text-sm" size="sm">
                        <Share2 className="w-4 h-4" />
                        分享
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      {comments.length} 条评论
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 评论区 */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <MessageSquare className="w-5 h-5" />
                    评论 ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* 发表评论 */}
                  <div className="space-y-3 sm:space-y-4">
                    <Label htmlFor="comment" className="text-sm sm:text-base">
                      发表评论
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="写下您的想法..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                    />
                    <Button className="flex items-center gap-2 w-full sm:w-auto" size="sm">
                      <Send className="w-4 h-4" />
                      发表评论
                    </Button>
                  </div>

                  <Separator />

                  {/* 评论列表 */}
                  <div className="space-y-4 sm:space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 sm:gap-4">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                            <span className="font-medium text-sm sm:text-base">{comment.author}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">{comment.content}</p>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-xs sm:text-sm h-8"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8">
                              回复
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className="lg:col-span-4">
              <div className="sticky top-4 sm:top-8 space-y-4 sm:space-y-6">
                {/* 作者信息 */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">作者信息</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0">
                        <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                      </Avatar>
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
