import { getSafeCode, getTableFieldMap, mapFormula } from '../formula-utils';

// ============================================================
// 测试组 1: 已正常工作的场景 (回归测试 — 确保修复不破坏现有功能)
// ============================================================
describe('mapFormula - 已兼容的转换 (回归测试)', () => {

  test('简单字段引用: {fieldName} → ${fieldName}', () => {
    expect(mapFormula('{amount}', null)).toBe('${amount}');
  });

  test('已是 amis 格式则返回 null', () => {
    expect(mapFormula('${existing}', null)).toBeNull();
  });

  test('{now} 精确匹配 → ${NOW()}', () => {
    expect(mapFormula('{now}', null)).toBe('${NOW()}');
  });

  test('带空格的 { now } 精确匹配 → ${NOW()}', () => {
    expect(mapFormula(' {now} ', null)).toBe('${NOW()}');
  });

  test('运算符公式: {amount} + {tax} → ${amount + tax}', () => {
    expect(mapFormula('{amount} + {tax}', null)).toBe('${amount + tax}');
  });

  test('运算符公式: {price} * {quantity} → ${price * quantity}', () => {
    expect(mapFormula('{price} * {quantity}', null)).toBe('${price * quantity}');
  });

  test('sum 聚合函数转换', () => {
    const tableFieldMap = { price: 'items' };
    expect(mapFormula('sum({price})', tableFieldMap)).toBe("${SUM(ARRAYMAP(items, item => item['price']))}");
  });

  test('average 聚合函数转换', () => {
    const tableFieldMap = { score: 'grades' };
    expect(mapFormula('average({score})', tableFieldMap)).toBe("${AVG(ARRAYMAP(grades, item => item['score']))}");
  });

  test('numToRMB 函数转换', () => {
    expect(mapFormula('numToRMB({total})', null)).toBe('${UPPERMONEY(total)}');
  });

  test('numToRMB 函数支持中文逗号字段: {评估价值（含税，元）}', () => {
    expect(mapFormula('numToRMB({评估价值（含税，元）})', null)).toBe('${UPPERMONEY(评估价值_含税_元)}');
  });

  test('applicant 对象字段展开: {applicant}.name', () => {
    expect(mapFormula('{applicant}.name', null)).toBe('${applicant.name}');
  });

  test('applicant 点号字段: {applicant.name}', () => {
    expect(mapFormula('{applicant.name}', null)).toBe('${applicant.name}');
  });

  test('applicant 嵌套点号: {applicant.organization.name}', () => {
    expect(mapFormula('{applicant.organization.name}', null)).toBe('${applicant.organization.name}');
  });

  test('普通用户字段展开: {user_field}.name', () => {
    expect(mapFormula('{user_field}.name', null)).toBe('${user_field__expand.name}');
  });

  test('普通用户字段点号: {user_field.name}', () => {
    expect(mapFormula('{user_field.name}', null)).toBe('${user_field__expand.name}');
  });

  test('中文特殊字符在运算符公式中: {金额（元）} + {税额}', () => {
    expect(mapFormula('{金额（元）} + {税额}', null)).toBe('${金额_元 + 税额}');
  });

  test('纯文本返回 null', () => {
    expect(mapFormula('hello', null)).toBeNull();
  });

  test('纯数字返回 null', () => {
    expect(mapFormula('100', null)).toBeNull();
  });
});

// ============================================================
// 测试组 2: Bug 1 — {approver} 上下文变量未特殊处理 (R-028)
// ============================================================
describe('mapFormula - Bug 1: approver 上下文变量处理', () => {

  test('{approver}.name 应转为 ${approver.name} 而非 ${approver__expand.name}', () => {
    const result = mapFormula('{approver}.name', null);
    expect(result).toBe('${approver.name}');
  });

  test('{approver.name} 应转为 ${approver.name} 而非 ${approver__expand.name}', () => {
    const result = mapFormula('{approver.name}', null);
    expect(result).toBe('${approver.name}');
  });

  test('{approver.organization.name} 应保持 approver 前缀', () => {
    const result = mapFormula('{approver.organization.name}', null);
    expect(result).toBe('${approver.organization.name}');
  });

  test('{approver}.organization.name 应保持 approver 前缀', () => {
    const result = mapFormula('{approver}.organization.name', null);
    expect(result).toBe('${approver.organization.name}');
  });

  test('混合 approver 和普通字段: {approver.name} + "-" + {department}', () => {
    // 这个公式中有运算符 +，所以会走复杂分支
    const result = mapFormula('{approver.name} + "-" + {department}', null);
    expect(result).toBe('${approver.name + "-" + department}');
  });
});

