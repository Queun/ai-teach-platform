"use client"

import { useState } from "react"
import { useComments } from "@/hooks/useInteraction"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface CommentSectionProps {
  targetType: 'ai-tool' | 'edu-resource' | 'news-article'
  targetId: string
  showTitle?: boolean
  className?: string
}

export function CommentSection({ 
  targetType, 
  targetId, 
  showTitle = true, 
  className = "" 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false) // 新增状态

  const {
    comments,
    loading,
    hasMore,
    stats,
    isAuthenticated,
    user,
    createComment,
    loadMore,
    toggleCommentLike,
    userCommentLikes,
    creating
  } = useComments({ targetType, targetId })

  // 处理发表新评论
  const handleSubmitComment = async () => {
    if (!newComment.trim() || creating) return
    
    const success = await createComment(newComment.trim())
    if (success) {
      setNewComment("")
      // 显示提交成功消息
      setShowSubmissionMessage(true)
      setTimeout(() => setShowSubmissionMessage(false), 5000) // 5秒后隐藏消息
    }
  }

  // 处理回复评论
  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || creating) return
    
    const success = await createComment(replyContent.trim(), parentId)
    if (success) {
      setReplyContent("")
      setReplyingTo(null)
      // 显示提交成功消息
      setShowSubmissionMessage(true)
      setTimeout(() => setShowSubmissionMessage(false), 5000) // 5秒后隐藏消息
    }
  }

  // 格式化时间
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: zhCN 
      })
    } catch {
      return "刚刚"
    }
  }

  // 切换评论展开/折叠
  const toggleCommentExpansion = (commentId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  // 渲染单个评论
  const renderComment = (comment: any, isReply = false) => {
    // 修复：更灵活的用户数据访问路径
    const userData = comment.attributes?.users_permissions_user?.data?.attributes || 
                    comment.users_permissions_user?.data?.attributes ||
                    comment.attributes?.user?.data?.attributes ||
                    comment.user?.data?.attributes ||
                    comment.attributes?.author ||
                    comment.author ||
                    comment.user ||
                    comment.attributes?.users_permissions_user ||
                    comment.users_permissions_user
    
    // 修复：确保commentData包含所有字段，包括replies
    const commentData = {
      ...(comment.attributes || comment),
      replies: comment.replies || comment.attributes?.replies // 确保replies字段存在
    }
    const commentId = comment.documentId || comment.id
    
    // 防护措施：确保commentId存在
    if (!commentId) {
      console.warn('Comment missing ID:', comment)
      return null
    }
    
    // 调试日志：帮助诊断用户数据问题
    if (!userData?.username) {
      console.warn('Comment user data:', { comment, userData })
    }
    
    const isLiked = (userCommentLikes && commentId) ? userCommentLikes[commentId] || false : false
    
    // 🔥 修复：replies数据已经在顶级，不需要通过.data访问
    const repliesArray = commentData.replies || []
    const hasReplies = Array.isArray(repliesArray) && repliesArray.length > 0
    const isExpanded = expandedComments.has(commentId) // 移除默认展开，恢复正常折叠逻辑
    
    // 智能回复显示：如果回复超过3条，只显示点赞最多的3条
    const maxVisibleReplies = 3
    const shouldLimitReplies = repliesArray.length > maxVisibleReplies
    let visibleReplies = repliesArray
    let hiddenRepliesCount = 0
    
    if (shouldLimitReplies && !isExpanded) {
      // 按点赞数降序，然后按创建时间降序排序，取前3条
      visibleReplies = [...repliesArray]
        .sort((a, b) => {
          const aLikes = (a.likesCount || a.attributes?.likesCount || 0);
          const bLikes = (b.likesCount || b.attributes?.likesCount || 0);
          
          if (aLikes !== bLikes) {
            return bLikes - aLikes; // 点赞数降序
          }
          
          // 点赞数相同时按创建时间降序
          const aTime = new Date(a.createdAt || a.attributes?.createdAt).getTime();
          const bTime = new Date(b.createdAt || b.attributes?.createdAt).getTime();
          return bTime - aTime;
        })
        .slice(0, maxVisibleReplies)
      hiddenRepliesCount = repliesArray.length - maxVisibleReplies
    } else if (isExpanded) {
      // 展开状态下，对所有回复进行排序
      visibleReplies = [...repliesArray].sort((a, b) => {
        const aLikes = (a.likesCount || a.attributes?.likesCount || 0);
        const bLikes = (b.likesCount || b.attributes?.likesCount || 0);
        
        if (aLikes !== bLikes) {
          return bLikes - aLikes; // 点赞数降序
        }
        
        // 点赞数相同时按创建时间降序
        const aTime = new Date(a.createdAt || a.attributes?.createdAt).getTime();
        const bTime = new Date(b.createdAt || b.attributes?.createdAt).getTime();
        return bTime - aTime;
      });
    }

    return (
      <div key={commentId} className={`${isReply ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}>
        <div className="flex gap-3 sm:gap-4">
          <SmartAvatar 
            name={userData?.username || userData?.name || '匿名用户'} 
            src={userData?.avatar?.url || userData?.avatar || (userData?.photo ? userData.photo?.url : null)}
            size={isReply ? "sm" : "default"}
            className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} flex-shrink-0`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <span className="font-medium text-sm sm:text-base">
                {userData?.username || userData?.name || '匿名用户'}
              </span>
              {userData?.confirmed && (
                <Badge variant="outline" className="text-xs w-fit">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  已验证
                </Badge>
              )}
              <span className="text-xs sm:text-sm text-gray-500">
                {formatTime(commentData.createdAt)}
              </span>
            </div>
            
            <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
              {commentData.content}
            </p>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCommentLike(commentId)}
                disabled={!isAuthenticated}
                className={`flex items-center gap-1 text-xs sm:text-sm h-8 transition-colors ${
                  isLiked ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                有用 ({commentData.likesCount || 0})
              </Button>
              
              {!isReply && isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs sm:text-sm h-8"
                  onClick={() => setReplyingTo(replyingTo === commentId ? null : commentId)}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  回复
                </Button>
              )}

              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCommentExpansion(commentId)}
                  className="text-xs sm:text-sm h-8 text-blue-600"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      收起回复
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      {shouldLimitReplies 
                        ? `查看全部 ${repliesArray.length} 条回复`
                        : `查看回复 (${repliesArray.length})`
                      }
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* 回复输入框 */}
            {replyingTo === commentId && (
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder={`回复 ${userData?.username || userData?.name || '匿名用户'}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(commentId)}
                    disabled={!replyContent.trim() || creating}
                    className="text-sm"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    {creating ? '发表中...' : '发表回复'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyContent("")
                    }}
                    className="text-sm"
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 嵌套回复 */}
            {hasReplies && (
              <div className="mt-4 space-y-4">
                {/* 如果未展开且有限制，显示热门回复 */}
                {!isExpanded && shouldLimitReplies && (
                  <div className="text-xs text-gray-500 mb-2 pl-2">
                    显示最热门的 {maxVisibleReplies} 条回复
                  </div>
                )}
                
                {/* 渲染可见的回复 */}
                {(isExpanded ? repliesArray : visibleReplies).map((reply: any) => 
                  renderComment(reply, true)
                )}
                
                {/* 如果有隐藏的回复，显示提示 */}
                {!isExpanded && hiddenRepliesCount > 0 && (
                  <div className="text-xs text-gray-400 pl-2 italic">
                    还有 {hiddenRepliesCount} 条回复未显示
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageSquare className="w-5 h-5" />
            用户评价 ({stats.commentsCount || comments.length || 0})
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* 发表评论 */}
        {isAuthenticated ? (
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="comment" className="text-sm sm:text-base">
              发表评论
            </Label>
            <Textarea
              id="comment"
              placeholder="写下您的想法..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
            />
            <Button 
              className="flex items-center gap-2 w-full sm:w-auto" 
              size="sm"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || creating}
            >
              <Send className="w-4 h-4" />
              {creating ? '发表中...' : '发表评论'}
            </Button>
            
            {/* 提交成功提示 */}
            {showSubmissionMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>评论已提交，正在等待审核通过后显示</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">请登录后参与评论</p>
          </div>
        )}

        {comments.length > 0 && <Separator />}

        {/* 评论列表 */}
        {loading && comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">加载评论中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base">暂无评论</p>
            <p className="text-sm mt-2">来发表第一条评论吧！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map(comment => renderComment(comment))}
            
            {/* 加载更多 */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                  className="text-sm"
                >
                  {loading ? '加载中...' : '加载更多评论'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}