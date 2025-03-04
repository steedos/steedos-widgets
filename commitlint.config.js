/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-03-04 10:12:09
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-04 10:12:21
 */
module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
      "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "test", "chore"]]
    }
  };