// ============================================================
// 测试组 3: Bug 2 — {now} 在复合表达式中未处理
// ============================================================
describe('mapFormula - Bug 2: {now} 在复合表达式中的处理', () => {

  test('{date_field} - {now} 中的 {now} 应转为 NOW()', () => {
    const result = mapFormula('{date_field} - {now}', null);
    expect(result).toBe('${date_field - NOW()}');
  });

  test('{now} + {offset} 中的 {now} 应转为 NOW()', () => {
    const result = mapFormula('{now} + {offset}', null);
    expect(result).toBe('${NOW() + offset}');
  });
});

// ============================================================
// 测试组 4: Bug 3 — 简单 {field} 引用中文特殊字符未 getSafeCode
// ============================================================
describe('mapFormula - Bug 3: 简单引用的中文特殊字符处理', () => {

  test('{合计（元）} 应转为 ${合计_元}', () => {
    const result = mapFormula('{合计（元）}', null);
    // getSafeCode: （ → _，） → 移除
    expect(result).toBe('${合计_元}');
  });

  test('{费用、合计} 应转为 ${费用_合计}', () => {
    const result = mapFormula('{费用、合计}', null);
    expect(result).toBe('${费用_合计}');
  });

  test('{项目（一）} 应转为 ${项目_一}', () => {
    const result = mapFormula('{项目（一）}', null);
    // （ → _，） → 移除: 项目_一
    expect(result).toBe('${项目_一}');
  });
});

// ============================================================
// 测试组 5: Bug 4 — 简单 {field} 引用未 trim 空白
// ============================================================
describe('mapFormula - Bug 4: 简单引用的空白 trim', () => {

  test('{ amount } 应转为 ${amount}', () => {
    const result = mapFormula('{ amount }', null);
    expect(result).toBe('${amount}');
  });

  test('{  field_name  } 应转为 ${field_name}', () => {
    const result = mapFormula('{  field_name  }', null);
    expect(result).toBe('${field_name}');
  });
});

// ============================================================
// 辅助函数测试
// ============================================================
describe('getSafeCode', () => {
  test('替换中文全角括号', () => {
    expect(getSafeCode('合计（元）')).toBe('合计_元');
  });

  test('替换中文顿号', () => {
    expect(getSafeCode('费用、合计')).toBe('费用_合计');
  });

  test('替换中文逗号', () => {
    expect(getSafeCode('评估价值（含税，元）')).toBe('评估价值_含税_元');
  });

  test('无特殊字符保持不变', () => {
    expect(getSafeCode('amount')).toBe('amount');
  });
});

describe('getTableFieldMap', () => {
  test('构建子表字段映射', () => {
    const fields = [
      {
        type: 'table',
        code: 'items',
        fields: [
          { code: 'price' },
          { code: 'quantity' }
        ]
      }
    ];
    expect(getTableFieldMap(fields)).toEqual({
      price: 'items',
      quantity: 'items'
    });
  });

  test('递归处理 section 嵌套', () => {
    const fields = [
      {
        type: 'section',
        fields: [
          {
            type: 'table',
            code: 'details',
            fields: [
              { code: 'amount' }
            ]
          }
        ]
      }
    ];
    expect(getTableFieldMap(fields)).toEqual({
      amount: 'details'
    });
  });

  test('空或 null 输入', () => {
    expect(getTableFieldMap(null)).toEqual({});
    expect(getTableFieldMap([])).toEqual({});
  });
});

// ============================================================
// 测试组 6: Bug 5 — 静态默认值含特殊字符被误判为公式
// ============================================================
describe('mapFormula - Bug 5: 静态默认值不应被误判为公式', () => {

  test('含 * 的中文静态文本应返回 null: "某某公司***工厂"', () => {
    expect(mapFormula('某某公司***工厂', null)).toBeNull();
  });

  test('含 - 的日期格式应返回 null: "2023-01-01"', () => {
    expect(mapFormula('2023-01-01', null)).toBeNull();
  });

  test('含 / 的路径格式应返回 null: "A/B/C"', () => {
    expect(mapFormula('A/B/C', null)).toBeNull();
  });

  test('含 + 的文本应返回 null: "C++"', () => {
    expect(mapFormula('C++', null)).toBeNull();
  });

  test('含 * 但同时有 {} 的仍为公式: "{amount} * 10"', () => {
    expect(mapFormula('{amount} * 10', null)).toBe('${amount * 10}');
  });

  test('含 - 但同时有 {} 的仍为公式: "{total} - {discount}"', () => {
    expect(mapFormula('{total} - {discount}', null)).toBe('${total - discount}');
  });

  test('纯运算符表达式无字段引用应返回 null: "100 * 2"', () => {
    expect(mapFormula('100 * 2', null)).toBeNull();
  });

  test('含 - 的中英文混合应返回 null: "ABC-DEF-123"', () => {
    expect(mapFormula('ABC-DEF-123', null)).toBeNull();
  });
});
