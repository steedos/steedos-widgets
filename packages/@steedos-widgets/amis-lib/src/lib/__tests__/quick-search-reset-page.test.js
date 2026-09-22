/**
 * @jest-environment jsdom
 */
// steedos/steedos-plugins#890 监控箱/已完成等列表停在第 3 页时做快速搜索，结果从第 3 页开始而不是第 1 页
//
// 根因：amis 6.3 的 search-box 触发 search 事件后走 onQuery(data) → CRUD.handleQuery(values) 不带 resetPage，
// 页码留在原地；而顶部搜索表单走的是 handleFilterSubmit(values, jumpToFirstPage=true)，所以表单搜索会回第一页。
// 修法：快速搜索的 search 事件脚本里 event.preventDefault() 掐掉 amis 默认的 onQuery，
// 改由脚本自己调 crud.handleQuery(values, undefined, undefined, resetPage=true)。
// 回车、放大镜、清空 ×（clearAndSubmit）三条路都经过 search 事件，所以一个钩子全覆盖。

global._ = require("lodash");

jest.mock("i18next", () => ({ t: (key) => key }));
jest.mock("@steedos-widgets/amis-lib", () => ({
  Router: { getTabDisplayAs: jest.fn(() => "grid") }
}));
jest.mock("../converter/amis/header", () => ({
  getObjectListHeaderFieldsFilterBar: jest.fn()
}));
jest.mock("../converter/amis/toolbars/export_excel", () => ({
  getExportExcelToolbarButtonSchema: jest.fn(() => ({ type: "button" }))
}));
jest.mock("../converter/amis/toolbars/setting_listview", () => ({
  getSettingListviewToolbarButtonSchema: jest.fn(() => ({ type: "button" }))
}));
jest.mock("../converter/amis/fields/index", () => ({
  isFieldQuickSearchable: (field) => !!field && field.type === "text"
}));

const { getObjectHeaderToolbar } = require("../converter/amis/toolbar");

const mainObject = {
  name: "instances",
  NAME_FIELD_KEY: "name",
  fields: {
    name: { name: "name", type: "text", label: "名称" },
    state: { name: "state", type: "select", label: "状态" }
  }
};

function walk(node, predicate) {
  if (!node || typeof node !== "object") return null;
  if (predicate(node)) return node;
  const children = Array.isArray(node) ? node : Object.values(node);
  for (const child of children) {
    const found = walk(child, predicate);
    if (found) return found;
  }
  return null;
}

function getQuickSearchBox(options) {
  const toolbar = getObjectHeaderToolbar(mainObject, mainObject.fields, "LARGE", options);
  const searchBox = walk(toolbar, (n) => n && n.type === "search-box");
  expect(searchBox).toBeTruthy();
  return searchBox;
}

function getScripts(options) {
  const searchBox = getQuickSearchBox(options);
  return {
    searchBox,
    onSearch: searchBox.onEvent.search.actions[0].script,
    onChange: searchBox.onEvent.change.actions[0].script
  };
}

// amis CustomAction.run：str2AsyncFunction(script, 'context', 'doAction', 'event') 再 .call(proxy, renderer, doAction, event, action)
// SteedosUI 在浏览器里是全局变量，这里也按全局变量喂
function runScript(script, { event, SteedosUI }) {
  global.SteedosUI = SteedosUI;
  try {
    const fn = new Function("context", "doAction", "event", script);
    return fn.call({}, {}, () => {}, event);
  } finally {
    delete global.SteedosUI;
  }
}

function makeCrud() {
  return {
    getData: jest.fn(() => ({})),
    setData: jest.fn(),
    handleQuery: jest.fn()
  };
}

function makeEvent(data) {
  return { context: { scoped: {} }, data, preventDefault: jest.fn() };
}

function makeSteedosUI({ crud, form } = {}) {
  return {
    getClosestAmisComponentByType: jest.fn((scope, type) => {
      if (type === "crud") return crud || null;
      if (type === "form") return form || null;
      return null;
    })
  };
}

