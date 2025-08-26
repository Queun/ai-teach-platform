"use client"

import { useState, useMemo } from "react"
import { useNews, useStats, useNewsCategories } from "@/hooks/useStrapi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, Eye, ArrowRight, MessageSquare, Hash, X, Filter, Loader2, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 判断是否有筛选条件
  const hasFilters = selectedCategory !== "all" || selectedTags.length > 0 || searchQuery.trim() !== ""

  // 使用 Strapi API 获取数据
  const { data: allNews, loading: newsLoading, error: newsError, loadMore, hasMore, pagination } = useNews({
    pageSize: hasFilters ? 100 : 12, // 有筛选条件时获取更多数据，无筛选时分页
    sort: 'createdAt:desc'
  })
  const { data: stats, loading: statsLoading } = useStats()
  const { data: newsCategories, loading: categoriesLoading } = useNewsCategories()

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

  // 转换 Strapi 数据为组件所需格式
  const news = useMemo(() => {
    if (!allNews || allNews.length === 0) return []
    
    console.log('原始新闻数据:', allNews);
    console.log('原始新闻数量:', allNews.length);
    
    const transformedNews = allNews.map(article => {
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
    
    console.log('转换后新闻数据:', transformedNews);
    console.log('转换后新闻数量:', transformedNews.length);
    
    return transformedNews;
  }, [allNews])

  // 提取所有可用标签
  const allTags = useMemo(() => {
    if (!news || news.length === 0) return []
    
    const tagMap = new Map<string, number>()
    news.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach(tag => {
          if (typeof tag === 'string' && tag.trim()) {
            const normalizedTag = tag.trim()
            tagMap.set(normalizedTag, (tagMap.get(normalizedTag) || 0) + 1)
          }
        })
      }
    })
    
    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count) // 按使用频率排序
      .slice(0, 20) // 只显示前20个最常用的标签
  }, [news])

  // 计算统计数据
  const newsStats = useMemo(() => {
    if (!news || news.length === 0) {
      return {
        total: 0,
        weeklyNew: 0,
        featured: 0,
        byCategory: {}
      };
    }

    // 计算本周新增（过去7天）
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyNew = news.filter(article => {
      const articleDate = new Date(article.date);
      return articleDate >= oneWeekAgo;
    }).length;

    // 计算精华资讯数量
    const featured = news.filter(article => article.featured || article.isBreaking).length;

    // 按分类统计
    const byCategory: Record<string, number> = {};
    news.forEach(article => {
      const category = article.category || 'general';
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    return {
      total: news.length,
      weeklyNew,
      featured,
      byCategory
    };
  }, [news]);

  // 使用动态分类数据，如果加载中或出错则使用默认分类
  const displayCategories = useMemo(() => {
    if (!categoriesLoading && newsCategories && newsCategories.length > 0) {
      return newsCategories;
    }
    
    // 默认分类作为后备
    return [
      { category: "all", name: "全部资讯", count: stats?.news || 0, label: "全部资讯", icon: "📰" },
      { category: "policy", name: "政策动态", count: 0, label: "政策动态", icon: "📋" },
      { category: "tools", name: "工具评测", count: 0, label: "工具评测", icon: "🔧" },
      { category: "cases", name: "教学案例", count: 0, label: "教学案例", icon: "💡" },
      { category: "opinions", name: "教育观点", count: 0, label: "教育观点", icon: "💭" },
      { category: "events", name: "活动通知", count: 0, label: "活动通知", icon: "📅" },
      { category: "research", name: "研究报告", count: 0, label: "研究报告", icon: "📊" },
    ];
  }, [newsCategories, categoriesLoading, stats]);

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    const matchesTags = selectedTags.length === 0 || selectedTags.some(selectedTag =>
      item.tags.some(articleTag => articleTag === selectedTag)
    )

    return matchesSearch && matchesCategory && matchesTags
  })

  console.log('筛选后新闻数量:', filteredNews.length);
  console.log('筛选后新闻:', filteredNews);

  // 标签处理函数
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllTags = () => {
    setSelectedTags([])
  }

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
                  {displayCategories.map((category) => (
                    <SelectItem key={category.category} value={category.category}>
                      {category.icon} {category.label} ({category.count})
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
                <div className="sticky top-16 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">资讯分类</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {displayCategories.map((category) => (
                      <Button
                        key={category.category}
                        variant={selectedCategory === category.category ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.category)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        <span className="flex-1 text-left">{category.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        热门标签
                      </CardTitle>
                      {selectedTags.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={clearAllTags}
                          className="text-xs text-gray-500 hover:text-gray-700 p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {allTags.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {allTags.slice(0, 12).map(({ tag, count }) => (
                            <Button
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleTag(tag)}
                              className={`
                                h-7 px-2 text-xs transition-all duration-200
                                ${selectedTags.includes(tag) 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                                }
                              `}
                            >
                              {tag}
                              <span className="ml-1 text-xs opacity-75">({count})</span>
                            </Button>
                          ))}
                        </div>
                        
                        {selectedTags.length > 0 && (
                          <div className="pt-2 border-t">
                            <div className="text-xs text-gray-500 mb-2">已选择 {selectedTags.length} 个标签:</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedTags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary" 
                                  className="text-xs cursor-pointer hover:bg-red-100"
                                  onClick={() => toggleTag(tag)}
                                >
                                  {tag}
                                  <X className="w-3 h-3 ml-1" />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {allTags.length > 12 && (
                          <div className="pt-2 text-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-gray-500"
                            >
                              查看更多标签 ({allTags.length - 12})
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-4">
                        <Hash className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        暂无标签数据
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">资讯统计</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">总资讯数</span>
                        <span className="font-semibold">{newsLoading ? '...' : newsStats.total}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">本周新增</span>
                        <span className="font-semibold text-green-600">
                          {newsLoading ? '...' : `+${newsStats.weeklyNew}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">头条资讯</span>
                        <span className="font-semibold text-blue-600">
                          {newsLoading ? '...' : newsStats.featured}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-600">找到 {sortedNews.length} 条资讯</div>
                    {(selectedTags.length > 0 || selectedCategory !== "all") && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>当前筛选:</span>
                        {selectedCategory !== "all" && (
                          <Badge variant="outline" className="text-xs">
                            分类: {displayCategories.find(c => c.category === selectedCategory)?.label}
                          </Badge>
                        )}
                        {selectedTags.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            标签: {selectedTags.join(', ')}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
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
                </div>

                {/* Featured News */}
                {featuredNews.length > 0 && selectedCategory === "all" && searchQuery === "" && selectedTags.length === 0 && (
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
                  {(() => {
                    // 修复：只排除在头条区域已显示的第一条精华新闻
                    const shouldShowFeaturedInHeader = selectedCategory === "all" && searchQuery === "" && selectedTags.length === 0;
                    const firstFeaturedNews = featuredNews.length > 0 ? featuredNews[0] : null;
                    
                    const gridNews = sortedNews.filter((item) => {
                      // 如果头条区域显示了精华新闻，则排除第一条精华新闻，其他都显示
                      if (shouldShowFeaturedInHeader && firstFeaturedNews && 
                          (item.id === firstFeaturedNews.id || item.documentId === firstFeaturedNews.documentId)) {
                        return false; // 排除已在头条显示的新闻
                      }
                      return true; // 显示所有其他新闻
                    });
                    
                    console.log('网格新闻筛选前:', sortedNews.length);
                    console.log('网格新闻筛选后:', gridNews.length);
                    console.log('是否显示头条:', shouldShowFeaturedInHeader);
                    console.log('头条新闻:', firstFeaturedNews?.title || '无');
                    
                    return gridNews.map((item) => (
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
                    ));
                  })()}
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
                {!hasFilters && hasMore && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={loadMore}
                      disabled={newsLoading}
                      size="lg"
                      variant="outline"
                      className="bg-white hover:bg-gray-50"
                    >
                      {newsLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          加载中...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          加载更多资讯
                        </>
                      )}
                    </Button>
                    
                    {pagination && (
                      <div className="text-xs text-gray-500 mt-3">
                        已显示 {allNews.length} / {pagination.total} 条资讯
                        {pagination.pageCount > 1 && (
                          <span className="ml-2">
                            第 {pagination.page} / {pagination.pageCount} 页
                          </span>
                        )}
                      </div>
                    )}
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
