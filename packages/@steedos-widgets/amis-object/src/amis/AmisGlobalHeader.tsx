/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-05-18 22:39:31
 * @Description: 
 */

export const AmisGlobalHeader = async (props) => {
    const { logoSrc } = props
    const isMobile = window.innerWidth <= 768

    const schema = {
        "type": "wrapper",
        "className": 'p-0',
        body: [
            {
                "type": "wrapper",
                "className": "bg-white sticky p-0 top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50 sm:shadow  border-b-[3px] border-sky-500 border-solid steedos-header-container",
                body: [
                    {
                        "type": "wrapper",
                        "className": 'flex w-full px-4 h-[50px] p-0 justify-between items-center steedos-header-container-line-one',
                        "body": [
                            {
                                type: "service",
                                className: 'p-0 flex flex-1 items-center',
                                "onEvent": {
                                    "@history_paths.changed": {
                                        "actions": [
                                            {
                                                "actionType": "reload"
                                            }
                                        ]
                                    }
                                },
                                body: [
                                    {
                                        "type": "button",
                                        "className": "toggle-sidebar flex items-center pr-4",
                                        "hiddenOn": "true",
                                        "onEvent": {
                                            "click": {
                                                "actions": [
                                                    {
                                                        "actionType": "custom",
                                                        "script": "document.body.classList.toggle('sidebar-open')",
                                                    }
                                                ]
                                            }
                                        },
                                        "body": [
                                            {
                                                "type": "steedos-icon",
                                                "category": "utility",
                                                "name": "rows",
                                                "colorVariant": "default",
                                                "id": "u:afc3a08e8cf3",
                                                "className": "slds-button_icon slds-global-header__icon"
                                            }
                                        ],
                                    },
                                    {
                                        "type": "button",
                                        "visibleOn": "${window:innerWidth < 768 && (window:historyPaths.length > 1 || window:historyPaths[0].params.record_id)}",
                                        "className":"flex",
                                        "onEvent": {
                                            "click": {
                                                "actions": [
                                                    {
                                                        "actionType": "custom",
                                                        "script": "window.goBack()"
                                                    }
                                                ]
                                            }
                                        },
                                        "body": [
                                            {
                                                "type": "steedos-icon",
                                                "category": "utility",
                                                "name": "chevronleft",
                                                "colorVariant": "default",
                                                "className": "slds-button_icon slds-global-header__icon"
                                            }
                                        ]
                                    },
                                    {
                                        "className": 'block h-10 w-auto mr-4',
                                        "type": "tpl",
                                        "tpl": `<a href='/app' class='flex items-center '><img class='block h-10 w-auto' src='${logoSrc}'></a>`,
                                        "hiddenOn": "${window:innerWidth < 768 && (window:historyPaths.length > 1 || window:historyPaths[0].params.record_id)}"
                                    },
                                ],
                            },
                            {
                                "type": "steedos-global-header-toolbar",
                                "label": "Global Header",
                                className: 'flex flex-nowrap gap-x-3 items-center',
                                logoutScript: "window.signOut();",
                                customButtons: [
                                    {
                                        "type": "button",
                                        "className": "toggle-sidebar",
                                        "visibleOn": "${AND(app.showSidebar,!" + isMobile + ")}",
                                        "onEvent": {
                                            "click": {
                                                "actions": [
                                                    {
                                                        "actionType": "custom",
                                                        "script": "document.body.classList.toggle('sidebar-open')",
                                                    }
                                                ]
                                            }
                                        },
                                        "body": [
                                            {
                                                "type": "steedos-icon",
                                                "category": "utility",
                                                "name": "rows",
                                                "colorVariant": "default",
                                                "id": "u:afc3a08e8cf3",
                                                "className": "slds-button_icon slds-global-header__icon"
                                            }
                                        ],
                                    },
                                    {
                                        "type": "steedos-app-launcher",
                                        "showAppName": false,
                                        "appId": "${app.id}",
                                        "visibleOn": "${isMobile}"
                                    }
                                ]
                            }
                        ],
                    },

                    {
                        "type": "grid",
                        "className": 'steedos-context-bar flex flex-nowrap h-10 leading-5 pl-4 mb-[-3px] steedos-header-container-line-two',
                        "hiddenOn": "${" + isMobile + "}",
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
                                "hiddenOn": "${app.showSidebar === true}",
                                "body": [
                                    {
                                        "visibleOn": "${AND(!app.showSidebar,!" + isMobile + ")}",
                                        "type": "steedos-app-menu",
                                        "stacked": false,
                                        showIcon: false,
                                        "appId": "${app.id}",
                                        overflow: {
                                            enable: false,
                                            itemWidth: 80,
                                        },
                                        "id": "u:77851eb4aa89",
                                    }
                                ],
                                "id": "u:5367229505d8",
                                "md": "",
                                "valign": "middle",
                            }
                        ],
                    },
                ],
            },
            {
                "type": "button",
                "className": 'p-0 absolute inset-0 mt-[50px] sm:mt-[90px]',
                hiddenOn: "${OR(app.showSidebar != true,isMobile)}",
                body: [
                    {
                        type: "wrapper",
                        className: 'sidebar-wrapper px-0 pt-4 pb-16 fixed z-20 h-full h-fill ease-in-out duration-300 flex flex-col border-r overflow-y-auto bg-white border-slate-200 block -translate-x-0 sm:w-[220px] w-64',
                        body: [
                            {
                                "type": "steedos-app-launcher",
                                "className": "px-4 pb-4",
                                "visibleOn": "${isMobile}",
                                "showAppName": true
                            },
                            {
                                "type": "steedos-app-menu",
                                "stacked": true,
                                "appId": "${app.id}",
                            },
                        ]
                    },
                    {
                        "type": "wrapper",
                        "className": 'sidebar-overlay',
                        "hiddenOn": "${!isMobile}",
                    }
                ],
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "actionType": "custom",
                                "script": "console.log(event.target); if(window.innerWidth < 768){ document.body.classList.remove('sidebar-open'); }",
                            }
                        ]
                    }
                },
            },
        ],
    }
    return schema;
}