'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import {
  Users,
  ArrowRight,
  Star,
  TrendingUp,
  Sparkles,
  BookOpen,
  MessageSquare,
  Zap,
  CheckCircle,
  Play,
  Award,
  Target,
  Lightbulb,
  Rocket,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useTools, useResources, useNews, useStats } from '@/hooks/useStrapi'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  // 获取数据 - 只显示精选内容
  const { data: stats } = useStats();
  const { data: featuredNews } = useNews({ pageSize: 3, featured: true, sort: 'createdAt:desc' });
  const { data: featuredResources } = useResources({ pageSize: 3, featured: true, sort: 'createdAt:desc' });
  const { data: featuredTools } = useTools({ pageSize: 2, featured: true, sort: 'createdAt:desc' });

  // 获取用户认证状态
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6 shadow-lg">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">AI教育新时代已来临</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-8xl">
                    爱教学
                  </span>
                  <br />
                  <span className="text-gray-800 text-2xl sm:text-3xl lg:text-4xl font-medium">让AI成为您的教学助手</span>
                </h1>

                <p className="text-xl sm:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-3xl leading-relaxed px-4 sm:px-0 font-medium">
                  <span className="text-blue-600 font-bold">5分钟上手</span>，
                  <span className="text-purple-600 font-bold">精选工具</span>，
                  <span className="text-pink-600 font-bold">教师首选</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10 sm:mb-12 px-4 sm:px-0">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0 h-16 sm:h-20"
                  >
                    <Link href="/tools" className="flex items-center gap-3">
                      <Rocket className="w-6 sm:w-7 h-6 sm:h-7" />
                      立即探索AI工具
                      <ArrowRight className="w-6 sm:w-7 h-6 sm:h-7 animate-pulse" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold border-3 border-gray-300 hover:border-gray-400 hover:bg-white/90 backdrop-blur-sm h-16 sm:h-20 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/resources" className="flex items-center gap-3">
                      <Play className="w-6 sm:w-7 h-6 sm:h-7" />
                      观看使用教程
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-base text-gray-700 px-4 sm:px-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-semibold">完全免费使用</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold">3000+教师使用</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-semibold">即开即用</span>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative px-4 sm:px-0">
                <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30">
                  {/* Live Demo Preview */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/25 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-sm">AI</span>
                          </div>
                          <div className="text-white">
                            <div className="font-bold text-base">爱教学工作台</div>
                            <div className="text-xs opacity-90">AI助力教学创新</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white text-xs font-medium">在线</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-5">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">200+</div>
                          <div className="text-xs text-gray-600">AI工具</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">800+</div>
                          <div className="text-xs text-gray-600">教学资源</div>
                        </div>
                        <div className="text-center p-3 bg-pink-50 rounded-lg">
                          <div className="text-2xl font-bold text-pink-600">3k+</div>
                          <div className="text-xs text-gray-600">活跃教师</div>
                        </div>
                      </div>

                      {/* Featured Tools Preview */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">今日热门工具</span>
                          <Badge className="bg-orange-100 text-orange-700 text-xs animate-pulse">🔥 热门</Badge>
                        </div>
                        
                        {featuredTools && featuredTools.length > 0 ? (
                          featuredTools.slice(0, 2).map((tool, index) => (
                            <div key={tool.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                              index === 0 ? 'bg-gradient-to-r from-blue-50 to-purple-50 ring-2 ring-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${
                                index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'
                              }`}>
                                {tool.name?.[0] || 'AI'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm truncate">{tool.name || 'AI工具'}</div>
                                <div className="text-xs text-gray-500 truncate">{tool.shortDesc || '智能教学助手'}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className={`w-4 h-4 ${index === 0 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`} />
                                <span className="text-xs font-medium">{index === 0 ? '4.9' : '4.7'}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg ring-2 ring-blue-200">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                🤖
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm">ChatGPT</div>
                                <div className="text-xs text-gray-500">智能对话助手</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">4.9</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                ✍️
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm">Grammarly</div>
                                <div className="text-xs text-gray-500">智能写作助手</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                                <span className="text-xs font-medium">4.7</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* Quick Action */}
                        <div className="pt-2">
                          <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
                            查看更多 →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="absolute top-1/4 -left-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-2 rounded-full shadow-lg animate-ping">
                    <span className="text-xs font-bold">+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats - More Impactful */}
            <div className="mt-16 sm:mt-20 lg:mt-24 relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-3xl"></div>
              
              <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
                {[
                  { 
                    number: stats ? `${stats.tools}+` : "200+", 
                    label: "AI教育工具", 
                    icon: Zap, 
                    color: "from-purple-500 to-blue-600",
                    bgColor: "bg-purple-50",
                    borderColor: "border-purple-200"
                  },
                  { 
                    number: stats ? `${stats.resources}+` : "800+", 
                    label: "精品教学资源", 
                    icon: BookOpen, 
                    color: "from-green-500 to-emerald-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200"
                  },
                  { 
                    number: stats ? `${stats.news}+` : "150+", 
                    label: "前沿教育资讯", 
                    icon: MessageSquare, 
                    color: "from-pink-500 to-purple-600",
                    bgColor: "bg-pink-50",
                    borderColor: "border-pink-200"
                  },
                  { 
                    number: "3,000+", 
                    label: "活跃教育工作者", 
                    icon: Users, 
                    color: "from-blue-500 to-indigo-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200"
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white relative overflow-hidden`}>
                      {/* Animated background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                      
                      <div className={`relative w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:rotate-12 transition-transform duration-500`}>
                        <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                      </div>
                      
                      <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500`}>
                        {stat.number}
                      </div>
                      <div className="text-gray-700 text-sm sm:text-base font-semibold leading-tight">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Highlights Section - Moved Up */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 text-base px-4 py-2">
              <Award className="w-5 h-5 mr-2" />
              为什么选择爱教学
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 text-gray-800 px-4 sm:px-0">
              专业、可信、高效的AI教育平台
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto px-4 sm:px-0 leading-relaxed">
              不只是工具的搬运工，更是教育创新的推动者
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                icon: "🎯",
                title: "专业审核",
                description: "每个资源都经过教育专家精心筛选和评估，确保质量和实用性",
                features: ["专家团队审核", "实用性验证", "持续更新维护"],
                gradient: "from-blue-500 to-purple-600"
              },
              {
                icon: "🤝",
                title: "活跃社区",
                description: "汇聚全国优秀教育工作者，分享经验、互相学习、共同成长",
                features: ["真实案例分享", "专业问题解答", "教学经验交流"],
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: "🚀",
                title: "创新驱动",
                description: "紧跟AI技术发展，第一时间为教育工作者提供最新的工具和方法",
                features: ["前沿技术跟踪", "创新应用探索", "趋势分析报告"],
                gradient: "from-purple-500 to-pink-600"
              },
            ].map((highlight, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-gray-50 to-white group relative overflow-hidden transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${highlight.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardContent className="relative p-8 sm:p-10 text-center">
                  <div className="text-5xl sm:text-6xl mb-6 sm:mb-8 group-hover:scale-125 transition-transform duration-500">
                    {highlight.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">{highlight.title}</h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
                    {highlight.description}
                  </p>
                  <div className="space-y-3">
                    {highlight.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-center gap-3 text-sm sm:text-base text-gray-700"
                      >
                        <div className={`w-5 h-5 bg-gradient-to-r ${highlight.gradient} rounded-full flex items-center justify-center`}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Tools Quick Experience Section - New */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 text-base px-4 py-2 animate-pulse">
              <Rocket className="w-5 h-5 mr-2" />
              热门工具推荐
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 text-gray-800 px-4 sm:px-0">
              发现最受欢迎的AI工具
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto px-4 sm:px-0 leading-relaxed">
              精选推荐最受欢迎的AI工具，查看详细介绍和使用指南
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {featuredTools && featuredTools.length > 0 ? (
              featuredTools.slice(0, 3).map((tool, index) => (
                <Card key={tool.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${
                        index === 0 ? 'from-blue-500 to-purple-600' : 
                        index === 1 ? 'from-green-500 to-emerald-600' : 
                        'from-purple-500 to-pink-600'
                      } flex items-center justify-center text-white text-xl font-bold group-hover:rotate-12 transition-transform duration-500`}>
                        {tool.name?.[0] || 'AI'}
                      </div>
                      {index === 0 && (
                        <Badge className="bg-red-100 text-red-700 animate-bounce">🔥 最热门</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold mb-3">{tool.name || 'AI工具'}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{tool.shortDesc || '智能教学助手工具'}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative p-6 pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.{9 - index}</span>
                        <span className="text-gray-500 text-sm">({(500 + index * 100)}+ 用户)</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium h-12 group-hover:scale-105 transition-transform duration-300"
                      asChild
                    >
                      <Link href={`/tools/${tool.documentId || tool.id}`}>
                        查看详情 <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback热门工具
              [
                { name: "ChatGPT", desc: "智能对话助手，回答问题、生成内容", emoji: "🤖" },
                { name: "Grammarly", desc: "智能写作助手，语法检查和优化", emoji: "✍️" },
                { name: "Canva AI", desc: "AI设计工具，快速制作教学素材", emoji: "🎨" }
              ].map((tool, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${
                        index === 0 ? 'from-blue-500 to-purple-600' : 
                        index === 1 ? 'from-green-500 to-emerald-600' : 
                        'from-purple-500 to-pink-600'
                      } flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform duration-500`}>
                        {tool.emoji}
                      </div>
                      {index === 0 && (
                        <Badge className="bg-red-100 text-red-700 animate-bounce">🔥 最热门</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold mb-3">{tool.name}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{tool.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative p-6 pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.{9 - index}</span>
                        <span className="text-gray-500 text-sm">({(500 + index * 100)}+ 用户)</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium h-12 group-hover:scale-105 transition-transform duration-300"
                      asChild
                    >
                      <Link href="/tools">
                        查看详情 <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="px-10 py-4 text-lg font-semibold" asChild>
              <Link href="/tools">查看全部200+工具 <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced News Section - Redesigned */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 sm:mb-16">
            <div className="mb-6 lg:mb-0">
              <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 text-base px-4 py-2">
                <TrendingUp className="w-5 h-5 mr-2" />
                教育前沿资讯
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">掌握AI教育最新动态</h2>
              <p className="text-gray-600 text-xl sm:text-2xl leading-relaxed">第一时间了解政策变化、技术突破和教学创新</p>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              className="hidden lg:flex px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/news">查看更多资讯 <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredNews && featuredNews.length > 0 ? (
              featuredNews.map((news, index) => (
                <Card
                  key={news.documentId || news.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                    news.isFeatured ? "ring-2 ring-yellow-300 shadow-lg shadow-yellow-100/50" : ""
                  }`}
                >
                  {/* 头条推荐角标 */}
                  {news.isFeatured && (
                    <div className="absolute top-0 left-0 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 text-xs font-medium rounded-br-lg shadow-lg">
                        <Star className="w-3 h-3 inline mr-1" />
                        头条推荐
                      </div>
                    </div>
                  )}

                  <div className="aspect-video w-full overflow-hidden relative">
                    {news.featuredImage?.url ? (
                      <img
                        src={`http://localhost:1337${news.featuredImage.url}`}
                        alt={news.title || '新闻图片'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs">
                        {news.category || "资讯"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-2">
                    <CardTitle className="text-base sm:text-lg leading-tight hover:text-blue-600 cursor-pointer line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/news/${news.documentId || news.id}`}>
                        {news.title || '无标题'}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <CardDescription className="mb-3 sm:mb-4 line-clamp-3 text-gray-600 text-sm sm:text-base">
                      {news.excerpt || news.content?.substring(0, 100) + '...' || '暂无摘要'}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      <span>
                        {news.publishDate 
                          ? new Date(news.publishDate).toLocaleDateString('zh-CN') 
                          : news.createdAt 
                            ? new Date(news.createdAt).toLocaleDateString('zh-CN')
                            : '日期未知'
                        }
                      </span>
                      <span>{news.readTime || '约5分钟阅读'}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 h-9"
                      asChild
                    >
                      <Link href={`/news/${news.documentId || news.id}`}>
                        阅读全文
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">暂无新闻资讯</h3>
                <p className="text-gray-500">最新的教育前沿资讯将在这里展示</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8 sm:mt-12 lg:hidden">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/news">查看更多资讯 <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Popular Resources - Moved and Redesigned */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 sm:mb-16">
            <div className="mb-6 lg:mb-0">
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 text-base px-4 py-2">
                <BookOpen className="w-5 h-5 mr-2" />
                精品教学资源
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">社区精选优质内容</h2>
              <p className="text-gray-600 text-xl sm:text-2xl leading-relaxed">经过专家审核的教学资源，助力您的教学创新</p>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              className="hidden lg:flex px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/resources">浏览全部资源 <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredResources && featuredResources.length > 0 ? (
              featuredResources.map((resource, index) => (
                <Card
                  key={resource.documentId || resource.id}
                  className={`hover:shadow-xl transition-all duration-300 group relative ${
                    resource.isFeatured
                      ? "ring-2 ring-green-300 bg-gradient-to-br from-green-50/50 to-white shadow-lg shadow-green-100/50"
                      : ""
                  }`}
                >
                  {/* 专家推荐徽章 */}
                  {resource.isFeatured && (
                    <div className="absolute top-0 left-0 z-10">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 sm:px-3 py-1 text-xs font-medium rounded-br-lg shadow-lg">
                        <Award className="w-3 h-3 inline mr-1" />
                        专家推荐
                      </div>
                    </div>
                  )}

                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {resource.category || resource.resourceType || "教学资源"}
                      </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      <Link href={`/resources/${resource.documentId || resource.id}`}>
                        {resource.title || '无标题'}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <CardDescription className="mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                      {resource.summary || resource.content?.substring(0, 80) + '...' || '暂无描述'}
                    </CardDescription>

                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <SmartAvatar 
                        name={resource.authorName || '爱教学团队'} 
                        size="sm"
                        className="w-5 sm:w-6 h-5 sm:h-6"
                      />
                      <span className="text-xs sm:text-sm text-gray-600 flex-1 truncate">
                        {resource.authorName || '爱教学团队'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {resource.difficulty || '入门'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4" />
                        {resource.downloads || resource.views || 0}+ 下载
                      </div>
                      <Button size="sm" className="group-hover:bg-blue-600 transition-colors h-8" asChild>
                        <Link href={`/resources/${resource.documentId || resource.id}`}>查看详情</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">暂无精品资源</h3>
                <p className="text-gray-500">经过专家审核的优质教学资源将在这里展示</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8 sm:mt-12 lg:hidden">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/resources">浏览全部资源 <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section - Final Push */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl animate-ping"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/25 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm sm:text-base font-semibold">
              {isAuthenticated ? `欢迎回来，${user?.username}！` : '加入我们的教育创新之旅'}
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 px-4 sm:px-0 leading-tight">
            {isAuthenticated ? (
              <>
                继续您的
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> AI教育探索</span>
              </>
            ) : (
              <>
                开启
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> AI教育新篇章</span>
              </>
            )}
          </h2>
          
          <p className="text-xl sm:text-2xl mb-10 sm:mb-12 opacity-95 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 font-medium">
            {isAuthenticated ? (
              <>查看您的学习进度，管理收藏内容，发现更多适合您的<span className="font-bold text-yellow-300">AI教育工具和资源</span></>
            ) : (
              <>
                与全国数千名教育工作者一起，探索AI在教育中的无限可能，
                <span className="font-bold text-yellow-300">让技术真正服务于教学</span>
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 sm:mb-12 px-4 sm:px-0">
            {isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  className="px-10 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold bg-white text-gray-800 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-16 sm:h-20"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <BarChart3 className="w-6 sm:w-7 h-6 sm:h-7" />
                    查看个人中心
                    <ArrowRight className="w-6 sm:w-7 h-6 sm:h-7" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="px-10 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold bg-white/10 text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 backdrop-blur-sm h-16 sm:h-20 transition-all duration-300"
                  asChild
                >
                  <Link href="/tools" className="flex items-center gap-3 text-white hover:text-white">
                    <Zap className="w-6 sm:w-7 h-6 sm:h-7" />
                    探索更多工具
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="px-10 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold bg-white text-gray-800 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-16 sm:h-20"
                  asChild
                >
                  <Link href="/auth/register" className="flex items-center gap-3">
                    <Users className="w-6 sm:w-7 h-6 sm:h-7" />
                    免费注册
                    <ArrowRight className="w-6 sm:w-7 h-6 sm:h-7" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="px-10 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold bg-white/10 text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 backdrop-blur-sm h-16 sm:h-20 transition-all duration-300"
                  asChild
                >
                  <Link href="/tools" className="flex items-center gap-3 text-white hover:text-white">
                    <Zap className="w-6 sm:w-7 h-6 sm:h-7" />
                    探索工具
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-10 text-base sm:text-lg opacity-90 font-medium">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-400/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span>个性化推荐</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-400/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span>学习进度跟踪</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-400/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span>专属收藏库</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-400/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span>完全免费</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-400/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span>一键登录</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-400/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span>即刻开始</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
