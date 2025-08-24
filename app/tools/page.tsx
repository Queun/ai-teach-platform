"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  ExternalLink,
  Star,
  Users,
  Zap,
  BookOpen,
  PenTool,
  BarChart3,
  MessageSquare,
  ImageIcon,
  Calculator,
  Globe,
  Heart,
  Bookmark,
  TrendingUp,
  Filter,
  Plus,
  Award,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPricing, setSelectedPricing] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const toolCategories = [
    { id: "all", name: "全部工具", icon: Globe, count: 156, color: "bg-blue-100 text-blue-800" },
    { id: "content-creation", name: "内容创作", icon: PenTool, count: 32, color: "bg-green-100 text-green-800" },
    { id: "assessment", name: "评估测试", icon: BarChart3, count: 28, color: "bg-purple-100 text-purple-800" },
    { id: "communication", name: "交流互动", icon: MessageSquare, count: 24, color: "bg-orange-100 text-orange-800" },
    { id: "multimedia", name: "多媒体", icon: ImageIcon, count: 20, color: "bg-pink-100 text-pink-800" },
    { id: "analytics", name: "数据分析", icon: BarChart3, count: 18, color: "bg-indigo-100 text-indigo-800" },
    { id: "language", name: "语言学习", icon: BookOpen, count: 16, color: "bg-yellow-100 text-yellow-800" },
    { id: "math", name: "数学计算", icon: Calculator, count: 18, color: "bg-red-100 text-red-800" },
  ]

  const tools = [
    {
      id: 1,
      name: "ChatGPT",
      description: "强大的对话式AI助手，可用于课程设计、内容创作、学生问答等多种教学场景",
      category: "content-creation",
      rating: 4.9,
      reviewCount: 1250,
      users: "100M+",
      pricing: "免费/付费",
      priceRange: "免费 - $20/月",
      features: ["对话交互", "内容生成", "多语言支持", "API接入", "自定义指令", "插件生态"],
      tags: ["对话AI", "内容创作", "教学助手", "GPT-4"],
      url: "https://chat.openai.com",
      featured: true,
      logo: "🤖",
      developer: "OpenAI",
      lastUpdated: "2024-05-28",
      difficulty: "入门",
      useCases: ["课程设计", "作业批改", "学生答疑", "教案生成"],
      pros: ["功能强大", "易于使用", "响应迅速", "持续更新"],
      cons: ["需要网络", "有使用限制", "中文理解有限"],
      tutorials: 15,
      isBookmarked: false,
      isRecommended: true,
    },
    {
      id: 2,
      name: "Grammarly",
      description: "AI驱动的写作助手，帮助学生和教师改善英语写作质量，提供语法和风格建议",
      category: "language",
      rating: 4.7,
      reviewCount: 890,
      users: "30M+",
      pricing: "免费/付费",
      priceRange: "免费 - $30/月",
      features: ["语法检查", "风格建议", "抄袭检测", "写作分析", "词汇增强", "语调调整"],
      tags: ["英语写作", "语法检查", "学术写作", "风格优化"],
      url: "https://grammarly.com",
      featured: false,
      logo: "✍️",
      developer: "Grammarly Inc.",
      lastUpdated: "2024-05-25",
      difficulty: "入门",
      useCases: ["英语写作", "论文修改", "邮件撰写", "学术写作"],
      pros: ["准确度高", "实时检查", "多平台支持", "详细解释"],
      cons: ["主要支持英语", "高级功能收费", "有时过于严格"],
      tutorials: 8,
      isBookmarked: true,
      isRecommended: false,
    },
    {
      id: 3,
      name: "Kahoot!",
      description: "互动式学习平台，通过游戏化测验和调查提升课堂参与度和学习效果",
      category: "assessment",
      rating: 4.6,
      reviewCount: 2100,
      users: "9B+",
      pricing: "免费/付费",
      priceRange: "免费 - $17/月",
      features: ["互动测验", "实时反馈", "游戏化学习", "数据分析", "团队协作", "自定义主题"],
      tags: ["互动测验", "课堂参与", "游戏化", "实时反馈"],
      url: "https://kahoot.com",
      featured: true,
      logo: "🎮",
      developer: "Kahoot! AS",
      lastUpdated: "2024-05-20",
      difficulty: "入门",
      useCases: ["课堂测验", "知识竞赛", "课前预习", "复习巩固"],
      pros: ["学生喜爱", "操作简单", "数据丰富", "支持大班"],
      cons: ["需要设备", "网络依赖", "题型有限"],
      tutorials: 12,
      isBookmarked: false,
      isRecommended: true,
    },
    {
      id: 4,
      name: "Canva",
      description: "简单易用的设计工具，帮助教师创建精美的教学材料、演示文稿和视觉内容",
      category: "multimedia",
      rating: 4.8,
      reviewCount: 1560,
      users: "135M+",
      pricing: "免费/付费",
      priceRange: "免费 - $15/月",
      features: ["模板设计", "协作编辑", "品牌套件", "动画制作", "AI设计", "素材库"],
      tags: ["设计工具", "教学材料", "视觉设计", "模板"],
      url: "https://canva.com",
      featured: false,
      logo: "🎨",
      developer: "Canva Pty Ltd",
      lastUpdated: "2024-05-22",
      difficulty: "入门",
      useCases: ["课件制作", "海报设计", "信息图表", "社交媒体"],
      pros: ["模板丰富", "操作简单", "协作便利", "输出质量高"],
      cons: ["高级功能收费", "网络依赖", "中文字体有限"],
      tutorials: 20,
      isBookmarked: true,
      isRecommended: false,
    },
    {
      id: 5,
      name: "Wolfram Alpha",
      description: "计算知识引擎，为数学、科学、工程等学科提供精确的计算和分析功能",
      category: "math",
      rating: 4.5,
      reviewCount: 670,
      users: "5M+",
      pricing: "免费/付费",
      priceRange: "免费 - $8/月",
      features: ["数学计算", "科学分析", "数据可视化", "步骤解析", "单位转换", "统计分析"],
      tags: ["数学工具", "科学计算", "STEM教育", "数据分析"],
      url: "https://wolframalpha.com",
      featured: false,
      logo: "🔢",
      developer: "Wolfram Research",
      lastUpdated: "2024-05-18",
      difficulty: "进阶",
      useCases: ["数学解题", "科学计算", "数据分析", "公式验证"],
      pros: ["计算准确", "功能全面", "步骤详细", "权威可靠"],
      cons: ["界面复杂", "学习成本高", "部分功能收费"],
      tutorials: 6,
      isBookmarked: false,
      isRecommended: false,
    },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory

    const matchesPricing =
      selectedPricing === "all" ||
      (selectedPricing === "free" && tool.pricing.includes("免费")) ||
      (selectedPricing === "paid" && tool.pricing.includes("付费"))

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4+" && tool.rating >= 4) ||
      (selectedRating === "4.5+" && tool.rating >= 4.5)

    return matchesSearch && matchesCategory && matchesPricing && matchesRating
  })

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "users":
        return Number.parseInt(b.users.replace(/[^\d]/g, "")) - Number.parseInt(a.users.replace(/[^\d]/g, ""))
      case "reviews":
        return b.reviewCount - a.reviewCount
      case "updated":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const featuredTools = tools.filter((tool) => tool.featured)
  const recommendedTools = tools.filter((tool) => tool.isRecommended)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">AI工具库</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">精选最优质的AI教育工具，提升教学效率，创新教学方式</p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索AI工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button className="h-12 px-6">
                <Plus className="w-4 h-4 mr-2" />
                推荐工具
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="all">全部工具</TabsTrigger>
            <TabsTrigger value="featured">精选推荐</TabsTrigger>
            <TabsTrigger value="trending">热门工具</TabsTrigger>
            <TabsTrigger value="new">最新收录</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-80 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      筛选条件
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <h4 className="font-medium mb-3">工具分类</h4>
                      <div className="space-y-2">
                        {toolCategories.map((category) => {
                          const Icon = category.icon
                          return (
                            <Button
                              key={category.id}
                              variant={selectedCategory === category.id ? "default" : "ghost"}
                              className="w-full justify-start h-auto p-2"
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              <span className="flex-1 text-left">{category.name}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {category.count}
                              </Badge>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Pricing Filter */}
                    <div>
                      <h4 className="font-medium mb-3">定价模式</h4>
                      <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择定价" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部</SelectItem>
                          <SelectItem value="free">免费</SelectItem>
                          <SelectItem value="paid">付费</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <h4 className="font-medium mb-3">用户评分</h4>
                      <Select value={selectedRating} onValueChange={setSelectedRating}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择评分" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部评分</SelectItem>
                          <SelectItem value="4.5+">4.5分及以上</SelectItem>
                          <SelectItem value="4+">4.0分及以上</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Features Filter */}
                    <div>
                      <h4 className="font-medium mb-3">特色功能</h4>
                      <div className="space-y-2">
                        {["API接入", "多语言支持", "实时协作", "移动端支持", "离线使用"].map((feature) => (
                          <label key={feature} className="flex items-center space-x-2">
                            <Checkbox />
                            <span className="text-sm">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">工具库统计</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">总工具数</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">本周新增</span>
                      <span className="font-semibold text-green-600">8</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">精选推荐</span>
                      <span className="font-semibold text-blue-600">23</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">免费工具</span>
                      <span className="font-semibold text-purple-600">89</span>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600">找到 {sortedTools.length} 个工具</div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">评分最高</SelectItem>
                      <SelectItem value="users">用户最多</SelectItem>
                      <SelectItem value="reviews">评价最多</SelectItem>
                      <SelectItem value="updated">最近更新</SelectItem>
                      <SelectItem value="name">名称排序</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {sortedTools.map((tool) => (
                    <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{tool.logo}</div>
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{tool.rating}</span>
                                  <span className="text-xs text-gray-500">({tool.reviewCount})</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {tool.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {tool.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Award className="w-3 h-3 mr-1" />
                                精选
                              </Badge>
                            )}
                            {tool.isRecommended && <Badge className="bg-blue-100 text-blue-800">推荐</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4 line-clamp-2">{tool.description}</CardDescription>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{tool.users} 用户</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{tool.lastUpdated}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">价格：{tool.priceRange}</span>
                            <span className="text-gray-600">{tool.tutorials} 个教程</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {tool.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {tool.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{tool.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link href={`/tools/${tool.id}`}>
                              <BookOpen className="w-3 h-3 mr-1" />
                              查看详情
                            </Link>
                          </Button>
                          <Button size="sm" className="flex-1" asChild>
                            <a href={tool.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              访问工具
                            </a>
                          </Button>
                          <Button size="sm" variant="ghost" className="px-2">
                            <Heart className={`w-4 h-4 ${tool.isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                          <Button size="sm" variant="ghost" className="px-2">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" disabled>
                      上一页
                    </Button>
                    <Button variant="default">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <span className="px-2">...</span>
                    <Button variant="outline">8</Button>
                    <Button variant="outline">下一页</Button>
                  </div>
                </div>
              </main>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{tool.logo}</div>
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{tool.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {tool.pricing}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Award className="w-3 h-3 mr-1" />
                        精选
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{tool.description}</CardDescription>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link href={`/tools/${tool.id}`}>查看详情</Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          访问工具
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">热门工具排行</h3>
              <p className="text-gray-600 mb-6">基于用户使用量和评分的热门工具排行榜</p>
              <Button>查看完整排行榜</Button>
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="text-center py-12">
              <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">最新收录工具</h3>
              <p className="text-gray-600 mb-6">最近添加到工具库的新工具</p>
              <Button>查看最新工具</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
