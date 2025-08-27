const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 导入模块
const { generateAndUploadMedia } = require('./upload-media');
const { importAllData } = require('./import-data');

// 配置
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// 颜色输出函数
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bright: (text) => `\x1b[1m${text}\x1b[0m`
};

// 打印横幅
function printBanner() {
  console.log(colors.cyan(''));
  console.log(colors.cyan('╔══════════════════════════════════════════════════════════════╗'));
  console.log(colors.cyan('║') + colors.bright('              爱教学 - AI教育平台数据库填充工具                ') + colors.cyan('║'));
  console.log(colors.cyan('║') + '                      数据库自动填充助手                      ' + colors.cyan('║'));
  console.log(colors.cyan('╚══════════════════════════════════════════════════════════════╝'));
  console.log('');
}

// 检查依赖
function checkDependencies() {
  console.log(colors.blue('🔍 检查依赖项...'));
  
  const requiredPackages = ['axios', 'form-data'];
  const packageJsonPath = path.join(__dirname, '../package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(colors.red('❌ 未找到 package.json 文件'));
    return false;
  }

  try {
    const packageJson = require(packageJsonPath);
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const missingPackages = requiredPackages.filter(pkg => !allDeps[pkg]);
    
    if (missingPackages.length > 0) {
      console.log(colors.red(`❌ 缺少依赖包: ${missingPackages.join(', ')}`));
      console.log(colors.yellow('请运行: npm install axios form-data'));
      return false;
    }
    
    console.log(colors.green('✅ 所有依赖项已满足'));
    return true;
  } catch (error) {
    console.log(colors.red('❌ 检查依赖时出错:', error.message));
    return false;
  }
}

// 检查环境
function checkEnvironment() {
  console.log(colors.blue('🌍 检查环境配置...'));
  
  if (!API_TOKEN) {
    console.log(colors.red('❌ 未设置 STRAPI_API_TOKEN 环境变量'));
    console.log(colors.yellow('请设置后再试: STRAPI_API_TOKEN=your_token npm run seed'));
    return false;
  }
  
  // 检查数据文件
  const dataDir = path.join(__dirname, '../data');
  const requiredFiles = ['ai-tools.json', 'edu-resources.json', 'news-articles.json'];
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(dataDir, file))
  );
  
  if (missingFiles.length > 0) {
    console.log(colors.red(`❌ 缺少数据文件: ${missingFiles.join(', ')}`));
    return false;
  }
  
  console.log(colors.green('✅ 环境配置正常'));
  console.log(colors.gray(`   API Token: ${API_TOKEN.substring(0, 10)}...`));
  console.log(colors.gray(`   Strapi URL: ${STRAPI_URL}`));
  return true;
}

