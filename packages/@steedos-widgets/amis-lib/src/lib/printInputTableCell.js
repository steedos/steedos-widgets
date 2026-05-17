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

// 字段类型 → amis cell body schema 的纯函数映射。
// 输入仅依赖可序列化的 fieldSpec（不依赖 React / DOM / amis runtime），
// 因此可以在 dataProvider 闭包里直接调用，也能脱离 amis 单独单测。
// fieldSpec 字段（按需扩展，必须可 JSON 序列化）：
//   { name, type, multiple, precision, format, prefix, suffix, options }
//   - options: [{ label, value }] 用于 select / mapping
// 返回结构：直接是 td.body 的值，amis 会作为子 schema 渲染。
export const buildPrintCellSchema = (fieldSpec, value) => {
    const spec = fieldSpec || {};
    const type = spec.type || 'text';

    // 空值统一处理：null / undefined / '' 回退到 nbsp 占位 tpl，
    // 保持与 hand-port 行为一致，避免 cell 高度塌陷。
    // 注意：false 与 0 不在空值兜底范围（业务上是有效显示值）。
    const isEmpty = value === null || value === undefined || value === '';
    if (isEmpty) {
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
            return {
                type: 'static-date',
                value: value,
                format: spec.format || (type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'),
            };
        }
        case 'email': {
            return {
                type: 'tpl',
                tpl: '<a href="mailto:' + String(value) + '">' + String(value) + '</a>',
            };
        }
        case 'url': {
            return {
                type: 'tpl',
                tpl: '<a href="' + String(value) + '" target="_blank">' + String(value) + '</a>',
            };
        }
        case 'text':
        case 'textarea':
        default: {
            return { type: 'tpl', tpl: String(value) };
        }
    }
};

// 把 fieldDef 投影成最小可 JSON 序列化的 fieldSpec，供 dataProvider 闭包使用。
// 故意独立成函数，单测可以直接喂 fieldSpec 跳过 normalize。
export const normalizeFieldSpecForPrint = (f) => {
    if (!f || !f.name) return null;
    return {
        name: f.name,
        type: f.type || 'text',
        label: f.label || f.name,
        multiple: !!f.multiple,
        precision: f.precision,
        format: f.format,
        prefix: f.prefix,
        suffix: f.suffix,
        options: Array.isArray(f.options) ? f.options : undefined,
    };
};
