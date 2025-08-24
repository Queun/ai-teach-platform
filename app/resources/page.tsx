"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ExternalLink, Star, Eye, MessageSquare, ThumbsUp, Calendar, User, Award, Filter } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("curated")

  const categories = [
    { id: "all", name: "全部资源", count: 156, icon: "📚" },
    { id: "teaching-guides", name: "教学指南", count: 45, icon: "📖" },
    { id: "ai-tools", name: "AI工具评测", count: 38, icon: "🤖" },
    { id: "case-studies", name: "教学案例", count: 32, icon: "💡" },
    { id: "templates", name: "教学模板", count: 28, icon: "📄" },
    { id: "research", name: "学术研究", count: 13, icon: "🔬" },
  ]

  // Mock 精品资源数据 - 来自 Discourse 社区
  const curatedResources = [
    {
      id: 1,
      title: "ChatGPT在小学数学教学中的10个实用技巧",
      description:
        "一线教师分享的ChatGPT数学教学实战经验，包含具体的提示词模板和课堂应用案例，已在多个班级验证效果显著。",
      author: {
        name: "张明老师",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "小学数学教师",
        discourseUsername: "zhangming_math",
      },
      category: "teaching-guides",
      tags: ["ChatGPT", "小学数学", "提示词", "课堂实践"],
      discourseTopicId: 1234,
      discourseUrl: "https://community.aijiaoxue.com/t/chatgpt-math-tips/1234",
      stats: {
        likes: 89,
        replies: 23,
        views: 1240,
        downloads: 156,
      },
      curatedAt: "2024-05-28",
      curatedBy: "教学专家组",
      featured: true,
      quality: "精华",
      difficulty: "入门",
    },
    {
      id: 2,
      title: "AI写作助手深度评测：5款工具横向对比",
      description: "详细对比Grammarly、QuillBot、Jasper等5款AI写作工具，从功能、价格、适用场景等维度进行全面分析。",
      author: {
        name: "李教授",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "英语教育专家",
        discourseUsername: "prof_li_english",
      },
      category: "ai-tools",
      tags: ["AI写作", "工具评测", "英语教学", "对比分析"],
      discourseTopicId: 1235,
      discourseUrl: "https://community.aijiaoxue.com/t/ai-writing-tools-comparison/1235",
      stats: {
        likes: 67,
        replies: 18,
        views: 890,
        downloads: 89,
      },
      curatedAt: "2024-05-26",
      curatedBy: "技术评测组",
      featured: false,
      quality: "优质",
      difficulty: "进阶",
    },
    {
      id: 3,
      title: "基于AI的个性化学习路径设计完整方案",
      description: "包含学生画像构建、学习路径算法、效果评估等完整流程，附带可直接使用的Excel模板和Python代码。",
      author: {
        name: "王主任",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "教学主任",
        discourseUsername: "director_wang",
      },
      category: "case-studies",
      tags: ["个性化学习", "学习路径", "算法设计", "模板"],
      discourseTopicId: 1236,
      discourseUrl: "https://community.aijiaoxue.com/t/personalized-learning-path/1236",
      stats: {
        likes: 124,
        replies: 31,
        views: 1560,
        downloads: 203,
      },
      curatedAt: "2024-05-24",
      curatedBy: "课程设计组",
      featured: true,
      quality: "精华",
      difficulty: "高级",
    },
    {
      id: 4,
      title: "AI伦理教育课程设计与实施指南",
      description: "针对中学生的AI伦理教育完整课程方案，包含课件、活动设计、评估标准等全套教学资源。",
      author: {
        name: "陈博士",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "教育研究员",
        discourseUsername: "dr_chen_ethics",
      },
      category: "templates",
      tags: ["AI伦理", "课程设计", "中学教育", "教学资源"],
      discourseTopicId: 1237,
      discourseUrl: "https://community.aijiaoxue.com/t/ai-ethics-curriculum/1237",
      stats: {
        likes: 45,
        replies: 12,
        views: 678,
        downloads: 67,
      },
      curatedAt: "2024-05-22",
      curatedBy: "伦理教育组",
      featured: false,
      quality: "优质",
      difficulty: "进阶",
    },
  ]

  const filteredResources = curatedResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case "curated":
        return new Date(b.curatedAt).getTime() - new Date(a.curatedAt).getTime()
      case "popular":
        return b.stats.likes - a.stats.likes
      case "downloads":
        return b.stats.downloads - a.stats.downloads
      case "discussions":
        return b.stats.replies - a.stats.replies
      default:
        return 0
    }
  })

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "精华":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "优质":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "入门":
        return "bg-green-100 text-green-800"
      case "进阶":
        return "bg-orange-100 text-orange-800"
      case "高级":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
              <h1 className="text-4xl font-bold text-gray-900">精品资源库</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">来自社区的优质教学资源，经过专家团队精心策展</p>
            <p className="text-sm text-gray-500 mb-8">
              所有资源均来自{" "}
              <Link href="https://community.aijiaoxue.com" className="text-blue-600 hover:underline">
                爱教学社区
              </Link>{" "}
              的真实分享，由教育专家审核推荐
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索精品资源..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">资源分类</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="flex-1 text-left">{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">策展信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">总资源数</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">本周新增</span>
                    <span className="font-semibold text-green-600">12</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">精华资源</span>
                    <span className="font-semibold text-yellow-600">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">质量标准</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">精华</Badge>
                    <span className="text-gray-600">专家推荐，质量极高</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">优质</Badge>
                    <span className="text-gray-600">社区认可，实用性强</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">找到 {sortedResources.length} 个精品资源</div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curated">最新策展</SelectItem>
                    <SelectItem value="popular">最受欢迎</SelectItem>
                    <SelectItem value="downloads">下载最多</SelectItem>
                    <SelectItem value="discussions">讨论最热</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {sortedResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getQualityColor(resource.quality)}>{resource.quality}</Badge>
                        <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                        {resource.featured && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            推荐
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">策展时间：{resource.curatedAt}</div>
                    </div>

                    <CardTitle className="text-xl leading-tight hover:text-blue-600 cursor-pointer">
                      <Link href={resource.discourseUrl} target="_blank" rel="noopener noreferrer">
                        {resource.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="mb-4 text-base leading-relaxed">{resource.description}</CardDescription>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={resource.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{resource.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{resource.author.name}</div>
                        <div className="text-sm text-gray-600">{resource.author.title}</div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`https://community.aijiaoxue.com/u/${resource.author.discourseUsername}`}
                          target="_blank"
                        >
                          <User className="w-3 h-3 mr-1" />
                          查看主页
                        </Link>
                      </Button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {resource.stats.likes} 点赞
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {resource.stats.replies} 讨论
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {resource.stats.views} 浏览
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {resource.stats.downloads} 下载
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={resource.discourseUrl} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            参与讨论
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={resource.discourseUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            查看详情
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Curation Info */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        由 <span className="font-medium">{resource.curatedBy}</span> 策展推荐
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">想要分享您的教学资源？</h3>
                <p className="text-gray-600 mb-4">加入我们的社区，分享您的教学经验和资源，有机会被策展为精品内容</p>
                <div className="flex gap-2 justify-center">
                  <Button asChild>
                    <Link href="https://community.aijiaoxue.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      加入社区
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="https://community.aijiaoxue.com/c/resources" target="_blank" rel="noopener noreferrer">
                      分享资源
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
