"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import GlobalSearchBox from "@/components/search/GlobalSearchBox"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const navigation = [
    { name: "首页", href: "/" },
    { name: "资源中心", href: "/resources" },
    { name: "AI工具", href: "/tools" },
    { name: "AI教育前沿", href: "/news" },
    { name: "社区", href: "/community" },
    { name: "关于", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-xl text-gray-900">爱教学</span>
          </Link>

          {/* Desktop Search (Hidden on very small screens, visible on md+) */}
          <div className="hidden lg:block flex-1 max-w-xl mx-8">
            <GlobalSearchBox 
              className="w-full"
              placeholder="搜索AI工具、资讯、教学资源..."
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 flex-shrink-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Mobile/Tablet Search Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden"
              onClick={() => setShowSearch(true)}
            >
              <Search className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" className="hidden md:flex relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500"></Badge>
            </Button>

            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/auth/login">登录</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">注册</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/auth/login">登录</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/auth/register">注册</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {showSearch && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
            <div className="bg-white p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <GlobalSearchBox 
                    className="w-full"
                    placeholder="搜索AI工具、资讯、教学资源..."
                    onSearch={() => setShowSearch(false)}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSearch(false)}
                  className="flex-shrink-0"
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
