"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarLetter } from "@/components/ui/avatar-letter"
import { cn } from "@/lib/utils"
import * as React from "react"

interface SmartAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  src?: string | null
  alt?: string
  size?: "sm" | "default" | "lg" | "xl" | "2xl"
  showFallback?: boolean
  autoColor?: boolean
}

const SmartAvatar = React.forwardRef<HTMLDivElement, SmartAvatarProps>(
  ({ 
    className, 
    name, 
    src, 
    alt, 
    size = "default", 
    showFallback = true, 
    autoColor = true,
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    
    // 如果有图片地址且图片加载成功，显示真实头像
    if (src && !imageError) {
      return (
        <Avatar 
          ref={ref} 
          className={cn(
            size === "sm" && "h-8 w-8",
            size === "default" && "h-10 w-10",
            size === "lg" && "h-12 w-12", 
            size === "xl" && "h-16 w-16",
            size === "2xl" && "h-20 w-20",
            className
          )} 
          {...props}
        >
          <AvatarImage 
            src={src} 
            alt={alt || name}
            onError={() => setImageError(true)}
          />
          <AvatarFallback>
            {showFallback ? (
              <AvatarLetter 
                name={name} 
                size={size} 
                autoColor={autoColor}
                className="h-full w-full"
              />
            ) : null}
          </AvatarFallback>
        </Avatar>
      )
    }

    // 否则显示首字母头像
    return (
      <AvatarLetter
        ref={ref}
        name={name}
        size={size}
        autoColor={autoColor}
        className={className}
        {...props}
      />
    )
  }
)
SmartAvatar.displayName = "SmartAvatar"

export { SmartAvatar }