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

describe('buildPrintCellSchema - 枚举类型', () => {
    test('select display 优先：直接用 label', () => {
        const out = buildPrintCellSchema({ name: 's', type: 'select' }, 'a', '选项A');
        expect(out).toEqual({ type: 'tpl', tpl: '选项A' });
    });

    test('select display 缺失：按 options 反查 label', () => {
        const out = buildPrintCellSchema(
            { name: 's', type: 'select', options: [{ label: '选项A', value: 'a' }] },
            'a'
        );
        expect(out).toEqual({ type: 'tpl', tpl: '选项A' });
    });

    test('select display 与 options 都缺：原值兜底', () => {
        const out = buildPrintCellSchema({ name: 's', type: 'select' }, 'raw');
        expect(out).toEqual({ type: 'tpl', tpl: 'raw' });
    });

    test('multi-select display 数组 → join(", ")', () => {
        const out = buildPrintCellSchema(
            { name: 's', type: 'select', multiple: true },
            ['a', 'b'],
            ['选项A', '选项B']
        );
        expect(out).toEqual({ type: 'tpl', tpl: '选项A, 选项B' });
    });

    test('lookup display 对象 → 取 label/name', () => {
        const out = buildPrintCellSchema(
            { name: 'r', type: 'lookup' },
            'id-1',
            { label: '客户甲', value: 'id-1' }
        );
        expect(out).toEqual({ type: 'tpl', tpl: '客户甲' });
    });

    test('multi-lookup display 数组对象 → 多 label join', () => {
        const out = buildPrintCellSchema(
            { name: 'r', type: 'lookup', multiple: true },
            ['1', '2'],
            [{ label: '客户甲' }, { label: '客户乙' }]
        );
        expect(out.tpl).toBe('客户甲, 客户乙');
    });

    test('user 字段优先使用 display 中的 fullname/label', () => {
        const out = buildPrintCellSchema(
            { name: 'u', type: 'user' },
            'uid-1',
            { fullname: '张三', _id: 'uid-1' }
        );
        expect(out).toEqual({ type: 'tpl', tpl: '张三' });
    });

    test('master_detail display 缺失但传 value 字符串', () => {
        const out = buildPrintCellSchema({ name: 'm', type: 'master_detail' }, 'id-1');
        expect(out).toEqual({ type: 'tpl', tpl: 'id-1' });
    });

    test('group 多值 join', () => {
        const out = buildPrintCellSchema(
            { name: 'g', type: 'group', multiple: true },
            ['id-1', 'id-2'],
            ['运营组', '研发组']
        );
        expect(out.tpl).toBe('运营组, 研发组');
    });

    test('select label 含 HTML 特殊字符会被转义', () => {
        const out = buildPrintCellSchema({ name: 's', type: 'select' }, 'a', '<script>alert(1)</script>');
        expect(out.tpl).not.toContain('<script>');
        expect(out.tpl).toContain('&lt;script&gt;');
    });
});

