const getScrollRange = (element) => {
  if (!element) {
    return 0;
  }
  return element.scrollHeight - element.clientHeight;
};

const findFlowSelectScrollContainer = (target) => {
  if (!(target instanceof Element)) {
    return null;
  }

  const popover = target.closest('.flow-select .antd-TreeSelect-popover');
  if (!popover) {
    return null;
  }

  const scrollContainers = [popover, ...popover.querySelectorAll('*')]
    .filter((element) => getScrollRange(element) > 8)
    .sort((a, b) => getScrollRange(b) - getScrollRange(a));

  return scrollContainers[0] || null;
};

module.exports = {
  findFlowSelectScrollContainer,
};
