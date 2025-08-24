"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("验证链接无效或已过期")
      return
    }

    // 模拟邮箱验证过程
    const verifyEmail = async () => {
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // 模拟验证结果（90%成功率）
        if (Math.random() > 0.1) {
          setStatus("success")
          setMessage("邮箱验证成功！您现在可以正常使用所有功能。")
        } else {
          setStatus("error")
          setMessage("验证失败，请重新发送验证邮件或联系客服。")
        }
      } catch (error) {
        setStatus("error")
        setMessage("验证过程中出现错误，请稍后重试。")
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">邮箱验证</h1>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            {status === "loading" && (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <CardTitle className="text-xl">验证中...</CardTitle>
                <CardDescription>正在验证您的邮箱地址，请稍候</CardDescription>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-600">验证成功</CardTitle>
                <CardDescription>您的邮箱已成功验证</CardDescription>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-red-600">验证失败</CardTitle>
                <CardDescription>邮箱验证未能完成</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert
              className={
                status === "success"
                  ? "bg-green-50 border-green-200"
                  : status === "error"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
              }
            >
              <AlertDescription
                className={
                  status === "success" ? "text-green-800" : status === "error" ? "text-red-800" : "text-blue-800"
                }
              >
                {message}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {status === "success" && (
                <Button className="w-full" asChild>
                  <Link href="/auth/login">立即登录</Link>
                </Button>
              )}

              {status === "error" && (
                <>
                  <Button className="w-full" asChild>
                    <Link href="/auth/forgot-password">
                      <Mail className="w-4 h-4 mr-2" />
                      重新发送验证邮件
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login">返回登录</Link>
                  </Button>
                </>
              )}

              {status === "loading" && (
                <Button variant="outline" className="w-full" disabled>
                  请等待验证完成...
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
