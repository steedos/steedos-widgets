/*
 * issue steedos/steedos-widgets#651 — POC 子表打印 cell schema 工厂（leaf module）
 *
 * 抽离原因：
 *   1. input_table.js 直接/间接依赖 converter/amis/form.js → objects.js → utils/object.ts，
 *      Jest 不开 ts-jest 时无法解析；
 *   2. 这里所有函数都是纯函数、零外部依赖，单测从这里直接 import 即可，
 *      不会拉进 amis runtime / lodash / i18next；
 *   3. input_table.js 的 dataProvider 通过 import 复用同一份逻辑，保证测试与运行时一致。
 */

// HTML 转义：用于把任意字符串安全嵌入 tpl 模板内（避免 < > & " ' 破坏 schema）。
const escapeHtml = (s) => {
    if (s === null || s === undefined) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

// 从枚举 / 引用类字段的「显示值候选」中提取一条文本：
//   - 字符串：直接返回
//   - 对象：优先 label → name → fullname → value
//   - 其它：toString
const pickLabel = (item) => {
    if (item === null || item === undefined) return '';
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (typeof item === 'object') {
        return String(item.label || item.name || item.fullname || item.value || '');
    }
    return String(item);
};

// 把单 / 多值显示候选 (display 或 value) 归一化为字符串数组（已去空）。
const normalizeDisplayList = (raw) => {
    if (raw === null || raw === undefined || raw === '') return [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.map(pickLabel).filter((s) => s !== '');
};

// 把 image / file 字段值规范化为 [{url, name}]。
// 与 hand-port _printTableNormalizeFiles 对齐：优先 display（服务端通常已注入 {url, name}），
// 兜底 value 自身（可能是字符串 URL / 对象 / 数组）。
const normalizeFiles = (value, display) => {
    const pick = (it) => {
        if (it === null || it === undefined) return null;
        if (typeof it === 'string') return { url: it, name: it };
        if (typeof it === 'object') {
            const url = it.url || it.src || it.value || '';
            const label = it.name || it.label || '';
            if (!url && !label) return null;
            return { url, name: label || url };
        }
        return null;
    };
    let src = (display !== null && display !== undefined && display !== '') ? display : value;
    if (src === null || src === undefined || src === '') return [];
    const arr = Array.isArray(src) ? src : [src];
    const out = [];
    for (let i = 0; i < arr.length; i++) {
        const p = pick(arr[i]);
        if (p) out.push(p);
    }
    return out;
};

// 字段类型 → amis cell body schema 的纯函数映射。
// 输入仅依赖可序列化的 fieldSpec（不依赖 React / DOM / amis runtime），
// 因此可以在 dataProvider 闭包里直接调用，也能脱离 amis 单独单测。
// fieldSpec 字段（按需扩展，必须可 JSON 序列化）：
//   { name, type, multiple, precision, format, prefix, suffix, options }
//   - options: [{ label, value }] 用于 select / mapping
// 第三个参数 display 是 row._display[name] —— 服务端 Steedos 预格式化的显示值。
//   select / lookup / user / formula / summary 都优先使用 display，
//   缺失时再回退到 value 自身。
// 返回结构：直接是 td.body 的值，amis 会作为子 schema 渲染。
export const buildPrintCellSchema = (fieldSpec, value, display) => {
    const spec = fieldSpec || {};
    const type = spec.type || 'text';

    // 空值统一处理：display 与 value 同时为空才回退占位。
    // 注意：false 与 0 不在空值兜底范围（业务上是有效显示值）。
    const isEmpty = (v) => v === null || v === undefined || v === '';
    if (isEmpty(value) && isEmpty(display)) {
        return { type: 'tpl', tpl: '&nbsp;' };
    }

    switch (type) {
        case 'boolean': {
            // 与 hand-port 一致用 ✓ / ✗；amis static-mapping 同时承担「未知值显示原值」职责。
            const truthy = value === true || value === 'true' || value === 1 || value === '1';
            return {
                type: 'static-mapping',
                value: truthy,
                map: { 'true': '✓', 'false': '✗' },
            };
        }
        case 'number':
        case 'currency':
        case 'percent': {
            // 数字类直接走 static-number；precision / prefix / suffix 透传由 amis 自己格式化。
            const cell = { type: 'static-number', value: typeof value === 'string' ? Number(value) : value };
            if (typeof spec.precision === 'number') cell.precision = spec.precision;
            if (type === 'currency') cell.prefix = spec.prefix || '￥';
            if (type === 'percent') cell.suffix = '%';
            return cell;
        }
        case 'date':
        case 'datetime': {
            const out = {
                type: 'static-date',
                value: value,
                format: spec.format || (type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'),
            };
            // amis static-date 默认把 number 当 unix 秒；前端传入的多数是毫秒戳，需显式声明
            if (typeof value === 'number') out.valueFormat = 'x';
            return out;
        }
        case 'email': {
            const v = String(value);
            return {
                type: 'tpl',
                tpl: '<a href="mailto:' + escapeHtml(v) + '">' + escapeHtml(v) + '</a>',
            };
        }
        case 'url': {
            const v = String(value);
            return {
                type: 'tpl',
                tpl: '<a href="' + escapeHtml(v) + '" target="_blank">' + escapeHtml(v) + '</a>',
            };
        }

        // ===== 枚举类（select / multi-select / radio / checkbox / lookup / multi-lookup / master_detail / user / group） =====
        // 设计：优先用 display（服务端已注入 label）；缺失时按 options 反查 label；
        // 多值统一 join(", ")。单值与多值共享同一路径，靠 normalizeDisplayList 统一处理。
        // 注意：v1 老审批 checkbox = 多选选项组（不是 v2 的 boolean 开关），必须走 options 反查。
        case 'select':
        case 'radio':
        case 'checkbox':
        case 'lookup':
        case 'master_detail':
        case 'user':
        case 'group': {
            // 优先级：display > options 反查（仅当 display 为空且 spec 给了 options）> value 原值
            const hasDisplay = display !== null && display !== undefined && display !== '';
            let labels;
            if (hasDisplay) {
                labels = normalizeDisplayList(display);
            } else if (Array.isArray(spec.options)) {
                const vals = Array.isArray(value) ? value : [value];
                labels = vals.map((v) => {
                    const hit = spec.options.find((o) => o && o.value === v);
                    return hit ? String(hit.label) : pickLabel(v);
                }).filter((s) => s !== '');
            } else {
                labels = normalizeDisplayList(value);
            }
            if (labels.length === 0) return { type: 'tpl', tpl: '&nbsp;' };
            return { type: 'tpl', tpl: escapeHtml(labels.join(', ')) };
        }

        // ===== 富内容：image / multi-image =====
        // 与 hand-port 对齐：固定缩略尺寸（CSS class steedos-print-input-table__img），
        // 多图横向排列。amis static-image 单图够用，但多图为统一行为这里手写 <img> tpl。
        case 'image':
        case 'avatar': {
            const items = normalizeFiles(value, display);
            if (!items.length) return { type: 'tpl', tpl: '&nbsp;' };
            const html = items.map((it) => {
                const url = escapeHtml(it.url);
                const alt = escapeHtml(it.name || '');
                if (!url) return '';
                return '<img src="' + url + '" alt="' + alt + '" class="steedos-print-input-table__img" />';
            }).join('');
            return { type: 'tpl', tpl: html || '&nbsp;' };
        }

        // ===== file / multi-file =====
        // 输出 <a href=url>name</a>，多文件用空格分隔。
        case 'file': {
            const items = normalizeFiles(value, display);
            if (!items.length) return { type: 'tpl', tpl: '&nbsp;' };
            const html = items.map((it) => {
                const url = escapeHtml(it.url);
                const label = escapeHtml(it.name || it.url || '');
                if (!url) return label;
                return '<a href="' + url + '" target="_blank" class="steedos-print-input-table__file">' + label + '</a>';
            }).join(' ');
            return { type: 'tpl', tpl: html || '&nbsp;' };
        }

        // ===== HTML / markdown / code =====
        // html 字段直接原样输出（保持业务方书写的内联标签）。
        // markdown 在 readonly 模式下走 static-markdown；code 走 static-code。
        case 'html': {
            return { type: 'tpl', tpl: String(value) };
        }
        case 'markdown': {
            return { type: 'static-markdown', value: String(value) };
        }
        case 'code': {
            return { type: 'static-code', value: String(value) };
        }

        // ===== formula / summary =====
        // 上游计算字段，服务端通常会回 display（已格式化）。
        // 若 display 缺失再退回 value（可能是 number / string），统一交给 tpl 显示。
        case 'formula':
        case 'summary': {
            const src = (display !== null && display !== undefined && display !== '') ? display : value;
            if (typeof src === 'number') {
                return { type: 'static-number', value: src };
            }
            return { type: 'tpl', tpl: escapeHtml(pickLabel(src)) };
        }

        // ===== password =====
        // 打印态固定回 ****** ；空值在最前面已被回退为 nbsp。
        case 'password': {
            return { type: 'tpl', tpl: '******' };
        }

        case 'text':
        case 'textarea':
        case 'autonumber':
        default: {
            return { type: 'tpl', tpl: String(value) };
        }
    }
};

// 把 fieldDef 投影成最小可 JSON 序列化的 fieldSpec，供 dataProvider 闭包使用。
// 故意独立成函数，单测可以直接喂 fieldSpec 跳过 normalize。
// v1 旧字段类型 → POC 内部规范类型映射。
// 注意：v1 workflow path（flow.js `case "table"` + `getTdInputTpl`）会把子表字段类型
// 先转成 amis schema 类型（input-number / static / input-date 等），
// 原始字段语义类型（dateTime / select / odata / checkbox / email / url …）大多被压成 'static'，
// 无法在 POC path 中精准反推。POC 报告中已记录此局限，后续若推全量替换需要让
// flow.js 在转换时保留原始 type 元信息。
const PRINT_FIELD_TYPE_ALIASES = {
    // v2 标准类型别名
    dateTime: 'datetime',
    datetimepicker: 'datetime',
    datepicker: 'date',
    // 注意：v1 老审批 `checkbox` = 多选选项组（一组 options，可勾多个），
    // 不能把它映射为 v2 的 `boolean`（单一开关）—— 否则会进 boolean case 输出 ✓/✗，
    // 永远命中不到 enum case 的 options 反查逻辑。v1 path 直接保留 'checkbox' 类型。
    odata: 'lookup',
    autonumber: 'text',
    masterDetail: 'master_detail',
    multiSelect: 'multi-select',
    // amis schema 类型回退：input-number 仍能精准识别为数字，
    // input-text / static 等保留为 default tpl 分支处理（fallback 至原值字符串）。
    'input-number': 'number',
    'input-date': 'date',
    'input-datetime': 'datetime',
    'input-text': 'text',
    'input-textarea': 'textarea',
    'static-number': 'number',
    'static-date': 'date',
    'static-datetime': 'datetime',
};

// 数字/金额/日期/布尔等字段本质属性：断行就是错的（如 "1,234,567.89" 不应被拆成两行）。
// 文本类不加任何宽度约束，让浏览器 table-layout:auto 根据容器宽度自动分配列宽并触发换行。
// 只保留纯数值类型为 nowrap，与非打印页面保持一致；日期/布尔等较短字段允许自然换行
const PRINT_NOWRAP_FIELD_TYPES = ['number', 'currency', 'percent'];

export const getPrintCellStyleForType = (type) => {
    if (PRINT_NOWRAP_FIELD_TYPES.indexOf(type) > -1) {
        return { whiteSpace: 'nowrap' };
    }
    return {};
};

export const normalizeFieldSpecForPrint = (f) => {
    if (!f || !f.name) return null;
    // 优先读 flow.js 在打印路径注入的原始 Steedos 类型（Direction A），
    // 避免 getTdInputTpl 将 dateTime/select/odata 等压缩为 'static' 后类型信息丢失
    const rawType = f._originalType || f.type || 'text';
    const normalizedType = PRINT_FIELD_TYPE_ALIASES[rawType] || rawType;
    return {
        name: f.name,
        type: normalizedType,
        label: f.label || f.name,
        multiple: !!f.multiple || !!f.is_multiselect || !!f._is_multiselect,
        precision: f.precision,
        format: f.format,
        prefix: f.prefix,
        suffix: f.suffix,
        options: f._parsedOptions || (Array.isArray(f.options) ? f.options : undefined),
    };
};
