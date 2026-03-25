/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2026-01-24 00:07:58
 * @Description: 
 */
import './AmisRecordDetailHeader.less'
import { getRecordDetailHeaderSchema , getUISchema} from '@steedos-widgets/amis-lib'

const OVERFLOW_HANDLER_ID = 'steedos_header_overflow_handler';

/**
 * Traverse the schema JSON to add CSS class names to the button flex container,
 * enabling targeted CSS styling and runtime overflow detection.
 */
function addButtonContainerClasses(schema: any) {
  if (!schema || !schema.body) return;
  const bodyArr = Array.isArray(schema.body) ? schema.body : [schema.body];
  for (const bodyItem of bodyArr) {
    if (bodyItem.type === 'wrapper' && bodyItem.body) {
      const gridItems = Array.isArray(bodyItem.body) ? bodyItem.body : [bodyItem.body];
      for (const gridItem of gridItems) {
        if (gridItem.type === 'grid' && gridItem.columns) {
          for (const col of gridItem.columns) {
            if (col.body && col.body.type === 'flex') {
              col.body.className = ((col.body.className || '') + ' steedos-header-buttons').trim();
              col.columnClassName = ((col.columnClassName || '') + ' steedos-header-buttons-col').trim();
            }
          }
        }
      }
    }
  }
}

/**
 * Runtime overflow detection script for the amis `custom` component.
 * Uses ResizeObserver + MutationObserver to detect when buttons overflow
 * the container, and dynamically collapses them into a "more" dropdown.
 * 
 * Parameters provided by amis custom onMount: (dom, value, onChange, props)
 */
const overflowOnMount = `
  var header = dom.closest('.steedos-object-record-detail-header');
  if (!header) return;

  var flexContainer = header.querySelector('.steedos-header-buttons');
  if (!flexContainer) return;

  // Create "more" dropdown container
  var moreContainer = document.createElement('div');
  moreContainer.className = 'steedos-header-overflow-more';
  moreContainer.style.display = 'none';

  var moreBtn = document.createElement('button');
  moreBtn.className = 'steedos-header-overflow-more-btn';
  moreBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';

  var moreMenu = document.createElement('div');
  moreMenu.className = 'steedos-header-overflow-menu';
  moreMenu.style.display = 'none';

  moreContainer.appendChild(moreBtn);
  moreContainer.appendChild(moreMenu);
  flexContainer.appendChild(moreContainer);

  // Toggle menu on click
  moreBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    moreMenu.style.display = moreMenu.style.display === 'none' ? 'block' : 'none';
  });

  // Close menu on outside click
  var closeHandler = function(e) {
    if (!moreContainer.contains(e.target)) {
      moreMenu.style.display = 'none';
    }
  };
  document.addEventListener('click', closeHandler, true);

  var isUpdating = false;
  var rafId = null;
  var mutationTimer = null;

  var mutationObserverConfig = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  };

  function reconnectMutationObserver() {
    // Reconnect on next frame so queued mutation records from our own
    // DOM changes are discarded (disconnect clears the queue).
    requestAnimationFrame(function() {
      mutationObserver.observe(flexContainer, mutationObserverConfig);
    });
  }

  function updateOverflow() {
    if (isUpdating) return;
    isUpdating = true;
    // Disconnect MutationObserver during update to prevent infinite loop
    // (our own DOM changes would otherwise re-trigger this function)
    mutationObserver.disconnect();
    try {
      var children = Array.from(flexContainer.children);
      var buttonItems = children.filter(function(el) { return el !== moreContainer; });

      // Reset all overflow-hidden buttons to measure true content width
      buttonItems.forEach(function(el) {
        if (el.getAttribute('data-overflow-hidden') === 'true') {
          el.style.removeProperty('display');
          el.removeAttribute('data-overflow-hidden');
        }
      });
      moreContainer.style.display = 'none';
      moreMenu.innerHTML = '';

      // Force reflow to get accurate measurements
      void flexContainer.offsetWidth;

      // Get buttons that are actually visible (not hidden by amis visibleOn)
      var visibleButtons = buttonItems.filter(function(el) {
        var cs = window.getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden';
      });

      // No overflow — nothing to do (also handles container not yet rendered)
      if (flexContainer.clientWidth === 0 || flexContainer.scrollWidth <= flexContainer.clientWidth) return;

      // Show the "more" dropdown trigger
      moreContainer.style.display = 'inline-flex';
      void flexContainer.offsetWidth;

      // Hide buttons from right to left until content fits
      for (var i = visibleButtons.length - 1; i >= 0; i--) {
        if (flexContainer.scrollWidth <= flexContainer.clientWidth) break;

        var btn = visibleButtons[i];
        btn.setAttribute('data-overflow-hidden', 'true');
        btn.style.display = 'none';

        // Create a proxy menu item that clicks the original button
        var menuItem = document.createElement('div');
        menuItem.className = 'steedos-header-overflow-menu-item';

        // Extract label text from the amis-rendered button
        var labelText = '';
        var innerBtn = btn.querySelector('button');
        if (innerBtn) {
          var labelSpan = innerBtn.querySelector('.antd-Button-label');
          labelText = labelSpan ? labelSpan.textContent : innerBtn.textContent;
        }
        if (!labelText || !labelText.trim()) {
          labelText = btn.textContent;
        }
        menuItem.textContent = (labelText || '').trim() || '...';

        // Proxy click to the original hidden button
        (function(originalBtn) {
          menuItem.addEventListener('click', function(e) {
            e.stopPropagation();
            moreMenu.style.display = 'none';
            var ct = originalBtn.querySelector('button') || originalBtn.querySelector('a') || originalBtn;
            ct.click();
          });
        })(btn);

        moreMenu.insertBefore(menuItem, moreMenu.firstChild);
      }

      // Hide dropdown if no items ended up in it
      if (moreMenu.children.length === 0) {
        moreContainer.style.display = 'none';
      }
    } finally {
      isUpdating = false;
      reconnectMutationObserver();
    }
  }

  function debouncedUpdate() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateOverflow);
  }

  // Watch for container size changes (window resize, split view toggle, etc.)
  var resizeObserver = new ResizeObserver(debouncedUpdate);
  resizeObserver.observe(flexContainer);

  // Watch for DOM mutations (buttons shown/hidden by amis visibleOn, data loading, etc.)
  var mutationObserver = new MutationObserver(function() {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(debouncedUpdate, 150);
  });
  mutationObserver.observe(flexContainer, mutationObserverConfig);

  // Initial check after buttons are rendered
  setTimeout(debouncedUpdate, 300);

  // Store cleanup function for onUnmount
  window.__steedosOverflowCleanup = window.__steedosOverflowCleanup || {};
  window.__steedosOverflowCleanup[props.id] = function() {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    document.removeEventListener('click', closeHandler, true);
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(mutationTimer);
  };
`;

