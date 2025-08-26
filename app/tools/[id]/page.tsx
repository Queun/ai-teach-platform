"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTool } from "@/hooks/useStrapi"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Heart,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle,
  Clock,
  Zap,
  BookOpen,
  Play,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Code,
} from "lucide-react"

export default function ToolDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [activeSection, setActiveSection] = useState("overview")
  const [userRating, setUserRating] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // 使用 Strapi API 获取工具数据
  const { data: toolData, loading, error } = useTool(id)

  // 监听滚动位置，更新导航状态
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "features", "tutorials", "reviews", "alternatives"]
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
      return JSON.stringify(content).substring(0, 200) + '...';
    }
    return '';
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载工具详情中...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !toolData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">加载失败</h1>
          <p className="text-gray-600 mb-4">{error || '工具未找到'}</p>
          <Button asChild>
            <Link href="/tools">返回工具库</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 转换 Strapi 数据为组件所需格式
  const data = toolData.attributes || toolData
  const tool = {
    id: toolData.id,
    name: data.name || '未命名工具',
    description: extractText(data.shortDesc || data.description || '暂无描述'),
    longDescription: extractText(data.description || data.longDescription || '暂无详细描述'),
    category: data.category || '其他',
    rating: data.rating || 5.0,
    reviewCount: data.reviewCount || 0,
    users: data.popularity > 10000 ? `${Math.floor(data.popularity / 1000)}K+` : `${data.popularity || 0}+`,
    pricing: data.pricing || '免费',
    priceRange: data.pricing || '免费',
    features: (data.features || []).map((feature: any) => ({
      name: feature.name || feature,
      description: feature.description || '',
      icon: MessageSquare, // 默认图标
    })),
    tags: data.tags || [],
    url: data.officialUrl || '#',
    logo: data.logo?.url 
      ? `http://localhost:1337${data.logo.url}` 
      : "🔧",
    developer: data.developer || "Unknown",
    developerUrl: data.developerUrl || '#',
    lastUpdated: new Date(data.updatedAt || toolData.updatedAt || Date.now()).toLocaleDateString('zh-CN'),
    releaseDate: data.releaseDate ? new Date(data.releaseDate).toLocaleDateString('zh-CN') : '未知',
    difficulty: data.difficulty || '入门',
    languages: data.supportedLanguages || ['中文', '英文'],
    platforms: [
      { name: "Web", icon: Monitor },
      { name: "Mobile", icon: Smartphone },
      { name: "API", icon: Code },
    ],
    useCases: (data.useCases || []).map((useCase: any) => ({
      title: useCase.title || useCase.name || useCase,
      description: useCase.description || '暂无描述',
    })),
    pros: data.pros || ['功能强大'],
    cons: data.cons || ['需要网络'],
    tutorials: data.tutorialCount || 0,
    alternatives: data.alternatives || [],
    integrations: data.integrations || [],
  }

  // Mock 评价数据
  const reviews = [
    {
      id: 1,
      user: {
        name: "张老师",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "小学语文教师",
      },
      rating: 5,
      date: "2024-05-25",
      title: "非常实用的教学助手",
      content: "用ChatGPT帮助设计课程内容和生成练习题，大大提高了备课效率。学生们也很喜欢用它来答疑解惑。",
      helpful: 23,
      verified: true,
    },
    {
      id: 2,
      user: {
        name: "李教授",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "大学英语教师",
      },
      rating: 4,
      date: "2024-05-20",
      title: "功能强大但需要技巧",
      content: "ChatGPT的功能确实很强大，但需要掌握一定的提示词技巧才能发挥最大效果。建议新手先学习一些基础用法。",
      helpful: 18,
      verified: true,
    },
    {
      id: 3,
      user: {
        name: "王同学",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "高中生",
      },
      rating: 5,
      date: "2024-05-18",
      title: "学习的好帮手",
      content: "遇到不懂的问题就问ChatGPT，它能用简单易懂的方式解释复杂概念，比查百科全书方便多了。",
      helpful: 15,
      verified: false,
    },
  ]

  // Mock 教程数据
  const tutorials = [
    {
      id: 1,
      title: "ChatGPT教育应用入门指南",
      description: "从零开始学习如何在教育场景中使用ChatGPT",
      duration: "15分钟",
      difficulty: "入门",
      views: 1240,
      type: "视频",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "设计有效的教学提示词",
      description: "学习如何编写高质量的提示词来获得更好的教学内容",
      duration: "20分钟",
      difficulty: "进阶",
      views: 890,
      type: "文章",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "ChatGPT在数学教学中的应用",
      description: "具体案例展示如何用ChatGPT辅助数学教学",
      duration: "25分钟",
      difficulty: "进阶",
      views: 756,
      type: "视频",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 4,
      title: "批量生成练习题的技巧",
      description: "掌握批量生成高质量练习题的方法和技巧",
      duration: "18分钟",
      difficulty: "进阶",
      views: 654,
      type: "视频",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  const ratingDistribution = [
    { stars: 5, count: 750, percentage: 60 },
    { stars: 4, count: 375, percentage: 30 },
    { stars: 3, count: 75, percentage: 6 },
    { stars: 2, count: 25, percentage: 2 },
    { stars: 1, count: 25, percentage: 2 },
  ]

  const navigationItems = [
    { id: "overview", label: "概述", icon: BookOpen },
    { id: "features", label: "功能特点", icon: Zap },
    { id: "tutorials", label: "使用教程", icon: Play },
    { id: "reviews", label: "用户评价", icon: Star },
    { id: "alternatives", label: "相关工具", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/tools">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回工具库
            </Link>
          </Button>

          <div className="flex gap-8">
            {/* 左侧导航 - 固定定位 */}
            <aside className="w-64 shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* 工具基本信息卡片 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        {tool.logo.startsWith('http') ? (
                          <img 
                            src={tool.logo} 
                            alt={tool.name}
                            className="w-16 h-16 rounded-xl object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`text-4xl ${tool.logo.startsWith('http') ? 'hidden' : ''}`}
                          style={tool.logo.startsWith('http') ? {display: 'none'} : {}}
                        >
                          {tool.logo.startsWith('http') ? '🔧' : tool.logo}
                        </div>
                      </div>
                      <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{tool.rating}</span>
                        <span className="text-sm text-gray-500">({tool.reviewCount})</span>
                      </div>
                      <Badge variant="outline">{tool.difficulty}</Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <Button size="lg" className="w-full" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          访问工具
                        </a>
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsBookmarked(!isBookmarked)}
                          className={isBookmarked ? "bg-blue-50 border-blue-200" : ""}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsLiked(!isLiked)}
                          className={isLiked ? "bg-red-50 border-red-200" : ""}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">开发商</span>
                        <span className="font-medium">{tool.developer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">用户数</span>
                        <span className="font-medium">{tool.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">价格</span>
                        <span className="font-medium">{tool.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">更新</span>
                        <span className="font-medium">{tool.lastUpdated}</span>
                      </div>
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
            <main className="flex-1 space-y-12">
              {/* 概述部分 */}
              <section id="overview" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      工具概述
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">详细介绍</h3>
                      <div className="prose max-w-none text-gray-700 leading-relaxed">
                        {tool.longDescription.split("\n\n").map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">优点</h4>
                        <div className="space-y-2">
                          {tool.pros.map((pro) => (
                            <div key={pro} className="flex items-center gap-2">
                              <ThumbsUp className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{pro}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-red-600">缺点</h4>
                        <div className="space-y-2">
                          {tool.cons.map((con) => (
                            <div key={con} className="flex items-center gap-2">
                              <ThumbsDown className="w-4 h-4 text-red-600" />
                              <span className="text-sm">{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">应用场景</h4>
                      {tool.useCases.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tool.useCases.map((useCase, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">{useCase.title}</h5>
                              <p className="text-sm text-gray-600">{useCase.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-500">暂无应用场景信息</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">支持平台</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {tool.platforms.map((platform) => {
                            const Icon = platform.icon
                            return (
                              <div key={platform.name} className="flex items-center gap-2 p-2 border rounded">
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{platform.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">支持语言</h4>
                        <div className="flex flex-wrap gap-1">
                          {tool.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 功能特点部分 */}
              <section id="features" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      功能特点
                    </CardTitle>
                    <CardDescription>详细了解工具的各项功能和特性</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tool.features.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tool.features.map((feature, index) => {
                          const Icon = feature.icon
                          return (
                            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">{feature.name}</h4>
                                  <p className="text-sm text-gray-600">{feature.description || '暂无描述'}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">暂无功能特点信息</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* 使用教程部分 */}
              <section id="tutorials" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      使用教程
                    </CardTitle>
                    <CardDescription>学习如何有效使用这个工具</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tutorials.map((tutorial) => (
                        <Card key={tutorial.id} className="hover:shadow-md transition-shadow cursor-pointer">
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
                            <img
                              src={tutorial.thumbnail || "/placeholder.svg"}
                              alt={tutorial.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                              {tutorial.type === "视频" ? (
                                <Play className="w-12 h-12 text-white" />
                              ) : (
                                <BookOpen className="w-12 h-12 text-white" />
                              )}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{tutorial.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {tutorial.duration}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {tutorial.difficulty}
                                </Badge>
                              </div>
                              <span>{tutorial.views} 观看</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 用户评价部分 */}
              <section id="reviews" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      用户评价
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* 评分统计 */}
                      <div className="lg:col-span-1">
                        <div className="text-center mb-6">
                          <div className="text-4xl font-bold mb-2">{tool.rating}</div>
                          <div className="flex justify-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(tool.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">{tool.reviewCount} 条评价</div>
                        </div>
                        <div className="space-y-2">
                          {ratingDistribution.map((item) => (
                            <div key={item.stars} className="flex items-center gap-2">
                              <span className="text-sm w-8">{item.stars}星</span>
                              <Progress value={item.percentage} className="flex-1" />
                              <span className="text-sm text-gray-500 w-12">{item.count}</span>
                            </div>
                          ))}
                        </div>

                        {/* 写评价 */}
                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-lg">写评价</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm">您的评分</Label>
                              <div className="flex gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-6 h-6 cursor-pointer ${
                                      i < userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                    onClick={() => setUserRating(i + 1)}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="review">评价内容</Label>
                              <Textarea id="review" placeholder="分享您的使用体验..." className="mt-1" />
                            </div>
                            <Button className="w-full">提交评价</Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 评价列表 */}
                      <div className="lg:col-span-2 space-y-6">
                        {reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{review.user.name}</span>
                                    {review.verified && (
                                      <Badge variant="outline" className="text-xs">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        已验证
                                      </Badge>
                                    )}
                                    <span className="text-sm text-gray-500">{review.user.role}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                  </div>
                                  <h4 className="font-medium mb-2">{review.title}</h4>
                                  <p className="text-gray-700 mb-3">{review.content}</p>
                                  <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm">
                                      <ThumbsUp className="w-3 h-3 mr-1" />
                                      有用 ({review.helpful})
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <MessageSquare className="w-3 h-3 mr-1" />
                                      回复
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 相关工具部分 */}
              <section id="alternatives" className="scroll-mt-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      相关工具
                    </CardTitle>
                    <CardDescription>您可能也感兴趣的类似工具</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tool.alternatives.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tool.alternatives.map((alt, index) => (
                          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center">
                              <div className="text-3xl mb-3">🔧</div>
                              <h4 className="font-semibold mb-2">{alt}</h4>
                              <p className="text-sm text-gray-600 mb-4">相关AI工具</p>
                              <div className="flex items-center justify-center gap-1 mb-3">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">4.5</span>
                                <span className="text-xs text-gray-500">(320)</span>
                              </div>
                              <Button size="sm" variant="outline" className="w-full">
                                查看详情
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">暂无相关工具推荐</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
