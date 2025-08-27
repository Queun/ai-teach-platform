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

// 测试真实的ChatGPT数据
async function testRealChatGPTData() {
  console.log('🔍 测试真实ChatGPT数据...');
  
  try {
    const chatGPTData = {
      data: {
        name: "ChatGPT",
        description: [
          {
            type: "paragraph",
            children: [
              {
                text: "ChatGPT是由OpenAI开发的先进语言模型，基于GPT架构构建。它能够进行自然对话、回答问题、协助写作、代码编程、数据分析等多种任务。在教育领域，ChatGPT可以作为智能助教，帮助学生解答疑问、提供学习建议、批改作业、生成教学内容等。"
              }
            ]
          }
        ],
        shortDesc: "OpenAI开发的强大对话式AI助手，支持教学问答、内容生成、代码编程等多种教育应用场景",
        category: "对话助手",
        tags: ["对话AI", "教学助手", "内容生成", "问答系统", "OpenAI"],
        difficulty: "初级",
        officialUrl: "https://chat.openai.com",
        tutorialUrl: "https://help.openai.com/en/collections/3742473-chatgpt",
        rating: 4.8,
        userRating: 4.7,
        popularity: 950,
        features: [
          "自然语言对话",
          "多语言支持",
          "代码生成和调试",
          "文档写作辅助",
          "数据分析协助",
          "创意内容生成"
        ],
        pros: [
          "回答准确度高",
          "支持多种语言",
          "界面简洁易用",
          "响应速度快",
          "免费版本可用"
        ],
        cons: [
          "知识截止时间限制",
          "可能生成不准确信息",
          "高峰期访问受限",
          "付费功能较多"
        ],
        pricing: "免费版 + GPT-4订阅 $20/月",
        platforms: ["网页版", "iOS", "Android"],
        quickStart: [
          {
            type: "paragraph",
            children: [
              {
                text: "1. 访问chat.openai.com注册账号\n2. 在对话框中输入你的问题或需求\n3. ChatGPT会即时回复并提供帮助\n4. 可以继续追问以获得更详细的解答"
              }
            ]
          }
        ],
        detailedGuide: [
          {
            type: "paragraph",
            children: [
              {
                text: "教育应用指南：\n\n**课堂教学**\n- 生成教案和课程大纲\n- 创建练习题和测验\n- 解答学生疑问\n\n**作业批改**\n- 检查语法和拼写\n- 提供写作建议\n- 评估论文质量\n\n**个性化学习**\n- 根据学生水平调整解释\n- 提供额外学习资源\n- 制定学习计划"
              }
            ]
          }
        ],
        useCases: [
          "智能答疑系统",
          "作业辅导助手",
          "教案内容生成",
          "学习计划制定",
          "语言学习练习",
          "编程教学辅助"
        ],
        isRecommended: true,
        isFeatured: true,
        sortOrder: 1,
        seoTitle: "ChatGPT - 教育领域最受欢迎的AI对话助手",
        seoDescription: "了解ChatGPT在教育中的应用，包括智能答疑、作业辅导、教案生成等功能。免费开始使用OpenAI的先进AI技术。",
        developer: "OpenAI"
      }
    };

    console.log('正在发送数据到 Strapi...');
    const response = await strapiAPI.post('/ai-tools', chatGPTData);
    console.log('✅ ChatGPT数据导入成功:', response.data.data.id);
    
    // 删除测试数据
    await strapiAPI.delete(`/ai-tools/${response.data.data.id}`);
    console.log('🗑️ 测试数据已清理');
    
  } catch (error) {
    console.error('❌ ChatGPT数据导入失败:');
    
    if (error.response?.data?.error?.details?.errors) {
      console.error('\n详细验证错误:');
      error.response.data.error.details.errors.forEach((err, index) => {
        console.error(`  ${index + 1}. 字段: ${err.path.join('.')} - ${err.message}`);
      });
    } else if (error.response?.data?.error) {
      console.error('\n错误详情:', JSON.stringify(error.response.data.error, null, 2));
    } else {
      console.error('\n错误:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 开始测试真实数据导入...\n');
  
  // 检查连接
  try {
    await strapiAPI.get('/upload/files');
    console.log('✅ Strapi 连接正常\n');
  } catch (error) {
    console.error('❌ Strapi 连接失败:', error.message);
    return;
  }
  
  await testRealChatGPTData();
  
  console.log('\n🎉 测试完成');
}

if (require.main === module) {
  main();
}