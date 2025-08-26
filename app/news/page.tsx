"use client"

import { useState, useMemo } from "react"
import { useNews, useStats } from "@/hooks/useStrapi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, Eye, ArrowRight, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  // 使用 Strapi API 获取数据
  const { data: allNews, loading: newsLoading, error: newsError } = useNews({
    pageSize: 50,
    sort: 'createdAt:desc'
  })
  const { data: stats, loading: statsLoading } = useStats()

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

  const categories = [
    { id: "all", name: "全部资讯", count: stats?.news || 86 },
    { id: "policy", name: "政策动态", count: 24 },
    { id: "tools", name: "工具评测", count: 18 },
    { id: "cases", name: "教学案例", count: 16 },
    { id: "opinions", name: "教育观点", count: 14 },
    { id: "events", name: "活动通知", count: 8 },
    { id: "research", name: "研究报告", count: 6 },
  ]

  // 转换 Strapi 数据为组件所需格式
  const news = useMemo(() => {
    if (!allNews || allNews.length === 0) return []
    
    return allNews.map(article => {
      // 安全访问 attributes，如果不存在则使用 article 本身
      const data = article.attributes || article
      
      return {
        id: article.id,
        documentId: article.documentId,
        title: data.title || '未命名文章',
        content: extractText(data.excerpt || data.content || '暂无内容'),
        category: data.category || '资讯',
        author: data.authorName || '未知作者',
        date: new Date(data.publishDate || data.createdAt || Date.now()).toLocaleDateString('zh-CN'),
        views: data.views || 0,
        shares: data.shares || 0,
        image: data.featuredImage?.url 
          ? `http://localhost:1337${data.featuredImage.url}` 
          : "/placeholder.svg?height=400&width=800",
        featured: data.isFeatured || false,
        isBreaking: data.isBreaking || false,
        tags: data.tags || [],
        source: data.source || '',
        readTime: data.readTime || '5分钟阅读',
        slug: data.slug || '',
        priority: data.priority || 0,
        keywords: data.keywords || [],
      }
    })
  }, [allNews])

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || 
      (selectedCategory === "policy" && item.category.includes("政策")) ||
      (selectedCategory === "tools" && item.category.includes("工具")) ||
      (selectedCategory === "cases" && item.category.includes("案例")) ||
      (selectedCategory === "opinions" && item.category.includes("观点")) ||
      (selectedCategory === "events" && item.category.includes("活动")) ||
      (selectedCategory === "research" && item.category.includes("研究"))

    return matchesSearch && matchesCategory
  })

  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "popular":
        return b.views - a.views
      case "comments":
        return b.shares - a.shares
      default:
        return 0
    }
  })

  const featuredNews = news.filter((item) => item.featured || item.isBreaking)

  // 根据分类获取新闻
  const getNewsByCategory = (categoryName: string) => {
    return news.filter((item) => item.category.includes(categoryName))
  }

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
        {/* Loading State */}
        {newsLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载新闻数据中...</p>
          </div>
        )}

        {/* Error State */}
        {newsError && (
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">加载失败</div>
            <p className="text-gray-600 mb-4">{newsError}</p>
            <Button onClick={() => window.location.reload()}>重新加载</Button>
          </div>
        )}

        {/* Main Content */}
        {!newsLoading && !newsError && (
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
                  <div className="text-sm text-gray-600">找到 {sortedNews.length} 条资讯</div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">最新发布</SelectItem>
                      <SelectItem value="popular">最多阅读</SelectItem>
                      <SelectItem value="comments">最多分享</SelectItem>
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
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">头条资讯</Badge>
                          {featuredNews[0].isBreaking && (
                            <Badge className="bg-red-100 text-red-800">突发</Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 cursor-pointer">
                          <Link href={`/news/${featuredNews[0].documentId || featuredNews[0].id}`}>
                            {featuredNews[0].title}
                          </Link>
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
                        
                        {/* Tags */}
                        {featuredNews[0].tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {featuredNews[0].tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <Button asChild>
                          <Link href={`/news/${featuredNews[0].documentId || featuredNews[0].id}`}>
                            阅读全文 <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedNews
                    .filter((item) => !item.featured || selectedCategory !== "all" || searchQuery !== "")
                    .map((item) => (
                      <Card key={item.documentId || item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{item.category}</Badge>
                              {item.isBreaking && (
                                <Badge className="bg-red-100 text-red-800 text-xs">突发</Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{item.date}</span>
                          </div>
                          <CardTitle className="text-lg leading-tight hover:text-blue-600 cursor-pointer">
                            <Link href={`/news/${item.documentId || item.id}`}>{item.title}</Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4 line-clamp-3">{item.content}</CardDescription>
                          
                          {/* Tags */}
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
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
                              {item.readTime && (
                                <span className="text-xs">{item.readTime}</span>
                              )}
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/news/${item.documentId || item.id}`}>阅读全文</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* Empty State */}
                {sortedNews.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">暂无相关资讯</h3>
                    <p className="text-gray-500">请尝试调整搜索条件或分类筛选</p>
                  </div>
                )}

                {/* Pagination */}
                {sortedNews.length > 0 && (
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
                )}
              </main>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="space-y-6">
              {featuredNews.length > 0 ? (
                featuredNews.map((item) => (
                  <Card key={item.documentId || item.id} className="overflow-hidden">
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
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">头条资讯</Badge>
                          {item.isBreaking && (
                            <Badge className="bg-red-100 text-red-800">突发</Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 cursor-pointer">
                          <Link href={`/news/${item.documentId || item.id}`}>{item.title}</Link>
                        </h3>
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
                        
                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <Button asChild>
                          <Link href={`/news/${item.documentId || item.id}`}>
                            阅读全文 <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">暂无头条资讯</h3>
                  <p className="text-gray-600 mb-6">最新的重要资讯将在这里展示</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="policy">
            <div className="space-y-6">
              {getNewsByCategory("政策").length > 0 ? getNewsByCategory("政策").map((item) => (
                <Card key={item.documentId || item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        <Link href={`/news/${item.documentId || item.id}`}>{item.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
                      
                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
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
                          <Link href={`/news/${item.documentId || item.id}`}>阅读全文</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">暂无政策解读</h3>
                  <p className="text-gray-500">最新的教育政策解读将在这里展示</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cases">
            <div className="space-y-6">
              {getNewsByCategory("案例").length > 0 ? getNewsByCategory("案例").map((item) => (
                <Card key={item.documentId || item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        <Link href={`/news/${item.documentId || item.id}`}>{item.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
                      
                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
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
                          <Link href={`/news/${item.documentId || item.id}`}>阅读全文</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">暂无教学案例</h3>
                  <p className="text-gray-500">最新的教学案例分享将在这里展示</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  )
}
