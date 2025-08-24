"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  MessageSquare,
  Download,
  TrendingUp,
  Settings,
  LogOut,
  Eye,
  Heart,
  Bookmark,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// Mock 历史记录数据
const MOCK_HISTORY = {
  resources: [
    {
      id: 1,
      title: "ChatGPT在数学教学中的创新应用",
      type: "PDF",
      category: "教学指南",
      visitedAt: "2024-05-29 14:30",
      action: "下载",
      url: "/resources/1",
    },
    {
      id: 2,
      title: "AI辅助英语写作批改系统使用手册",
      type: "视频",
      category: "工具教程",
      visitedAt: "2024-05-29 10:15",
      action: "浏览",
      url: "/resources/2",
    },
    {
      id: 3,
      title: "基于AI的个性化学习路径设计模板",
      type: "模板",
      category: "教学模板",
      visitedAt: "2024-05-28 16:45",
      action: "收藏",
      url: "/resources/3",
    },
  ],
  tools: [
    {
      id: 1,
      name: "ChatGPT",
      category: "内容创作",
      visitedAt: "2024-05-29 15:20",
      action: "访问工具",
      url: "/tools/chatgpt",
    },
    {
      id: 2,
      name: "Grammarly",
      category: "语言学习",
      visitedAt: "2024-05-28 11:30",
      action: "查看详情",
      url: "/tools/grammarly",
    },
  ],
  community: [
    {
      id: 1,
      title: "如何在小学数学课堂中有效使用ChatGPT？",
      type: "讨论",
      visitedAt: "2024-05-29 13:45",
      action: "参与讨论",
      url: "/community/1",
    },
    {
      id: 2,
      title: "AI辅助英语写作批改的最佳实践分享",
      type: "讨论",
      visitedAt: "2024-05-28 09:20",
      action: "点赞",
      url: "/community/2",
    },
  ],
  news: [
    {
      id: 1,
      title: "教育部发布AI教育新政策，鼓励中小学引入AI课程",
      category: "政策动态",
      visitedAt: "2024-05-29 08:30",
      action: "阅读",
      url: "/news/1",
    },
  ],
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // 检查登录状态
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  const stats = {
    resourcesViewed: MOCK_HISTORY.resources.length + 15,
    toolsUsed: MOCK_HISTORY.tools.length + 8,
    discussionsJoined: MOCK_HISTORY.community.length + 12,
    articlesRead: MOCK_HISTORY.news.length + 25,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 用户信息头部 */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback className="text-lg">{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">欢迎回来，{user.name}</h1>
                    <p className="text-gray-600">{user.role}</p>
                    <p className="text-sm text-gray-500">上次登录：{new Date(user.loginTime).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">数据概览</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
              <TabsTrigger value="favorites">我的收藏</TabsTrigger>
              <TabsTrigger value="settings">账户设置</TabsTrigger>
            </TabsList>

            {/* 数据概览 */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">浏览资源</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.resourcesViewed}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">使用工具</p>
                        <p className="text-2xl font-bold text-green-600">{stats.toolsUsed}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">参与讨论</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.discussionsJoined}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">阅读文章</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.articlesRead}</p>
                      </div>
                      <Eye className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 最近活动 */}
              <Card>
                <CardHeader>
                  <CardTitle>最近活动</CardTitle>
                  <CardDescription>您最近在平台上的活动记录</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      ...MOCK_HISTORY.resources.slice(0, 2),
                      ...MOCK_HISTORY.tools.slice(0, 1),
                      ...MOCK_HISTORY.community.slice(0, 1),
                    ]
                      .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime())
                      .slice(0, 4)
                      .map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium">{item.title || item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.action} • {item.visitedAt}
                            </p>
                          </div>
                          <Badge variant="outline">{item.category || item.type}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 历史记录 */}
            <TabsContent value="history" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 资源浏览记录 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      资源浏览记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MOCK_HISTORY.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <Link href={resource.url} className="font-medium hover:text-blue-600 line-clamp-1">
                              {resource.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {resource.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {resource.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{resource.visitedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {resource.action === "下载" && <Download className="w-3 h-3" />}
                            {resource.action === "浏览" && <Eye className="w-3 h-3" />}
                            {resource.action === "收藏" && <Bookmark className="w-3 h-3" />}
                            {resource.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 工具使用记录 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      工具使用记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MOCK_HISTORY.tools.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <Link href={tool.url} className="font-medium hover:text-blue-600">
                              {tool.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                              <span className="text-xs text-gray-500">{tool.visitedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ExternalLink className="w-3 h-3" />
                            {tool.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 社区参与记录 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      社区参与记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MOCK_HISTORY.community.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <Link href={item.url} className="font-medium hover:text-blue-600 line-clamp-2">
                              {item.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{item.visitedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {item.action === "点赞" && <Heart className="w-3 h-3" />}
                            {item.action === "参与讨论" && <MessageSquare className="w-3 h-3" />}
                            {item.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 资讯阅读记录 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      资讯阅读记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MOCK_HISTORY.news.map((article) => (
                        <div
                          key={article.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <Link href={article.url} className="font-medium hover:text-blue-600 line-clamp-2">
                              {article.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {article.category}
                              </Badge>
                              <span className="text-xs text-gray-500">{article.visitedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            {article.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 我的收藏 */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>我的收藏</CardTitle>
                  <CardDescription>您收藏的资源、工具和讨论</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">暂无收藏内容</h3>
                    <p className="text-gray-600 mb-4">开始浏览资源和工具，收藏您感兴趣的内容</p>
                    <div className="flex gap-2 justify-center">
                      <Button asChild>
                        <Link href="/resources">浏览资源</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/tools">探索工具</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 账户设置 */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>账户设置</CardTitle>
                  <CardDescription>管理您的个人信息和偏好设置</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">个人信息</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">姓名</label>
                          <p className="text-gray-900">{user.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">邮箱</label>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">角色</label>
                          <p className="text-gray-900">{user.role}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">注册时间</label>
                          <p className="text-gray-900">2024年5月</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">安全设置</h3>
                      <div className="space-y-3">
                        <Button variant="outline">修改密码</Button>
                        <Button variant="outline">绑定手机号</Button>
                        <Button variant="outline">两步验证</Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">通知设置</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>邮件通知</span>
                          <Button variant="outline" size="sm">
                            开启
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>新资源推荐</span>
                          <Button variant="outline" size="sm">
                            开启
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>社区互动提醒</span>
                          <Button variant="outline" size="sm">
                            开启
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
