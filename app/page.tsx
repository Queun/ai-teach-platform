import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    爱教学
                  </span>
                  <br />
                  <span className="text-gray-800">AI赋能教育</span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl leading-relaxed px-4 sm:px-0">
                  为教育工作者打造的专业AI工具与资源平台，助力教学创新，提升教育质量，
                  <span className="font-semibold text-blue-600">让每位教师都能轻松驾驭AI</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 px-4 sm:px-0">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 h-12 sm:h-auto"
                  >
                    <Link href="/resources" className="flex items-center gap-2">
                      <Rocket className="w-4 sm:w-5 h-4 sm:h-5" />
                      立即开始探索
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 hover:bg-white/80 backdrop-blur-sm h-12 sm:h-auto"
                  >
                    <Link href="/tools" className="flex items-center gap-2">
                      <Play className="w-4 sm:w-5 h-4 sm:h-5" />
                      观看演示
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-gray-600 px-4 sm:px-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>完全免费使用</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>专家内容策展</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>活跃教师社区</span>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative px-4 sm:px-0">
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
                  {/* Mock Dashboard Preview */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">AI</span>
                        </div>
                        <div className="text-white">
                          <div className="font-semibold text-sm sm:text-base">爱教学工作台</div>
                          <div className="text-xs opacity-80">您的AI教学助手</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">今日推荐工具</span>
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">热门</Badge>
                      </div>
                      <div className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl sm:text-2xl">🤖</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base truncate">ChatGPT</div>
                          <div className="text-xs text-gray-500">AI对话助手</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.9</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl sm:text-2xl">✍️</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base truncate">Grammarly</div>
                          <div className="text-xs text-gray-500">写作助手</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.7</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 sm:p-3 rounded-full shadow-lg animate-bounce">
                    <Lightbulb className="w-4 sm:w-6 h-4 sm:h-6" />
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-2 sm:p-3 rounded-full shadow-lg animate-pulse">
                    <Target className="w-4 sm:w-6 h-4 sm:h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
              {[
                { number: "10,000+", label: "活跃教育工作者", icon: Users, color: "text-blue-600" },
                { number: "500+", label: "AI教育工具", icon: Zap, color: "text-purple-600" },
                { number: "50,000+", label: "教学资源", icon: BookOpen, color: "text-green-600" },
                { number: "100,000+", label: "社区互动", icon: MessageSquare, color: "text-pink-600" },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <stat.icon className={`w-6 sm:w-8 h-6 sm:h-8 ${stat.color} mx-auto mb-2 sm:mb-3`} />
                    <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1 sm:mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm font-medium leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Highlights Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Award className="w-4 h-4 mr-2" />
              平台亮点
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 px-4 sm:px-0">
              为什么选择爱教学？
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              我们不只是工具的搬运工，更是教育创新的推动者
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "🎯",
                title: "专业策展",
                description: "每个资源都经过教育专家精心筛选和评估，确保质量和实用性",
                features: ["专家团队审核", "实用性验证", "持续更新维护"],
              },
              {
                icon: "🤝",
                title: "活跃社区",
                description: "汇聚全国优秀教育工作者，分享经验、互相学习、共同成长",
                features: ["真实案例分享", "专业问题解答", "教学经验交流"],
              },
              {
                icon: "🚀",
                title: "创新驱动",
                description: "紧跟AI技术发展，第一时间为教育工作者提供最新的工具和方法",
                features: ["前沿技术跟踪", "创新应用探索", "趋势分析报告"],
              },
            ].map((highlight, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white group"
              >
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {highlight.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">{highlight.title}</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {highlight.description}
                  </p>
                  <div className="space-y-2">
                    {highlight.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500"
                      >
                        <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced News Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 sm:mb-12">
            <div className="mb-6 lg:mb-0">
              <Badge className="mb-4 bg-purple-100 text-purple-800">
                <TrendingUp className="w-4 h-4 mr-2" />
                教育前沿
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">掌握AI教育最新动态</h2>
              <p className="text-gray-600 text-base sm:text-lg">第一时间了解政策变化、技术突破和教学创新</p>
            </div>
            <Button variant="outline" className="hidden lg:flex" asChild>
              <Link href="/news">查看更多</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "教育部发布AI教育新政策，鼓励中小学引入AI课程",
                date: "2024-05-28",
                category: "政策动态",
                image: "/placeholder.svg?height=200&width=400",
                excerpt:
                  "教育部近日发布新政策，鼓励全国中小学校积极引入人工智能相关课程，培养学生的AI素养和创新能力...",
                readTime: "5分钟阅读",
                featured: true,
              },
              {
                title: "2024年AI教育工具排行榜发布，这些工具最受教师欢迎",
                date: "2024-05-25",
                category: "工具评测",
                image: "/placeholder.svg?height=200&width=400",
                excerpt:
                  "近日，国内权威教育科技评测机构发布了2024年AI教育工具排行榜，多款创新工具因其易用性和教学效果获得教师高度评价...",
                readTime: "8分钟阅读",
              },
              {
                title: "AI如何改变语言教学？一线教师分享成功经验",
                date: "2024-05-20",
                category: "教学案例",
                image: "/placeholder.svg?height=200&width=400",
                excerpt:
                  "来自北京市实验中学的王老师分享了她在英语教学中应用AI工具的成功经验，学生的口语和写作能力显著提升...",
                readTime: "6分钟阅读",
              },
            ].map((news, index) => (
              <Card
                key={index}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  news.featured ? "ring-2 ring-yellow-300 shadow-lg shadow-yellow-100/50" : ""
                }`}
              >
                {/* 头条推荐角标 */}
                {news.featured && (
                  <div className="absolute top-0 left-0 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 text-xs font-medium rounded-br-lg shadow-lg">
                      <Star className="w-3 h-3 inline mr-1" />
                      头条推荐
                    </div>
                  </div>
                )}

                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs">
                      {news.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-2">
                  <CardTitle className="text-base sm:text-lg leading-tight hover:text-blue-600 cursor-pointer line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/news/${index + 1}`}>{news.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="mb-3 sm:mb-4 line-clamp-3 text-gray-600 text-sm sm:text-base">
                    {news.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    <span>{news.date}</span>
                    <span>{news.readTime}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 h-9"
                    asChild
                  >
                    <Link href={`/news/${index + 1}`}>
                      阅读全文
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8 lg:hidden">
            <Button variant="outline" asChild>
              <Link href="/news">查看更多资讯</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Popular Resources */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 sm:mb-12">
            <div className="mb-6 lg:mb-0">
              <Badge className="mb-4 bg-green-100 text-green-800">
                <BookOpen className="w-4 h-4 mr-2" />
                精品资源
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">社区精选教学资源</h2>
              <p className="text-gray-600 text-base sm:text-lg">经过专家策展的优质内容，助力您的教学创新</p>
            </div>
            <Button variant="outline" className="hidden lg:flex" asChild>
              <Link href="/resources">浏览全部</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "ChatGPT在课堂教学中的应用指南",
                category: "教学指南",
                rating: 4.9,
                downloads: "2.3k",
                description: "详细介绍如何在日常教学中有效使用ChatGPT提升教学效果",
                author: "张明老师",
                difficulty: "入门",
                featured: true,
              },
              {
                title: "AI辅助作业批改系统使用手册",
                category: "工具教程",
                rating: 4.8,
                downloads: "1.8k",
                description: "学习如何使用AI工具快速准确地批改学生作业",
                author: "李教授",
                difficulty: "进阶",
              },
              {
                title: "个性化学习路径设计模板",
                category: "教学模板",
                rating: 4.7,
                downloads: "1.5k",
                description: "基于AI分析的个性化学习路径设计方法和模板",
                author: "王主任",
                difficulty: "高级",
              },
            ].map((resource, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl transition-all duration-300 group relative ${
                  resource.featured
                    ? "ring-2 ring-green-300 bg-gradient-to-br from-green-50/50 to-white shadow-lg shadow-green-100/50"
                    : ""
                }`}
              >
                {/* 专家推荐徽章 */}
                {resource.featured && (
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
                      {resource.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 sm:w-4 h-3 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-medium">{resource.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                    {resource.description}
                  </CardDescription>

                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Avatar className="w-5 sm:w-6 h-5 sm:h-6">
                      <AvatarFallback className="text-xs">{resource.author[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm text-gray-600 flex-1 truncate">{resource.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {resource.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4" />
                      {resource.downloads} 下载
                    </div>
                    <Button size="sm" className="group-hover:bg-blue-600 transition-colors h-8">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8 lg:hidden">
            <Button variant="outline" asChild>
              <Link href="/resources">浏览全部资源</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">加入我们的教育创新之旅</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4 sm:px-0">开启AI教育新篇章</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            与全国数万名教育工作者一起，探索AI在教育中的无限可能，
            <span className="font-semibold">让技术真正服务于教学</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4 sm:px-0">
            <Button
              size="lg"
              variant="secondary"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white text-gray-800 hover:bg-gray-100 shadow-lg h-12 sm:h-auto"
              asChild
            >
              <Link href="/auth/register" className="flex items-center gap-2">
                <Users className="w-4 sm:w-5 h-4 sm:h-5" />
                免费注册
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-white/30 hover:bg-white/10 backdrop-blur-sm h-12 sm:h-auto text-black"
              asChild
            >
              <Link href="/tools" className="flex items-center gap-2">
                <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
                探索AI工具
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>完全免费</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>无需信用卡</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>即刻开始</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