/**
 * Cleanup script for the amis `custom` component onUnmount.
 * Parameters provided by amis custom onUnmount: (props)
 */
const overflowOnUnmount = `
  if (window.__steedosOverflowCleanup && window.__steedosOverflowCleanup[props.id]) {
    window.__steedosOverflowCleanup[props.id]();
    delete window.__steedosOverflowCleanup[props.id];
  }
`;

export const AmisRecordDetailHeader = async (props) => {
  // console.log(`AmisRecordDetailHeader=====>`, props)
  //sticky在最新版ios上存在bug，因此暂时去除手机版sticky
  const { className = 'sm:sticky top-0 sm:z-10 p-0 bg-white sm:m-4 sm:shadow sm:rounded', schemaFilter, showButtons, showBackButton } = props;
  const objectUiSchema = await getUISchema(props.objectApiName || "space_users", false);
  const defaultOnEvent = {}
  const { $schema, recordId, onEvent = defaultOnEvent, showRecordTitle = true } = props;
  let objectApiName = props.objectApiName || "space_users";
  const schema = (await getRecordDetailHeaderSchema(objectApiName, recordId, {showRecordTitle, formFactor: props.data.formFactor, showButtons, showBackButton, display: props.data.display, _inDrawer: props.data._inDrawer})).amisSchema;
  schema.className += " " + className;

  // Add CSS class names to the button flex container for overflow handling
  addButtonContainerClasses(schema);

  // Inject runtime overflow handler (amis custom component with ResizeObserver)
  if (showButtons !== false) {
    if (!Array.isArray(schema.body)) {
      schema.body = schema.body ? [schema.body] : [];
    }
    schema.body.push({
      type: 'custom',
      inline: true,
      id: OVERFLOW_HANDLER_ID,
      html: '',
      onMount: overflowOnMount,
      onUnmount: overflowOnUnmount
    });
  }

  // console.log(`AmisRecordDetailHeader======>`, Object.assign({}, schema, {onEvent: onEvent}))

  let config = Object.assign({}, schema, {onEvent: onEvent})

  if(schemaFilter && typeof schemaFilter === 'string'){
    let schemaFilterFun = new Function(
      'config',
      'props',
      schemaFilter
    );
    try {
      const _config = await schemaFilterFun(config, props);
      config = _config || config;
    } catch (e) {
      console.warn(e);
    }
  }
  // console.log(`AmisRecordDetailHeader==>`, config)
  return config
}