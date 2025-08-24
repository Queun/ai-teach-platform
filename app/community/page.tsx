"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Search, MessageSquare, Heart, Share2, Bookmark, TrendingUp, Users, Calendar, Pin } from "lucide-react"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const discussions = [
    {
      id: 1,
      title: "如何在小学数学课堂中有效使用ChatGPT？",
      content: "最近开始尝试在数学课上使用ChatGPT辅助教学，想听听大家的经验和建议...",
      author: {
        name: "张老师",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "小学数学教师",
        level: "活跃用户",
      },
      category: "教学经验",
      tags: ["ChatGPT", "小学数学", "课堂教学"],
      stats: {
        replies: 23,
        likes: 45,
        views: 312,
        bookmarks: 12,
      },
      createdAt: "2小时前",
      isPinned: false,
      isHot: true,
    },
    {
      id: 2,
      title: "AI辅助英语写作批改的最佳实践分享",
      content: "经过一学期的实践，总结了一些AI批改英语作文的经验，包括工具选择、批改标准设置等...",
      author: {
        name: "李教授",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "大学英语教师",
        level: "专家用户",
      },
      category: "工具分享",
      tags: ["英语教学", "写作批改", "AI工具"],
      stats: {
        replies: 18,
        likes: 67,
        views: 489,
        bookmarks: 28,
      },
      createdAt: "5小时前",
      isPinned: true,
      isHot: true,
    },
    {
      id: 3,
      title: "求推荐适合高中物理的AI教学工具",
      content: "想为高中物理课程引入一些AI工具，特别是在实验模拟和概念解释方面，有什么好的推荐吗？",
      author: {
        name: "王老师",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "高中物理教师",
        level: "新手用户",
      },
      category: "求助问答",
      tags: ["高中物理", "实验模拟", "工具推荐"],
      stats: {
        replies: 12,
        likes: 28,
        views: 156,
        bookmarks: 8,
      },
      createdAt: "1天前",
      isPinned: false,
      isHot: false,
    },
    {
      id: 4,
      title: "AI个性化学习路径设计案例分享",
      content: "分享一个成功的AI个性化学习路径设计案例，包括学生画像分析、路径规划、效果评估等...",
      author: {
        name: "陈主任",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "教学主任",
        level: "资深用户",
      },
      category: "案例分享",
      tags: ["个性化学习", "学习路径", "案例研究"],
      stats: {
        replies: 31,
        likes: 89,
        views: 672,
        bookmarks: 45,
      },
      createdAt: "2天前",
      isPinned: false,
      isHot: true,
    },
  ]

  const categories = [
    { name: "全部讨论", count: 1234, color: "bg-blue-100 text-blue-800" },
    { name: "教学经验", count: 456, color: "bg-green-100 text-green-800" },
    { name: "工具分享", count: 234, color: "bg-purple-100 text-purple-800" },
    { name: "求助问答", count: 189, color: "bg-orange-100 text-orange-800" },
    { name: "案例分享", count: 167, color: "bg-pink-100 text-pink-800" },
    { name: "技术讨论", count: 123, color: "bg-indigo-100 text-indigo-800" },
    { name: "政策解读", count: 65, color: "bg-gray-100 text-gray-800" },
  ]

  const activeUsers = [
    {
      name: "张教授",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "AI教育专家",
      posts: 156,
      reputation: 2340,
    },
    {
      name: "李老师",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "小学教师",
      posts: 89,
      reputation: 1890,
    },
    {
      name: "王主任",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "教学主任",
      posts: 67,
      reputation: 1560,
    },
    {
      name: "陈博士",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "教育研究员",
      posts: 45,
      reputation: 1230,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">教师社区</h1>
            <p className="text-xl text-gray-600 mb-8">与全国教育工作者交流AI教学经验，共同探索教育创新之路</p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索讨论话题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button className="h-12 px-8">发起讨论</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">讨论分类</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge className={category.color}>{category.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  活跃用户
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">{user.reputation}</div>
                      <div className="text-xs text-gray-500">声望</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">社区统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">总用户数</span>
                  <span className="font-semibold">12,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">今日活跃</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">讨论话题</span>
                  <span className="font-semibold">5,678</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">回复数量</span>
                  <span className="font-semibold">23,456</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Tabs defaultValue="latest" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="latest">最新讨论</TabsTrigger>
                  <TabsTrigger value="hot">热门话题</TabsTrigger>
                  <TabsTrigger value="pinned">置顶公告</TabsTrigger>
                  <TabsTrigger value="unanswered">待解答</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    筛选
                  </Button>
                  <Button variant="outline" size="sm">
                    排序
                  </Button>
                </div>
              </div>

              <TabsContent value="latest" className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {discussion.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                            {discussion.isHot && (
                              <Badge variant="destructive" className="text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                热门
                              </Badge>
                            )}
                            <Badge variant="secondary">{discussion.category}</Badge>
                          </div>

                          <CardTitle className="text-lg leading-tight hover:text-blue-600 cursor-pointer mb-2">
                            {discussion.title}
                          </CardTitle>

                          <CardDescription className="line-clamp-2 mb-3">{discussion.content}</CardDescription>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium">{discussion.author.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {discussion.author.level}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {discussion.createdAt}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{discussion.stats.replies} 回复</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{discussion.stats.likes} 点赞</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bookmark className="w-4 h-4" />
                            <span>{discussion.stats.bookmarks} 收藏</span>
                          </div>
                          <span>{discussion.stats.views} 浏览</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4 mr-1" />
                            点赞
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 mr-1" />
                            分享
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4 mr-1" />
                            收藏
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="hot">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">热门话题</h3>
                  <p className="text-gray-600 mb-6">基于互动量和关注度的热门讨论</p>
                </div>
              </TabsContent>

              <TabsContent value="pinned">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">置顶公告</h3>
                  <p className="text-gray-600 mb-6">重要通知和社区公告</p>
                </div>
              </TabsContent>

              <TabsContent value="unanswered">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">待解答问题</h3>
                  <p className="text-gray-600 mb-6">需要社区帮助的问题</p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
