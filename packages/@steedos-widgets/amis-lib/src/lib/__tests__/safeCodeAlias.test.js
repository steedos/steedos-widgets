/*
 * issue steedos/steedos-widgets#660 单元测试
 *
 * 验证子表行表单初始化时，根据字段定义和当前 formData 计算
 * safeCode 别名注入数据的纯函数 getSafeCodeAliasInitData。
 *
 * 测试范围：
 *   - 不渲染真实 DOM、不启动 amis runtime
 *   - 只断言 (fields, formData) -> aliasInitData 的纯函数行为
 *   - 模拟「单车核算明细表」真实场景：13 字段中 2 个带括号字段配 default_value
 *     的公式 NaN bug 触发条件
 */

import { getSafeCode, getSafeCodeAliasInitData } from '../safeCodeAlias';

describe('getSafeCode - 与 workflow/formula-utils 行为一致', () => {
    test('普通字段名不变', () => {
        expect(getSafeCode('维修保养费')).toBe('维修保养费');
        expect(getSafeCode('amount')).toBe('amount');
        expect(getSafeCode('item_1')).toBe('item_1');
    });

    test('全角括号被移除/替换', () => {
        expect(getSafeCode('燃油费（本地）')).toBe('燃油费_本地');
        expect(getSafeCode('燃油费（异地）')).toBe('燃油费_异地');
    });

    test('半角括号被移除/替换', () => {
        expect(getSafeCode('foo(bar)')).toBe('foo_bar');
    });

    test('其他特殊字符转 _', () => {
        expect(getSafeCode('a b c')).toBe('a_b_c');
        expect(getSafeCode('x-y')).toBe('x_y');
    });
});

describe('getSafeCodeAliasInitData - 边界与防御', () => {
    test('参数非法时返回空对象', () => {
        expect(getSafeCodeAliasInitData(null, {})).toEqual({});
        expect(getSafeCodeAliasInitData([], null)).toEqual({});
        expect(getSafeCodeAliasInitData(undefined, undefined)).toEqual({});
    });

    test('字段名无需转义时不产出 alias', () => {
        const fields = [{ name: '维修保养费' }, { name: 'amount' }];
        expect(getSafeCodeAliasInitData(fields, {
            '维修保养费': '0.00',
            amount: 100
        })).toEqual({});
    });

    test('safeCode 已与真实字段冲突 -> 跳过避免覆盖真实字段值', () => {
        const fields = [
            { name: '燃油费（本地）' },
            { name: '燃油费_本地' } // 真实存在同名 safe 字段
        ];
        const formData = { '燃油费（本地）': '10.00', '燃油费_本地': 'real' };
        expect(getSafeCodeAliasInitData(fields, formData)).toEqual({});
    });

    test('formData 中已存在 safeCode 键值时不覆盖', () => {
        const fields = [{ name: '燃油费（本地）' }];
        const formData = { '燃油费（本地）': '10.00', '燃油费_本地': 'already-set' };
        expect(getSafeCodeAliasInitData(fields, formData)).toEqual({});
    });

    test('formData 中 raw 键缺失时不产出', () => {
        const fields = [{ name: '燃油费（本地）' }];
        const formData = {};
        expect(getSafeCodeAliasInitData(fields, formData)).toEqual({});
    });
});

describe('getSafeCodeAliasInitData - issue #660 真实场景', () => {
    /**
     * 模拟「单车核算明细表」子表新增行时弹窗初始 formData：
     *   - 共 13 个数字字段，其中 5 个配置了 default_value="0.00"
     *   - 5 个 default_value 字段中有 2 个名称含全角括号
     *   - 公式 `本月发生额` = ${燃油费_本地 + 燃油费_异地 + 维修保养费 + ...} 引用 safeCode
     *
     * 修复前：formData 只含原始 key，公式取不到 safeCode，结果 NaN -> "数字无效"
     * 修复后：本函数应返回 {燃油费_本地: '0.00', 燃油费_异地: '0.00'}
     */
    const fields = [
        { name: '燃油费（本地）' },
        { name: '燃油费（异地）' },
        { name: '维修保养费' },
        { name: '过道费' },
        { name: '停车费' },
        { name: '洗车费' },
        { name: '照证审验费' },
        { name: '检车费' },
        { name: '交强险' },
        { name: '商业险' },
        { name: '车船使用税' },
        { name: '司机补助费' },
        { name: '司机住宿费' },
        { name: '本月发生额' } // 公式字段，无需别名
    ];

    test('新增行 mount 后只补两个带括号字段的 safeCode', () => {
        const formData = {
            '燃油费（本地）': '0.00',
            '燃油费（异地）': '0.00',
            '维修保养费': '0.00',
            '过道费': '0.00',
            '停车费': '0.00'
            // 其他 default 缺失字段为 undefined，符合实际
        };
        expect(getSafeCodeAliasInitData(fields, formData)).toEqual({
            '燃油费_本地': '0.00',
            '燃油费_异地': '0.00'
        });
    });

    test('用户输入非零默认值后，safeCode 仍按原值同步', () => {
        const formData = {
            '燃油费（本地）': '100.50',
            '燃油费（异地）': '200.00',
            '维修保养费': '50',
            '过道费': '0.00',
            '停车费': '0.00'
        };
        expect(getSafeCodeAliasInitData(fields, formData)).toEqual({
            '燃油费_本地': '100.50',
            '燃油费_异地': '200.00'
        });
    });

    test('依赖字段值参与求和后公式可计算（端到端模拟）', () => {
        const formData = {
            '燃油费（本地）': '10',
            '燃油费（异地）': '20',
            '维修保养费': '30',
            '过道费': '40',
            '停车费': '50'
        };
        const alias = getSafeCodeAliasInitData(fields, formData);
        const merged = Object.assign({}, formData, alias);
        // 模拟公式 ${燃油费_本地 + 燃油费_异地 + 维修保养费 + 过道费 + 停车费}
        // 用 Number 强转模拟 amis-formula 对字符串数字的处理
        const sum = Number(merged['燃油费_本地']) +
                    Number(merged['燃油费_异地']) +
                    Number(merged['维修保养费']) +
                    Number(merged['过道费']) +
                    Number(merged['停车费']);
        expect(sum).toBe(150);
        expect(Number.isNaN(sum)).toBe(false);
    });

    test('修复前的对照：直接对原始 formData 求和 safeCode -> NaN', () => {
        const formData = {
            '燃油费（本地）': '10',
            '燃油费（异地）': '20',
            '维修保养费': '30'
        };
        // 模拟未补别名时 amis-formula 取不到 safeCode
        const broken = Number(formData['燃油费_本地']) + Number(formData['燃油费_异地']) + Number(formData['维修保养费']);
        expect(Number.isNaN(broken)).toBe(true);
    });
});
