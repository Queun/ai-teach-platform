"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSearchHistory, useSearchSuggestions, usePopularSearches } from '@/hooks/useSearch'
import { cn } from '@/lib/utils'

interface GlobalSearchBoxProps {
  className?: string
  placeholder?: string
  showHistory?: boolean
  showSuggestions?: boolean
  showPopular?: boolean
  onSearch?: (query: string) => void
}

export default function GlobalSearchBox({
  className,
  placeholder = "搜索AI工具、资讯、教学资源...",
  showHistory = true,
  showSuggestions = true,
  showPopular = true,
  onSearch
}: GlobalSearchBoxProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { history, addToHistory, removeFromHistory } = useSearchHistory()
  const { suggestions, loading: suggestionsLoading } = useSearchSuggestions(query)
  const { popularSearches } = usePopularSearches()

  // 组合所有建议项
  const allSuggestions = [
    ...(showHistory && query.length === 0 ? history.map(h => ({ type: 'history', text: h.query, count: h.resultCount })) : []),
    ...(showSuggestions && query.length > 0 ? suggestions.map(s => ({ type: 'suggestion', text: s })) : []),
    ...(showPopular && query.length === 0 ? popularSearches.map(p => ({ type: 'popular', text: p })) : [])
  ]

  // 处理搜索
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    // 添加到搜索历史
    addToHistory({
      query: searchQuery,
      timestamp: Date.now(),
      resultCount: 0 // 实际结果数会在搜索完成后更新
    })
    
    // 关闭下拉菜单
    setIsOpen(false)
    setQuery('')
    
    // 执行搜索
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || allSuggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(query)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSearch(allSuggestions[selectedIndex].text)
        } else {
          handleSearch(query)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // 处理点击外部区域
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 快捷键支持 (Ctrl+K 或 Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-xl", className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-24 h-10 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg"
        />
        
        {/* 右侧按钮区域 */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded text-gray-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* 下拉建议面板 */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-xl border border-gray-200">
          <CardContent className="p-0">
            {allSuggestions.length > 0 ? (
              <div className="py-2">
                {allSuggestions.map((item, index) => (
                  <div
                    key={`${item.type}-${item.text}-${index}`}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 cursor-pointer transition-colors",
                      selectedIndex === index 
                        ? "bg-blue-50 text-blue-900" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => handleSearch(item.text)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* 图标 */}
                      <div className="flex-shrink-0">
                        {item.type === 'history' && <Clock className="w-4 h-4 text-gray-400" />}
                        {item.type === 'suggestion' && <Search className="w-4 h-4 text-blue-500" />}
                        {item.type === 'popular' && <TrendingUp className="w-4 h-4 text-orange-500" />}
                      </div>
                      
                      {/* 文本 */}
                      <span className="truncate text-sm">{item.text}</span>
                      
                      {/* 结果数量 */}
                      {'count' in item && item.count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {item.count} 个结果
                        </Badge>
                      )}
                    </div>

                    {/* 删除历史按钮 */}
                    {item.type === 'history' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromHistory(item.text)
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : suggestionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">搜索中...</span>
              </div>
            ) : query ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                没有找到相关建议
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 text-sm">
                开始输入以获取搜索建议
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}