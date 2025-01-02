/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-01-02 15:39:40
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-02 15:43:32
 */
import { getMeta, getTableAdminEvents, getGridOptions, getTableHeader } from './tables';

const getAgGrid = (table: any, mode: string, { env }) => {
    const onDataFilter = async function (config: any, AgGrid: any, props: any, data: any, ref: any) {
        // 为ref.current补上props属性，否则props.dispatchEvent不能生效
        ref.current.props = props;
        let dispatchEvent = async function (action, data) {
            props.dispatchEvent(action, data, ref.current);
        }
        let gridOptions = getGridOptions(table, mode, {
            dispatchEvent,
            env
        });
        return gridOptions;
    }
    const tableId = table._id;
    const agGrid = {
        "type": "ag-grid",
        "onDataFilter": onDataFilter,
        "className": "steedos-tables-grid-content mt-2 h-96",
        "style": {
            "height": "calc(100% - 58px)"
        },
        "onEvent": {
            // "@b6tables.addRecord": {
            //     "actions": [
            //         {
            //           "actionType": "toast",
            //           "args": {
            //             "msgType": "warning",
            //             "msg": "1155我是全局警告消息，可以配置不同类型和弹出位置~",
            //             "position": "top-right"
            //           }
            //         }
            //     ]
            // },
            "setGridApi": {
                "weight": 0,
                "actions": [
                    // {
                    //     "ignoreError": false,
                    //     "actionType": "custom",
                    //     "script": "debugger;",
                    //     "args": {
                    //     }
                    // },
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@b6tables.${tableId}.setGridApi`
                        },
                        "data": {
                            "gridApi": "${gridApi}",
                            "gridContext": "${gridContext}"
                        }
                    }
                ]
            },
            "editField": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@b6tables.${tableId}.editField`
                        },
                        "data": {
                            "editingFieldId": "${editingFieldId}"
                        }
                    }
                ]
            },
            "deleteField": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@b6tables.${tableId}.deleteField`
                        },
                        "data": {
                            "deletingFieldId": "${deletingFieldId}"
                        }
                    }
                ]
            },
            "sortFields": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@b6tables.${tableId}.sortFields`
                        },
                        "data": {
                            "sortedFields": "${sortedFields}"
                        }
                    }
                ]
            },
            "setTotalCount": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@b6tables.${tableId}.setTotalCount`
                        },
                        "data": {
                            "totalCount": "${totalCount}"
                        }
                    }
                ]
            }
        }
    };
    return agGrid;
}

export async function getTablesGridSchema(
    tableId: string,
    mode: string, //edit/read/admin
    { env }
) {
    const meta = await getMeta(tableId);
    let tableAdminEvents = {};
    const isAdmin = mode === "admin";
    if (isAdmin) {
        tableAdminEvents = getTableAdminEvents(meta);
    }

    const amisSchema = {
        "type": "service",
        "id": `service_tables_grid_${tableId}`,
        "name": "page",
        "data": {
            "_aggridTotalCount": "--"
        },
        "className": "steedos-tables-grid h-full",
        "body": [
            getTableHeader(meta, mode, { env }),
            getAgGrid(meta, mode, { env })
        ],
        "onEvent": {
            [`@b6tables.${tableId}.setGridApi`]: {
                "actions": [
                    // {
                    //     "ignoreError": false,
                    //     "actionType": "custom",
                    //     "script": "debugger;console.log('===event.data===', event.data);",
                    //     "args": {
                    //     }
                    // },
                    {
                        "actionType": "setValue",
                        "args": {
                            "value": {
                                "gridApi": "${gridApi}",
                                "gridContext": "${gridContext}"
                            }
                        },
                        // "componentId": "apps-form"
                    }
                ]
            },
            [`@b6tables.${tableId}.setTotalCount`]: {
                "actions": [
                    {
                        "actionType": "setValue",
                        "args": {
                            "value": {
                                "_aggridTotalCount": "${totalCount}"
                            }
                        },
                        // "componentId": "apps-form"
                    }
                ]
            },
            ["@b6tables.addRecord"]: {
                "actions": [
                    {
                        "actionType": "toast",
                        "args": {
                            "msgType": "warning",
                            "msg": "11我是全局警告消息，可以配置不同类型和弹出位置~",
                            "position": "top-right"
                        }
                    }
                ]
            },
            ...tableAdminEvents
        }
    };
    return {
        meta,
        amisSchema,
    };
}