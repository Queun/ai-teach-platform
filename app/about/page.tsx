"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Target,
  Eye,
  Heart,
  Users,
  BookOpen,
  Zap,
  Globe,
  Lightbulb,
  Rocket,
  Mail,
  Linkedin,
  Github,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const stats = [
    { number: "2022", label: "成立年份", icon: Calendar, color: "text-blue-600" },
    { number: "10,000+", label: "服务教师", icon: Users, color: "text-green-600" },
    { number: "500+", label: "精选工具", icon: Zap, color: "text-purple-600" },
    { number: "50,000+", label: "优质资源", icon: BookOpen, color: "text-orange-600" },
  ]

  const values = [
    {
      icon: Target,
      title: "专业专注",
      description: "专注AI教育领域，深耕教学场景，为教育工作者提供最专业的服务",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Heart,
      title: "用户至上",
      description: "以教师和学生的需求为中心，持续优化产品体验和服务质量",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Lightbulb,
      title: "创新驱动",
      description: "紧跟AI技术发展前沿，不断探索教育创新的新可能",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Globe,
      title: "开放共享",
      description: "构建开放的教育生态，促进知识共享和经验交流",
      color: "bg-green-100 text-green-600",
    },
  ]

  const team = [
    {
      name: "张明",
      role: "创始人 & CEO",
      bio: "前教育部信息化专家，15年教育科技经验",
      avatar: "/placeholder.svg?height=120&width=120",
      social: {
        email: "zhang.ming@aijiaoxue.com",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "李华",
      role: "技术总监",
      bio: "前阿里巴巴高级工程师，AI技术专家",
      avatar: "/placeholder.svg?height=120&width=120",
      social: {
        email: "li.hua@aijiaoxue.com",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "王芳",
      role: "产品总监",
      bio: "前腾讯教育产品经理，用户体验专家",
      avatar: "/placeholder.svg?height=120&width=120",
      social: {
        email: "wang.fang@aijiaoxue.com",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "陈强",
      role: "教育专家",
      bio: "北京师范大学教授，AI教育研究专家",
      avatar: "/placeholder.svg?height=120&width=120",
      social: {
        email: "chen.qiang@aijiaoxue.com",
        linkedin: "#",
        github: "#",
      },
    },
  ]

  const timeline = [
    {
      year: "2022",
      title: "项目启动",
      description: "爱教学项目正式启动，开始AI教育资源整合",
      achievements: ["完成市场调研", "组建核心团队", "确定产品方向"],
    },
    {
      year: "2023",
      title: "平台上线",
      description: "爱教学平台正式上线，开始为教师提供AI工具和资源",
      achievements: ["平台正式发布", "首批1000名用户", "100个精选工具"],
    },
    {
      year: "2024",
      title: "快速发展",
      description: "用户规模快速增长，功能不断完善，影响力持续扩大",
      achievements: ["用户突破10000", "资源超过50000", "获得教育部认可"],
    },
    {
      year: "2025",
      title: "未来规划",
      description: "继续深耕AI教育，打造更完善的教育生态系统",
      achievements: ["国际化发展", "AI课程体系", "教师认证计划"],
    },
  ]

  const partners = [
    { name: "教育部", logo: "🏛️", description: "政策指导与支持" },
    { name: "北京师范大学", logo: "🎓", description: "学术研究合作" },
    { name: "清华大学", logo: "🎓", description: "技术创新合作" },
    { name: "中国教育学会", logo: "📚", description: "行业标准制定" },
    { name: "OpenAI", logo: "🤖", description: "技术合作伙伴" },
    { name: "微软教育", logo: "💻", description: "平台技术支持" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Heart className="w-4 h-4 mr-2" />
              关于我们
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                让AI赋能每位教师
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              爱教学致力于成为全球领先的AI教育资源平台，通过整合优质的AI工具和教学资源，
              帮助教育���作者提升教学效率，创新教学方式，培养面向未来的人才。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/auth/register" className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  加入我们
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/contact" className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  联系我们
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <stat.icon className={`w-8 sm:w-10 h-8 sm:h-10 ${stat.color} mx-auto mb-3 sm:mb-4`} />
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                  <div className="text-gray-600 text-sm sm:text-base font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">使命与愿景</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              我们相信AI技术将深刻改变教育的未来，我们的使命是让这种改变惠及每一位教育工作者
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center p-6 sm:p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">我们的使命</CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed text-center">
                  通过整合全球优质的AI教育工具和资源，为教育工作者提供专业、便捷、高效的服务，
                  助力教学创新，提升教育质量，培养具有创新精神和实践能力的未来人才。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center p-6 sm:p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">我们的愿景</CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed text-center">
                  成为全球领先的AI教育资源平台，构建开放、共享、创新的教育生态系统，
                  让每位教师都能轻松驾驭AI技术，让每个学生都能享受个性化的优质教育。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">核心价值观</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              这些价值观指导着我们的每一个决策，塑造着我们的企业文化
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 ${value.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <value.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">核心团队</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              我们的团队由来自教育、技术、产品等领域的专家组成，致力于推动AI教育的发展
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="relative mb-4 sm:mb-6">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg sm:text-xl">{member.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3 text-sm sm:text-base">{member.role}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Github className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">发展历程</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              从创立至今，我们始终专注于AI教育领域，不断创新，持续成长
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 transform sm:-translate-x-1/2"></div>

            <div className="space-y-8 sm:space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform sm:-translate-x-1/2 z-10"></div>

                  {/* Content */}
                  <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:pr-8" : "sm:pl-8"} ml-12 sm:ml-0`}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">{item.year}</Badge>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{item.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                          {item.description}
                        </p>
                        <div className="space-y-2">
                          {item.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm sm:text-base text-gray-700">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">合作伙伴</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              我们与众多知名机构和企业建立了深度合作关系，共同推动AI教育的发展
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {partners.map((partner, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {partner.logo}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">{partner.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">加入我们的使命</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed">
            如果您也相信AI能够改变教育，如果您也想为教育创新贡献力量，
            <br className="hidden sm:block" />
            欢迎加入我们，一起创造教育的美好未来
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
              <Link href="/careers" className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                加入团队
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 text-white">
              <Link href="/contact" className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                商务合作
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>北京市海淀区中关村</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>400-123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>contact@aijiaoxue.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
