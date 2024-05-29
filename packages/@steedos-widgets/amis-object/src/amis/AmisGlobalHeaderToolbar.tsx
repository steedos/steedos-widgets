
  /*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-29 11:45:57
 * @Description: 
 */

import './AmisGlobalHeaderToolbar.less';
import { i18next } from '@steedos-widgets/amis-lib';

const reg = /([^/]+)\/view\/([^/]+)/;

const notificationReadAdaptor = `
  var redirect = payload.redirect || payload;
  if(typeof redirect !== 'string'){
    redirect = "";
  }
  var matchs = redirect.match(${reg});
  var objectName = matchs.length > 1 ? matchs[1] : "";
  var recordId = matchs.length > 1 ? matchs[2] : "";
  payload = {
    status: 0,
    msg: '',
    data: {
      redirect: redirect,
      objectName: objectName,
      recordId: recordId
    }
  } 
  console.log("====payload==", payload);
  return payload;
`;

const beforeMarkReadAllScript = `
  var hasUnRead = !!db.notifications.find({'$or':[{'is_read': null},{'is_read': false}]}).count();
  // 没有订阅到未读通知时需要额外单独触发重新请求通知列表及未读数量
  // 如果有订阅到的话，因为监听订阅到的通知记录变化，有变化会触发@data.changed.notifications事件，从而会自动触发重新请求通知列表及未读数量
  event.data.needToReload = !hasUnRead;
`;