describe("#890 快速搜索回第一页（toolbar search-box 的 search 事件脚本）", () => {
  test("回车/放大镜：阻止 amis 默认 onQuery，改由 crud.handleQuery 带 resetPage=true 查询", () => {
    const { onSearch } = getScripts();
    const crud = makeCrud();
    const event = makeEvent({ __keywords: "请假" });

    runScript(onSearch, { event, SteedosUI: makeSteedosUI({ crud }) });

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(crud.handleQuery).toHaveBeenCalledTimes(1);
    // 与 amis 自己的 onQuery(data) 载荷一致，只多了第 4 个参数 resetPage=true
    expect(crud.handleQuery).toHaveBeenCalledWith({ __keywords: "请假" }, undefined, undefined, true);
  });

  test("清空 ×（clearAndSubmit）也走 search 事件：空关键字同样回第一页", () => {
    const { searchBox, onSearch } = getScripts();
    expect(searchBox.clearAndSubmit).toBe(true);
    const crud = makeCrud();
    const event = makeEvent({ __keywords: "" });

    runScript(onSearch, { event, SteedosUI: makeSteedosUI({ crud }) });

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(crud.handleQuery).toHaveBeenCalledWith({ __keywords: "" }, undefined, undefined, true);
  });

  test("search 脚本仍先把 __changedSearchBoxValues 同步进 crud 数据域，再重新查询（#6734 刷新按钮守卫不丢）", () => {
    const { onSearch } = getScripts();
    const crud = makeCrud();
    const event = makeEvent({ __keywords: "请假" });

    runScript(onSearch, { event, SteedosUI: makeSteedosUI({ crud }) });

    expect(crud.setData).toHaveBeenCalledTimes(1);
    expect(crud.setData.mock.calls[0][0]).toEqual({ __changedSearchBoxValues: { __keywords: "请假" } });
    expect(crud.setData.mock.invocationCallOrder[0]).toBeLessThan(crud.handleQuery.mock.invocationCallOrder[0]);
  });

  test("找不到 crud 时不阻止默认行为、不报错（交回 amis 默认流程）", () => {
    const { onSearch } = getScripts();
    const event = makeEvent({ __keywords: "请假" });

    expect(() => runScript(onSearch, { event, SteedosUI: makeSteedosUI({}) })).not.toThrow();

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test("lookup 弹窗自定义 keywordsSearchBoxName 也按该名字重置", () => {
    const name = "__keywords__lookup__owner__users";
    const { searchBox, onSearch } = getScripts({ isLookup: true, keywordsSearchBoxName: name });
    expect(searchBox.name).toBe(name);
    const crud = makeCrud();
    const event = makeEvent({ [name]: "张", isLookup: true });

    runScript(onSearch, { event, SteedosUI: makeSteedosUI({ crud }) });

    expect(crud.handleQuery).toHaveBeenCalledWith({ [name]: "张" }, undefined, undefined, true);
  });

  test("页码重置发生在「找不到搜索表单就 return」之前；有搜索表单时 500ms 后仍同步表单值", () => {
    jest.useFakeTimers();
    try {
      const { onSearch } = getScripts();
      const crud = makeCrud();
      const form = { setValues: jest.fn() };
      const changedFilterFormValues = { __searchable__state: "completed" };
      const event = makeEvent({ __keywords: "请假", __changedFilterFormValues: changedFilterFormValues });

      runScript(onSearch, { event, SteedosUI: makeSteedosUI({ crud, form }) });

      expect(crud.handleQuery).toHaveBeenCalledWith({ __keywords: "请假" }, undefined, undefined, true);
      expect(form.setValues).not.toHaveBeenCalled();
      jest.advanceTimersByTime(500);
      expect(form.setValues).toHaveBeenCalledWith(changedFilterFormValues);
    } finally {
      jest.useRealTimers();
    }
  });

  test("change 事件脚本不动页码、不阻止默认行为（只同步关键字，避免每敲一个字就请求）", () => {
    const { onChange } = getScripts();
    const crud = makeCrud();
    const event = makeEvent({ __keywords: "请" });

    runScript(onChange, { event, SteedosUI: makeSteedosUI({ crud }) });

    expect(crud.setData).toHaveBeenCalledTimes(1);
    expect(crud.handleQuery).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

describe("amis 6.3 契约（真实 CRUD / SearchBox 渲染器代码）", () => {
  function requireCRUD() {
    const mod = require("amis/lib/renderers/CRUD");
    return mod.CRUD || mod.default;
  }
  function requireSearchBoxRenderer() {
    // 该模块不导出类，只通过 @Renderer({type:'search-box'}) 装饰器注册进 amis-core 的渲染器表
    require("amis/lib/renderers/SearchBox");
    const renderer = require("amis-core").getRendererByName("search-box");
    expect(renderer && renderer.component).toBeTruthy();
    return renderer.component;
  }

  test("CRUD.handleQuery 只有第 4 个参数 resetPage=true 才把 page 置 1（默认路径页码留在原地 = #890 根因）", () => {
    const CRUD = requireCRUD();
    const updateQuery = jest.fn();
    const search = jest.fn();
    const ctx = { props: { store: { updateQuery } }, search };

    CRUD.prototype.handleQuery.call(ctx, { __keywords: "请假" });
    expect(updateQuery.mock.calls[0][0]).toEqual({ __keywords: "请假" });

    CRUD.prototype.handleQuery.call(ctx, { __keywords: "请假" }, undefined, undefined, true);
    expect(updateQuery.mock.calls[1][0]).toEqual({ page: 1, __keywords: "请假" });
    expect(search).toHaveBeenCalledTimes(2);
  });

  test("SearchBox 渲染器 handleSearch：search 事件被 preventDefault 后不再调用 onQuery（不会双重请求）", async () => {
    const SearchBoxRenderer = requireSearchBoxRenderer();
    const onQuery = jest.fn();
    const makeCtx = (prevented) => ({
      props: {
        name: "__keywords",
        data: {},
        onQuery,
        dispatchEvent: jest.fn(async () => ({ prevented }))
      }
    });

    const prevented = makeCtx(true);
    await SearchBoxRenderer.prototype.handleSearch.call(prevented, "请假");
    expect(prevented.props.dispatchEvent).toHaveBeenCalledWith("search", expect.objectContaining({ __keywords: "请假" }));
    expect(onQuery).not.toHaveBeenCalled();

    const passthrough = makeCtx(false);
    await SearchBoxRenderer.prototype.handleSearch.call(passthrough, "请假");
    // 默认路径只带关键字、不带 page —— 这就是页码不回 1 的来源
    expect(onQuery).toHaveBeenCalledWith({ __keywords: "请假" });
  });
});
