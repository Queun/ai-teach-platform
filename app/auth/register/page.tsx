"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, School, Github, Chrome, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    school: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    role?: string
    agreeTerms?: string
    general?: string
  }>({})

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    // 姓名验证
    if (!formData.name.trim()) {
      newErrors.name = "请输入您的姓名"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "姓名至少需要2个字符"
    }

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = "请输入邮箱地址"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址"
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = "请输入密码"
    } else if (formData.password.length < 6) {
      newErrors.password = "密码至少需要6位字符"
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认密码"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致"
    }

    // 职业角色验证
    if (!formData.role) {
      newErrors.role = "请选择您的职业角色"
    }

    // 服务条款验证
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "请阅读并同意服务条款和隐私政策"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // 使用姓名作为用户名
      const result = await register({
        username: formData.name.trim(),
        email: formData.email,
        password: formData.password
      })
      
      if (result.success) {
        // 注册成功，重定向到首页
        router.push("/")
      } else {
        setErrors({ general: result.error || "注册失败，请稍后重试" })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ general: "注册失败，请稍后重试" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // 如果正在检查认证状态，显示加载状态
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">正在检查登录状态...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">加入爱教学</h1>
          <p className="text-gray-600 mt-2">创建您的账户，开启AI教育之旅</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">用户注册</CardTitle>
            <CardDescription className="text-center">填写以下信息创建您的账户</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="输入您的姓名"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="输入您的邮箱"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">职业角色</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} disabled={isSubmitting}>
                  <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                    <SelectValue placeholder="选择您的职业角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary-teacher">小学教师</SelectItem>
                    <SelectItem value="middle-teacher">中学教师</SelectItem>
                    <SelectItem value="high-teacher">高中教师</SelectItem>
                    <SelectItem value="university-teacher">大学教师</SelectItem>
                    <SelectItem value="administrator">教学管理者</SelectItem>
                    <SelectItem value="researcher">教育研究员</SelectItem>
                    <SelectItem value="student">学生</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">学校/机构（可选）</Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="school"
                    type="text"
                    placeholder="输入您的学校或机构名称"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="设置您的密码（至少6位字符）"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="再次输入密码"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                    disabled={isSubmitting}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    我同意{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      服务条款
                    </Link>{" "}
                    和{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                      隐私政策
                    </Link>
                  </Label>
                </div>
                {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}
              </div>

              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    创建中...
                  </>
                ) : (
                  "创建账户"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">或者使用</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11" disabled={isSubmitting}>
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="h-11" disabled={isSubmitting}>
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">已有账户？</span>{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                立即登录
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
