const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Strapi 配置
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN; // 从环境变量获取

// 创建 media 目录结构
const mediaDir = path.join(__dirname, '../data/media');
const avatarsDir = path.join(mediaDir, 'avatars');
const coverImagesDir = path.join(mediaDir, 'cover-images');
const featuredImagesDir = path.join(mediaDir, 'featured-images');

// 创建必要的目录
[mediaDir, avatarsDir, coverImagesDir, featuredImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 生成占位图片的函数
function generatePlaceholderSVG(width, height, text, bgColor = '#3B82F6') {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${adjustColor(bgColor, -20)};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <text x="50%" y="50%" font-family="Inter, Arial, sans-serif" font-size="${Math.min(width, height) / 10}" 
          fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="600">${text}</text>
  </svg>`;
  return svg;
}

// 调整颜色亮度
function adjustColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// 上传文件到 Strapi
async function uploadToStrapi(filePath, fileName) {
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(filePath), fileName);

    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${API_TOKEN}`
      },
      timeout: 30000 // 30秒超时
    });

    return response.data[0];
  } catch (error) {
    console.error(`上传文件 ${fileName} 失败:`, error.response?.data?.message || error.message);
    
    // 如果是连接错误，等待一下再重试一次
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
      console.log(`等待5秒后重试上传 ${fileName}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      try {
        const retryFormData = new FormData();
        retryFormData.append('files', fs.createReadStream(filePath), fileName);
        
        const retryResponse = await axios.post(`${STRAPI_URL}/api/upload`, retryFormData, {
          headers: {
            ...retryFormData.getHeaders(),
            'Authorization': `Bearer ${API_TOKEN}`
          },
          timeout: 30000
        });
        
        console.log(`重试上传 ${fileName} 成功`);
        return retryResponse.data[0];
      } catch (retryError) {
        console.error(`重试上传 ${fileName} 仍然失败:`, retryError.message);
        return null;
      }
    }
    
    return null;
  }
}

// 生成和上传媒体文件
async function generateAndUploadMedia() {
  console.log('开始生成和上传媒体文件...');

  // 定义需要生成的图片类型
  const imageConfigs = [
    // AI工具图标
    { name: 'chatgpt-icon.svg', width: 400, height: 400, text: 'ChatGPT', bgColor: '#10A37F', type: 'icon' },
    { name: 'claude-icon.svg', width: 400, height: 400, text: 'Claude', bgColor: '#CC785C', type: 'icon' },
    { name: 'notion-icon.svg', width: 400, height: 400, text: 'Notion AI', bgColor: '#000000', type: 'icon' },
    { name: 'midjourney-icon.svg', width: 400, height: 400, text: 'MJ', bgColor: '#9333EA', type: 'icon' },
    { name: 'canva-icon.svg', width: 400, height: 400, text: 'Canva', bgColor: '#00C4CC', type: 'icon' },
    
    // 教育资源封面图
    { name: 'ai-teaching-cover.svg', width: 800, height: 450, text: 'AI教学创新', bgColor: '#2563EB', type: 'cover' },
    { name: 'math-thinking-cover.svg', width: 800, height: 450, text: '数学思维', bgColor: '#DC2626', type: 'cover' },
    { name: 'physics-experiment-cover.svg', width: 800, height: 450, text: '物理实验', bgColor: '#7C3AED', type: 'cover' },
    { name: 'english-reading-cover.svg', width: 800, height: 450, text: '英语阅读', bgColor: '#059669', type: 'cover' },
    { name: 'project-learning-cover.svg', width: 800, height: 450, text: '项目学习', bgColor: '#EA580C', type: 'cover' },
    
    // 新闻特色图片
    { name: 'gpt4-turbo-news.svg', width: 1200, height: 630, text: 'GPT-4 Turbo', bgColor: '#10A37F', type: 'featured' },
    { name: 'ai-education-policy.svg', width: 1200, height: 630, text: 'AI教育政策', bgColor: '#DC2626', type: 'featured' },
    { name: 'stanford-ai-platform.svg', width: 1200, height: 630, text: '斯坦福AI平台', bgColor: '#7C2D12', type: 'featured' },
    { name: 'chatgpt-classroom.svg', width: 1200, height: 630, text: 'ChatGPT课堂', bgColor: '#1E40AF', type: 'featured' },
    
    // 作者头像
    { name: 'teacher-avatar-1.svg', width: 200, height: 200, text: '张教授', bgColor: '#6366F1', type: 'avatar' },
    { name: 'teacher-avatar-2.svg', width: 200, height: 200, text: '李老师', bgColor: '#EC4899', type: 'avatar' },
    { name: 'teacher-avatar-3.svg', width: 200, height: 200, text: '王博士', bgColor: '#10B981', type: 'avatar' },
    { name: 'teacher-avatar-4.svg', width: 200, height: 200, text: '陈专家', bgColor: '#F59E0B', type: 'avatar' }
  ];

  const uploadedFiles = {};

  for (const config of imageConfigs) {
    // 生成 SVG 内容
    const svgContent = generatePlaceholderSVG(
      config.width, 
      config.height, 
      config.text, 
      config.bgColor
    );

    // 保存到本地
    let localDir;
    switch (config.type) {
      case 'avatar':
        localDir = avatarsDir;
        break;
      case 'cover':
        localDir = coverImagesDir;
        break;
      case 'featured':
      case 'icon':
        localDir = featuredImagesDir;
        break;
      default:
        localDir = mediaDir;
    }

    const localPath = path.join(localDir, config.name);
    fs.writeFileSync(localPath, svgContent);
    
    console.log(`生成图片: ${config.name}`);

    // 上传到 Strapi
    const uploadedFile = await uploadToStrapi(localPath, config.name);
    if (uploadedFile) {
      uploadedFiles[config.name.replace('.svg', '')] = uploadedFile;
      console.log(`上传成功: ${config.name} -> ID: ${uploadedFile.id}`);
    }

    // 添加较长延迟避免请求过快，防止服务压力过大
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 保存上传结果到文件
  const mediaMapPath = path.join(__dirname, '../data/media-map.json');
  fs.writeFileSync(mediaMapPath, JSON.stringify(uploadedFiles, null, 2));
  
  console.log('媒体文件生成和上传完成!');
  console.log(`媒体映射文件保存至: ${mediaMapPath}`);
  
  return uploadedFiles;
}

// 主函数
async function main() {
  try {
    if (!API_TOKEN) {
      console.error('错误: 请设置 STRAPI_API_TOKEN 环境变量');
      console.log('使用方法: STRAPI_API_TOKEN=your_token node upload-media.js');
      process.exit(1);
    }

    console.log(`连接到 Strapi: ${STRAPI_URL}`);
    console.log('检查连接...');

    // 测试连接
    try {
      await axios.get(`${STRAPI_URL}/api/upload/files`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      console.log('Strapi 连接成功!');
    } catch (error) {
      console.error('无法连接到 Strapi:', error.message);
      console.log('请确保:');
      console.log('1. Strapi 服务正在运行 (npm run develop)');
      console.log('2. API_TOKEN 正确且有上传权限');
      process.exit(1);
    }

    await generateAndUploadMedia();
    
  } catch (error) {
    console.error('执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { generateAndUploadMedia, uploadToStrapi };