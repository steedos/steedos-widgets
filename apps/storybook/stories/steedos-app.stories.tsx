/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-18 17:10:58
 * @Description: 
 */
import { React, AmisRender } from '../components/AmisRender';

import * as _ from 'lodash';

import {createHashHistory} from 'history';
import {match} from 'path-to-regexp';

const history = createHashHistory({});

function normalizeLink(to, location = history.location) {
  console.log(`normalizeLink`, to)
  to = to || '';

  if (to && to[0] === '#') {
    to = location.pathname + location.search + to;
  } else if (to && to[0] === '?') {
    to = location.pathname + to;
  }

  const idx = to.indexOf('?');
  const idx2 = to.indexOf('#');
  let pathname = ~idx
    ? to.substring(0, idx)
    : ~idx2
    ? to.substring(0, idx2)
    : to;
  let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
  let hash = ~idx2 ? to.substring(idx2) : location.hash;

  if (!pathname) {
    pathname = location.pathname;
  } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
    let relativeBase = location.pathname;
    const paths = relativeBase.split('/');
    paths.pop();
    let m;
    while ((m = /^\.\.?\//.exec(pathname))) {
      if (m[0] === '../') {
        paths.pop();
      }
      pathname = pathname.substring(m[0].length);
    }
    pathname = paths.concat(pathname).join('/');
  }

  return pathname + search + hash;
}

function isCurrentUrl(to, ctx?) {
  if (!to) {
    return false;
  }
  const pathname = history.location.pathname;
  const link = normalizeLink(to, {
    ...location,
    pathname,
    hash: ''
  });

  if (!~link.indexOf('http') && ~link.indexOf(':')) {
    let strict = ctx && ctx.strict;
    return match(link, {
      decode: decodeURIComponent,
      strict: typeof strict !== 'undefined' ? strict : true
    })(pathname);
  }

  return decodeURI(pathname) === link;
}

