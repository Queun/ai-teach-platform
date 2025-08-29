/**
 * 同步互动统计数据脚本
 * 将旧的 likes 字段数据同步到新的 likesCount, favoritesCount, commentsCount 字段
 * 
 * 使用方法：
 * 1. cd backend
 * 2. node ../scripts/sync-interaction-stats.js
 */

async function syncInteractionStats() {
  console.log('🚀 启动互动统计数据同步...');

  try {
    // 动态导入 Strapi 以确保在正确的环境中运行
    const strapi = require('./src/index.js');
    
    if (!strapi) {
      throw new Error('无法加载 Strapi 实例。请确保在 backend 目录中运行此脚本。');
    }

    console.log('✅ Strapi 实例已加载');

    // ===================
    // 使用直接的数据库查询方式
    // ===================
    
    console.log('\n📚 开始同步教育资源统计数据...');

    // 简化的HTTP API调用方式同步数据
    const fetch = require('node-fetch');
    const baseUrl = 'http://localhost:1337/api';
    
    // 获取教育资源数据
    const resourcesResponse = await fetch(`${baseUrl}/edu-resources?pagination[limit]=100&fields[0]=id&fields[1]=title&fields[2]=likes&fields[3]=likesCount&fields[4]=favoritesCount&fields[5]=commentsCount`);
    const resourcesData = await resourcesResponse.json();
    
    if (!resourcesData.data) {
      throw new Error('无法获取教育资源数据。请确保 Strapi 服务正在运行。');
    }

    console.log(`找到 ${resourcesData.data.length} 个教育资源需要检查`);

    let updatedResourcesCount = 0;
    for (const resource of resourcesData.data) {
      const attrs = resource.attributes;
      const needsUpdate = 
        attrs.likesCount === null || 
        attrs.favoritesCount === null || 
        attrs.commentsCount === null;

      if (needsUpdate) {
        const updateData = {
          data: {
            likesCount: attrs.likesCount !== null ? attrs.likesCount : (attrs.likes || 0),
            favoritesCount: attrs.favoritesCount !== null ? attrs.favoritesCount : 0,
            commentsCount: attrs.commentsCount !== null ? attrs.commentsCount : 0,
          }
        };

        const updateResponse = await fetch(`${baseUrl}/edu-resources/${resource.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
          updatedResourcesCount++;
          console.log(`✅ 已同步资源: ${attrs.title} (ID: ${resource.id})`);
        } else {
          console.error(`❌ 同步失败: ${attrs.title} (ID: ${resource.id})`);
        }
      }
    }
    
    console.log(`📚 教育资源同步完成: ${updatedResourcesCount}/${resourcesData.data.length} 个资源已更新`);

    console.log('\n🎉 数据同步完成！');
    console.log(`📊 总计更新: ${updatedResourcesCount} 个教育资源条目`);

  } catch (error) {
    console.error('❌ 数据同步失败:', error);
    console.error('详细错误信息:', error.message);
    
    // 提供解决方案建议
    console.log('\n💡 解决建议:');
    console.log('1. 确保 Strapi 后端服务正在运行 (npm run develop 或 npm start)');
    console.log('2. 确保在项目根目录运行此脚本');
    console.log('3. 检查网络连接和端口 1337 是否可访问');
    
    process.exit(1);
  }
}

// 运行同步脚本
if (require.main === module) {
  syncInteractionStats()
    .then(() => {
      console.log('✅ 脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { syncInteractionStats };