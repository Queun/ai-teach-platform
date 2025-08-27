const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Strapi 配置
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../data');
const aiToolsData = require(path.join(DATA_DIR, 'ai-tools.json'));
const eduResourcesData = require(path.join(DATA_DIR, 'edu-resources.json'));
const newsArticlesData = require(path.join(DATA_DIR, 'news-articles.json'));

// 尝试加载媒体映射文件
let mediaMap = {};
const mediaMapPath = path.join(DATA_DIR, 'media-map.json');
if (fs.existsSync(mediaMapPath)) {
  mediaMap = require(mediaMapPath);
}

// 创建 Strapi API 客户端
const strapiAPI = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 映射图片到媒体 ID
function mapImageToMediaId(imageName) {
  if (!imageName || !mediaMap[imageName]) {
    return null;
  }
  return mediaMap[imageName].id;
}

// 导入 AI 工具
async function importAITools() {
  console.log('\n🤖 开始导入 AI 工具数据...');
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < aiToolsData.length; i++) {
    const tool = aiToolsData[i];
    
    try {
      // 映射媒体文件
      const toolData = {
        data: {
          ...tool,
          // 根据工具名称映射图标
          icon: mapImageToMediaId(`${tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-icon`)
        }
      };

      const response = await strapiAPI.post('/ai-tools', toolData);
      console.log(`✅ 导入成功: ${tool.name} (ID: ${response.data.data.id})`);
      results.success++;
      
    } catch (error) {
      console.error(`❌ 导入失败: ${tool.name}`);
      console.error(`   错误: ${error.response?.data?.error?.message || error.message}`);
      results.failed++;
      results.errors.push({
        name: tool.name,
        error: error.response?.data?.error?.message || error.message
      });
    }

    // 添加延迟避免请求过快
    await delay(300);
  }

  console.log(`\n📊 AI工具导入完成: 成功 ${results.success}, 失败 ${results.failed}`);
  return results;
}

// 导入教育资源
async function importEduResources() {
  console.log('\n📚 开始导入教育资源数据...');
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < eduResourcesData.length; i++) {
    const resource = eduResourcesData[i];
    
    try {
      // 为每个资源分配封面图片
      const coverImages = [
        'ai-teaching-cover',
        'math-thinking-cover', 
        'physics-experiment-cover',
        'english-reading-cover',
        'project-learning-cover'
      ];
      const coverImage = coverImages[i % coverImages.length];

      // 为作者分配头像
      const avatars = [
        'teacher-avatar-1',
        'teacher-avatar-2', 
        'teacher-avatar-3',
        'teacher-avatar-4'
      ];
      const authorAvatar = avatars[i % avatars.length];

      const resourceData = {
        data: {
          ...resource,
          coverImage: mapImageToMediaId(coverImage),
          authorAvatar: mapImageToMediaId(authorAvatar)
        }
      };

      const response = await strapiAPI.post('/edu-resources', resourceData);
      console.log(`✅ 导入成功: ${resource.title} (ID: ${response.data.data.id})`);
      results.success++;
      
    } catch (error) {
      console.error(`❌ 导入失败: ${resource.title}`);
      console.error(`   错误: ${error.response?.data?.error?.message || error.message}`);
      results.failed++;
      results.errors.push({
        title: resource.title,
        error: error.response?.data?.error?.message || error.message
      });
    }

    await delay(300);
  }

  console.log(`\n📊 教育资源导入完成: 成功 ${results.success}, 失败 ${results.failed}`);
  return results;
}

// 导入新闻文章
async function importNewsArticles() {
  console.log('\n📰 开始导入新闻文章数据...');
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < newsArticlesData.length; i++) {
    const article = newsArticlesData[i];
    
    try {
      // 为热门新闻分配特色图片
      const featuredImages = [
        'gpt4-turbo-news',
        'ai-education-policy',
        'stanford-ai-platform',
        'chatgpt-classroom'
      ];
      
      let featuredImage = null;
      if (article.isFeatured || article.isBreaking) {
        featuredImage = featuredImages[i % featuredImages.length];
      }

      // 为作者分配头像
      const avatars = [
        'teacher-avatar-1',
        'teacher-avatar-2', 
        'teacher-avatar-3',
        'teacher-avatar-4'
      ];
      const authorAvatar = avatars[i % avatars.length];

      const articleData = {
        data: {
          ...article,
          featuredImage: mapImageToMediaId(featuredImage),
          authorAvatar: mapImageToMediaId(authorAvatar)
        }
      };

      const response = await strapiAPI.post('/news-articles', articleData);
      console.log(`✅ 导入成功: ${article.title} (ID: ${response.data.data.id})`);
      results.success++;
      
    } catch (error) {
      console.error(`❌ 导入失败: ${article.title}`);
      console.error(`   错误: ${error.response?.data?.error?.message || error.message}`);
      results.failed++;
      results.errors.push({
        title: article.title,
        error: error.response?.data?.error?.message || error.message
      });
    }

    await delay(300);
  }

  console.log(`\n📊 新闻文章导入完成: 成功 ${results.success}, 失败 ${results.failed}`);
  return results;
}

