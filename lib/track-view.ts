/**
 * 客户端浏览量追踪工具
 * 通过API路由调用，避免客户端直接使用写权限token
 */

export async function trackView(
  contentType: 'ai-tools' | 'edu-resources' | 'news-articles', 
  contentId: string | number
): Promise<boolean> {
  try {
    const response = await fetch('/api/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType,
        contentId: contentId.toString()
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.success === true;
    } else {
      console.error('Failed to track view:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error tracking view:', error);
    return false;
  }
}