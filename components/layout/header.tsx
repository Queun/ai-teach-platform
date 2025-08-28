"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Bell, User, LogOut, Settings, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import GlobalSearchBox from "@/components/search/GlobalSearchBox"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

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

            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {/* 通知按钮 */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500"></Badge>
                  </Button>

                  {/* 用户下拉菜单 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} alt={user?.username} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user?.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          <span>个人中心</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard?tab=settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>账户设置</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>退出登录</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild size="sm">
                    <Link href="/auth/login">登录</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/auth/register">注册</Link>
                  </Button>
                </>
              )}
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
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar} alt={user?.username} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                              {user?.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-green-700">{user?.username}</span>
                            <span className="text-xs text-green-600">{user?.email}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            个人中心
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/dashboard?tab=settings" onClick={() => setIsOpen(false)}>
                            <Settings className="w-4 h-4 mr-2" />
                            账户设置
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={logout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          退出登录
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/auth/login">登录</Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link href="/auth/register">注册</Link>
                        </Button>
                      </>
                    )}
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