// 检查 Strapi 连接
async function checkStrapiConnection() {
  try {
    const response = await strapiAPI.get('/users-permissions/users/me');
    console.log('✅ Strapi 连接正常');
    return true;
  } catch (error) {
    console.error('❌ Strapi 连接失败:', error.message);
    console.log('\n请检查:');
    console.log('1. Strapi 服务是否运行: npm run develop');
    console.log('2. API_TOKEN 是否正确且有足够权限');
    console.log('3. 内容类型是否已创建 (ai-tools, edu-resources, news-articles)');
    return false;
  }
}

// 清除现有数据 (可选)
async function clearExistingData(contentType, force = false) {
  if (!force) {
    console.log(`⚠️  跳过清除 ${contentType} 数据 (使用 --force 参数强制清除)`);
    return;
  }

  try {
    console.log(`🗑️  正在清除 ${contentType} 现有数据...`);
    
    // 获取现有数据
    const response = await strapiAPI.get(`/${contentType}`);
    const existingItems = response.data.data;

    // 删除每个条目
    for (const item of existingItems) {
      await strapiAPI.delete(`/${contentType}/${item.id}`);
      await delay(100);
    }
    
    console.log(`✅ 已清除 ${existingItems.length} 条 ${contentType} 数据`);
  } catch (error) {
    console.log(`⚠️  清除 ${contentType} 数据时出错:`, error.message);
  }
}

// 主导入函数
async function importAllData(options = {}) {
  const { clearData = false } = options;
  
  console.log('🚀 开始批量导入数据到 Strapi...');
  console.log(`📍 目标地址: ${STRAPI_URL}`);
  
  // 检查连接
  if (!(await checkStrapiConnection())) {
    process.exit(1);
  }

  // 检查媒体文件
  if (Object.keys(mediaMap).length === 0) {
    console.log('⚠️  未找到媒体映射文件，将跳过图片关联');
    console.log('   请先运行: node upload-media.js');
  } else {
    console.log(`✅ 加载了 ${Object.keys(mediaMap).length} 个媒体文件映射`);
  }

  const overallResults = {
    aiTools: null,
    eduResources: null, 
    newsArticles: null,
    startTime: new Date(),
    endTime: null
  };

  try {
    // 可选：清除现有数据
    if (clearData) {
      await clearExistingData('ai-tools', true);
      await clearExistingData('edu-resources', true);
      await clearExistingData('news-articles', true);
    }

    // 导入各类数据
    overallResults.aiTools = await importAITools();
    overallResults.eduResources = await importEduResources();
    overallResults.newsArticles = await importNewsArticles();
    
    overallResults.endTime = new Date();
    
    // 打印总结报告
    console.log('\n' + '='.repeat(60));
    console.log('📋 批量导入完成报告');
    console.log('='.repeat(60));
    
    const totalSuccess = overallResults.aiTools.success + 
                        overallResults.eduResources.success + 
                        overallResults.newsArticles.success;
                        
    const totalFailed = overallResults.aiTools.failed + 
                       overallResults.eduResources.failed + 
                       overallResults.newsArticles.failed;

    console.log(`📊 总体统计:`);
    console.log(`   ✅ 成功导入: ${totalSuccess} 条`);
    console.log(`   ❌ 导入失败: ${totalFailed} 条`);
    console.log(`   ⏱️  用时: ${Math.round((overallResults.endTime - overallResults.startTime) / 1000)}秒`);
    
    console.log(`\n📋 分类统计:`);
    console.log(`   🤖 AI工具: ${overallResults.aiTools.success}/${overallResults.aiTools.success + overallResults.aiTools.failed}`);
    console.log(`   📚 教育资源: ${overallResults.eduResources.success}/${overallResults.eduResources.success + overallResults.eduResources.failed}`);
    console.log(`   📰 新闻文章: ${overallResults.newsArticles.success}/${overallResults.newsArticles.success + overallResults.newsArticles.failed}`);

    // 保存导入结果
    const resultFile = path.join(DATA_DIR, 'import-results.json');
    fs.writeFileSync(resultFile, JSON.stringify(overallResults, null, 2));
    console.log(`\n💾 详细结果已保存至: ${resultFile}`);

    if (totalFailed > 0) {
      console.log(`\n⚠️  有 ${totalFailed} 条数据导入失败，请检查错误详情`);
    }
    
  } catch (error) {
    console.error('\n💥 导入过程中出现严重错误:', error);
    process.exit(1);
  }
}

// 主函数
async function main() {
  try {
    if (!API_TOKEN) {
      console.error('❌ 错误: 请设置 STRAPI_API_TOKEN 环境变量');
      console.log('\n使用方法:');
      console.log('  STRAPI_API_TOKEN=your_token node import-data.js');
      console.log('  STRAPI_API_TOKEN=your_token node import-data.js --clear  # 清除现有数据');
      process.exit(1);
    }

    const clearData = process.argv.includes('--clear') || process.argv.includes('--force');
    
    if (clearData) {
      console.log('⚠️  警告: 将清除现有数据后重新导入');
    }

    await importAllData({ clearData });
    
    console.log('\n🎉 数据导入完成！');
    console.log('你现在可以访问 Strapi 管理面板查看导入的数据');
    console.log(`管理面板地址: ${STRAPI_URL}/admin`);
    
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { 
  importAITools, 
  importEduResources, 
  importNewsArticles, 
  importAllData 
};