const APPENV = {
  theme: 'antd',
  updateLocation: (location, replace) => {
    debugger;
    location = normalizeLink(location);
    if (location === 'goBack') {
      return history.goBack();
    } else if (
      (!/^https?\:\/\//.test(location) &&
        location === history.location.pathname + history.location.search) ||
      location === history.location.href
    ) {
      // 目标地址和当前地址一样，不处理，免得重复刷新
      return;
    } else if (/^https?\:\/\//.test(location) || !history) {
      return (window.location.href = location);
    }

    history[replace ? 'replace' : 'push'](location);
  },
  jumpTo: (to, action) => {
    debugger;
    if (to === 'goBack') {
      return history.goBack();
    }

    to = normalizeLink(to);

    if (isCurrentUrl(to)) {
      return;
    }

    if (action && action.actionType === 'url') {
      action.blank === false
        ? (window.location.href = to)
        : window.open(to, '_blank');
      return;
    } else if (action && action.blank) {
      window.open(to, '_blank');
      return;
    }

    if (/^https?:\/\//.test(to)) {
      window.location.href = to;
    } else if (
      (!/^https?\:\/\//.test(to) &&
        to === history.pathname + history.location.search) ||
      to === history.location.href
    ) {
      // do nothing
    } else {
      history.push(to);
    }
  },
  isCurrentUrl: isCurrentUrl,
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets.json`,
  ],
};

const data = {};

export default {
  title: 'Steedos/App',
};

const appId = 's3';

const defaultPages = {
  label: '默认路由',
  children: [
    {
      url: '/app/:appId/:objectName/view/:objectRecordId',
      label: "详细页面",
      icon: "far fa-address-book",
      schema: {
        type: 'page',
        body: {
          "type": "steedos-page-object-control",
          "name": "steedosPageObjectControl",
          "data": {
            objectName: "${objectName}",
            pageType: 'record',
            recordId: "${objectRecordId}"
          }
        },
        data: {
          objectName: "${params.objectName}",
          pageType: 'record',
          recordId: "${params.objectRecordId}"
        }
      }
    }
  ]
}

function transformToPages(data) {
  // 用一个 Map 来存储分组后的数据
  const groupMap = new Map();

  data.forEach(item => {
      const group = item.group || '未分类';
      if (!groupMap.has(group)) {
          groupMap.set(group, {
              label: group,
              children: []
          });
      }

      const page: any = {
          label: item.name,
          icon: "far fa-address-book", //item.icon
          url: item.id, //item.path,
          // Check if the item is a link and set the 'link' property instead of 'url'
          ...(item.type === 'url' ? { link: item.path } : {})
      };

      if(item.type === 'object'){
        page.schema = {
          type: 'page',
          body: {
            "type": "steedos-page-object-control",
            "name": "steedosPageObjectControl",
            "data": {
              objectName: item.id,
              pageType: 'list'
            }
          },
          data: {
            objectName: item.id,
            pageType: 'list'
          }
        }
      }

      if(item.type === 'url'){
        if(page.link){
          page.redirect = page.link.replace("${context.user.spaceUserId}", (window as any).Builder.settings.context.userId).replace("${global.user.spaceId}", (window as any).Builder.settings.context.tenantId)
        }
        delete page.link;
      }

      groupMap.get(group).children.push(page);
  });

  // 将 Map 转换回数组
  console.log('transformToPages', Array.from(groupMap.values()))
  return Array.from(groupMap.values());
}

export const SteedosApp = () => (
  <AmisRender schema={{"type": "page","body": {
    "type": "steedos-page-object-control",
    "name": "steedosPageObjectControl",
    "data": {
      objectName: "space_users",
      pageType: 'list'
    }
  }}} data={data} env={APPENV}/>
)

export const SteedosApp2 = ()=>{
  const isMobile = window.innerWidth <= 768;
  const logoSrc = '/images/logo_platform.png'; 
  const APPSchema = {
    type: 'service',
    data: {
      name: "s3"
    },
    body: {
      "type": "app",
      "brandName": "s3",
      // "header": {
      //   "type": "steedos-global-header",
      //   "className": "w-full",
      //   "logoSrc": logoSrc,
      //   "customButtons": [
      //     {
      //         "type": "button",
      //         "className": "toggle-sidebar",
      //         "visibleOn": "${AND(app.showSidebar,!" + isMobile + ")}",
      //         "onEvent": {
      //             "click": {
      //                 "actions": [
      //                     {
      //                         "actionType": "custom",
      //                         "script": "document.body.classList.toggle('sidebar-open')",
      //                     }
      //                 ]
      //             }
      //         },
      //         "body": [
      //             {
      //                 "type": "steedos-icon",
      //                 "category": "utility",
      //                 "name": "rows",
      //                 "colorVariant": "default",
      //                 "id": "u:afc3a08e8cf3",
      //                 "className": "slds-button_icon slds-global-header__icon"
      //             }
      //         ],
      //     },
      //     {
      //         "type": "steedos-app-launcher",
      //         "showAppName": false,
      //         "appId": "${app.id}",
      //         "visibleOn": "${isMobile}"
      //     }
      //   ]
      // },
      "header": {
          "type": "grid",
          "className": 'steedos-context-bar flex flex-nowrap h-10 leading-5 pl-5 mb-[-3px] steedos-header-container-line-two',
          "columns": [
              {
                  "columnClassName": "items-center flex pb-0",
                  "body": [
                      {
                          "type": "steedos-app-launcher",
                          "showAppName": true,
                          "appId": "${app.id}",
                      }
                  ],
                  "md": "auto",
                  "valign": "middle"
              },
              {
                  "columnClassName": "flex overflow-hidden",
                  "body": [
                    {
                      "type": "steedos-global-header-toolbar",
                      "label": "Global Header",
                      className: 'flex flex-nowrap gap-x-3 items-center justify-end',
                      logoutScript: "window.signOut();",
                      // customButtons: customButtons
                    }
                  ],
                  "id": "u:5367229505d8",
                  "md": "",
                  "valign": "middle",
              }
          ],
      },
      "asideBefore": {},
      "asideAfter": {},
      "footer": {},
      "className": "ml-4",
      "api": {
          "method": "get",
          "cache": "10000",
          "url": `/service/api/apps/${appId}/menus`,
          "data": null,
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          },
          "adaptor": transformToPages.toString() +";const defaultPages = "+ JSON.stringify(defaultPages)+";\r const pages = [...transformToPages(payload.children), defaultPages]; console.log('pages', pages);\r return {pages: pages, name: payload.name};",
      },
      "id": "u:53a05f7c471a"
    }
  };
  const amisInstance = amisRequire('amis/embed').embed(
    document.body,
    APPSchema,
    {
      location: history.location,
      context: {
        amisUser: {
          id: 1,
          name: 'AMIS User'
        },
        context: {
          app: appId,
          appId: appId,
          app_id: appId,
          user: {
            is_space_admin: true
          }
        },
        appId: appId,
        app_id: appId,
      }
    },
    APPENV
  );

  history.listen(state => {
    amisInstance.updateProps({
      location: state.location || state
    });
  });

  document.addEventListener('click', function(event) {
    // 确保点击的是链接
    const target = event.target.closest('a');
    if (target) {
        // 阻止默认的跳转行为
        event.preventDefault();
        const originalHref = target.getAttribute('href');
        // 你可以在这里处理自定义的逻辑
        console.log('拦截链接:', originalHref);

        history.push(originalHref)
    }
});
}
