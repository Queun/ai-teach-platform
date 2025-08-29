/**
 * 初始化统计字段脚本
 * 将所有内容的 likesCount, favoritesCount, commentsCount 字段从 null 初始化为 0
 * 这样列表页面就不会显示 null 或空白
 */

async function initializeStatFields() {
  console.log('🚀 开始初始化统计字段...\n');

  const baseUrl = 'http://localhost:1337/api';

  try {
    // 测试API连接
    console.log('🔍 检查API连接...');
    const testResponse = await fetch(`${baseUrl}/edu-resources?pagination[limit]=1`);
    
    if (!testResponse.ok) {
      throw new Error(`API连接失败: ${testResponse.status} ${testResponse.statusText}`);
    }
    
    console.log('✅ API连接正常\n');

    // 处理教育资源
    console.log('📚 处理教育资源...');
    await initializeContentType('edu-resources', 'edu-resource');

    // 处理AI工具
    console.log('🤖 处理AI工具...');
    await initializeContentType('ai-tools', 'ai-tool');

    // 处理新闻文章  
    console.log('📰 处理新闻文章...');
    await initializeContentType('news-articles', 'news-article');

    console.log('\n🎉 初始化完成！');
    console.log('💡 现在所有内容的统计字段都已设置为 0，可以正常显示点赞数了');

  } catch (error) {
    console.error('\n❌ 初始化过程中出现错误:');
    console.error(`   ${error.message}`);
    throw error;
  }
}

async function initializeContentType(apiEndpoint, contentType) {
  const baseUrl = 'http://localhost:1337/api';
  
  try {
    // 获取所有内容
    const response = await fetch(`${baseUrl}/${apiEndpoint}?pagination[limit]=100`);
    
    if (!response.ok) {
      throw new Error(`获取 ${contentType} 数据失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log(`   ⏭️  没有找到 ${contentType} 数据，跳过\n`);
      return;
    }

    console.log(`   📊 找到 ${data.data.length} 个 ${contentType} 条目`);

    let updatedCount = 0;

    for (let i = 0; i < data.data.length; i++) {
      const item = data.data[i];
      const attrs = item.attributes || item; // 兼容不同的数据结构
      
      console.log(`   🔍 [${i + 1}/${data.data.length}] 检查: ${attrs.title || attrs.name || `ID:${item.id}`}`);
      console.log(`       当前值: likes=${attrs.likesCount}, favorites=${attrs.favoritesCount}, comments=${attrs.commentsCount}`);
      
      // 检查是否需要初始化（任何一个统计字段为 null 或 undefined）
      const needsInit = 
        attrs.likesCount === null || attrs.likesCount === undefined ||
        attrs.favoritesCount === null || attrs.favoritesCount === undefined ||
        attrs.commentsCount === null || attrs.commentsCount === undefined;

      if (needsInit) {
        const updateData = {
          data: {
            likesCount: (attrs.likesCount !== null && attrs.likesCount !== undefined) ? attrs.likesCount : 0,
            favoritesCount: (attrs.favoritesCount !== null && attrs.favoritesCount !== undefined) ? attrs.favoritesCount : 0,
            commentsCount: (attrs.commentsCount !== null && attrs.commentsCount !== undefined) ? attrs.commentsCount : 0,
          }
        };

        console.log(`       更新为: likes=${updateData.data.likesCount}, favorites=${updateData.data.favoritesCount}, comments=${updateData.data.commentsCount}`);

        const updateResponse = await fetch(`${baseUrl}/${apiEndpoint}/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
          updatedCount++;
          console.log(`       ✅ 更新成功`);
        } else {
          const errorText = await updateResponse.text();
          console.error(`       ❌ 更新失败: ${errorText}`);
        }

        // 添加延迟
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        console.log(`       ⏭️  已初始化，跳过`);
      }
      
      console.log(''); // 空行分隔
    }
    
    console.log(`   📈 ${contentType} 初始化完成: ${updatedCount}/${data.data.length} 个条目已更新\n`);
    
  } catch (error) {
    console.error(`   ❌ ${contentType} 初始化失败:`, error.message);
    throw error;
  }
}

// 主函数
async function main() {
  try {
    await initializeStatFields();
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