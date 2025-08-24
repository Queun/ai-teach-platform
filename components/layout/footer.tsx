import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl">爱教学</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              致力于为教育工作者提供最优质的AI工具和资源，推动教育创新发展，构建智慧教育生态。"爱教学"——AI教学的谐音，让AI赋能每位教师。
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">快速链接</h3>
            <div className="space-y-2">
              {[
                { name: "资源中心", href: "/resources" },
                { name: "AI工具库", href: "/tools" },
                { name: "AI教育前沿", href: "/news" },
                { name: "教师社区", href: "/community" },
                { name: "使用指南", href: "/guide" },
                { name: "常见问题", href: "/faq" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">支持与帮助</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@aiedu.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>400-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>北京市海淀区中关村</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">订阅更新</h3>
            <p className="text-gray-400 text-sm">订阅我们的邮件列表，获取最新的AI教育资讯和工具推荐。</p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="输入您的邮箱"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700">订阅</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">© 2024 爱教学. 保留所有权利.</div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              服务条款
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
