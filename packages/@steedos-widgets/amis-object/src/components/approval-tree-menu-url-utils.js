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

/**
 * 判断 URL 中是否含有非空的 additionalFilters 参数。
 *
 * - 完全没有 additionalFilters → false
 * - additionalFilters= （空值，根节点 URL 形式）→ false
 * - additionalFilters=['flow','=','xxx'] 等任何非空值 → true
 *
 * 用途：审批菜单组件在 URL 同步时判断是否携带过滤器，配合
 * isStaleFilterUrl/clearStaleFilterParams 处理"过滤器已失效"场景
 * （详见 ApprovalTreeMenu.tsx 中 cleanStaleFilterIfNeeded 注释）。
 *
 * @param {string} url
 * @returns {boolean}
 */
function hasNonEmptyAdditionalFilters(url) {
  if (typeof url !== 'string' || !url) return false;
  var questionMarkIdx = url.indexOf('?');
  if (questionMarkIdx === -1) return false;
  var queryString = url.substring(questionMarkIdx + 1);
  var segments = queryString.split('&');
  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];
    if (!seg) continue;
    var eqIdx = seg.indexOf('=');
    if (eqIdx === -1) continue;
    var key = seg.substring(0, eqIdx);
    var val = seg.substring(eqIdx + 1);
    if (key === 'additionalFilters' && val) return true;
  }
  return false;
}

/**
 * 把 URL 改写为"清除过滤器"形态，用于"过滤器已失效"自愈场景：
 * - 单据提交后，所属流程节点对应的审批列表已变为 0 条（流程子节点从菜单消失），
 *   左侧菜单回退到根节点。但浏览器 URL 中仍带着过期的 additionalFilters，
 *   导致主列表按已失效的 flow 过滤渲染为空，与"手动点选根节点应看到完整列表"行为不一致。
 *
 * 行为：
 * - additionalFilters 保留 key、值置空（与审批菜单根节点 link 的 `additionalFilters=` 形态一致）
 * - 移除 flowId / categoryId / url 三个仅审批后端 nav 携带、且会被 amis 数据域消费的参数
 * - 其他 query 参数（如 side_object / side_listview_id）保留不变
 *
 * 与 stripFilterParams（ApprovalTreeMenu.tsx 内部）的区别：本函数**保留 additionalFilters key**，
 * 仅将其值置空，便于：
 *   1) 后续 URL→菜单匹配仍能命中根节点 link（根节点 link 含 additionalFilters=）
 *   2) 浏览器地址栏与"手动点击根节点"得到的 URL 完全一致
 *
 * @param {string} url
 * @returns {string}
 */
function clearStaleFilterParams(url) {
  try {
    if (typeof url !== 'string' || !url) return url;
    var questionMarkIdx = url.indexOf('?');
    if (questionMarkIdx === -1) return url;
    var path = url.substring(0, questionMarkIdx);
    var queryString = url.substring(questionMarkIdx + 1);
    var REMOVE_KEYS = { flowId: 1, categoryId: 1, url: 1 };
    var seenAdditionalFilters = false;
    var params = [];
    queryString.split('&').forEach(function (segment) {
      if (!segment) return;
      var eqIdx = segment.indexOf('=');
      var key = eqIdx >= 0 ? segment.substring(0, eqIdx) : segment;
      if (REMOVE_KEYS[key]) return;
      if (key === 'additionalFilters') {
        seenAdditionalFilters = true;
        params.push('additionalFilters=');
        return;
      }
      params.push(segment);
    });
    if (!seenAdditionalFilters) params.push('additionalFilters=');
    return params.length > 0 ? path + '?' + params.join('&') : path;
  } catch (e) {
    return url;
  }
}

export {
  isGridModePath,
  viewUrlToGridUrl,
  stripBackendOnlyParams,
  hasNonEmptyAdditionalFilters,
  clearStaleFilterParams,
};
