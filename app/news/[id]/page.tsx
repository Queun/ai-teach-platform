"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Eye, Heart, Share2, Bookmark, MessageSquare, ArrowLeft, ThumbsUp, Send } from "lucide-react"

export default function NewsDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [comment, setComment] = useState("")

  // 模拟文章数据
  const articles = {
    "1": {
      id: 1,
      title: "教育部发布AI教育新政策，鼓励中小学引入AI课程",
      content: `教育部近日发布新政策，鼓励全国中小学校积极引入人工智能相关课程，培养学生的AI素养和创新能力。该政策明确提出，到2025年，全国50%以上的中小学校应开设AI相关课程，并将AI教育纳入学校信息化建设的重要内容。

## 政策要点

### 1. 课程设置要求
政策要求各地教育部门结合本地实际情况，制定AI教育课程实施方案。课程内容应包括：
- AI基础知识普及
- 编程思维培养
- 数据分析能力训练
- AI伦理教育

### 2. 师资培训计划
为确保政策有效实施，教育部将启动大规模的教师培训计划：
- 每年培训10万名AI教育师资
- 建立AI教育名师工作室
- 开展线上线下混合式培训

### 3. 资源建设支持
政策还强调要加强AI教育资源建设：
- 开发适合中小学生的AI教育教材
- 建设AI教育实验室
- 提供在线学习平台

## 专家解读

北京师范大学教育技术学院院长李明教授表示："这一政策的出台，标志着我国AI教育进入了新阶段。通过系统性的课程设置和师资培训，将有力推动AI教育的普及和发展。"

中国教育科学研究院研究员张华博士认为："AI教育不仅要教授技术知识，更要培养学生的创新思维和批判性思维。这对于培养未来AI人才具有重要意义。"

## 实施时间表

根据政策安排，AI教育推广将分三个阶段进行：

**第一阶段（2024年）：** 试点推广
- 在100所学校开展试点
- 完成首批师资培训
- 开发基础教学资源

**第二阶段（2025年）：** 全面推广
- 50%以上中小学开设AI课程
- 建立评估体系
- 完善教学资源

**第三阶段（2026年及以后）：** 深化发展
- 实现AI教育全覆盖
- 建立长效机制
- 国际交流合作

## 社会反响

政策发布后，得到了教育界和社会各界的广泛关注和积极响应。多所学校表示将积极参与试点工作，为AI教育的推广贡献力量。

家长们对此政策也表示支持，认为这将有助于孩子们更好地适应未来社会的发展需要。

## 结语

AI教育政策的出台，为我国教育现代化注入了新的活力。相信在政府、学校、教师和社会各界的共同努力下，AI教育将在中小学校园中生根发芽，为培养具有创新精神和实践能力的新时代人才奠定坚实基础。`,
      category: "政策动态",
      author: {
        name: "教育政策研究中心",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "专注教育政策研究与解读",
      },
      date: "2024-05-28",
      views: 3560,
      likes: 128,
      comments: 45,
      bookmarks: 89,
      image: "/placeholder.svg?height=400&width=800",
      tags: ["教育政策", "AI课程", "中小学教育", "师资培训"],
    },
    "2": {
      id: 2,
      title: "2024年AI教育工具排行榜发布，这些工具最受教师欢迎",
      content: `近日，国内权威教育科技评测机构发布了2024年AI教育工具排行榜，多款创新工具因其易用性和教学效果获得教师高度评价。

## 排行榜前十名

### 1. 智能批改助手"批批通"
**评分：9.2/10**
- 支持多学科作业批改
- 智能错误分析和建议
- 个性化学习报告生成

### 2. 个性化学习路径生成器"学习规划师"
**评分：9.0/10**
- 基于学生能力的路径规划
- 实时学习进度跟踪
- 智能推荐学习资源

### 3. AI互动课堂工具"课堂伙伴"
**评分：8.9/10**
- 实时课堂互动
- 学生参与度分析
- 智能问答系统

### 4. 语言学习助手"AI外教"
**评分：8.7/10**
- 口语练习和纠音
- 写作辅导和修改
- 多语言支持

### 5. 数学解题助手"数学大师"
**评分：8.6/10**
- 步骤化解题过程
- 多种解法展示
- 知识点关联分析

## 教师使用情况调查

本次调查覆盖全国31个省市的5000名教师，结果显示：

- **70%** 的教师已在日常教学中使用AI工具
- **85%** 的教师认为AI工具提高了教学效率
- **78%** 的教师表示学生对AI辅助学习表现出浓厚兴趣

### 各学科使用率排名：
1. 语文教学：82%
2. 英语教学：79%
3. 数学教学：75%
4. 科学教学：68%
5. 其他学科：45%

## 专家点评

教育技术专家王教授表示："这些工具的共同特点是操作简单、功能实用、与教学场景结合紧密。它们不是要替代教师，而是要成为教师的得力助手。"

## 使用建议

### 对于新手教师：
- 从简单工具开始，如批改助手
- 参加相关培训课程
- 与有经验的同事交流

### 对于有经验的教师：
- 尝试组合使用多种工具
- 探索工具的高级功能
- 分享使用经验和技巧

## 未来趋势

报告预测，未来AI教育工具将呈现以下发展趋势：
- 更加智能化和个性化
- 跨平台整合能力增强
- 数据分析功能更加完善
- 与教学管理系统深度融合`,
      category: "工具评测",
      author: {
        name: "教育科技评测中心",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "专业的教育科技产品评测机构",
      },
      date: "2024-05-25",
      views: 2890,
      likes: 95,
      comments: 32,
      bookmarks: 67,
      image: "/placeholder.svg?height=400&width=800",
      tags: ["AI工具", "教育科技", "工具评测", "教学效率"],
    },
    "3": {
      id: 3,
      title: "AI如何改变语言教学？一线教师分享成功经验",
      content: `来自北京市实验中学的王老师分享了她在英语教学中应用AI工具的成功经验，学生的口语和写作能力显著提升。

## 王老师的AI教学实践

### 背景介绍
王明老师，从教15年，现任北京市实验中学高二英语教师。去年开始在班级中引入AI工具辅助教学，经过一年的实践，取得了显著成效。

### 三大应用场景

#### 1. AI语音助手进行口语练习
**使用工具：** AI外教口语练习系统
**应用方式：**
- 课前预习：学生使用AI进行发音练习
- 课堂互动：AI实时纠正发音错误
- 课后巩固：个性化口语作业布置

**效果：** 班级口语平均分提高12分

#### 2. AI写作助手提供个性化反馈
**使用工具：** 智能写作批改系统
**应用方式：**
- 实时语法检查
- 词汇使用建议
- 文章结构优化
- 个性化改进建议

**效果：** 写作平均分提高15分

#### 3. AI生成多样化阅读材料
**使用工具：** 智能内容生成器
**应用方式：**
- 根据学生水平生成阅读材料
- 创建个性化练习题
- 制作多媒体学习内容

**效果：** 阅读理解能力显著提升

## 学生反馈

### 积极反馈：
- "AI老师24小时在线，随时可以练习口语"
- "写作错误能立即得到纠正，进步很快"
- "个性化的学习内容让我更有兴趣"

### 初期挑战：
- 部分学生对AI工具有抵触情绪
- 担心过度依赖AI影响独立思考
- 需要时间适应新的学习方式

## 解决方案

### 1. 正确引导学生认知
王老师强调："AI是工具，不是老师的替代品。我们要学会正确使用这些工具，而不是依赖它们。"

### 2. 建立使用规范
- 明确AI工具的使用场景
- 设置使用时间限制
- 鼓励独立思考和创作

### 3. 循序渐进的引入
- 从简单功能开始
- 逐步增加使用频率
- 定期评估使用效果

## 教学成果

经过一学期的实践：
- 班级英语平均成绩提高15分
- 学生学习积极性明显增强
- 课堂参与度提升30%
- 作业完成质量显著改善

## 经验总结

### 成功要素：
1. **教师主导：** AI是辅助工具，教师仍是教学的主导者
2. **个性化应用：** 根据学生特点选择合适的AI工具
3. **持续优化：** 根据使用效果不断调整教学策略

### 注意事项：
1. **避免过度依赖：** 培养学生独立思考能力
2. **保护隐私：** 注意学生数据安全
3. **平衡发展：** 技术与人文并重

## 对其他教师的建议

1. **从小处着手：** 选择一个简单的AI工具开始
2. **多学习交流：** 参加相关培训和研讨会
3. **保持开放心态：** 拥抱新技术，但不盲从
4. **关注学生反馈：** 及时调整教学策略

## 未来展望

王老师表示："AI技术在教育领域的应用还有很大潜力。我们要做的是找到技术与教育的最佳结合点，让AI真正服务于教学，服务于学生的成长。"

她计划在下学期进一步探索AI在项目式学习中的应用，希望能为学生提供更加丰富和个性化的学习体验。`,
      category: "教学案例",
      author: {
        name: "王明",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "北京市实验中学英语教师，AI教学实践者",
      },
      date: "2024-05-20",
      views: 2450,
      likes: 87,
      comments: 28,
      bookmarks: 56,
      image: "/placeholder.svg?height=400&width=800",
      tags: ["语言教学", "教学案例", "英语教育", "AI应用"],
    },
  }

  const article = articles[id as keyof typeof articles]

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
          <Button asChild>
            <Link href="/news">返回资讯列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  const comments = [
    {
      id: 1,
      author: "张老师",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "这个政策真的很及时，我们学校正在考虑引入AI课程，这给了我们很好的指导。",
      date: "2024-05-29",
      likes: 12,
    },
    {
      id: 2,
      author: "李教授",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "师资培训确实是关键，希望能有更多实用的培训课程。期待政策的具体实施细则。",
      date: "2024-05-29",
      likes: 8,
    },
    {
      id: 3,
      author: "王主任",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "我们学校已经开始准备了，计划明年就开设AI相关课程。感谢分享这么详细的政策解读！",
      date: "2024-05-28",
      likes: 15,
    },
  ]

  const relatedArticles = [
    {
      id: 4,
      title: "AI伦理教育成为热点，专家呼吁加强学生AI素养培养",
      category: "教育观点",
      date: "2024-05-18",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 5,
      title: "全国AI教育创新大赛启动，邀请中小学教师参与",
      category: "活动通知",
      date: "2024-05-15",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 6,
      title: "研究表明：AI辅助教学提高学生学习兴趣和成绩",
      category: "研究报告",
      date: "2024-05-10",
      image: "/placeholder.svg?height=150&width=200",
    },
  ]

  // 在组件内部添加这个简单的Markdown解析函数
  const parseSimpleMarkdown = (content: string) => {
    return (
      content
        // 处理标题
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-4 mt-8 text-gray-800">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-6 mt-8 text-gray-800">$1</h1>')

        // 处理粗体
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')

        // 处理列表项
        .replace(/^- (.*$)/gim, '<li class="mb-2 text-gray-700">$1</li>')

        // 处理段落（将连续的非标题、非列表行包装为段落）
        .split("\n\n")
        .map((paragraph) => {
          // 如果已经是HTML标签，直接返回
          if (paragraph.includes("<h") || paragraph.includes("<li") || paragraph.includes("<strong")) {
            return paragraph
          }
          // 如果是空行，跳过
          if (paragraph.trim() === "") {
            return ""
          }
          // 否则包装为段落
          return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraph.replace(/\n/g, "<br>")}</p>`
        })
        .join("\n")

        // 处理列表包装
        .replace(/(<li.*?<\/li>\s*)+/g, (match) => {
          return `<ul class="mb-6 ml-6 space-y-2 list-disc">${match}</ul>`
        })
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <Button variant="ghost" className="mb-4 sm:mb-6" asChild>
            <Link href="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回资讯列表
            </Link>
          </Button>

          {/* 文章头部 */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <Badge variant="secondary">{article.category}</Badge>
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold leading-tight mb-3 sm:mb-4">
                {article.title}
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm sm:text-base">{article.author.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{article.author.bio}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                    {article.views} 阅读
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* 文章图片 */}
          <div className="mb-6 sm:mb-8">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-8">
              <Card className="mb-6 sm:mb-8">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: parseSimpleMarkdown(article.content),
                    }}
                  />
                </CardContent>
              </Card>

              {/* 互动按钮 */}
              <Card className="mb-6 sm:mb-8">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <Button
                        variant={isLiked ? "default" : "outline"}
                        onClick={() => setIsLiked(!isLiked)}
                        className="flex items-center gap-2 text-sm"
                        size="sm"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                        {article.likes + (isLiked ? 1 : 0)} 点赞
                      </Button>
                      <Button
                        variant={isBookmarked ? "default" : "outline"}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className="flex items-center gap-2 text-sm"
                        size="sm"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                        {article.bookmarks + (isBookmarked ? 1 : 0)} 收藏
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 text-sm" size="sm">
                        <Share2 className="w-4 h-4" />
                        分享
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      {comments.length} 条评论
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 评论区 */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <MessageSquare className="w-5 h-5" />
                    评论 ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* 发表评论 */}
                  <div className="space-y-3 sm:space-y-4">
                    <Label htmlFor="comment" className="text-sm sm:text-base">
                      发表评论
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="写下您的想法..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                    />
                    <Button className="flex items-center gap-2 w-full sm:w-auto" size="sm">
                      <Send className="w-4 h-4" />
                      发表评论
                    </Button>
                  </div>

                  <Separator />

                  {/* 评论列表 */}
                  <div className="space-y-4 sm:space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 sm:gap-4">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                            <span className="font-medium text-sm sm:text-base">{comment.author}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">{comment.content}</p>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-xs sm:text-sm h-8"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8">
                              回复
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className="lg:col-span-4">
              <div className="sticky top-4 sm:top-8 space-y-4 sm:space-y-6">
                {/* 作者信息 */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">作者信息</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0">
                        <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{article.author.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 break-words leading-relaxed">
                          {article.author.bio}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-sm" size="sm">
                      关注作者
                    </Button>
                  </CardContent>
                </Card>

                {/* 相关文章 */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">相关文章</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    {relatedArticles.map((related) => (
                      <Link key={related.id} href={`/news/${related.id}`}>
                        <div className="group hover:bg-gray-50 p-2 sm:p-3 rounded-lg transition-colors cursor-pointer">
                          <div className="flex gap-3">
                            <img
                              src={related.image || "/placeholder.svg"}
                              alt={related.title}
                              className="w-16 sm:w-20 h-12 sm:h-16 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                                {related.title}
                              </h4>
                              <div className="flex flex-col gap-1">
                                <Badge variant="outline" className="text-xs w-fit">
                                  {related.category}
                                </Badge>
                                <span className="text-xs text-gray-500">{related.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* 热门标签 */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">热门标签</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {["AI教育", "教育政策", "教学案例", "工具评测", "教师发展"].map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-blue-50 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
