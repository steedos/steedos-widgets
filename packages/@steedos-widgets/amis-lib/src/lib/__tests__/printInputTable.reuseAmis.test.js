/*
 * issue steedos/steedos-widgets#651 — POC 单元测试
 * 覆盖 buildPrintCellSchema 字段类型 → amis cell body schema 的纯函数映射。
 *
 * 测试取舍：
 *   - 不渲染真实 DOM、不启动 amis runtime；
 *   - 只断言「输入 fieldSpec + value 后输出的 amis schema 对象结构」；
 *   - 缺 live 样本的字段类型（image/file/multi-select/...）100% 由单测覆盖；
 *   - live 验证矩阵只关注 T0 三项 + 已覆盖类型视觉无异常。
 */

import { buildPrintCellSchema } from '../printInputTableCell';

describe('buildPrintCellSchema - 空值与默认行为', () => {
    test('null 值统一回退到 nbsp tpl，避免 cell 塌陷', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'text' }, null))
            .toEqual({ type: 'tpl', tpl: '&nbsp;' });
    });

    test('undefined 值同样回退 nbsp', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'text' }, undefined))
            .toEqual({ type: 'tpl', tpl: '&nbsp;' });
    });

    test('空字符串视为空', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'number' }, ''))
            .toEqual({ type: 'tpl', tpl: '&nbsp;' });
    });

    test('未知 fieldSpec 时回退为默认 text 路径', () => {
        expect(buildPrintCellSchema(undefined, 'hello'))
            .toEqual({ type: 'tpl', tpl: 'hello' });
    });
});

describe('buildPrintCellSchema - 标量类型', () => {
    test('text → tpl', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'text' }, 'foo'))
            .toEqual({ type: 'tpl', tpl: 'foo' });
    });

    test('textarea → tpl（保留原文，不做转义/截断）', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'textarea' }, '多行\n文本'))
            .toEqual({ type: 'tpl', tpl: '多行\n文本' });
    });

    test('number → static-number', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'number' }, 123.45))
            .toEqual({ type: 'static-number', value: 123.45 });
    });

    test('number 字符串值会被转 Number', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'number' }, '42'))
            .toEqual({ type: 'static-number', value: 42 });
    });

    test('number 带 precision 透传', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'number', precision: 2 }, 10))
            .toEqual({ type: 'static-number', value: 10, precision: 2 });
    });

    test('currency → static-number + 默认 ￥ 前缀', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'currency' }, 99);
        expect(out.type).toBe('static-number');
        expect(out.value).toBe(99);
        expect(out.prefix).toBe('￥');
    });

    test('currency 自定义 prefix', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'currency', prefix: '$' }, 9);
        expect(out.prefix).toBe('$');
    });

    test('percent → static-number + % 后缀', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'percent' }, 0.5);
        expect(out.type).toBe('static-number');
        expect(out.value).toBe(0.5);
        expect(out.suffix).toBe('%');
    });

    test('boolean true → static-mapping ✓', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'boolean' }, true))
            .toEqual({ type: 'static-mapping', value: true, map: { 'true': '✓', 'false': '✗' } });
    });

    test('boolean false → 注意 false 不属于空值兜底，应走 mapping 出 ✗', () => {
        expect(buildPrintCellSchema({ name: 'a', type: 'boolean' }, false))
            .toEqual({ type: 'static-mapping', value: false, map: { 'true': '✓', 'false': '✗' } });
    });

    test("boolean 字符串 'true' 同样被识别", () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'boolean' }, 'true');
        expect(out.value).toBe(true);
    });

    test('date 默认格式 YYYY-MM-DD', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'date' }, '2024-01-15');
        expect(out).toEqual({ type: 'static-date', value: '2024-01-15', format: 'YYYY-MM-DD' });
    });

    test('datetime 默认格式带时分秒', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'datetime' }, 1700000000000);
        expect(out.format).toBe('YYYY-MM-DD HH:mm:ss');
        expect(out.value).toBe(1700000000000);
    });

    test('date 自定义 format 透传', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'date', format: 'YYYY/MM/DD' }, '2024-01-15');
        expect(out.format).toBe('YYYY/MM/DD');
    });

    test('email → mailto tpl', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'email' }, 'foo@bar.com');
        expect(out).toEqual({ type: 'tpl', tpl: '<a href="mailto:foo@bar.com">foo@bar.com</a>' });
    });

    test('url → 外链 tpl', () => {
        const out = buildPrintCellSchema({ name: 'a', type: 'url' }, 'https://example.com');
        expect(out.tpl).toContain('https://example.com');
        expect(out.tpl).toContain('target="_blank"');
    });
});
