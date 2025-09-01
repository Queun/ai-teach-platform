export default {
  async check(ctx) {
    try {
      // 检查数据库连接
      await strapi.db.connection.raw('SELECT 1');
      
      ctx.body = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'ai-edu-platform-backend',
        version: process.env.npm_package_version || '1.0.0',
        uptime: process.uptime(),
        database: 'connected'
      };
      ctx.status = 200;
    } catch (error) {
      ctx.body = {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: 'ai-edu-platform-backend',
        error: error.message,
        database: 'disconnected'
      };
      ctx.status = 503;
    }
  },
};