"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, SortAsc, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GlobalSearchBox from '@/components/search/GlobalSearchBox'
import Link from 'next/link'
import { useSearch, getSearchResultIcon, getSearchResultTypeLabel, highlightSearchTerms, type SearchResult } from '@/hooks/useSearch'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'
  
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tools' | 'news' | 'resources'>(initialCategory as any)
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data, loading, error, search } = useSearch()

  // 执行搜索
  useEffect(() => {
    if (currentQuery) {
      search({
        query: currentQuery,
        category: selectedCategory,
        limit: 20,
        page: currentPage
      })
    }
  }, [currentQuery, selectedCategory, sortBy, currentPage, search])

  // URL参数变化时更新状态
  useEffect(() => {
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || 'all'
    if (query !== currentQuery) {
      setCurrentQuery(query)
    }
    if (category !== selectedCategory) {
      setSelectedCategory(category as any)
    }
  }, [searchParams, currentQuery, selectedCategory])

  // 处理新搜索
  const handleSearch = (query: string) => {
    setCurrentQuery(query)
    setCurrentPage(1)
    // 更新URL
    const url = new URL(window.location.href)
    url.searchParams.set('q', query)
    if (selectedCategory !== 'all') {
      url.searchParams.set('category', selectedCategory)
    }
    window.history.pushState({}, '', url.toString())
  }

  // 处理分类变化
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as any)
    setCurrentPage(1)
    // 更新URL
    const url = new URL(window.location.href)
    if (category !== 'all') {
      url.searchParams.set('category', category)
    } else {
      url.searchParams.delete('category')
    }
    window.history.pushState({}, '', url.toString())
  }

  // 排序结果
  const sortedResults = data?.results ? [...data.results].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.score - a.score
      case 'date':
        return new Date(b.metadata.date || 0).getTime() - new Date(a.metadata.date || 0).getTime()
      case 'views':
        return (b.metadata.views || 0) - (a.metadata.views || 0)
      case 'rating':
        return (b.metadata.rating || 0) - (a.metadata.rating || 0)
      default:
        return 0
    }
  }) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索头部 */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">搜索结果</h1>
            
            {/* 搜索框 */}
            <GlobalSearchBox
              className="w-full"
              onSearch={handleSearch}
              showHistory={false}
            />
            
            {/* 搜索状态信息 */}
            {currentQuery && (
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span>
                  搜索词: <strong>"{currentQuery}"</strong>
                </span>
                {data && (
                  <span>
                    找到 <strong>{data.total}</strong> 个结果
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* 空状态 */}
        {!currentQuery && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">开始搜索</h3>
            <p className="text-gray-500">输入关键词搜索AI工具、资讯和教学资源</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">搜索出错</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => search({ query: currentQuery, category: selectedCategory })}>
              重试
            </Button>
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">搜索中...</p>
          </div>
        )}

        {/* 搜索结果 */}
        {currentQuery && data && !loading && (
          <div className="space-y-6">
            {/* 筛选和排序工具栏 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                {/* 分类选择器 */}
                <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                      全部 ({data.categories.tools + data.categories.news + data.categories.resources})
                    </TabsTrigger>
                    <TabsTrigger value="tools" className="text-xs sm:text-sm">
                      工具 ({data.categories.tools})
                    </TabsTrigger>
                    <TabsTrigger value="news" className="text-xs sm:text-sm">
                      资讯 ({data.categories.news})
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="text-xs sm:text-sm">
                      资源 ({data.categories.resources})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* 排序选择器 */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">相关性</SelectItem>
                    <SelectItem value="date">发布日期</SelectItem>
                    <SelectItem value="views">浏览量</SelectItem>
                    <SelectItem value="rating">评分</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 结果列表 */}
            {sortedResults.length > 0 ? (
              <div className="space-y-4">
                {sortedResults.map((result) => (
                  <SearchResultCard
                    key={`${result.type}-${result.id}`}
                    result={result}
                    query={currentQuery}
                  />
                ))}

                {/* 分页 */}
                {data.total > 20 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        上一页
                      </Button>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        第 {currentPage} 页
                      </span>
                      <Button 
                        variant="outline"
                        disabled={currentPage * 20 >= data.total}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">没有找到相关结果</h3>
                <p className="text-gray-500 mb-4">试试其他关键词或调整筛选条件</p>
                <Button 
                  variant="outline" 
                  onClick={() => handleCategoryChange('all')}
                >
                  查看所有分类
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// 搜索结果卡片组件
interface SearchResultCardProps {
  result: SearchResult
  query: string
}

function SearchResultCard({ result, query }: SearchResultCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* 图片/图标 */}
          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
            {result.image ? (
              <img
                src={result.image}
                alt={result.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling!.style.display = 'block'
                }}
              />
            ) : null}
            <div 
              className={`text-2xl ${result.image ? 'hidden' : ''}`}
              style={result.image ? { display: 'none' } : {}}
            >
              {getSearchResultIcon(result.type)}
            </div>
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            {/* 标题和类型 */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <Link 
                href={result.url}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline line-clamp-2 search-highlight"
                dangerouslySetInnerHTML={{ __html: highlightSearchTerms(result.title, query) }}
              />
              <Badge variant="outline" className="flex-shrink-0">
                {getSearchResultTypeLabel(result.type)}
              </Badge>
            </div>

            {/* 描述 */}
            <p 
              className="text-gray-600 text-sm mb-3 line-clamp-2 search-highlight"
              dangerouslySetInnerHTML={{ __html: highlightSearchTerms(result.description, query) }}
            />

            {/* 标签 */}
            {result.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {result.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {result.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{result.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* 元数据 */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {result.metadata.author && (
                <span>作者: {result.metadata.author}</span>
              )}
              {result.metadata.date && (
                <span>{result.metadata.date}</span>
              )}
              {result.metadata.views && (
                <span>{result.metadata.views} 次浏览</span>
              )}
              {result.metadata.rating && (
                <span>评分: {result.metadata.rating}</span>
              )}
              <span className="text-green-600">相关度: {Math.round(result.score * 10) / 10}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}