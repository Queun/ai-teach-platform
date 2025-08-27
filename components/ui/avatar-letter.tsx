"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const avatarLetterVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold select-none overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-20 w-20 text-xl",
      },
      variant: {
        default: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
        purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
        pink: "bg-gradient-to-br from-pink-500 to-pink-600 text-white",
        green: "bg-gradient-to-br from-green-500 to-green-600 text-white",
        orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
        red: "bg-gradient-to-br from-red-500 to-red-600 text-white",
        yellow: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white",
        indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white",
        cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white",
        teal: "bg-gradient-to-br from-teal-500 to-teal-600 text-white",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface AvatarLetterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarLetterVariants> {
  name: string
  fallbackInitials?: string
  autoColor?: boolean
}

// 颜色映射函数，根据名称自动选择颜色
function getColorVariant(name: string): VariantProps<typeof avatarLetterVariants>["variant"] {
  const colorVariants = [
    "default", "purple", "pink", "green", "orange", "red", 
    "yellow", "indigo", "cyan", "teal"
  ] as const
  
  // 使用名称的字符码之和来确定颜色
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colorVariants[hash % colorVariants.length]
}

// 判断是否为中文字符
function isChinese(char: string): boolean {
  return /[\u4e00-\u9fff]/.test(char)
}

// 获取首字母或首字
function getInitials(name: string): string {
  if (!name) return "?"
  
  const trimmedName = name.trim()
  const words = trimmedName.split(/\s+/)
  
  if (words.length === 1) {
    const word = words[0]
    const firstChar = word.charAt(0)
    
    // 如果首字符是中文，返回首个汉字
    if (isChinese(firstChar)) {
      return firstChar
    }
    
    // 如果是英文，取前两个字符
    return word.slice(0, 2).toUpperCase()
  }
  
  // 多个词的情况
  return words
    .slice(0, 2)
    .map(word => {
      const firstChar = word.charAt(0)
      // 中文直接返回首字，英文转大写
      return isChinese(firstChar) ? firstChar : firstChar.toUpperCase()
    })
    .join('')
}

const AvatarLetter = React.forwardRef<HTMLDivElement, AvatarLetterProps>(
  ({ className, name, fallbackInitials, autoColor = true, variant, size, ...props }, ref) => {
    const initials = fallbackInitials || getInitials(name)
    const colorVariant = autoColor ? getColorVariant(name) : variant

    return (
      <div
        ref={ref}
        className={cn(avatarLetterVariants({ size, variant: colorVariant }), className)}
        title={name}
        {...props}
      >
        <span className="leading-none tracking-tight">
          {initials}
        </span>
      </div>
    )
  }
)
AvatarLetter.displayName = "AvatarLetter"

export { AvatarLetter, avatarLetterVariants }