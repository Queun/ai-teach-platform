module.exports = ({ env }) => {
  // 处理字符串或数组格式的APP_KEYS
  let appKeys = env('APP_KEYS');
  
  // 如果是字符串（环境变量通常是字符串），则按逗号分割
  if (typeof appKeys === 'string') {
    appKeys = appKeys.split(',').map(key => key.trim());
  }
  
  // 如果仍然为空，使用默认值
  if (!appKeys || appKeys.length === 0) {
    appKeys = [
      'Qw1zxz8gPYaAnyo3wzAA4yXUj69084t+HKvU8rKOIvs=',
      'KPMcMybXnwaiBRIKa7cwEBAp6nSlAE/jNacCSbFuQiA=',
      'lit9VifN1WGx4pHSFBQMBsDtzzrkpFqkonk7BdLu0LM=',
      'pwljyRYo6qkcog3CUbTkByYWTnD8gaCCliZSGKBo3XQ='
    ];
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: appKeys,
    },
  };
};