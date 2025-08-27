const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const strapiAPI = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// 测试极简数据
async function testMinimalData() {
  console.log('🔍 测试极简AI工具数据...');
  
  try {
    // 最基础的数据结构
    const minimalTool = {
      data: {
        name: "测试工具",
        description: "这是一个测试工具",
        category: "AI写作"
      }
    };

    const response = await strapiAPI.post('/ai-tools', minimalTool);
    console.log('✅ 极简数据导入成功:', response.data.data.id);
    
    // 删除测试数据
    await strapiAPI.delete(`/ai-tools/${response.data.data.id}`);
    console.log('🗑️ 测试数据已清理');
    
  } catch (error) {
    console.error('❌ 极简数据导入失败:');
    if (error.response?.data?.error) {
      console.error('详细错误:', JSON.stringify(error.response.data.error, null, 2));
    } else {
      console.error('错误:', error.message);
    }
  }
}

// 测试稍微复杂的数据
async function testComplexData() {
  console.log('\n🔍 测试复杂数据...');
  
  try {
    const complexTool = {
      data: {
        name: "复杂测试工具",
        description: "这是一个复杂测试工具",
        shortDesc: "简短描述",
        category: "AI写作",
        tags: ["测试", "工具"],
        difficulty: "初级",
        officialUrl: "https://example.com",
        rating: 4.5,
        features: ["功能1", "功能2"],
        pricing: "免费"
      }
    };

    const response = await strapiAPI.post('/ai-tools', complexTool);
    console.log('✅ 复杂数据导入成功:', response.data.data.id);
    
    // 删除测试数据
    await strapiAPI.delete(`/ai-tools/${response.data.data.id}`);
    console.log('🗑️ 测试数据已清理');
    
  } catch (error) {
    console.error('❌ 复杂数据导入失败:');
    if (error.response?.data?.error) {
      console.error('详细错误:', JSON.stringify(error.response.data.error, null, 2));
    } else {
      console.error('错误:', error.message);
    }
  }
}

// 测试blocks格式数据
async function testBlocksData() {
  console.log('\n🔍 测试Blocks格式数据...');
  
  try {
    const blocksData = {
      data: {
        name: "Blocks测试工具",
        description: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "这是一个使用blocks格式的描述"
              }
            ]
          }
        ],
        category: "AI写作"
      }
    };

    const response = await strapiAPI.post('/ai-tools', blocksData);
    console.log('✅ Blocks数据导入成功:', response.data.data.id);
    
    // 删除测试数据
    await strapiAPI.delete(`/ai-tools/${response.data.data.id}`);
    console.log('🗑️ 测试数据已清理');
    
  } catch (error) {
    console.error('❌ Blocks数据导入失败:');
    if (error.response?.data?.error) {
      console.error('详细错误:', JSON.stringify(error.response.data.error, null, 2));
    } else {
      console.error('错误:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 开始调试数据导入问题...\n');
  
  // 检查连接
  try {
    await strapiAPI.get('/upload/files');
    console.log('✅ Strapi 连接正常\n');
  } catch (error) {
    console.error('❌ Strapi 连接失败:', error.message);
    return;
  }
  
  await testMinimalData();
  await testComplexData();
  await testBlocksData();
  
  console.log('\n🎉 调试完成');
}

if (require.main === module) {
  main();
}