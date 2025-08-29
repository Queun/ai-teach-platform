/**
 * 简单的HTTP API数据同步脚本
 * 将旧的 likes 字段数据同步到新的 likesCount 字段
 * 
 * 运行前请确保：
 * 1. Strapi 服务正在运行 (npm run develop)
 * 2. API 端口为 1337
 */

async function syncResourceStats() {
  console.log('🚀 开始同步教育资源统计数据...');

  try {
    // 获取教育资源数据
    const response = await fetch('http://localhost:1337/api/edu-resources?pagination[limit]=100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('❌ 没有找到教育资源数据');
      return;
    }

    console.log(`📚 找到 ${data.data.length} 个教育资源需要检查`);

    let updatedCount = 0;

    for (const resource of data.data) {
      const attrs = resource.attributes;
      
      // 检查是否需要更新
      const needsUpdate = 
        attrs.likesCount === null || 
        attrs.favoritesCount === null || 
        attrs.commentsCount === null;

      if (needsUpdate) {
        // 构建更新数据
        const updateData = {
          data: {
            likesCount: attrs.likesCount !== null ? attrs.likesCount : (attrs.likes || 0),
            favoritesCount: attrs.favoritesCount !== null ? attrs.favoritesCount : 0,
            commentsCount: attrs.commentsCount !== null ? attrs.commentsCount : 0,
          }
        };

        // 更新资源
        const updateResponse = await fetch(`http://localhost:1337/api/edu-resources/${resource.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
          updatedCount++;
          const oldLikes = attrs.likes || 0;
          const newLikes = updateData.data.likesCount;
          console.log(`✅ 已同步: ${attrs.title} (ID: ${resource.id}) - 点赞数: ${oldLikes} → ${newLikes}`);
        } else {
          const errorText = await updateResponse.text();
          console.error(`❌ 同步失败: ${attrs.title} (ID: ${resource.id}) - 错误: ${errorText}`);
        }

        // 添加小延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`\n🎉 同步完成！`);
    console.log(`📊 总计更新: ${updatedCount}/${data.data.length} 个教育资源条目`);
    
    if (updatedCount > 0) {
      console.log(`\n💡 建议：请刷新前端页面查看更新后的点赞数据`);
    }

  } catch (error) {
    console.error('❌ 数据同步失败:', error.message);
    
    console.log('\n💡 排查步骤:');
    console.log('1. 检查 Strapi 是否正在运行 (访问 http://localhost:1337)');
    console.log('2. 确认 API 端点是否可访问');
    console.log('3. 检查网络连接');
  }
}

// 如果是直接运行此脚本
if (typeof window === 'undefined' && typeof require !== 'undefined') {
  // Node.js 环境
  const fetch = require('node-fetch');
  global.fetch = fetch;
  
  syncResourceStats()
    .then(() => {
      console.log('\n✅ 脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

// 也可以在浏览器控制台中运行
if (typeof window !== 'undefined') {
  console.log('🔧 可以在浏览器控制台运行 syncResourceStats() 函数');
}