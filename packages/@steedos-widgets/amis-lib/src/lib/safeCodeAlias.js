/*
 * Issue steedos/steedos-widgets#660
 * 工作流子表新增行公式依赖带特殊字符字段名时，首次未按默认值计算的修复辅助工具。
 *
 * 背景：
 *   - 子表行输入控件的 `name` 是原始字段编码（可能含括号/特殊字符），如 `燃油费（本地）`
 *   - 工作流公式表达式经过 getSafeCode 转义后引用的是 `燃油费_本地`
 *   - 行表单初次 mount 时，formData 只包含原始名键，safeCode 键缺失，公式得到 NaN
 *
 * 本模块导出一个纯函数：根据 fields 列表和当前 formData，计算出需要补充的
 * safeCode -> 原始值 映射，供子表行表单 onEvent.inited 调用 setValue 注入。
 */

/**
 * 与 workflow/formula-utils.js 中 getSafeCode 等价的转义算法。
 * 这里复制一份是为了让 lib/input_table.js 不依赖 workflow 子目录。
 */
export function getSafeCode(code) {
    if (code == null) return code;
    return String(code)
        .replace(/[）)]/g, '')
        .replace(/[^a-zA-Z0-9_$\u4e00-\u9fff.]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/_$/, '');
}

/**
 * 计算子表行表单初始化时需要补充的 safeCode 别名键值。
 *
 * @param {Array<{name:string}>} fields 行字段列表，每项至少要有 name
 * @param {Object} formData 当前行表单数据（已应用 default_value 的状态）
 * @returns {Object} 仅包含需要 setValue 的 safeCode 键值对；无需补充时返回空对象
 *
 * 规则：
 *   1. 仅处理 getSafeCode(name) !== name 的字段
 *   2. 若 safeCode 已存在真实字段（fields 中有同名 name），跳过避免冲突
 *   3. 若 formData[safeCode] 已存在（非 undefined/null），跳过避免覆盖用户输入
 *   4. 若 formData[name] 不存在，跳过（无源值可补）
 */
export function getSafeCodeAliasInitData(fields, formData) {
    const result = {};
    if (!Array.isArray(fields) || !formData || typeof formData !== 'object') {
        return result;
    }
    const realFieldNames = new Set();
    for (const f of fields) {
        if (f && f.name) realFieldNames.add(f.name);
    }
    for (const f of fields) {
        if (!f || !f.name) continue;
        const raw = f.name;
        const safe = getSafeCode(raw);
        if (safe === raw) continue;
        if (realFieldNames.has(safe)) continue;
        if (formData[safe] !== undefined && formData[safe] !== null) continue;
        if (formData[raw] === undefined) continue;
        result[safe] = formData[raw];
    }
    return result;
}
