"use client"

import { useState, useMemo } from "react"
import { useTools, useFeaturedTools, useStats, useToolCategories } from "@/hooks/useStrapi"
import { useInteraction } from "@/hooks/useInteraction"
import strapiService from "@/lib/strapi"
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
  Hash,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"

// 工具卡片互动组件
function ToolCard({ tool }: { tool: any }) {
  // 使用 useMemo 稳定 targetId 和 initialStats，避免无限重渲染
  const targetId = useMemo(() => tool.documentId || tool.id.toString(), [tool.documentId, tool.id])
  
  const initialStats = useMemo(() => ({
    likesCount: tool.likesCount || 0,  // 使用正确的字段名
    favoritesCount: tool.favoritesCount || 0,
    commentsCount: tool.commentsCount || 0
  }), [tool.likesCount, tool.favoritesCount, tool.commentsCount])

  const {
    isLiked,
    isFavorited: isBookmarked,
    stats,
    loading: interactionLoading,
    toggleLike,
    toggleFavorite,
    isAuthenticated
  } = useInteraction({
    targetType: 'ai-tool',
    targetId,
    initialStats
  })

  return (
    <Card key={tool.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              {tool.logo.startsWith('http') ? (
                <img 
                  src={tool.logo} 
                  alt={tool.name}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div 
                className={`text-2xl ${tool.logo.startsWith('http') ? 'hidden' : ''}`}
                style={tool.logo.startsWith('http') ? {display: 'none'} : {}}
              >
                {tool.logo.startsWith('http') ? '🔧' : tool.logo}
              </div>
            </div>
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {tool.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {tool.featured && (
              <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <Award className="w-3 h-3 mr-1" />
                精选
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600 leading-relaxed">
          {tool.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{tool.userCount}+ 用户</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{stats.likesCount} 点赞</span>
              </div>
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
            <Link href={`/tools/${tool.documentId || tool.id}`}>
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
          <Button 
            size="sm" 
            variant="ghost" 
            className={`px-2 ${isLiked ? "bg-red-50 border-red-200" : ""}`}
            onClick={toggleLike}
            disabled={interactionLoading || !isAuthenticated}
            title={!isAuthenticated ? "请先登录" : isLiked ? "取消点赞" : "点赞"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className={`px-2 ${isBookmarked ? "bg-blue-50 border-blue-200" : ""}`}
            onClick={toggleFavorite}
            disabled={interactionLoading || !isAuthenticated}
            title={!isAuthenticated ? "请先登录" : isBookmarked ? "取消收藏" : "收藏"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPricing, setSelectedPricing] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt:desc")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  
  // 判断是否有筛选条件
  const hasFilters = selectedCategory !== "all" || selectedTags.length > 0 || searchQuery.trim() !== "" || 
                     selectedPricing !== "all"

  // 使用 Strapi API Hooks
  const { data: stats, loading: statsLoading } = useStats()
  const { data: allTools, loading: toolsLoading, error: toolsError, loadMore, hasMore, pagination } = useTools({
    pageSize: hasFilters ? 100 : 12, // 有筛选条件时获取更多数据，无筛选时分页
    sort: 'createdAt:desc', // 使用创建时间，这个字段创建后不会变化
    page: currentPage
  })
  const { data: featuredToolsData, loading: featuredLoading } = useFeaturedTools(6)
  const { data: toolCategories, loading: categoriesLoading } = useToolCategories()

  // 辅助函数：安全地提取文本内容
  const extractText = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object') {
      // 如果是富文本对象，尝试提取纯文本
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
      // 如果有其他文本字段
      return JSON.stringify(content).substring(0, 100) + '...';
    }
    return '';
  };

  // 转换 Strapi 数据为组件所需格式
  const tools = useMemo(() => {
    if (!allTools || allTools.length === 0) return []
    
    return allTools.map(tool => {
      // 安全访问 attributes，如果不存在则使用 tool 本身
      const data = tool.attributes || tool
      
      return {
        id: tool.id,
        documentId: tool.documentId,
        name: data.name || '未命名工具',
        description: extractText(data.description || data.shortDesc || '暂无描述'),
        category: data.category || '其他',
        rating: data.rating || 5.0,
        reviewCount: 0, // 可以从统计数据获取
        users: data.popularity > 10000 ? `${Math.floor(data.popularity / 1000)}K+` : `${data.popularity || 0}+`,
        pricing: data.pricing || '免费',
        priceRange: data.pricing || '免费',
        features: data.features || [],
        tags: data.tags || [],
        url: data.officialUrl || '#',
        featured: data.isFeatured || false,
        logo: data.logo?.url 
          ? `http://localhost:1337${data.logo.url}` 
          : "🔧",
        developer: data.developer || "未知",
        lastUpdated: new Date(data.publishedAt || data.createdAt || Date.now()).toISOString().split('T')[0],
        difficulty: data.difficulty || '入门',
        useCases: data.useCases || [],
        pros: data.pros || [],
        cons: data.cons || [],
        tutorials: 0,
        isBookmarked: false,
        isRecommended: data.isRecommended || false,
        // 添加统计字段，避免组件重渲染
        likesCount: data.likesCount || 0,
        favoritesCount: data.favoritesCount || 0,
        commentsCount: data.commentsCount || 0,
        // 保存原始日期字段用于排序
        publishedAt: data.publishedAt,
        createdAt: data.createdAt,
      }
    })
  }, [allTools])

  // 提取所有可用标签
  const allTags = useMemo(() => {
    if (!tools || tools.length === 0) return []
    
    const tagMap = new Map<string, number>()
    tools.forEach(tool => {
      if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach(tag => {
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
      .slice(0, 15) // 只显示前15个最常用的标签
  }, [tools])

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

    const matchesTags = selectedTags.length === 0 || selectedTags.some(selectedTag =>
      tool.tags.some(toolTag => toolTag === selectedTag)
    )

    return matchesSearch && matchesCategory && matchesPricing && matchesTags
  })

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case "users":
        return Number.parseInt(b.users.replace(/[^\d]/g, "")) - Number.parseInt(a.users.replace(/[^\d]/g, ""))
      case "reviews":
        return b.reviewCount - a.reviewCount
      case "updated":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      case "createdAt:desc":
      default:
        // 使用稳定的 createdAt 字段，这个字段创建后不会变化
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    }
  })

  const featuredTools = useMemo(() => {
    if (!featuredToolsData || featuredToolsData.length === 0) return []
    
    return featuredToolsData.map(tool => {
      // 安全访问 attributes，如果不存在则使用 tool 本身
      const data = tool.attributes || tool
      
      return {
        id: tool.id,
        documentId: tool.documentId,
        name: data.name || '未命名工具',
        description: extractText(data.description || data.shortDesc || '暂无描述'),
        category: data.category || '其他',
        rating: data.rating || 5.0,
        reviewCount: 0,
        users: data.popularity > 10000 ? `${Math.floor(data.popularity / 1000)}K+` : `${data.popularity || 0}+`,
        userCount: data.popularity || 0,
        pricing: data.pricing || '免费',
        priceRange: data.pricing || '免费',
        features: data.features || [],
        tags: data.tags || [],
        url: data.officialUrl || '#',
        featured: true,
        logo: data.logo?.url 
          ? `http://localhost:1337${data.logo.url}` 
          : "🔧",
        developer: data.developer || "未知",
        lastUpdated: new Date(data.publishedAt || data.createdAt || Date.now()).toISOString().split('T')[0],
        difficulty: data.difficulty || '入门',
        useCases: data.useCases || [],
        pros: data.pros || [],
        cons: data.cons || [],
        tutorials: 0,
        isBookmarked: false,
        isRecommended: data.isRecommended || false,
        // 添加统计字段，避免组件重渲染
        likesCount: data.likesCount || 0,
        favoritesCount: data.favoritesCount || 0,
        commentsCount: data.commentsCount || 0,
        // 保存原始日期字段用于排序
        publishedAt: data.publishedAt,
        createdAt: data.createdAt,
      }
    })
  }, [featuredToolsData])
  
  const recommendedTools = tools.filter((tool) => tool.isRecommended)

  // 分页处理函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = pagination ? pagination.pageCount : 1
  const currentPageFromAPI = pagination ? pagination.page : 1

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
        {/* Loading State */}
        {toolsLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载工具数据中...</p>
          </div>
        )}

        {/* Error State */}
        {toolsError && (
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">加载失败</div>
            <p className="text-gray-600 mb-4">{toolsError}</p>
            <Button onClick={() => window.location.reload()}>重新加载</Button>
          </div>
        )}

        {/* Main Content */}
        {!toolsLoading && !toolsError && (
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
                <div className="sticky top-16 space-y-6">
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
                        {(toolCategories || []).map((category) => {
                          return (
                            <Button
                              key={category.category}
                              variant={selectedCategory === category.category ? "default" : "ghost"}
                              className="w-full justify-start h-auto p-2"
                              onClick={() => setSelectedCategory(category.category)}
                            >
                              <span className="mr-2">{category.icon}</span>
                              <span className="flex-1 text-left">{category.label}</span>
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

                    {/* 热门标签筛选 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          热门标签
                        </h4>
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
                      
                      {allTags.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {allTags.slice(0, 10).map(({ tag, count }) => (
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
                              <div className="text-xs text-gray-500 mb-1">已选择:</div>
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
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 text-sm py-2">
                          <Hash className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                          暂无标签数据
                        </div>
                      )}
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
                      <span className="font-semibold">{statsLoading ? '...' : stats?.tools || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">本周新增</span>
                      <span className="font-semibold text-green-600">-</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">精选推荐</span>
                      <span className="font-semibold text-blue-600">{featuredTools.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">推荐工具</span>
                      <span className="font-semibold text-purple-600">{recommendedTools.length}</span>
                    </div>
                  </CardContent>
                </Card>
                </div>
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
                      <SelectItem value="createdAt:desc">最新发布</SelectItem>
                      <SelectItem value="users">用户最多</SelectItem>
                      <SelectItem value="reviews">评价最多</SelectItem>
                      <SelectItem value="updated">最近更新</SelectItem>
                      <SelectItem value="name">名称排序</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {sortedTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>

                {/* 分页功能 */}
                {!hasFilters && totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        disabled={currentPageFromAPI <= 1 || toolsLoading}
                        onClick={() => handlePageChange(currentPageFromAPI - 1)}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        上一页
                      </Button>
                      
                      {/* 页码按钮 */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPageFromAPI <= 3) {
                          pageNum = i + 1;
                        } else if (currentPageFromAPI >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPageFromAPI - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPageFromAPI === pageNum ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={toolsLoading}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPageFromAPI < totalPages - 2 && (
                        <>
                          <span className="px-2 text-gray-500">...</span>
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={toolsLoading}
                            className="w-10"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        variant="outline" 
                        disabled={currentPageFromAPI >= totalPages || toolsLoading}
                        onClick={() => handlePageChange(currentPageFromAPI + 1)}
                      >
                        下一页
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    
                    {/* 分页信息 */}
                    <div className="text-center mt-3">
                      <div className="text-xs text-gray-500">
                        第 {currentPageFromAPI} / {totalPages} 页
                        {pagination && (
                          <span className="ml-3">
                            共 {pagination.total} 个工具
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 有筛选条件时显示的加载更多按钮（备用方案） */}
                {hasFilters && hasMore && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={loadMore}
                      disabled={toolsLoading}
                      size="lg"
                      variant="outline"
                      className="bg-white hover:bg-gray-50"
                    >
                      {toolsLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          加载中...
                        </>
                      ) : (
                        <>
                          加载更多工具
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </main>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
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
        )}
      </div>
    </div>
  )
}
