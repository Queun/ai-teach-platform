import { strapiService } from '@/lib/strapi';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { contentType, contentId } = await request.json();

    // 验证参数
    const validTypes = ['ai-tools', 'edu-resources', 'news-articles'];
    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    // 使用服务端的全权限token增加浏览量
    const success = await strapiService.incrementViews(contentType, contentId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to increment views' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}