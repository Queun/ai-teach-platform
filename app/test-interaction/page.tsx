"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import strapiService from '@/lib/strapi'

export default function TestInteractionPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState({
    targetType: 'ai-tool' as 'ai-tool' | 'edu-resource' | 'news-article',
    targetId: 'eqyix2sakwkpjnkk4v7yv9mt',
    userId: 2
  })

  const [currentUser, setCurrentUser] = useState<any>(null)

  // 获取当前用户信息
  const getCurrentUser = async () => {
    setLoading(true)
    try {
      const user = await strapiService.getCurrentUser()
      setCurrentUser(user)
      setResults(prev => [...prev, {
        test: 'Get Current User',
        success: true,
        data: user,
        note: 'Check user ID and documentId structure'
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Get Current User',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }
  // 使用documentId创建用户互动
  const testCreateWithDocumentId = async () => {
    if (!currentUser) {
      setResults(prev => [...prev, {
        test: 'Create with DocumentId',
        success: false,
        error: 'Please get current user first to obtain documentId'
      }])
      return
    }

    setLoading(true)
    try {
      // 使用用户的documentId或id，根据用户数据结构决定
      const userDocumentId = currentUser.documentId || currentUser.id
      
      const response = await strapiService.request('/user-actions', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            actionType: 'like',
            targetType: testData.targetType,
            targetId: testData.targetId, // 字符串 ID
            users_permissions_user: {
              connect: [userDocumentId]
            },
            isActive: true
          }
        })
      })
      setResults(prev => [...prev, {
        test: 'Create with DocumentId',
        success: true,
        data: response
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Create with DocumentId',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 获取所有用户信息（查看用户表结构）
  const getAllUsers = async () => {
    setLoading(true)
    try {
      const response = await strapiService.request('/users?populate=*')
      setResults(prev => [...prev, {
        test: 'Get All Users (with populate)',
        success: true,
        data: response,
        note: 'Check user table structure, including ID fields and documentId'
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Get All Users (with populate)',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试切换点赞（测试取消功能）
  const testToggleLike = async () => {
    if (!currentUser) {
      setResults(prev => [...prev, {
        test: 'Toggle Like Test',
        success: false,
        error: 'Please get current user first'
      }])
      return
    }

    setLoading(true)
    try {
      // 调用真实的 API 方法
      const result = await strapiService.toggleUserAction(
        'like',
        testData.targetType as 'ai-tool',
        testData.targetId,
        currentUser.id
      )
      
      setResults(prev => [...prev, {
        test: 'Toggle Like Test',
        success: result.success,
        data: result,
        note: `Action result: ${result.isActive ? 'LIKED' : 'UNLIKED'}`
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Toggle Like Test',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试切换收藏（测试取消功能）
  const testToggleFavorite = async () => {
    if (!currentUser) {
      setResults(prev => [...prev, {
        test: 'Toggle Favorite Test',
        success: false,
        error: 'Please get current user first'
      }])
      return
    }

    setLoading(true)
    try {
      // 调用真实的 API 方法
      const result = await strapiService.toggleUserAction(
        'favorite',
        testData.targetType as 'ai-tool',
        testData.targetId,
        currentUser.id
      )
      
      setResults(prev => [...prev, {
        test: 'Toggle Favorite Test',
        success: result.success,
        data: result,
        note: `Action result: ${result.isActive ? 'FAVORITED' : 'UNFAVORITED'}`
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Toggle Favorite Test',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试获取所有 user-actions
  const testGetAllUserActions = async () => {
    setLoading(true)
    try {
      const response = await strapiService.request('/user-actions?populate=*')
      setResults(prev => [...prev, {
        test: 'Get All User Actions (with populate)',
        success: true,
        data: response,
        note: 'Check the populated relationship fields structure'
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Get All User Actions (with populate)',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试创建 user-action
  const testCreateUserAction = async () => {
    setLoading(true)
    try {
      const response = await strapiService.request('/user-actions', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            actionType: 'like',
            targetType: testData.targetType,
            targetId: 1, // 使用数字 ID 进行测试
            users_permissions_user: {
              connect: [testData.userId]
            },
            isActive: true
          }
        })
      })
      setResults(prev => [...prev, {
        test: 'Create User Action (Numeric ID)',
        success: true,
        data: response
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Create User Action (Numeric ID)',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试创建 user-action - 尝试不同的字段名
  const testCreateUserActionV2 = async () => {
    setLoading(true)
    try {
      // 尝试使用直接的用户ID引用
      const response = await strapiService.request('/user-actions', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            actionType: 'like',
            targetType: testData.targetType,
            targetId: 1,
            user: {
              connect: [testData.userId]
            }, // 尝试使用 'user'
            isActive: true
          }
        })
      })
      setResults(prev => [...prev, {
        test: 'Create User Action V2 (user field)',
        success: true,
        data: response
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Create User Action V2 (user field)',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试不同的关联方式
  const testCreateUserActionV3 = async () => {
    setLoading(true)
    try {
      const response = await strapiService.request('/user-actions', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            actionType: 'like',
            targetType: testData.targetType,
            targetId: 1,
            users_permissions_user: {
              connect: [testData.userId]
            }, // 使用连接形式
            isActive: true
          }
        })
      })
      setResults(prev => [...prev, {
        test: 'Create User Action V3 (object form)',
        success: true,
        data: response
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Create User Action V3 (object form)',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 分析现有数据结构
  const analyzeExistingData = async () => {
    setLoading(true)
    try {
      const response = await strapiService.request('/user-actions?populate=*')
      setResults(prev => [...prev, {
        test: 'Analyze Existing Data Structure (Full Populate)',
        success: true,
        data: response,
        note: 'Detailed analysis: Check relationship field structures, data types, and nested objects'
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Analyze Existing Data Structure (Full Populate)',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试用户查询过滤器
  const testUserQueryWithFilters = async () => {
    setLoading(true)
    try {
      const url = `/user-actions?filters[users_permissions_user][$eq]=${testData.userId}&filters[isActive][$eq]=true&populate=*`
      const response = await strapiService.request(url)
      setResults(prev => [...prev, {
        test: 'Query User Actions by User ID (with populate)',
        success: true,
        url: url,
        data: response,
        note: 'Check filtered results with full relationship data'
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Query User Actions by User ID (with populate)',
        success: false,
        url: url,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 测试字符串 targetId（现在应该可以工作了）
  const testStringTargetId = async () => {
    setLoading(true)
    try {
      const response = await strapiService.request('/user-actions', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            actionType: 'favorite',
            targetType: testData.targetType,
            targetId: testData.targetId, // 字符串 ID
            users_permissions_user: {
              connect: [testData.userId]
            },
            isActive: true
          }
        })
      })
      setResults(prev => [...prev, {
        test: 'Create User Action (String ID)',
        success: true,
        data: response
      }])
    } catch (error: any) {
      setResults(prev => [...prev, {
        test: 'Create User Action (String ID)',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 清除结果
  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Interaction API 测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetType">Target Type</Label>
              <Select
                value={testData.targetType}
                onValueChange={(value: 'ai-tool' | 'edu-resource' | 'news-article') => 
                  setTestData(prev => ({ ...prev, targetType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-tool">AI工具</SelectItem>
                  <SelectItem value="edu-resource">教育资源</SelectItem>
                  <SelectItem value="news-article">新闻文章</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetId">Target ID</Label>
              <Input
                id="targetId"
                value={testData.targetId}
                onChange={(e) => setTestData({...testData, targetId: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="number"
                value={testData.userId}
                onChange={(e) => setTestData({...testData, userId: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={getCurrentUser} disabled={loading}>
              获取当前用户
            </Button>
            <Button onClick={getAllUsers} disabled={loading}>
              获取所有用户
            </Button>
            <Button onClick={testGetAllUserActions} disabled={loading}>
              获取所有 User Actions
            </Button>
            <Button onClick={analyzeExistingData} disabled={loading}>
              分析现有数据结构
            </Button>
            <Button onClick={testCreateWithDocumentId} disabled={loading}>
              创建 (DocumentId)
            </Button>
            <Button onClick={testToggleLike} disabled={loading}>
              切换点赞状态
            </Button>
            <Button onClick={testToggleFavorite} disabled={loading}>
              切换收藏状态
            </Button>
            <Button onClick={testCreateUserActionV2} disabled={loading}>
              创建 (user field)
            </Button>
            <Button onClick={testCreateUserActionV3} disabled={loading}>
              创建 (object form)
            </Button>
            <Button onClick={testStringTargetId} disabled={loading}>
              创建 (字符串ID)
            </Button>
            <Button onClick={testUserQueryWithFilters} disabled={loading}>
              查询用户互动
            </Button>
            <Button onClick={clearResults} variant="outline">
              清除结果
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>测试结果</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 && (
            <p className="text-gray-500">暂无测试结果</p>
          )}
          
          {results.map((result, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{result.test}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.success ? '成功' : '失败'}
                </span>
              </div>
              
              {result.url && (
                <div className="mb-2">
                  <strong>URL:</strong> <code className="text-sm bg-gray-100 p-1 rounded">{result.url}</code>
                </div>
              )}
              
              {result.error && (
                <div className="text-red-600 mb-2">
                  <strong>错误:</strong> {result.error}
                </div>
              )}
              
              {result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">查看数据</summary>
                  <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto text-xs">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}