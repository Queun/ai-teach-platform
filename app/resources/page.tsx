"use client"

import { useState, useMemo } from "react"
import { useResources, useStats, useResourceCategories } from "@/hooks/useStrapi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { Search, ExternalLink, Star, Eye, MessageSquare, ThumbsUp, Calendar, User, Award, Filter, X, Hash, ChevronDown, Loader2, Bookmark } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // 判断是否有筛选条件
  const hasFilters = selectedCategory !== "all" || selectedTags.length > 0 || searchQuery.trim() !== ""

  // 使用 Strapi API 获取数据
  const { data: allResources, loading: resourcesLoading, error: resourcesError, loadMore, hasMore, pagination } = useResources({
    pageSize: hasFilters ? 100 : 12, // 有筛选条件时获取更多数据，无筛选时分页
    sort: 'createdAt:desc' // 使用创建时间，这个字段创建后不会变化
  })
  const { data: stats, loading: statsLoading } = useStats()
  const { data: categories, loading: categoriesLoading } = useResourceCategories()

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
      return JSON.stringify(content).substring(0, 100) + '...';
    }
    return '';
  };

  // 转换 Strapi 数据为组件所需格式
  const resources = useMemo(() => {
    if (!allResources || allResources.length === 0) return []
    
    return allResources.map(resource => {
      // 安全访问 attributes，如果不存在则使用 resource 本身
      const data = resource.attributes || resource
      
      return {
        id: resource.id,
        documentId: resource.documentId,
        title: data.title || '未命名资源',
        description: extractText(data.summary || data.content || '暂无描述'),
        author: {
          name: data.authorName || '未知作者',
          avatar: data.authorAvatar?.url 
            ? `http://localhost:1337${data.authorAvatar.url}` 
            : null,
          title: data.authorTitle || '教育工作者',
          discourseUsername: data.authorName?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
        },
        category: data.category || 'templates',
        tags: data.tags || [],
        stats: {
          likes: data.likesCount || 0,  // 使用新的 likesCount 字段（如果为 null 则显示 0）
          replies: 0, // 可以从关联的评论数据获取
          views: data.views || 0,
          favorites: data.favoritesCount || 0,
        },
        curatedAt: new Date(data.publishedAt || data.createdAt || Date.now()).toLocaleDateString('zh-CN'),
        curatedAtRaw: new Date(data.publishedAt || data.createdAt || Date.now()), // 保存原始日期对象用于计算
        curatedBy: "专家团队",
        featured: data.isFeatured || false,
        quality: data.isFeatured ? "精华" : "优质",
        difficulty: data.difficulty || "入门",
        discourseUrl: `#`, // 实际应该链接到详情页
        resourceUrl: data.attachments?.[0]?.url 
          ? `http://localhost:1337${data.attachments[0].url}` 
          : null,
        coverImage: data.coverImage?.url 
          ? `http://localhost:1337${data.coverImage.url}` 
          : null,
        subject: data.subject || '',
        gradeLevel: data.gradeLevel || '',
        resourceType: data.resourceType || '',
        estimatedTime: data.estimatedTime || '',
        // 保存原始日期字段用于排序
        publishedAt: data.publishedAt,
        createdAt: data.createdAt,
      }
    })
  }, [allResources])

  // 提取所有可用标签
  const allTags = useMemo(() => {
    if (!resources || resources.length === 0) return []
    
    const tagMap = new Map<string, number>()
    resources.forEach(resource => {
      if (resource.tags && Array.isArray(resource.tags)) {
        resource.tags.forEach(tag => {
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
  }, [resources])

  // 计算统计数据
  const resourceStats = useMemo(() => {
    if (!resources || resources.length === 0) {
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
    
    const weeklyNew = resources.filter(resource => {
      // 使用原始日期对象进行准确比较
      const resourceDate = resource.curatedAtRaw || new Date(resource.curatedAt);
      return resourceDate >= oneWeekAgo;
    }).length;

    // 计算精华资源数量
    const featured = resources.filter(r => r.featured).length;

    // 按分类统计
    const byCategory: Record<string, number> = {};
    resources.forEach(resource => {
      const category = resource.category || 'uncategorized';
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    return {
      total: resources.length,
      weeklyNew,
      featured,
      byCategory
    };
  }, [resources]);

  // 使用动态分类数据，如果加载中或出错则使用默认分类
  const displayCategories = useMemo(() => {
    if (!categoriesLoading && categories && categories.length > 0) {
      return categories;
    }
    
    // 默认分类作为后备
    return [
      { category: "all", name: "全部资源", count: stats?.resources || 0, label: "全部资源", icon: "📚" },
      { category: "teaching-guides", name: "教学指南", count: 0, label: "教学指南", icon: "📖" },
      { category: "ai-tools", name: "AI工具评测", count: 0, label: "AI工具评测", icon: "🤖" },
      { category: "case-studies", name: "教学案例", count: 0, label: "教学案例", icon: "💡" },
      { category: "templates", name: "教学模板", count: 0, label: "教学模板", icon: "📄" },
      { category: "research", name: "学术研究", count: 0, label: "学术研究", icon: "🔬" },
    ];
  }, [categories, categoriesLoading, stats]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory

    const matchesTags = selectedTags.length === 0 || selectedTags.some(selectedTag =>
      resource.tags.some(resourceTag => resourceTag === selectedTag)
    )

    return matchesSearch && matchesCategory && matchesTags
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        // 使用稳定的 createdAt 字段，这个字段创建后不会变化
        const dateA = new Date(a.createdAt || '');
        const dateB = new Date(b.createdAt || '');
        return dateB.getTime() - dateA.getTime();
      case "popular":
        return b.stats.likes - a.stats.likes
      default:
        return 0
    }
  })

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
              <h1 className="text-4xl font-bold text-gray-900">教育资源库</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">专业审核的优质教学资源，助力您的教学创新</p>
            <p className="text-sm text-gray-500 mb-8">
              所有资源均经过教育专家精心筛选和审核
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索教学资源..."
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
        {resourcesLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载资源数据中...</p>
          </div>
        )}

        {/* Error State */}
        {resourcesError && (
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">加载失败</div>
            <p className="text-gray-600 mb-4">{resourcesError}</p>
            <Button onClick={() => window.location.reload()}>重新加载</Button>
          </div>
        )}

        {/* Main Content */}
        {!resourcesLoading && !resourcesError && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="sticky top-16 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">资源分类</CardTitle>
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
                <CardTitle className="text-lg">资源统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">总资源数</span>
                    <span className="font-semibold">{resourcesLoading ? '...' : resourceStats.total}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">本周新增</span>
                    <span className="font-semibold text-green-600">
                      {resourcesLoading ? '...' : `+${resourceStats.weeklyNew}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">精华资源</span>
                    <span className="font-semibold text-yellow-600">
                      {resourcesLoading ? '...' : resourceStats.featured}
                    </span>
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
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-600">找到 {sortedResources.length} 个教学资源</div>
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
                    <SelectItem value="recent">最新发布</SelectItem>
                    <SelectItem value="popular">最受欢迎</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {sortedResources.map((resource) => (
                <Card key={resource.documentId || resource.id} className="hover:shadow-lg transition-shadow">
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
                      <div className="text-xs text-gray-500">更新时间：{resource.curatedAt}</div>
                    </div>

                    <CardTitle className="text-xl leading-tight hover:text-blue-600 cursor-pointer">
                      <Link href={`/resources/${resource.documentId || resource.id}`}>
                        {resource.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="mb-4 text-base leading-relaxed">{resource.description}</CardDescription>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <SmartAvatar 
                        name={resource.author.name} 
                        src={resource.author.avatar}
                        size="default"
                        className="w-10 h-10"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{resource.author.name}</div>
                        <div className="text-sm text-gray-600">{resource.author.title}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 5}
                        </Badge>
                      )}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {resource.stats.views} 浏览
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {resource.stats.likes} 点赞
                        </div>
                        <div className="flex items-center gap-1">
                          <Bookmark className="w-4 h-4" />
                          {resource.stats.favorites || 0} 收藏
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/resources/${resource.documentId || resource.id}`}>
                            <Eye className="w-3 h-3 mr-1" />
                            查看详情
                          </Link>
                        </Button>
                        {resource.resourceUrl && (
                          <Button size="sm" asChild>
                            <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer">
                              <Calendar className="w-3 h-3 mr-1" />
                              下载资源
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Curation Info */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        由 <span className="font-medium">{resource.curatedBy}</span> 推荐审核
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty State */}
              {sortedResources.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">暂无教学资源</h3>
                  <p className="text-gray-500">请尝试调整搜索条件或分类筛选</p>
                </div>
              )}
            </div>

            {/* 分页功能 - 只在无筛选条件时显示加载更多按钮 */}
            {!hasFilters && hasMore && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore}
                  disabled={resourcesLoading}
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                >
                  {resourcesLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      加载中...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      加载更多资源
                    </>
                  )}
                </Button>
                
                {pagination && (
                  <div className="text-xs text-gray-500 mt-3">
                    已显示 {allResources.length} / {pagination.total} 个资源
                    {pagination.pageCount > 1 && (
                      <span className="ml-2">
                        第 {pagination.page} / {pagination.pageCount} 页
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Call to Action */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">想要分享您的教学资源？</h3>
                <p className="text-gray-600 mb-4">加入我们的社区，分享您的教学经验和资源，有机会被审核为精品内容</p>
                <div className="flex gap-2 justify-center">
                  <Button asChild>
                    <Link href="/community" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      加入社区
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/community/submit" rel="noopener noreferrer">
                      分享资源
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
        )}
      </div>
    </div>
  )
}
