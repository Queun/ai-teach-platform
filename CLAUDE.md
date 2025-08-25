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