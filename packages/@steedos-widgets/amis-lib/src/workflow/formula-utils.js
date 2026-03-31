/**
 * 工作流表单公式转换工具函数
 * 将老版本工作流公式语法转换为 amis-formula 兼容的表达式
 */

/**
 * 将字段编码中的特殊字符替换为安全字符
 * （ → _，） → 移除，( → _，) → 移除，、 → _，， → _，% → _，= → _，： → _，/ → _，- → _，空格 → _
 */
export const getSafeCode = (code) => {
  return code.replace(/（/g, '_').replace(/）/g, '').replace(/\(/g, '_').replace(/\)/g, '').replace(/、/g, '_').replace(/，/g, '_').replace(/%/g, '_').replace(/=/g, '_').replace(/：/g, '_').replace(/\//g, '_').replace(/-/g, '_').replace(/ /g, '_');
};

/**
 * 构建子表字段→父表字段的映射表
 * 支持 section 嵌套递归
 */
export const getTableFieldMap = (fields) => {
  const map = {};
  if (!fields) return map;
  fields.forEach((field) => {
    if (field.type === 'table' && field.fields) {
      field.fields.forEach((col) => {
        map[col.code] = field.code;
      });
    }
    if (field.type === 'section' && field.fields) {
      Object.assign(map, getTableFieldMap(field.fields));
    }
  });
  return map;
};

/**
 * 判断是否为上下文变量（不需要 __expand 后缀的特殊字段）
 * 包括 applicant（申请人）和 approver（审批人）
 */
const isContextVariable = (code) => {
  return code === 'applicant' || code === 'approver';
};

/**
 * 将老版本工作流公式转换为 amis-formula 表达式
 * 
 * 转换规则对照：
 * - {fieldName}        → ${fieldName}          (简单字段引用)
 * - {now}              → ${NOW()}              (当前时间)
 * - sum({col})         → ${SUM(ARRAYMAP(...))} (聚合函数)
 * - {applicant}.name   → ${applicant.name}     (上下文变量)
 * - {approver}.name    → ${approver.name}      (上下文变量)
 * - {user_field}.name  → ${user_field__expand.name} (用户字段展开)
 * - {合计（元）}        → ${合计_元_}           (中文特殊字符安全化)
 * 
 * @param {string} formula - 老版本公式字符串
 * @param {Object} tableFieldMap - 子表字段映射 { colCode: tableCode }
 * @returns {string|null} amis 公式表达式，或 null（已是 amis 格式/无法识别）
 */
export const mapFormula = (formula, tableFieldMap) => {
  if (formula.trim().startsWith('${')) {
    return null;
  }
  if (formula.trim() === '{now}') {
    return '${NOW()}';
  }
  let newFormula = formula;

  // 预处理：修正生产数据中的非标准聚合函数语法
  // B: 全角括号 sum（{x}） → sum({x})
  newFormula = newFormula.replace(/(sum|average|count|max|min|numToRMB)\s*（/ig, '$1(');
  newFormula = newFormula.replace(/\}）/g, '})');
  // C: 缺失括号 sum{x} → sum({x})
  newFormula = newFormula.replace(/(sum|average|count|max|min|numToRMB)\{([^{}]*)\}/ig, '$1({$2})');
  // D: 清理 C 产生的冗余内层括号 sum({(金额)}) → sum({金额})
  newFormula = newFormula.replace(/(sum|average|count|max|min|numToRMB)\(\{\(([^)]+)\)\}\)/ig, '$1({$2})');

  const isFunction = newFormula.match(/(sum|average|count|max|min|numToRMB)\s*\(/i);
  const hasFieldRef = newFormula.match(/\{[^{}]+\}/);
  const isOperator = newFormula.match(/[\+\-\*\/]/) && hasFieldRef && newFormula.indexOf("}.") < 0;
  const isObjectField = newFormula.indexOf("}.") > -1;
  const isDotField = newFormula.match(/\{[^{}]+\.[^{}]+\}/);

  if (isFunction || isOperator || isObjectField || isDotField) {

    // 将数学分组方括号 [] 转为圆括号 ()，如 [{a}+{b}]/{c} → ({a}+{b})/{c}
    newFormula = newFormula.replace(/\[/g, '(').replace(/\]/g, ')');

    if (isFunction) {
      newFormula = newFormula.replace(/sum\s*\(/ig, 'SUM(');
      newFormula = newFormula.replace(/average\s*\(/ig, 'AVG(');
      newFormula = newFormula.replace(/count\s*\(/ig, 'COUNT(');
      newFormula = newFormula.replace(/max\s*\(/ig, 'MAX(');
      newFormula = newFormula.replace(/min\s*\(/ig, 'MIN(');
      newFormula = newFormula.replace(/numToRMB\s*\(/ig, 'UPPERMONEY(');
    }

    newFormula = newFormula.replace(/\{([^{}]+)\}\./g, (match, code) => {
      const trimmedCode = code.trim();
      if (isContextVariable(trimmedCode)) {
        return `${trimmedCode}.`;
      }
      return `${getSafeCode(trimmedCode)}__expand.`;
    });

    newFormula = newFormula.replace(/\{([^{}]+)\}/g, (match, code) => {
      code = code.trim();
      // {now} 在复合表达式中转为 NOW()
      if (code === 'now') {
        return 'NOW()';
      }
      if (tableFieldMap && tableFieldMap[code]) {
        const tableCode = tableFieldMap[code];
        const safeTableCode = getSafeCode(tableCode);
        return `ARRAYMAP(${safeTableCode}, item => item['${code}'])`;
      }
      if (code.indexOf('.') > -1) {
        const parts = code.split('.');
        const firstPart = parts[0].trim();
        if (isContextVariable(firstPart)) {
          return `${firstPart}.${parts.slice(1).join('.')}`;
        }
        return `${getSafeCode(firstPart)}__expand.${parts.slice(1).join('.')}`;
      }
      return getSafeCode(code);
    });

    return `\${${newFormula}}`;
  }

  if (newFormula.trim().startsWith('{') && newFormula.trim().endsWith('}')) {
    const innerCode = newFormula.trim().slice(1, -1).trim();
    if (innerCode === 'now') {
      return '${NOW()}';
    }
    const safeCode = getSafeCode(innerCode);
    return `\${${safeCode}}`;
  }

  return null;
};
