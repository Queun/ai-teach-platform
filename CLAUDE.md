# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 交流约定 (Communication Guidelines)

- 与用户交流时优先使用中文，保持亲切和易懂的沟通方式
- 在代码部分和技术文档中，当中文无法准确表达技术概念时，可以使用英文以确保准确性

## Development Commands

- `pnpm dev` - Start the Next.js development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run Next.js ESLint checks

## Environment Considerations

由于某些不可抗力，Claude Code实际运行在WSL中，而项目则在Windows磁盘中，这会导致直接执行编译效率很低。如果需要执行编译和重启服务器，可以交给用户来操作。

## Project Architecture

This is a Next.js 15 application using the App Router pattern with React 19. The project is an AI-powered educational platform called "爱教学" (AI Education Platform) targeting Chinese educational professionals.

### Key Structure

- **App Router**: Uses Next.js App Router (`app/` directory) with route groups for different sections
- **UI Components**: Built with shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **Theme**: Supports light/dark mode via `next-themes`
- **Typography**: Inter font loaded via Google Fonts

### Main Sections

- `/` - Landing page with hero, features, news, and resources sections
- `/auth/` - Authentication pages (login, register, forgot password, email verification)
- `/dashboard/` - User dashboard
- `/tools/` - AI tool directory with individual tool pages
- `/resources/` - Educational resource library
- `/community/` - Community features
- `/news/` - News and updates section
- `/about/` - About page

### Component Architecture

- `components/ui/` - Reusable UI primitives from shadcn/ui
- `components/layout/` - Layout components (Header, Footer)
- `components/theme-provider.tsx` - Theme context provider
- `hooks/` - Custom React hooks
- `lib/utils.ts` - Utility functions including cn() for class merging

### Configuration Notes

- TypeScript with strict mode enabled
- Path aliases configured (`@/*` maps to root)
- Next.js config ignores ESLint and TypeScript errors during builds
- Images are unoptimized (likely for static export)
- pnpm is used as the package manager

### Styling System

The project uses a sophisticated design system with:
- CSS custom properties for theming
- Extensive color palette with semantic naming
- Animation utilities for micro-interactions
- Responsive design patterns
- Gradient backgrounds and glass-morphism effects

### Development Notes

The application is designed as a comprehensive platform for educational professionals to discover, learn about, and use AI tools in their teaching practice. It features rich content sections, community elements, and detailed tool/resource directories.

## 项目状态概览

- ✅ **核心功能已完成**：用户系统、工具库、资源库、新闻模块、互动系统、Dashboard
- ✅ **技术架构稳定**：Next.js 15 + Strapi 5 + PostgreSQL + Docker
- ✅ **生产就绪状态**：完整的前后端数据流和用户体验

## 重要参考文档

当需要了解项目详细信息时，可主动查阅以下文档：

- **📊 项目状态文档**：`docs/project-status.md`
  - 完整的功能完成状态
  - 技术架构详情
  - 已知问题和解决方案
  - 性能指标和数据库状态

- **🎯 开发计划文档**：`docs/development-plan.md`
  - 3-6个月功能路线图
  - 里程碑和优先级规划
  - 商业化和运营策略
  - 团队和资源规划

- **🔧 技术参考文档**：
  - `docs/strapi5-development-notes.md` - Strapi 5 开发要点和常见问题
  - `docs/user-interaction-system.md` - 用户互动系统设计文档

- **📁 归档文档** (`docs/archive/`)：
  - `develop-roadmap.md` - 历史开发路线图
  - `strapi-content-types-reference.md` - 数据模型设计规范