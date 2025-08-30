"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Construction, Users, MessageSquare, Calendar, Rocket, Clock, Mail } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [showModal, setShowModal] = useState(false)

  // 页面加载时显示模态框
  useEffect(() => {
    setShowModal(true)
  }, [])

  const upcomingFeatures = [
    {
      icon: MessageSquare,
      title: "讨论交流",
      description: "与全国教育工作者交流AI教学经验",
      status: "审核中"
    },
    {
      icon: Users,
      title: "专家问答",
      description: "AI教育专家在线答疑解惑",
      status: "审核中"
    },
    {
      icon: Rocket,
      title: "项目协作",
      description: "跨校跨地区教育创新项目合作",
      status: "审核中"
    },
    {
      icon: Calendar,
      title: "活动分享",
      description: "线上线下教育活动和研讨会",
      status: "审核中"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 开发中提示模态框 */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Construction className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-xl">社区功能审核中</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              教师社区功能已基本开发完毕，目前正在进行合规审核，确保为教育工作者提供安全、专业的交流环境。
              <br />
              <br />
              审核通过后将正式开放讨论交流、专家问答、项目协作等功能。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowModal(false)} className="px-8">
              我知道了
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Construction className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">教师社区</h1>
            <p className="text-xl text-gray-600 mb-2">正在审核中</p>
            <p className="text-lg text-gray-500">功能已开发完成，正等待合规审核通过后正式开放</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 即将推出的功能 */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Rocket className="w-6 h-6" />
                即将开放的功能
              </CardTitle>
              <CardDescription className="text-base">
                所有功能已开发完成，正在进行最后的合规审核确保平台安全合规
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingFeatures.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{feature.title}</h3>
                          <Badge 
                            variant={feature.status === "审核中" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 审核进度 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                审核进度
              </CardTitle>
              <CardDescription>
                各项功能已开发完成，正在按流程进行合规审核
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>功能开发完成</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">已完成</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>安全测试通过</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">已完成</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>合规性审核</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">进行中</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span>正式开放使用</span>
                  </div>
                  <Badge variant="secondary">待审核通过</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 联系我们 */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                保持联系
              </CardTitle>
              <CardDescription>
                功能已开发完成，如有任何问题或建议，欢迎与我们联系
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/tools">探索AI工具</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/resources">浏览教育资源</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/news">查看最新资讯</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                社区功能审核中，预计将在近期通过审核与大家见面，感谢您的耐心等待！
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
