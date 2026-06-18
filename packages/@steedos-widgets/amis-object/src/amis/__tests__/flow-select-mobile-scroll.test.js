/**
 * @jest-environment jsdom
 */

const {
  findFlowSelectScrollContainer,
} = require('../flow-select-mobile-scroll');

const setMetrics = (element, metrics) => {
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: metrics.scrollHeight,
  });
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: metrics.clientHeight,
  });
};

describe('flow select mobile scroll container', () => {
  test('prefers the inner virtual scroller over the outer tree scrollbar', () => {
    document.body.innerHTML = `
      <div class="flow-select">
        <div class="antd-TreeSelect-popover">
          <div class="antd-Tree">
            <ul class="antd-Tree-list">
              <div class="virtual-scroll">
                <div class="virtual-content"></div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    `;

    const tree = document.querySelector('.antd-Tree');
    const virtualScroller = document.querySelector('.virtual-scroll');
    setMetrics(tree, { scrollHeight: 274, clientHeight: 196 });
    setMetrics(virtualScroller, { scrollHeight: 9888, clientHeight: 266 });

    expect(findFlowSelectScrollContainer(tree)).toBe(virtualScroller);
  });
});
