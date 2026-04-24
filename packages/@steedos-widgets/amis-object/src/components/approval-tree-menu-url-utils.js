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

/**
 * 仅剥离审批后端 nav API 在菜单 link 上附加的 flowId/categoryId/url 参数，
 * **保留** additionalFilters。用于在与详情页 URL 比对时忽略菜单侧附加的参数，
 * 同时仍然依靠 additionalFilters 区分不同分类/流程子节点。
 *
 * 背景：通用列表页 (tpl.js getNameTplUrl) 生成的详情页链接仅携带 additionalFilters，
 * 不携带 flowId/categoryId（避免污染非审批对象的 URL）。如果直接做字符串比较，
 * 详情页 URL 永远无法命中含 flowId/categoryId 的菜单子节点 link，导致菜单高亮丢失。
 *
 * 同时对每个 query 参数的值做 decodeURIComponent 归一化，因为浏览器地址栏的
 * additionalFilters 是 percent-encoded（如 %5B%27category%27...），而审批后端
 * nav API 返回的菜单 link 是字面量字符串（['category',...]），直接对比会因
 * 编码差异失配。
 *
 * @param {string} url - 任意 URL（path + query）
 * @returns {string}
 */
function stripBackendOnlyParams(url) {
  try {
    var questionMarkIdx = url.indexOf('?');
    if (questionMarkIdx === -1) return url;

    var path = url.substring(0, questionMarkIdx);
    var queryString = url.substring(questionMarkIdx + 1);

    var STRIP_KEYS = { flowId: 1, categoryId: 1, url: 1 };
    var params = queryString
      .split('&')
      .filter(function (param) {
        var key = param.split('=')[0];
        return !STRIP_KEYS[key];
      })
      .map(function (param) {
        var eqIdx = param.indexOf('=');
        if (eqIdx === -1) return param;
        var key = param.substring(0, eqIdx);
        var val = param.substring(eqIdx + 1);
        try {
          val = decodeURIComponent(val);
        } catch (e) {
          /* keep raw on decode error */
        }
        return key + '=' + val;
      });

    return params.length > 0 ? path + '?' + params.join('&') : path;
  } catch (e) {
    return url;
  }
}

export { isGridModePath, viewUrlToGridUrl, stripBackendOnlyParams };
