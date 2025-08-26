'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTools, useResources, useNews, useStats } from "@/hooks/useStrapi";
import strapiService from "@/lib/strapi";
import { Loader2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

export default function StrapiTestPage() {
  const { data: tools, loading: toolsLoading, error: toolsError, refetch: refetchTools } = useTools({ pageSize: 3 });
  const { data: resources, loading: resourcesLoading, error: resourcesError } = useResources({ pageSize: 3 });  
  const { data: news, loading: newsLoading, error: newsError } = useNews({ pageSize: 3 });
  const { data: stats, loading: statsLoading, error: statsError } = useStats();

  const StatusCard = ({ title, loading, error, data, onRetry }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>加载中...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center text-red-600 py-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {!loading && !error && data && (
          <div className="space-y-4">
            {Array.isArray(data) ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">找到 {data.length} 条数据</p>
                {data.slice(0, 2).map((item: any, index: number) => (
                  <div key={item.id || index} className="p-3 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-start gap-3">
                      {/* 显示图片预览 - 修正为根级别访问 */}
                      {(item.logo || item.coverImage || item.featuredImage) && (
                        <div className="flex-shrink-0">
                          <img 
                            src={`http://localhost:1337${item.logo?.url || item.coverImage?.url || item.featuredImage?.url}`}
                            alt="Preview"
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {item.name || item.title || `项目 ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 truncate">
                          {item.shortDesc || item.excerpt || item.description || "无描述"}
                        </div>
                        
                        {/* 显示媒体字段状态 - 修正为根级别访问 */}
                        <div className="flex gap-2 mt-2">
                          {item.logo && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Logo ✓</span>
                          )}
                          {item.screenshots && Array.isArray(item.screenshots) && item.screenshots.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                              Screenshots({item.screenshots.length}) ✓
                            </span>
                          )}
                          {item.coverImage && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">封面 ✓</span>
                          )}
                          {item.featuredImage && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">特色图 ✓</span>
                          )}
                        </div>

                        {/* 调试信息：显示媒体字段的原始状态 */}
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          <div className="font-semibold text-yellow-800 mb-1">🔍 媒体字段调试信息:</div>
                          <div className="space-y-1 text-yellow-700">
                            {/* 检查 attributes 层级 */}
                            <div>attributes.logo: {item.attributes?.logo ? '✅ 有数据' : '❌ 字段不存在'}</div>
                            <div>attributes.screenshots: {item.attributes?.screenshots ? (Array.isArray(item.attributes.screenshots) ? `✅ 有数据 (${item.attributes.screenshots.length}张)` : '❌ 格式错误') : '❌ 字段不存在'}</div>
                            
                            {/* 检查根级别 */}
                            <div>root.logo: {item.logo ? '✅ 有数据' : '❌ 字段不存在'}</div>
                            <div>root.screenshots: {item.screenshots ? (Array.isArray(item.screenshots) ? `✅ 有数据 (${item.screenshots.length}张)` : '❌ 格式错误') : '❌ 字段不存在'}</div>
                            
                            {/* 显示URL */}
                            {item.attributes?.logo && (
                              <div>attributes图片URL: {item.attributes.logo.url}</div>
                            )}
                            {item.logo && (
                              <div>root图片URL: {item.logo.url}</div>
                            )}
                            {item.attributes?.screenshots && item.attributes.screenshots[0] && (
                              <div>attributes截图URL: {item.attributes.screenshots[0].url}</div>
                            )}
                            {item.screenshots && item.screenshots[0] && (
                              <div>root截图URL: {item.screenshots[0].url}</div>
                            )}
                            
                            {/* 显示完整路径结构调试 */}
                            <details className="mt-2">
                              <summary className="cursor-pointer text-blue-600">显示完整item结构</summary>
                              <div className="mt-1 text-xs">
                                <div>有 attributes: {!!item.attributes ? '是' : '否'}</div>
                                <div>有 logo: {!!item.logo ? '是' : '否'}</div>
                                <div>有 attributes.logo: {!!item.attributes?.logo ? '是' : '否'}</div>
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 原始数据展示 */}
                <details className="mt-4">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                    查看原始数据 (点击展开)
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto max-h-40 rounded border">
                    {JSON.stringify(data.slice(0, 1), null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{data.tools || 0}</div>
                    <div className="text-xs text-gray-600">AI工具</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{data.resources || 0}</div>
                    <div className="text-xs text-gray-600">教育资源</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{data.news || 0}</div>
                    <div className="text-xs text-gray-600">新闻资讯</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Strapi API 测试页面</h1>
          <p className="text-gray-600">验证前端与 Strapi 后端的连接状态</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">API 基础连接: {process.env.NEXT_PUBLIC_STRAPI_URL}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard 
            title="统计数据" 
            loading={statsLoading} 
            error={statsError} 
            data={stats}
          />
          
          <StatusCard 
            title="AI工具" 
            loading={toolsLoading} 
            error={toolsError} 
            data={tools}
            onRetry={refetchTools}
          />
          
          <StatusCard 
            title="教育资源" 
            loading={resourcesLoading} 
            error={resourcesError} 
            data={resources}
          />
          
          <StatusCard 
            title="新闻资讯" 
            loading={newsLoading} 
            error={newsError} 
            data={news}
          />
        </div>

        {/* API 连接信息 */}
        <Card>
          <CardHeader>
            <CardTitle>API 连接信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Strapi URL:</strong>
                <div className="text-gray-600 break-all">{process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api'}</div>
              </div>
              <div>
                <strong>API Token:</strong>
                <div className="flex items-center gap-2">
                  {process.env.NEXT_PUBLIC_STRAPI_TOKEN ? (
                    <>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-600">已配置</span>
                      <code className="text-xs bg-gray-100 px-1 rounded">{process.env.NEXT_PUBLIC_STRAPI_TOKEN.substring(0, 8)}...</code>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-600">未配置 (使用公共访问)</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <strong>连接状态:</strong>
                <div className="flex items-center gap-2">
                  {!toolsLoading && !toolsError && tools !== null && tools !== undefined && (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-600">已连接</span>
                    </>
                  )}
                  {toolsError && (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-600">连接失败</span>
                    </>
                  )}
                  {toolsLoading && (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-yellow-600">连接中...</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <strong>权限模式:</strong>
                <div className="text-gray-600">
                  {process.env.NEXT_PUBLIC_STRAPI_TOKEN ? 'Token 认证' : 'Public 访问'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button size="sm" variant="outline" asChild>
                <a href="http://localhost:1337/admin" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Strapi 管理面板
                </a>
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-1" />
                重新测试
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>配置指南</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🎯 手动配置 Strapi 内容类型和权限</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>访问 <a href="http://localhost:1337/admin" target="_blank" rel="noopener noreferrer" className="underline">Strapi 管理面板</a></li>
                <li>使用 Content-Type Builder 创建 AI工具、教育资源、新闻资讯三个内容类型</li>
                <li>参考 <code>docs/strapi-content-types-optimized.md</code> 中的字段定义</li>
                <li><strong>配置权限</strong>: Settings → Roles & Permissions → Public → 启用 find 和 findOne 权限</li>
                <li>添加一些示例数据用于测试</li>
                <li>回到此页面验证数据能否正常显示</li>
              </ol>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">🔐 API Token 配置 (可选)</h4>
              <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                <li><strong>创建Token</strong>: Settings → API Tokens → Create new API Token</li>
                <li><strong>配置权限</strong>: 选择 "Read-only" 或 "Full access"</li>
                <li><strong>复制Token</strong>: ⚠️ 只会显示一次，务必保存</li>
                <li><strong>添加到环境变量</strong>: 在 <code>.env.local</code> 中添加 <code>NEXT_PUBLIC_STRAPI_TOKEN=你的token</code></li>
                <li><strong>重启前端</strong>: 重新启动开发服务器以应用环境变量</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">⚡ 快速测试建议</h4>
              <div className="text-sm text-green-800 space-y-2">
                <p><strong>第一步</strong>: 先启用 Public 权限进行快速测试，确保API连通</p>
                <p><strong>第二步</strong>: 添加示例数据，验证数据流程</p>
                <p><strong>第三步</strong>: 配置API Token提升安全性</p>
                <p><strong>验证URL</strong>: 
                  <a href="http://localhost:1337/api/ai-tools" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                    测试AI工具API
                  </a>
                </p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>常见问题：</strong></p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>如果显示403错误：检查权限配置</li>
                <li>如果显示404错误：检查内容类型是否已创建</li>
                <li>如果显示连接错误：检查Strapi服务是否运行</li>
                <li>如果Token无效：重新创建API Token</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}