const getNotificationBadgeButton = () => {
  const isMobile = window.innerWidth < 768;
  const listContent = {
    "type": "page",
    "body": [
      {
        "type": "service",
        "className": "service-global-header-notifications-list",
        "body": [
          {
            "type": "panel",
            "title": i18next.t('frontend_notifications'),
            "className": "steedos-header-toolbar-notifications-panel " + (isMobile ? "" : "min-w-[300px] max-w-md"),
            "body": [
              {
                "type": "each",
                "className": "overflow-auto max-h-96 steedos-header-toolbar-notifications-list",
                "name": "notifications",
                "items": {
                  "type": "tpl",
                  "tpl": `<div class='flex items-center p-4 hover:bg-sky-50'>
                                  <img src='<%=data.context.rootUrl + "/avatar/" + data.from%>' alt='' class='h-10 w-10 flex-none rounded-full'>
                                  <div class='ml-4 flex-auto'>
                                    <div class='font-medium'>
                                      <span class='text-primary'><%=data.name%></span>
                                    </div>
                                    <div class='mt-1 text-gray-700'>
                                      <%=data.body%>
                                    </div>
                                    <div class='mt-1 text-gray-700'>
                                      <%=moment(data.created).locale(data.global.user.language).fromNow()%>
                                      <abbr class='slds-text-link slds-m-horizontal_xxx-small <%=data.is_read ? 'hidden' : ''%>' title='unread'>●</abbr>
                                    </div>
                                  </div>
                                </div>`,
                  "id": "u:07ece657c7b7",
                  "onEvent": {
                    "click": {
                      "weight": 0,
                      "actions": [
                        {
                          "args": {
                            "options": {},
                            "api": {
                              "url": "${context.rootUrl}/api/v4/notifications/${_id}/read?rootUrl=&appId=${appId}&async=true",
                              "method": "get",
                              "messages": {},
                              "headers": {
                                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                              },
                              "adaptor": "payload = {\n  status: 0,\n  msg: '',\n  data: {\n    redirect: payload.redirect || payload \n  }} \nreturn payload;"
                              // "adaptor": notificationReadAdaptor
                            }
                          },
                          "actionType": "ajax"
                        },
                        // {
                        //   "actionType": "custom",
                        //   "script": "if(Meteor.isCordova){window.open(Meteor.absoluteUrl(event.data.responseResult.responseData.redirect), '_blank')}else{window.open(event.data.responseResult.responseData.redirect, '_blank')}",
                        //   "expression": "${!!event.data.responseResult.responseData.redirect}",
                        // },
                        {
                          // PC端保持原样，新窗口打开
                          "actionType": "custom",
                          "script": "window.open(event.data.responseResult.responseData.redirect, '_blank')",
                          "expression": "${!!event.data.responseResult.responseData.redirect && window:innerWidth > 768}"
                        },
                        {
                          // 手机端改为直接跳路由，因为新窗口打开顶部会显示url地址栏
                          "actionType": "link",
                          "args": {
                            "link": "${redirect}"
                          },
                          "expression": "${!!event.data.responseResult.responseData.redirect && window:innerWidth <= 768}"
                        },
                        {
                          "actionType": "cancel",
                          "componentId": "steedos_header_toolbar_notifications_dialog",
                          "expression": "${!!event.data.responseResult.responseData.redirect && window:innerWidth <= 768}"
                        }
                      ]
                    }
                  }
                },
                "id": "u:18da41dab9ca"
              },
            ],
            actions: [
              {
                "type": "button",
                "label": i18next.t('frontend_notifications_close_dialog'),
                "visibleOn": "${window:innerWidth <= 768}",
                "close": true
              },
              {
                "type": "button",
                "label": i18next.t('frontend_notifications_allread'),
                "id": "u:5530f3779e3a",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "custom",
                        "script": beforeMarkReadAllScript 
                      },
                      {
                        "componentId": "",
                        "args": {
                          "api": {
                            "url": "${context.rootUrl}/api/v4/notifications/all/markReadAll",
                            "method": "post",
                            "headers": {
                              "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                            }
                          },
                          "messages": {
                            "success": i18next.t('frontend_notifications_allread_message')
                          }
                        },
                        "actionType": "ajax"
                      },
                      {
                        "componentId": "service_global_header_notifications_unread_count",
                        "actionType": "reload",
                        "expression": "${needToReload}"
                      },
                      {
                        "componentId": "service_global_header_notifications_list",
                        "actionType": "reload",
                        "expression": "${needToReload}"
                      }
                    ],
                    "weight": 0
                  }
                }
              }
            ]
          },
    
        ],
        "id": "service_global_header_notifications_list",
        "onEvent": {
          "@data.changed.notifications": {
            "actions": [
              {
                "actionType": "reload"
              }
            ]
          }
        },
        "messages": {
        },
        "api": {
          "method": "post",
          "url": "${context.rootUrl}/graphql",
          "data": {
            "&": "$$",
            "context": "${context}",
            "userId": "${context.userId}"
          },
          "dataType": "json",
          "requestAdaptor": "const { userId } = api.data;\napi.data = {\n    query: `{\n        notifications(filters: [\"owner\",\"=\",\"${userId}\"], sort: \"created desc,name\", top : 10){\n          _id,name,body,related_to,related_name,url,owner,is_read,from,created\n        }  }`\n}",
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          },
          "adaptor": "return payload.data"
        },
      }
    ],
    "onEvent": {
      "init": {
        "actions": [
          {
            "actionType": "custom",
            "script": "window.$('.service-global-header-notifications-list').closest('.amis-dialog-widget').addClass('steedos-header-toolbar-notifications-dialog');"
          }
        ]
      }
    },
    "bodyClassName": "p-0"
  }
  const badgeButtonContent = {
    "type": "service",
    "body": [
      {
        "type": "steedos-badge",
        "body": [
          {
            "type": "steedos-icon",
            "category": "utility",
            "name": "notification",
            "colorVariant": "default",
            "className": "slds-button_icon slds-global-header__icon"
          }
        ],
        "count": "${unReadCount}"
      },
    ],
    "id": "service_global_header_notifications_unread_count",
    "messages": {
    },
    "api": {
      "method": "post",
      "url": "${context.rootUrl}/graphql",
      "data": {
        "&": "$$",
        "context": "${context}",
        "userId": "${context.userId}"
      },
      "dataType": "json",
      "requestAdaptor": "const { userId } = api.data;\napi.data = {\n    query: `{\n unReadCount: notifications__count(filters: [[\"owner\",\"=\",\"${userId}\"], [\"is_read\", \"!=\", true]])\n    }`\n}",
      "headers": {
        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
      },
      "adaptor": "return payload.data"
    },
    "onEvent": {
      "@data.changed.notifications": {
        "actions": [
          {
            "actionType": "reload"
          }
        ]
      }
    },
    // "interval": 30000,
    "silentPolling": true
  };
  return isMobile ? {
    "type": "button",
    "body": badgeButtonContent,
    "actionType": "dialog",
    "dialog": {
      "title": "",
      "id": "steedos_header_toolbar_notifications_dialog",
      "body": listContent,
      "actions": [],
      "showCloseButton": false,
      "closeOnOutside": true
    }
  } : {
    "type": "steedos-dropdown",
    "placement": "bottomRight",
    "trigger": [
      "click"
    ],
    "body": [
      badgeButtonContent
    ],
    "overlay": [
      listContent
    ],
    "className": "antd-Action steedos-header-toolbar-notifications",
    "open": false
  };
}