describe('buildPrintCellSchema - 富内容类型', () => {
    test('image 单图：display 是 {url,name} 对象', () => {
        const out = buildPrintCellSchema(
            { name: 'pic', type: 'image' },
            'pic.jpg',
            { url: 'http://cdn/x.jpg', name: 'x.jpg' }
        );
        expect(out.type).toBe('tpl');
        expect(out.tpl).toContain('<img');
        expect(out.tpl).toContain('http://cdn/x.jpg');
        expect(out.tpl).toContain('steedos-print-input-table__img');
    });

    test('image 多图：display 是数组', () => {
        const out = buildPrintCellSchema(
            { name: 'pic', type: 'image', multiple: true },
            ['a.jpg', 'b.jpg'],
            [{ url: 'http://cdn/a.jpg' }, { url: 'http://cdn/b.jpg' }]
        );
        const imgCount = (out.tpl.match(/<img/g) || []).length;
        expect(imgCount).toBe(2);
    });

    test('image value 是字符串 URL（无 display）', () => {
        const out = buildPrintCellSchema({ name: 'pic', type: 'image' }, 'http://cdn/raw.jpg');
        expect(out.tpl).toContain('http://cdn/raw.jpg');
    });

    test('avatar 走 image 同分支', () => {
        const out = buildPrintCellSchema({ name: 'av', type: 'avatar' }, null, { url: 'http://cdn/a.png' });
        expect(out.tpl).toContain('<img');
    });

    test('file 单文件 → 锚链接', () => {
        const out = buildPrintCellSchema(
            { name: 'f', type: 'file' },
            null,
            { url: 'http://cdn/r.pdf', name: '合同.pdf' }
        );
        expect(out.tpl).toContain('<a href="http://cdn/r.pdf"');
        expect(out.tpl).toContain('合同.pdf');
        expect(out.tpl).toContain('target="_blank"');
    });

    test('file 多文件 → 多锚链接', () => {
        const out = buildPrintCellSchema(
            { name: 'f', type: 'file', multiple: true },
            null,
            [{ url: 'http://cdn/1.pdf', name: '1' }, { url: 'http://cdn/2.pdf', name: '2' }]
        );
        const anchorCount = (out.tpl.match(/<a /g) || []).length;
        expect(anchorCount).toBe(2);
    });

    test('html 字段保留原内联 HTML', () => {
        const out = buildPrintCellSchema({ name: 'h', type: 'html' }, '<b>粗体</b>');
        expect(out).toEqual({ type: 'tpl', tpl: '<b>粗体</b>' });
    });

    test('markdown → static-markdown', () => {
        const out = buildPrintCellSchema({ name: 'm', type: 'markdown' }, '# 标题');
        expect(out).toEqual({ type: 'static-markdown', value: '# 标题' });
    });

    test('code → static-code', () => {
        const out = buildPrintCellSchema({ name: 'c', type: 'code' }, 'console.log(1)');
        expect(out).toEqual({ type: 'static-code', value: 'console.log(1)' });
    });
});

describe('buildPrintCellSchema - 公式与特殊类型', () => {
    test('formula 返回 number → static-number', () => {
        const out = buildPrintCellSchema({ name: 'f', type: 'formula' }, 42);
        expect(out).toEqual({ type: 'static-number', value: 42 });
    });

    test('formula display 是字符串', () => {
        const out = buildPrintCellSchema({ name: 'f', type: 'formula' }, null, '计算结果');
        expect(out).toEqual({ type: 'tpl', tpl: '计算结果' });
    });

    test('summary display 是 number', () => {
        const out = buildPrintCellSchema({ name: 's', type: 'summary' }, null, 99.5);
        expect(out).toEqual({ type: 'static-number', value: 99.5 });
    });

    test('password 有值 → ******', () => {
        const out = buildPrintCellSchema({ name: 'p', type: 'password' }, 'realsecret');
        expect(out).toEqual({ type: 'tpl', tpl: '******' });
    });

    test('password 空值仍走空值兜底', () => {
        const out = buildPrintCellSchema({ name: 'p', type: 'password' }, '');
        expect(out).toEqual({ type: 'tpl', tpl: '&nbsp;' });
    });

    test('autonumber → tpl 原值', () => {
        const out = buildPrintCellSchema({ name: 'n', type: 'autonumber' }, 'NO.001');
        expect(out).toEqual({ type: 'tpl', tpl: 'NO.001' });
    });

    test('未知 type 兜底为 text tpl', () => {
        const out = buildPrintCellSchema({ name: 'x', type: 'unknown_type_xyz' }, 'hello');
        expect(out).toEqual({ type: 'tpl', tpl: 'hello' });
    });

    test('display 存在 value 不存在仍然渲染（不走空值兜底）', () => {
        const out = buildPrintCellSchema({ name: 'f', type: 'formula' }, undefined, '结果');
        expect(out.tpl).toBe('结果');
    });
});
