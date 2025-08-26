import { useState, useCallback, useEffect } from 'react'

// 搜索结果类型
export interface SearchResult {
  id: string
  documentId: string
  type: 'tool' | 'news' | 'resource'
  title: string
  description: string
  category: string
  tags: string[]
  image?: string
  url: string
  score: number
  metadata: {
    author?: string
    date?: string
    views?: number
    rating?: number
  }
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  categories: {
    tools: number
    news: number
    resources: number
  }
}

// 搜索参数类型
export interface SearchParams {
  query: string
  category?: 'all' | 'tools' | 'news' | 'resources'
  limit?: number
  page?: number
}

// 搜索状态类型
interface SearchState {
  data: SearchResponse | null
  loading: boolean
  error: string | null
}

// 搜索历史类型
interface SearchHistoryItem {
  query: string
  timestamp: number
  resultCount: number
}

// 主要搜索 hook
export function useSearch() {
  const [state, setState] = useState<SearchState>({
    data: null,
    loading: false,
    error: null
  })

  const search = useCallback(async (params: SearchParams) => {
    if (!params.query.trim()) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const searchParams = new URLSearchParams({
        q: params.query,
        category: params.category || 'all',
        limit: (params.limit || 20).toString(),
        page: (params.page || 1).toString()
      })

      const response = await fetch(`/api/search?${searchParams}`)
      
      if (!response.ok) {
        throw new Error(`搜索请求失败: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      
      setState({
        data,
        loading: false,
        error: null
      })

      // 保存搜索历史
      saveSearchHistory({
        query: params.query,
        timestamp: Date.now(),
        resultCount: data.total
      })

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索失败'
      setState({
        data: null,
        loading: false,
        error: errorMessage
      })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])

  return {
    ...state,
    search,
    reset
  }
}

// 搜索历史管理 hook
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  // 从 localStorage 加载搜索历史
  useEffect(() => {
    try {
      const saved = localStorage.getItem('search-history')
      if (saved) {
        const parsed = JSON.parse(saved)
        // 只保留最近的20条记录
        setHistory(parsed.slice(0, 20))
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }, [])

  const addToHistory = useCallback((item: SearchHistoryItem) => {
    setHistory(prev => {
      // 去重并添加到开头
      const filtered = prev.filter(h => h.query !== item.query)
      const updated = [item, ...filtered].slice(0, 20) // 最多保存20条
      
      // 保存到 localStorage
      try {
        localStorage.setItem('search-history', JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save search history:', error)
      }
      
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem('search-history')
    } catch (error) {
      console.error('Failed to clear search history:', error)
    }
  }, [])

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.query !== query)
      try {
        localStorage.setItem('search-history', JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to update search history:', error)
      }
      return updated
    })
  }, [])

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}

// 实时搜索建议 hook
export function useSearchSuggestions(query: string, delay: number = 300) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        // 这里可以实现搜索建议的逻辑
        // 暂时使用简单的本地建议
        const commonSuggestions = [
          'AI工具', 'ChatGPT', '教学资源', '编程教学', 
          '数学教学', '英语学习', '在线教育', '教学设计',
          '课件制作', '教学评估', 'AIGC', '人工智能教育'
        ]
        
        const filtered = commonSuggestions.filter(s => 
          s.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        
        setSuggestions(filtered)
      } catch (error) {
        console.error('Failed to load suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay])

  return { suggestions, loading }
}

// 热门搜索词 hook
export function usePopularSearches() {
  const [popularSearches] = useState<string[]>([
    'ChatGPT教学',
    'AI绘图工具',
    '编程学习',
    '在线课堂',
    '教学设计',
    '学习资源',
    '教育技术',
    'AIGC应用'
  ])

  return { popularSearches }
}

// 工具函数：保存搜索历史
function saveSearchHistory(item: SearchHistoryItem) {
  try {
    const saved = localStorage.getItem('search-history')
    const history: SearchHistoryItem[] = saved ? JSON.parse(saved) : []
    
    // 去重并添加到开头
    const filtered = history.filter(h => h.query !== item.query)
    const updated = [item, ...filtered].slice(0, 20)
    
    localStorage.setItem('search-history', JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save search history:', error)
  }
}

// 工具函数：高亮搜索关键词
export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text
  
  const terms = query.split(/\s+/).filter(term => term.length > 0)
  let highlightedText = text
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
  })
  
  return highlightedText
}

// 工具函数：获取搜索结果类型图标
export function getSearchResultIcon(type: SearchResult['type']): string {
  switch (type) {
    case 'tool':
      return '🔧'
    case 'news':
      return '📰'
    case 'resource':
      return '📚'
    default:
      return '📄'
  }
}

// 工具函数：获取搜索结果类型标签
export function getSearchResultTypeLabel(type: SearchResult['type']): string {
  switch (type) {
    case 'tool':
      return 'AI工具'
    case 'news':
      return '新闻资讯'
    case 'resource':
      return '教学资源'
    default:
      return '内容'
  }
}