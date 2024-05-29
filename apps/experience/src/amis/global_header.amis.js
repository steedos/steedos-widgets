/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-12 15:19:40
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 14:39:55
 * @Description: 未完成
 */


export default {
    "type": "page",
    "bodyClassName": "slds-global-header_container supports-backdrop-blur:bg-white/60 sticky top-0 z-40 w-full flex-none bg-white/95 shadow-none backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-transparent lg:z-50 lg:border-b lg:border-slate-900/10",
    "body": [
        {
            "type": "grid",
            "className": "slds-global-header slds-grid slds-grid_align-spread shadow-none",
            "columns": [
              {
                "body": [
                  {
                    "type": "tpl",
                    "tpl": "<div class='slds-global-header__logo' style='background-image:url(/logo.png);display:inline-block'></div>",
                    "inline": false,
                    "id": "u:ac9c702143ba"
                  }
                ],
                "columnClassName": "slds-global-header__item",
                "id": "u:df90ac69b596"
              },
              {
                "body": [
                ],
                "columnClassName": "slds-global-header__item",
                "id": "u:f6b4a939c733"
              },
              {
                "body": [
                    {
                        "type": "tpl",
                        "tpl": "<div class='slds-dropdown-trigger slds-dropdown-trigger_click' style='display:inline-block'><button onClick='window.open(\"https://docs.steedos.com/zh-CN\", \"_blank\");' class='slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__help slds-global-actions__item-action' id='header-help-popover-id' tabindex='0' title='Help and Training' type='button' aria-haspopup='true'><svg focusable='false' data-key='down' aria-hidden='true' class='slds-button__icon slds-global-header__icon'><use xlink:href='/assets/icons/utility-sprite/svg/symbols.svg#help'></use></svg><span class='slds-assistive-text'>Help and Training</span></button></div>",
                        "inline": false,
                        "className": "slds-global-actions__item",
                    },
                    {
                        "type": "custom",
                        "name": "myName",
                        "className": "slds-global-actions__item",
                        "onMount": (dom, value, onChange, props) => {
                          const div = document.createElement('div');
                          div.className = 'slds-dropdown-trigger slds-dropdown-trigger_click';
                          const button = document.createElement('button');
                          button.className = 'slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__notifications slds-global-actions__item-action';
                          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                          svg.setAttribute('class', 'slds-button__icon slds-global-header__icon')
                          const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/icons/utility-sprite/svg/symbols.svg#notification');
                          svg.appendChild(use);
                          button.appendChild(svg);
                          button.onclick = event => {
                            onChange('new', 'myName');
                            event.preventDefault();
                          };

                          const span = document.createElement('span');
                          span.className = 'slds-notification-badge slds-incoming-notification slds-show-notification';
                          span.innerText = '5'

                          div.appendChild(button);
                          div.appendChild(span);
                          dom.appendChild(div);
                        }
                      },
                    {
                        "type": "tpl",
                        "tpl": "<div class='hidden lg:relative lg:z-10 lg:ml-2 lg:flex lg:items-center'><div class='relative ml-0 flex-shrink-0'><div class='slds-global-actions__item'><button class='slds-dropdown-trigger slds-dropdown-trigger_click' id='headlessui-menu-button-:R34qm:' type='button' aria-haspopup='true' aria-expanded='false'><span class='sr-only'>Open user menu</span><img class='h-8 w-8 rounded-full' src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80' alt=''></button></div></div></div>",
                        "inline": false,
                        "className": "slds-global-actions__item",
                    }
                ],
                "md": "auto",
                "id": "u:3d2888de2605",
                "columnClassName": "slds-global-actions",
              }
            ],
            "id": "u:97ec73bfc148"
          }
]}


