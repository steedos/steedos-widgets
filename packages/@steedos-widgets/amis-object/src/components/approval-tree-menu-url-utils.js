/**
 * ApprovalTreeMenu URL 工具函数
 *
 * 纯函数，零依赖，供 ApprovalTreeMenu.tsx 和单元测试共同使用。
 *
 * @see https://github.com/steedos/steedos-widgets/issues/619
 */

/**
 * 判断给定路径是否匹配二栏（grid）模式
 * 匹配 Steedos 路由格式：/app/{appId}/{objectName}/grid/{listViewName}
 * 参见 router.jsx → getObjectListViewPath
 *
 * @param {string} pathname - URL 路径部分（不含 query string）
 * @returns {boolean}
 */
function isGridModePath(pathname) {
  return /\/app\/[^/]+\/[^/]+\/grid\/[^/?#]+/.test(pathname);
}

/**
 * 将三栏格式 URL 转换为二栏 grid 格式 URL，保留过滤参数
 *
 * 输入示例：
 *   /app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=['category','=','xxx']&flowId=&categoryId=xxx
 *
 * 输出示例：
 *   /app/approve_workflow/instance_tasks/grid/inbox?display=grid&additionalFilters=['category','=','xxx']&flowId=&categoryId=xxx
 *
 * 转换逻辑：
 * 1. 从 query string 中提取 side_listview_id 作为 listviewId
 * 2. 将路径中的 /view/none（或 /view/<任意recordId>）替换为 /grid/<listviewId>
 * 3. 从 query string 中移除 side_object 和 side_listview_id（二栏模式不需要）
 * 4. 添加 display=grid 参数
 * 5. 保留 additionalFilters、flowId、categoryId 等过滤参数
 *
 * 如果 URL 不包含 /view/ 或缺少 side_listview_id，则原样返回（安全降级）
 *
 * @param {string} viewUrl - 三栏格式 URL（ 路径 + query string）
 * @returns {string}
 */
function viewUrlToGridUrl(viewUrl) {
  try {
    var questionMarkIdx = viewUrl.indexOf('?');
    var path = questionMarkIdx >= 0 ? viewUrl.substring(0, questionMarkIdx) : viewUrl;
    var queryString = questionMarkIdx >= 0 ? viewUrl.substring(questionMarkIdx + 1) : '';

    // 必须匹配 Steedos 路由格式 /app/{appId}/{objectName}/view/{recordId} 才需要转换
    if (!/\/app\/[^/]+\/[^/]+\/view\/[^/?#]+/.test(path)) return viewUrl;

    // 手动解析 query params（不使用 URLSearchParams，因为 additionalFilters 值含未编码的 '='）
    var params = [];
    var sideListviewId = '';
    queryString.split('&').forEach(function (segment) {
      if (!segment) return;
      var eqIdx = segment.indexOf('=');
      var key = eqIdx >= 0 ? segment.substring(0, eqIdx) : segment;
      if (key === 'side_listview_id') {
        sideListviewId = eqIdx >= 0 ? segment.substring(eqIdx + 1) : '';
      } else if (key === 'side_object') {
        // 移除 side_object
      } else {
        params.push(segment); // 保留原始 key=value
      }
    });

    if (!sideListviewId) return viewUrl; // 安全降级

    // 替换路径：/view/<recordId> → /grid/<listviewId>（仅替换路由中 objectName 后的 view 段）
    var gridPath = path.replace(/(\/app\/[^/]+\/[^/]+)\/view\/[^/?#]+/, '$1/grid/' + sideListviewId);

    // 构建新的 query string：display=grid + 保留的过滤参数
    var newParams = ['display=grid'].concat(params).filter(Boolean);
    return gridPath + '?' + newParams.join('&');
  } catch (e) {
    return viewUrl; // 安全降级
  }
}

export { isGridModePath, viewUrlToGridUrl };
