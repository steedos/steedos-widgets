
  /*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 10:32:37
 * @Description: 
 */

import './AmisGlobalHeader.less';

export const AmisGlobalHeader = async (props) => {
    const { className = '', data, logoutScript = "", customButtons = [] } = props;
    
    let  avatarSrc = null;

    if(data.context?.user?.avatar){
        avatarSrc = `${data.context.rootUrl || ""}/avatar/${data.context.user.userId}?w=220&h=200&fs=160&avatar=${data.context.user.avatar}`;
    }

    return {
        "type": "wrapper",
        "id": "u:9c3d279be31a",
        "className": `steedos-global-header leading-3	${className}`,
        "size": "xs",
        "body": [
          ...customButtons,
          {
            "type": "button",
            "hiddenOn": "window.innerWidth < 768",
            "id": "u:267a7e84a89d",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "componentId": "",
                    "args": {
                      "url": "https://www.steedos.com/docs"
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
            "label": "帮助"
          },
          {
            "type": "button",
            "hiddenOn": "window.innerWidth < 768",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "componentId": "",
                    "args": {
                      "url": "/app/admin"
                    },
                    "actionType": "url"
                  }
                ]
              }
            },
            "id": "u:b5d0ab3a32b5",
            "body": [
              {
                "type": "steedos-icon",
                "category": "utility",
                "name": "setup",
                "colorVariant": "default",
                "id": "u:793a86f8a9e4",
                "className": "slds-button_icon slds-global-header__icon"
              }
            ],
            "label": "设置"
          },
          {
            "type": "steedos-dropdown",
            "placement": "bottomRight",
            "trigger": [
              "click"
            ],
            "body": [
              {
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
                "id": "u:aba521eed5b7",
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
                "interval": 30000,
                "silentPolling": true
              }
            ],
            "overlay": [
                {
                    "type": "service",
                    "body": [
                        {
                            "type": "panel",
                            "title": "通知",
                            "className": "min-w-[300px]",
                            "body": [
                              {
                                "type": "each",
                                className: "overflow-auto max-h-96",
                                "name": "notifications",
                                "items": {
                                  "type": "tpl",
                                  "tpl": "<div class='flex items-center p-4 hover:bg-sky-50'><img src='<%=data.context.rootUrl + `/avatar/` + data.from%>' alt='' class='h-10 w-10 flex-none rounded-full'><div class='ml-4 flex-auto'><div class='font-medium'><a href='<%=data.context.rootUrl + `/api/v4/notifications/` + data._id + `/read` %>' target='_blank'><%=data.name%></a></div><div class='mt-1 text-slate-700'><%=data.body%></div><div class='mt-1 text-slate-700'><%=moment(data.created).fromNow()%><abbr class='slds-text-link slds-m-horizontal_xxx-small <%=data.is_read ? 'hidden' : ''%>' title='unread'>●</abbr></div></div></div>",
                                  "id": "u:07ece657c7b7"
                                },
                                "id": "u:18da41dab9ca"
                              },
                            ],
                            actions: [
                              {
                                "type": "button",
                                "label": "全部标记为已读",
                                "id": "u:5530f3779e3a",
                                "onEvent": {
                                  "click": {
                                    "actions": [
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
                                            "success": "已全部标记为已读"
                                          }
                                        },
                                        "actionType": "ajax"
                                      }
                                    ],
                                    "weight": 0
                                  }
                                }
                              }
                            ]
                          },
                          
                    ],
                    "id": "u:aba521eed5b7",
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
            "id": "u:857e8161c96b",
            "className": "antd-Action",
            "open": false
          },
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
                        ]
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
                        ]
                      }
                    ]
                  },
                  {
                    "type": "button",
                    "label": "个人资料",
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
                  // {
                  //   "type": "button",
                  //   "label": "关于",
                  //   "className": "flex",
                  //   "onEvent": {
                  //     "click": {
                  //       "actions": [
                  //           {
                  //               "args": {
                  //                 "url": "/app/admin/page/creator_about",
                  //                 "blank": false
                  //               },
                  //               "actionType": "link"
                  //             }
                  //       ]
                  //     }
                  //   },
                  //   "level": "link"
                  // },
                  {
                    "type": "button",
                    "label": "注销",
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
            "className": "antd-Action"
          }
        ]
      }
    
}