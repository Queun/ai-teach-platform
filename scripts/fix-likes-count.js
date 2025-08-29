/**
 * 教育资源统计数据同步脚本
 * 将旧的 likes 字段数据同步到新的 likesCount 字段
 * 
 * 运行条件：
 * 1. Node.js 18+ (支持内置 fetch)
 * 2. Strapi 服务正在运行在 localhost:1337
 */

async function syncResourceStats() {
  console.log('🚀 开始同步教育资源统计数据...\n');

  const baseUrl = 'http://localhost:1337/api';

  try {
    // 首先测试API连接
    console.log('🔍 检查API连接...');
    const testResponse = await fetch(`${baseUrl}/edu-resources?pagination[limit]=1`);
    
    if (!testResponse.ok) {
      throw new Error(`API连接失败: ${testResponse.status} ${testResponse.statusText}`);
    }
    
    console.log('✅ API连接正常\n');

    // 获取所有教育资源数据
    console.log('📚 获取教育资源数据...');
    const response = await fetch(`${baseUrl}/edu-resources?pagination[limit]=100`);

    if (!response.ok) {
      throw new Error(`获取数据失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('❌ 没有找到教育资源数据');
      return;
    }

    console.log(`📊 找到 ${data.data.length} 个教育资源\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    // 处理每个资源
    for (let i = 0; i < data.data.length; i++) {
      const resource = data.data[i];
      const attrs = resource.attributes;
      
      console.log(`[${i + 1}/${data.data.length}] 处理: ${attrs.title}`);
      
      // 检查是否需要更新
      const needsUpdate = 
        attrs.likesCount === null || 
        attrs.favoritesCount === null || 
        attrs.commentsCount === null;

      if (needsUpdate) {
        // 构建更新数据 - 使用旧的 likes 字段作为 likesCount 的初始值
        const updateData = {
          data: {
            likesCount: attrs.likesCount !== null ? attrs.likesCount : (attrs.likes || 0),
            favoritesCount: attrs.favoritesCount !== null ? attrs.favoritesCount : 0,
            commentsCount: attrs.commentsCount !== null ? attrs.commentsCount : 0,
          }
        };

        console.log(`  📝 更新统计: likes ${attrs.likes || 0} → likesCount ${updateData.data.likesCount}`);

        // 更新资源
        const updateResponse = await fetch(`${baseUrl}/edu-resources/${resource.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
          updatedCount++;
          console.log(`  ✅ 更新成功\n`);
        } else {
          const errorText = await updateResponse.text();
          console.error(`  ❌ 更新失败: ${errorText}\n`);
        }

        // 添加延迟避免API请求过快
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        skippedCount++;
        console.log(`  ⏭️  已是最新数据，跳过\n`);
      }
    }
    
    // 输出总结
    console.log('=' .repeat(50));
    console.log('🎉 同步完成！');
    console.log(`📊 处理结果:`);
    console.log(`   - 总资源数: ${data.data.length}`);
    console.log(`   - 已更新: ${updatedCount}`);
    console.log(`   - 已跳过: ${skippedCount}`);
    console.log('=' .repeat(50));
    
    if (updatedCount > 0) {
      console.log('\n💡 请刷新前端页面查看更新后的点赞数据');
      console.log('🔄 如果前端仍显示0，可能需要清除浏览器缓存');
    }

  } catch (error) {
    console.error('\n❌ 同步过程中出现错误:');
    console.error(`   ${error.message}`);
    
    console.log('\n🔧 排查建议:');
    console.log('   1. 确保 Strapi 服务正在运行');
    console.log('   2. 访问 http://localhost:1337 检查服务状态');
    console.log('   3. 确认 API 端点可正常访问');
    console.log('   4. 检查防火墙和网络设置');
    
    throw error;
  }
}

// 主函数
async function main() {
  try {
    await syncResourceStats();
    console.log('\n✅ 脚本执行完成');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 脚本执行失败');
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}