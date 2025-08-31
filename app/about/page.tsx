"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Heart,
  Lightbulb,
  MessageSquare,
  Mail,
  Globe,
  Code,
  Coffee,
  Users,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: Target,
      title: "信息聚合",
      description: "收集整理各类AI教育工具和资源的信息，为教育工作者提供参考",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Heart,
      title: "用户友好",
      description: "简洁的界面设计，便于查找和浏览相关教育资源",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Lightbulb,
      title: "持续更新",
      description: "定期更新工具信息和教育资源，保持内容的时效性",
      color: "bg-yellow-100 text-yellow-600",
    },
  ]

  const currentStatus = [
    "🚧 测试阶段：本网站目前处于测试阶段，功能持续完善中",
    "✅ 基础功能已完成：用户注册、登录、浏览工具和资源",
    "✅ 互动功能：点赞、收藏、个人Dashboard",
    "✅ 响应式设计：支持移动端和桌面端访问",
    "🚧 持续优化：根据用户反馈不断改进体验",
    "🚧 内容扩充：逐步增加更多优质教育资源",
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* What We Do */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">爱教学 - AI教育工具信息平台</h2>
            <p className="text-lg text-gray-600">
              收集、整理各类AI教育工具信息，为教育工作者提供参考和推荐
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">当前状态</h2>
          </div>

          {/* Test Stage Alert */}
          <div className="mb-6 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-lg font-semibold text-yellow-800">测试版本</span>
            </div>
            <p className="text-center text-sm text-yellow-700">
              本网站目前处于测试阶段，功能持续完善中。如有问题或建议，欢迎反馈！
            </p>
          </div>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-3">
                {currentStatus.slice(1).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">欢迎交流</h2>
          <p className="text-base sm:text-lg mb-6 opacity-90 leading-relaxed">
            个人开发项目，欢迎任何建议和反馈
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button size="lg" variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
              <Link href="/tools" className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                浏览工具
              </Link>
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 transition-colors">
              <a href="mailto:574702578@qq.com" className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                联系我们
              </a>
            </Button>
          </div>

          <div className="text-sm opacity-80">
            <p>574702578@qq.com</p>
          </div>
        </div>
      </section>
    </div>
  )
}