// 检查Strapi服务状态
async function checkStrapiService() {
  console.log(colors.blue('🔌 检查 Strapi 服务状态...'));
  
  try {
    const axios = require('axios');
    // 先测试基本连接
    await axios.get(`${STRAPI_URL}/api/upload/files`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    
    console.log(colors.green('✅ Strapi 服务连接正常'));
    return true;
  } catch (error) {
    console.log(colors.red('❌ 无法连接到 Strapi 服务'));
    console.log(colors.yellow('错误详情:'), error.message);
    console.log(colors.yellow('请确保:'));
    console.log(colors.yellow('  1. Strapi 服务正在运行 (cd backend && npm run develop)'));
    console.log(colors.yellow('  2. API Token 有效且有足够权限'));
    console.log(colors.yellow('  3. 内容类型已正确创建'));
    return false;
  }
}

// 显示进度
function showProgress(step, total, message) {
  const percentage = Math.round((step / total) * 100);
  const progressBar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
  process.stdout.write(`\r${colors.cyan(`[${progressBar}]`)} ${percentage}% - ${message}`);
  if (step === total) console.log('');
}

// 主填充函数
async function seedDatabase(options = {}) {
  const { 
    skipMedia = false, 
    skipData = false, 
    clearExisting = false,
    interactive = false 
  } = options;

  printBanner();

  // 前置检查
  console.log(colors.bright('🚦 执行前置检查...'));
  console.log('');

  if (!checkDependencies()) return false;
  if (!checkEnvironment()) return false;
  if (!(await checkStrapiService())) return false;

  console.log('');
  console.log(colors.green('✅ 所有前置检查通过!'));
  console.log('');

  // 交互式确认
  if (interactive) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise((resolve) => {
      rl.question(colors.yellow('是否继续执行数据库填充? (y/N): '), (answer) => {
        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
          console.log(colors.yellow('操作已取消'));
          process.exit(0);
        }
        rl.close();
        resolve();
      });
    });
  }

  const startTime = new Date();
  let results = {
    media: { success: false, error: null },
    data: { success: false, error: null, details: null }
  };

  try {
    // 步骤 1: 上传媒体文件
    if (!skipMedia) {
      console.log(colors.bright('📸 步骤 1/2: 生成和上传媒体文件'));
      console.log(colors.gray('生成占位图片并上传到 Strapi 媒体库...'));
      console.log('');

      try {
        showProgress(0, 1, '准备生成媒体文件...');
        const mediaResults = await generateAndUploadMedia();
        showProgress(1, 1, '媒体文件上传完成!');
        
        results.media.success = true;
        console.log(colors.green(`✅ 媒体文件处理完成 (${Object.keys(mediaResults).length} 个文件)`));
      } catch (error) {
        results.media.error = error.message;
        console.log(colors.red('❌ 媒体文件处理失败:', error.message));
        console.log(colors.yellow('⚠️  将跳过媒体关联，继续导入数据...'));
      }
    } else {
      console.log(colors.yellow('⏭️  跳过媒体文件上传'));
    }

    console.log('');

    // 步骤 2: 导入数据
    if (!skipData) {
      console.log(colors.bright('📊 步骤 2/2: 导入内容数据'));
      console.log(colors.gray('导入 AI 工具、教育资源和新闻文章数据...'));
      console.log('');

      try {
        const dataResults = await importAllData({ clearData: clearExisting });
        results.data.success = true;
        results.data.details = dataResults;
        console.log(colors.green('✅ 内容数据导入完成'));
      } catch (error) {
        results.data.error = error.message;
        console.log(colors.red('❌ 内容数据导入失败:', error.message));
        throw error;
      }
    } else {
      console.log(colors.yellow('⏭️  跳过数据导入'));
    }

    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    // 成功总结
    console.log('');
    console.log(colors.green('🎉 数据库填充完成!'));
    console.log('');
    console.log(colors.bright('📋 执行总结:'));
    console.log(`   ⏱️  总用时: ${duration} 秒`);
    console.log(`   📸 媒体文件: ${results.media.success ? colors.green('成功') : colors.red('失败')}`);
    console.log(`   📊 数据导入: ${results.data.success ? colors.green('成功') : colors.red('失败')}`);

    if (results.data.details) {
      const details = results.data.details;
      const aiTools = details.aiTools;
      const eduResources = details.eduResources;
      const newsArticles = details.newsArticles;

      if (aiTools && eduResources && newsArticles) {
        const totalSuccess = aiTools.success + eduResources.success + newsArticles.success;
        const totalFailed = aiTools.failed + eduResources.failed + newsArticles.failed;
        
        console.log(`   📈 导入统计: ${colors.green(`${totalSuccess} 成功`)}, ${totalFailed > 0 ? colors.red(`${totalFailed} 失败`) : '0 失败'}`);
        console.log(`      🤖 AI工具: ${aiTools.success}/${aiTools.success + aiTools.failed}`);
        console.log(`      📚 教育资源: ${eduResources.success}/${eduResources.success + eduResources.failed}`);
        console.log(`      📰 新闻文章: ${newsArticles.success}/${newsArticles.success + newsArticles.failed}`);
      }
    }

    console.log('');
    console.log(colors.cyan('🎯 下一步操作:'));
    console.log(colors.gray(`   1. 访问 Strapi 管理面板: ${STRAPI_URL}/admin`));
    console.log(colors.gray('   2. 检查导入的数据是否正确'));
    console.log(colors.gray('   3. 启动前端应用验证显示效果'));
    console.log('');

    return true;

  } catch (error) {
    console.log('');
    console.log(colors.red('💥 数据库填充过程中出现错误:'));
    console.log(colors.red(error.message));
    console.log('');
    console.log(colors.yellow('🔧 故障排查建议:'));
    console.log(colors.gray('   1. 检查 Strapi 服务是否正常运行'));
    console.log(colors.gray('   2. 验证 API Token 权限是否足够'));
    console.log(colors.gray('   3. 确认内容类型架构是否匹配'));
    console.log(colors.gray('   4. 检查网络连接是否稳定'));
    
    return false;
  }
}

// 显示帮助信息
function showHelp() {
  console.log('');
  console.log(colors.bright('爱教学数据库填充工具'));
  console.log('');
  console.log(colors.blue('使用方法:'));
  console.log('  node seed-database.js [选项]');
  console.log('');
  console.log(colors.blue('环境变量:'));
  console.log('  STRAPI_API_TOKEN    Strapi API 访问令牌 (必需)');
  console.log('');
  console.log(colors.blue('选项:'));
  console.log('  --skip-media        跳过媒体文件上传');
  console.log('  --skip-data         跳过数据导入');  
  console.log('  --clear             清除现有数据后重新导入');
  console.log('  --interactive, -i   交互式确认模式');
  console.log('  --help, -h          显示此帮助信息');
  console.log('');
  console.log(colors.blue('示例:'));
  console.log('  # 完整填充 (推荐)');
  console.log('  STRAPI_API_TOKEN=xxx node seed-database.js');
  console.log('');
  console.log('  # 清除现有数据后重新填充');
  console.log('  STRAPI_API_TOKEN=xxx node seed-database.js --clear');
  console.log('');
  console.log('  # 仅上传媒体文件');
  console.log('  STRAPI_API_TOKEN=xxx node seed-database.js --skip-data');
  console.log('');
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  // 显示帮助
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // 解析参数
  const options = {
    skipMedia: args.includes('--skip-media'),
    skipData: args.includes('--skip-data'),
    clearExisting: args.includes('--clear'),
    interactive: args.includes('--interactive') || args.includes('-i')
  };

  try {
    const success = await seedDatabase(options);
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(colors.red('执行失败:'), error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { seedDatabase, checkStrapiService, checkEnvironment };