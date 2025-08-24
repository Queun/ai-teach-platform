"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "全部资讯", count: 86 },
    { id: "policy", name: "政策动态", count: 24 },
    { id: "tools", name: "工具评测", count: 18 },
    { id: "cases", name: "教学案例", count: 16 },
    { id: "opinions", name: "教育观点", count: 14 },
    { id: "events", name: "活动通知", count: 8 },
    { id: "research", name: "研究报告", count: 6 },
  ]

  const news = [
    {
      id: 1,
      title: "教育部发布AI教育新政策，鼓励中小学引入AI课程",
      content:
        "教育部近日发布新政策，鼓励全国中小学校积极引入人工智能相关课程，培养学生的AI素养和创新能力。该政策明确提出，到2025年，全国50%以上的中小学校应开设AI相关课程，并将AI教育纳入学校信息化建设的重要内容。",
      category: "政策动态",
      author: "教育政策研究中心",
      date: "2024-05-28",
      views: 3560,
      image: "/placeholder.svg?height=400&width=800",
      featured: true,
      tags: ["教育政策", "AI课程", "中小学教育"],
    },
    {
      id: 2,
      title: "2024年AI教育工具排行榜发布，这些工具最受教师欢迎",
      content:
        "近日，国内权威教育科技评测机构发布了2024年AI教育工具排行榜，多款创新工具因其易用性和教学效果获得教师高度评价。",
      category: "工具评测",
      author: "教育科技评测中心",
      date: "2024-05-25",
      views: 2890,
      image: "/placeholder.svg?height=400&width=800",
      featured: false,
      tags: ["AI工具", "教育科技", "工具评测"],
    },
    {
      id: 3,
      title: "AI如何改变语言教学？一线教师分享成功经验",
      content: "来自北京市实验中学的王老师分享了她在英语教学中应用AI工具的成功经验，学生的口语和写作能力显著提升。",
      category: "教学案例",
      author: "王明",
      date: "2024-05-20",
      views: 2450,
      image: "/placeholder.svg?height=400&width=800",
      featured: false,
      tags: ["语言教学", "教学案例", "英语教育"],
    },
    {
      id: 4,
      title: "AI伦理教育成为热点，专家呼吁加强学生AI素养培养",
      content: "随着AI技术在教育领域的广泛应用，如何培养学生正确认识和使用AI的能力，成为教育界关注的热点话题。",
      category: "教育观点",
      author: "教育研究院",
      date: "2024-05-18",
      views: 2120,
      image: "/placeholder.svg?height=400&width=800",
      featured: false,
      tags: ["AI伦理", "教育观点", "学生素养"],
    },
    {
      id: 5,
      title: "全国AI教育创新大赛启动，邀请中小学教师参与",
      content: "由教育部教育技术中心主办的首届全国AI教育创新大赛正式启动，面向全国中小学教师征集AI教育应用创新案例。",
      category: "活动通知",
      author: "教育技术中心",
      date: "2024-05-15",
      views: 1890,
      image: "/placeholder.svg?height=400&width=800",
      featured: false,
      tags: ["教育比赛", "教师发展", "AI创新"],
    },
    {
      id: 6,
      title: "研究表明：AI辅助教学提高学生学习兴趣和成绩",
      content: "一项历时两年、覆盖全国20所学校的研究显示，合理使用AI辅助教学能显著提高学生的学习兴趣和学业成绩。",
      category: "研究报告",
      author: "教育科学研究所",
      date: "2024-05-10",
      views: 1760,
      image: "/placeholder.svg?height=400&width=800",
      featured: false,
      tags: ["教育研究", "学习效果", "混合式教学"],
    },
  ]

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" || item.category === categories.find((cat) => cat.id === selectedCategory)?.name

    return matchesSearch && matchesCategory
  })

  const featuredNews = news.filter((item) => item.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">AI教育前沿</h1>
            <p className="text-xl text-gray-600 mb-8">了解AI教育领域的最新动态、政策解读和教学案例</p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索资讯..."
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
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="all">全部资讯</TabsTrigger>
            <TabsTrigger value="featured">头条资讯</TabsTrigger>
            <TabsTrigger value="policy">政策解读</TabsTrigger>
            <TabsTrigger value="cases">教学案例</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-64 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">资讯分类</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-between"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">热门标签</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["AI教育", "教育政策", "教学案例", "工具评测", "教师发展", "学生素养", "混合式教学"].map(
                        (tag) => (
                          <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-blue-50">
                            {tag}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600">找到 {filteredNews.length} 条资讯</div>
                  <Select defaultValue="latest">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">最新发布</SelectItem>
                      <SelectItem value="popular">最多阅读</SelectItem>
                      <SelectItem value="comments">最多评论</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured News */}
                {featuredNews.length > 0 && selectedCategory === "all" && searchQuery === "" && (
                  <Card className="mb-8 overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/5">
                        <img
                          src={featuredNews[0].image || "/placeholder.svg"}
                          alt={featuredNews[0].title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: "250px" }}
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <Badge className="mb-2 bg-blue-100 text-blue-800">头条资讯</Badge>
                        <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 cursor-pointer">
                          {featuredNews[0].title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{featuredNews[0].content}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {featuredNews[0].author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {featuredNews[0].date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {featuredNews[0].views} 阅读
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/news/${featuredNews[0].id}`}>
                            阅读全文 <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews
                    .filter((item) => !item.featured || selectedCategory !== "all" || searchQuery !== "")
                    .map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{item.category}</Badge>
                            <span className="text-sm text-gray-500">{item.date}</span>
                          </div>
                          <CardTitle className="text-lg leading-tight hover:text-blue-600 cursor-pointer">
                            <Link href={`/news/${item.id}`}>{item.title}</Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4 line-clamp-3">{item.content}</CardDescription>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {item.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {item.views}
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/news/${item.id}`}>阅读全文</Link>
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
                    <Button variant="outline">5</Button>
                    <Button variant="outline">下一页</Button>
                  </div>
                </div>
              </main>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="space-y-6">
              {featuredNews.length > 0 ? (
                featuredNews.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/5">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: "250px" }}
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <Badge className="mb-2 bg-blue-100 text-blue-800">头条资讯</Badge>
                        <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 cursor-pointer">{item.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {item.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {item.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {item.views} 阅读
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/news/${item.id}`}>
                            阅读全文 <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">暂无头条资讯</h3>
                  <p className="text-gray-600 mb-6">请稍后查看</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="policy">
            <div className="space-y-6">
              {news
                .filter((item) => item.category === "政策动态")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: "200px" }}
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <Badge variant="secondary" className="mb-2">
                          {item.category}
                        </Badge>
                        <h3 className="text-xl font-bold mb-3 hover:text-blue-600 cursor-pointer">
                          <Link href={`/news/${item.id}`}>{item.title}</Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {item.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {item.views} 阅读
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/news/${item.id}`}>阅读全文</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="cases">
            <div className="space-y-6">
              {news
                .filter((item) => item.category === "教学案例")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: "200px" }}
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <Badge variant="secondary" className="mb-2">
                          {item.category}
                        </Badge>
                        <h3 className="text-xl font-bold mb-3 hover:text-blue-600 cursor-pointer">
                          <Link href={`/news/${item.id}`}>{item.title}</Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {item.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {item.views} 阅读
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/news/${item.id}`}>阅读全文</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