export const AmisGlobalHeaderToolbar = async (props) => {
    const { className = '', data, logoutScript = "", customButtons = [] } = props;

    let  avatarSrc = null;

    if(data.context?.user?.avatar){
        avatarSrc = `${data.context.rootUrl || ""}/avatar/${data.context.user.userId}?w=220&h=200&fs=160&avatar=${data.context.user.avatar}`;
    }

    return {
        "type": "wrapper",
        "id": "u:9c3d279be31a",
        "className": `steedos-global-header-toolbar leading-3	${className}`,
        "size": "xs",
        "body": [
          ...customButtons,
          {
            "type": "button",
            "hiddenOn": "${window:innerWidth < 768 || (window:Meteor.settings.public && window:Meteor.settings.public.platform && window:Meteor.settings.public.platform.is_oem)}",
            "id": "u:267a7e84a89d",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "componentId": "",
                    "args": {
                      "url": "https://docs.steedos.com/zh-CN"
                    },
                    "actionType": "url"
                  }
                ]
              }
            },
            "body": [
              {
                "type": "steedos-icon",
                "category": "utility",
                "name": "help",
                "colorVariant": "default",
                "id": "u:afc3a08e8cf3",
                "className": "slds-button_icon slds-global-header__icon"
              }
            ],
            "label": i18next.t('frontend_help'),
            "className": "steedos-header-toolbar-help"
          },
          {
            "type": "dropdown-button",
            "className": "steedos-header-toolbar-setup",
            "visibleOn": "${window:innerWidth > 768}",
            "label": false,
            "trigger": "click",
            "level": "link",
            "btnClassName": "p-0 m-0",
            "icon": "fa fa-cog text-xl slds-button_icon m-0",
            "align": "right",
            "hideCaret": true,
            "buttons": [
              {
                "type": "button",
                "hiddenOn": "window.innerWidth < 768",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "args": {
                          "url": "/app/admin"
                        },
                        "actionType": "url"
                      }
                    ]
                  }
                },
                "id": "u:b5d0ab3a32b5",
                "level": "link",
                "label": i18next.t('frontend_setup')
              },
              // {
              //   "type": "divider",
              //   "className": "m-0",
              //   "visibleOn": "${window:Meteor.settings.public.enable_saas != true && global.user.is_space_admin == true}"
              // },
              {
                "type": "button",
                "label": "编辑对象",
                "className": "flex",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "ajax",
                        "outputVar": "responseResult",
                        "args": {
                          "api": {
                            "url": "/api/v1/objects/search",
                            "data": {
                              "filters": ["name", "=", "${window:FlowRouter|routerParams|pick:object_name}"],
                              "fields": ["_id"]
                            },
                            "method": "post",
                            "messages": {}
                          }
                        }
                      },
                        {
                            "args": {
                              "url": "/app/admin/objects/view/${responseResult.items[0]._id}",
                            },
                            "actionType": "url"
                          }
                    ]
                  }
                },
                "level": "link",
                "visibleOn": "${window:Meteor.settings.public.enable_saas != true && global.user.is_space_admin == true && window:FlowRouter|isObjectRouter}"
              },
              {
                "type": "button",
                "label": "编辑页面",
                "className": "flex",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "ajax",
                        "outputVar": "responseResult",
                        "args": {
                          "api": {
                            "url": "/api/v1/pages/search",
                            "data": {
                              "filters": ["name", "=", "${window:FlowRouter|routerParams|pick:page_id}"],
                              "fields": ["_id"]
                            },
                            "method": "post",
                            "messages": {}
                          }
                        }
                      },
                      {
                          "args": {
                            "url": "/app/admin/pages/view/${responseResult.items[0]._id}"
                          },
                          "actionType": "url"
                      }
                    ]
                  }
                },
                "level": "link",
                "visibleOn": "${window:Meteor.settings.public.enable_saas != true && global.user.is_space_admin == true && window:FlowRouter|isPageRouter}"
              }
            ]
          },
          getNotificationBadgeButton(),
          {
            "type": "steedos-dropdown",
            "placement": "bottomRight",
            "trigger": [
              "click"
            ],
            "body": [
              {
                "type": "avatar",
                "src": avatarSrc,
                "icon": "fa fa-user",
                "id": "u:033218742221",
                "style": {
                    "background": "rgb(59 130 246 / 0.5)",
                    "color": "#FFFFFF"
                },
                size: 30
              },
              {
                "type":"tpl",
                "tpl":"<span id=\"headerName\" class=\"user-name text-overflow \" style=\"display: none;height: 30px;line-height: 30px;font-size: 16px;font-weight: bold;margin-left: 10px;\">${global.user.name}<i class=\"fa fa-angle-down\" style=\"margin-left: 4px;\"></i></span>"
              }
            ],
            "overlay": [
              {
                "type": "wrapper",
                "className": "",
                "body": [
                  
                  {
                    "type": "grid",
                    "valign": "middle",
                    "align": "center",
                    "className": "m-2",
                    "columns": [
                      {
                        "body": [
                          {
                            "type": "avatar",
                            "className": "",
                            "src": avatarSrc,
                            "icon": "fa fa-user",
                            "id": "u:033218742221",
                            "style": {
                                "background": "rgb(59 130 246 / 0.5)",
                                "color": "#FFFFFF"
                            },
                          },
                        ],
                        "xs": "auto"
                      },
                      {
                        "body": [
                          {
                            "type": "tpl",
                            className: "block",
                            "tpl": "${context.user.name}",
                            "inline": true,
                          },
                          {
                            "type": "tpl",
                            className: "block",
                            "tpl": "${context.user.email}",
                            "inline": true,
                          },
                        ],
                        "columnClassName": "break-all"
                      }
                    ]
                  },
                  {
                    "type": "button",
                    "label": i18next.t('frontend_profile'),
                    "className": "flex",
                    "onEvent": {
                      "click": {
                        "actions": [
                            {
                                "args": {
                                  "url": "/app/admin/space_users/view/${context.user.spaceUserId}",
                                  "blank": false
                                },
                                "actionType": "link"
                              }
                        ]
                      }
                    },
                    "level": "link"
                  },
                  {
                    "type": "button",
                    "label": i18next.t('switch_space'),
                    "className": "flex",
                    "onEvent": {
                      "click": {
                        "actions": [
                            {
                                "args": {
                                  "url": "/accounts/a/#/select-space",
                                  "blank": false
                                },
                                "actionType": "url"
                              }
                        ]
                      }
                    },
                    "level": "link",
                    "visibleOn": "${window:Meteor.settings.public.enable_saas}"
                  },
                  {
                    "type": "button",
                    "label": i18next.t('frontend_about'),
                    "className": "flex",
                    "hiddenOn": "${window:Meteor.settings.public && window:Meteor.settings.public.platform && window:Meteor.settings.public.platform.is_oem}",
                    "onEvent": {
                      "click": {
                        "actions": [
                            {
                                "args": {
                                  "url": "/app/-/page/about",
                                  "blank": false
                                },
                                "actionType": "link"
                              }
                        ]
                      }
                    },
                    "level": "link"
                  },
                  {
                    "type": "button",
                    "label": i18next.t('frontend_log_out'),
                    "className": "flex",
                    "onEvent": {
                      "click": {
                        "actions": [
                            {
                                "componentId": "",
                                "args": {},
                                "actionType": "custom",
                                "script": logoutScript
                              }
                        ]
                      }
                    },
                    "level": "link"
                  }
                ],
              }
            ],
            "className": "antd-Action steedos-header-toolbar-user"
          }
        ]
      }
    
}