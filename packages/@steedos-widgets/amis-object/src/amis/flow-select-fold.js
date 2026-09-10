// 流程选择器的分类展开策略。
// 下拉树（各筛选/查询/转发/分发入口）默认把流程分类收起，调用方显式传值时以调用方为准。
// 两个属性必须成对兜底：amis 的 eachTree 层级从 1 起算，分类正好是 level 1，
// 只给 initiallyOpen=false 而 unfoldedLevel 仍是 amis 默认的 1，分类照样展开。
const COLLAPSED_MODES = ['tree-select'];

const resolveFoldProps = (mode, initiallyOpen, unfoldedLevel) => {
  if (COLLAPSED_MODES.indexOf(mode) < 0) {
    return { initiallyOpen, unfoldedLevel };
  }

  return {
    initiallyOpen: typeof initiallyOpen === 'undefined' ? false : initiallyOpen,
    unfoldedLevel: typeof unfoldedLevel === 'undefined' ? 0 : unfoldedLevel,
  };
};

module.exports = {
  resolveFoldProps,
};
