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

// 修复blocks格式的函数
function fixBlocksFormat(blocks) {
  if (!Array.isArray(blocks)) return blocks;
  
  return blocks.map(block => {
    if (block.children && Array.isArray(block.children)) {
      return {
        ...block,
        children: block.children.map(child => {
          if (child.text !== undefined && !child.type) {
            return {
              type: "text", // 添加缺失的type属性
              text: child.text
            };
          }
          return child;
        })
      };
    }
    return block;
  });
}

// 导入AI工具数据 (简化版，无媒体文件)
async function importAITools() {
  console.log('\n🤖 开始导入 AI 工具数据...');
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < Math.min(aiToolsData.length, 10); i++) { // 限制为前10个
    const tool = aiToolsData[i];
    
    try {
      // 简化的数据结构，只包含基础字段
      const toolData = {
        data: {
          name: tool.name,
          description: fixBlocksFormat(tool.description),
          shortDesc: tool.shortDesc,
          category: tool.category,
          tags: tool.tags,
          difficulty: tool.difficulty,
          officialUrl: tool.officialUrl,
          tutorialUrl: tool.tutorialUrl,
          rating: tool.rating || 0,
          userRating: tool.userRating || 0,
          popularity: tool.popularity || 0,
          features: tool.features,
          pros: tool.pros,
          cons: tool.cons,
          pricing: tool.pricing,
          platforms: tool.platforms,
          quickStart: fixBlocksFormat(tool.quickStart),
          detailedGuide: fixBlocksFormat(tool.detailedGuide),
          useCases: tool.useCases,
          isRecommended: tool.isRecommended || false,
          isFeatured: tool.isFeatured || false,
          sortOrder: tool.sortOrder || 0,
          seoTitle: tool.seoTitle,
          seoDescription: tool.seoDescription,
          customFields: tool.customFields,
          developer: tool.developer || "Unknown"
          // 不包含logo字段，前端使用首字母头像
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

    // 延迟避免请求过快
    await delay(300);
  }

  console.log(`\n📊 AI工具导入完成: 成功 ${results.success}, 失败 ${results.failed}`);
  return results;
}

// 导入教育资源数据 (简化版，无媒体文件)
async function importEduResources() {
  console.log('\n📚 开始导入教育资源数据...');
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < Math.min(eduResourcesData.length, 5); i++) { // 限制为前5个
    const resource = eduResourcesData[i];
    
    try {
      // 简化的数据结构，不包含媒体字段
      const resourceData = {
        data: {
          title: resource.title,
          content: fixBlocksFormat(resource.content),
          summary: resource.summary,
          category: resource.category,
          subject: resource.subject,
          gradeLevel: resource.gradeLevel,
          tags: resource.tags,
          authorName: resource.authorName,
          authorTitle: resource.authorTitle,
          authorSchool: resource.authorSchool,
          resourceType: resource.resourceType,
          difficulty: resource.difficulty,
          estimatedTime: resource.estimatedTime,
          videoUrl: resource.videoUrl,
          downloads: resource.downloads || 0,
          views: resource.views || 0,
          likes: resource.likes || 0,
          rating: resource.rating || 0,
          objectives: resource.objectives,
          prerequisites: resource.prerequisites,
          materials: resource.materials,
          isFeatured: resource.isFeatured || false,
          seoTitle: resource.seoTitle,
          seoDescription: resource.seoDescription,
          relatedTools: resource.relatedTools,
          feedback: resource.feedback,
          customFields: resource.customFields
          // 不包含coverImage和authorAvatar，前端使用首字母头像
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

// 导入新闻文章数据 (简化版，无媒体文件)
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
      // 简化的数据结构，不包含媒体字段
      const articleData = {
        data: {
          title: article.title,
          content: fixBlocksFormat(article.content),
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags,
          source: article.source,
          readTime: article.readTime,
          authorName: article.authorName,
          authorBio: article.authorBio,
          views: article.views || 0,
          shares: article.shares || 0,
          isBreaking: article.isBreaking || false,
          isFeatured: article.isFeatured || false,
          priority: article.priority || 1,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          slug: article.slug,
          relatedNews: article.relatedNews,
          keywords: article.keywords,
          customFields: article.customFields
          // 不包含featuredImage和authorAvatar，前端使用首字母头像
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
    const response = await strapiAPI.get('/upload/files');
    console.log('✅ Strapi 连接正常');
    return true;
  } catch (error) {
    console.error('❌ Strapi 连接失败:', error.message);
    console.log('\n请检查:');
    console.log('1. Strapi 服务是否运行: npm run develop');
    console.log('2. API_TOKEN 是否正确且有足够权限');
    return false;
  }
}

// 主导入函数
async function importAllData(options = {}) {
  const overallResults = {
    startTime: new Date(),
    aiTools: null,
    eduResources: null,
    newsArticles: null,
    endTime: null
  };

  console.log('🚀 开始批量导入数据到 Strapi...');
  console.log(`📍 目标地址: ${STRAPI_URL}`);
  
  // 检查连接
  if (!(await checkStrapiConnection())) {
    process.exit(1);
  }

  try {
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
    const resultFile = path.join(DATA_DIR, 'import-results-simple.json');
    fs.writeFileSync(resultFile, JSON.stringify(overallResults, null, 2));
    console.log(`\n💾 详细结果已保存至: ${resultFile}`);

    if (totalFailed > 0) {
      console.log(`\n⚠️  有 ${totalFailed} 条数据导入失败，请检查错误详情`);
    }

    console.log('\n🎉 数据导入完成！');
    console.log('你现在可以访问 Strapi 管理面板查看导入的数据');
    console.log(`管理面板地址: ${STRAPI_URL}/admin`);

  } catch (error) {
    console.error('导入过程中出现错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  importAllData();
}

module.exports = {
  importAITools, 
  importEduResources, 
  importNewsArticles, 
  importAllData 
};