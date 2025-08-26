import { NextRequest, NextResponse } from 'next/server'
import strapiService from '@/lib/strapi'

// 搜索结果接口
interface SearchResult {
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

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  categories: {
    tools: number
    news: number
    resources: number
  }
}

// 关键词匹配评分函数
function calculateScore(text: string, query: string, weight: number = 1): number {
  if (!text || !query) return 0
  
  const normalizedText = text.toLowerCase()
  const normalizedQuery = query.toLowerCase()
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0)
  
  let score = 0
  
  queryTerms.forEach(term => {
    // 精确匹配
    if (normalizedText.includes(term)) {
      score += weight * 2
      
      // 标题开头匹配额外加分
      if (normalizedText.startsWith(term)) {
        score += weight * 1
      }
      
      // 完整词匹配额外加分
      const wordBoundary = new RegExp(`\\b${term}\\b`, 'i')
      if (wordBoundary.test(text)) {
        score += weight * 1
      }
    }
    
    // 模糊匹配（包含部分字符）
    if (term.length > 2) {
      for (let i = 0; i <= term.length - 2; i++) {
        const substring = term.substring(i, i + 2)
        if (normalizedText.includes(substring)) {
          score += weight * 0.1
        }
      }
    }
  })
  
  return score
}

// 辅助函数：安全地提取文本内容
function extractText(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  if (content && typeof content === 'object') {
    if (Array.isArray(content)) {
      return content.map(item => extractText(item)).join(' ');
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
    return JSON.stringify(content).substring(0, 200);
  }
  return '';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    
    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query,
        categories: { tools: 0, news: 0, resources: 0 }
      } as SearchResponse)
    }

    const results: SearchResult[] = []
    let toolsCount = 0, newsCount = 0, resourcesCount = 0

    // 并行搜索所有内容类型
    const [toolsResponse, newsResponse, resourcesResponse] = await Promise.all([
      category === 'all' || category === 'tools' ? strapiService.getTools({ pageSize: 100 }) : { data: [] },
      category === 'all' || category === 'news' ? strapiService.getNews({ pageSize: 100 }) : { data: [] },
      category === 'all' || category === 'resources' ? strapiService.getResources({ pageSize: 100 }) : { data: [] }
    ])

    // 处理工具搜索结果
    if (toolsResponse.data) {
      toolsResponse.data.forEach(tool => {
        const data = tool.attributes || tool
        const title = data.name || '未命名工具'
        const description = extractText(data.description || data.shortDesc || '')
        const tags = data.tags || []
        
        let score = 0
        score += calculateScore(title, query, 3) // 标题权重最高
        score += calculateScore(description, query, 1) // 描述权重中等
        score += calculateScore(tags.join(' '), query, 2) // 标签权重较高
        score += calculateScore(data.category || '', query, 1.5) // 分类权重
        
        if (score > 0.5) { // 设置最低分数阈值
          toolsCount++
          results.push({
            id: tool.id.toString(),
            documentId: tool.documentId || tool.id.toString(),
            type: 'tool',
            title,
            description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
            category: data.category || '工具',
            tags,
            image: data.logo?.url ? `http://localhost:1337${data.logo.url}` : undefined,
            url: `/tools/${tool.documentId || tool.id}`,
            score,
            metadata: {
              rating: data.rating || 0,
              views: data.popularity || 0
            }
          })
        }
      })
    }

    // 处理新闻搜索结果
    if (newsResponse.data) {
      newsResponse.data.forEach(article => {
        const data = article.attributes || article
        const title = data.title || '未命名文章'
        const description = extractText(data.excerpt || data.content || '')
        const tags = data.tags || []
        
        let score = 0
        score += calculateScore(title, query, 3)
        score += calculateScore(description, query, 1)
        score += calculateScore(tags.join(' '), query, 2)
        score += calculateScore(data.category || '', query, 1.5)
        
        if (score > 0.5) {
          newsCount++
          results.push({
            id: article.id.toString(),
            documentId: article.documentId || article.id.toString(),
            type: 'news',
            title,
            description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
            category: data.category || '新闻',
            tags,
            image: data.featuredImage?.url ? `http://localhost:1337${data.featuredImage.url}` : undefined,
            url: `/news/${article.documentId || article.id}`,
            score,
            metadata: {
              author: data.authorName || '未知作者',
              date: new Date(data.publishDate || data.createdAt || Date.now()).toLocaleDateString('zh-CN'),
              views: data.views || 0
            }
          })
        }
      })
    }

    // 处理资源搜索结果
    if (resourcesResponse.data) {
      resourcesResponse.data.forEach(resource => {
        const data = resource.attributes || resource
        const title = data.title || '未命名资源'
        const description = extractText(data.summary || data.content || '')
        const tags = data.tags || []
        
        let score = 0
        score += calculateScore(title, query, 3)
        score += calculateScore(description, query, 1)
        score += calculateScore(tags.join(' '), query, 2)
        score += calculateScore(data.category || '', query, 1.5)
        
        if (score > 0.5) {
          resourcesCount++
          results.push({
            id: resource.id.toString(),
            documentId: resource.documentId || resource.id.toString(),
            type: 'resource',
            title,
            description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
            category: data.category || '资源',
            tags,
            image: data.coverImage?.url ? `http://localhost:1337${data.coverImage.url}` : undefined,
            url: `/resources/${resource.documentId || resource.id}`,
            score,
            metadata: {
              author: data.authorName || '未知作者',
              views: data.views || 0,
              rating: data.rating || 0
            }
          })
        }
      })
    }

    // 按分数排序
    results.sort((a, b) => b.score - a.score)

    // 分页
    const startIndex = (page - 1) * limit
    const paginatedResults = results.slice(startIndex, startIndex + limit)

    const response: SearchResponse = {
      results: paginatedResults,
      total: results.length,
      query,
      categories: {
        tools: toolsCount,
        news: newsCount,
        resources: resourcesCount
      }
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: '搜索服务暂时不可用', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}