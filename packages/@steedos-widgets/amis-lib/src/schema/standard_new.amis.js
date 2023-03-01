/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: 廖大雪 2291335922@qq.com
 * @LastEditTime: 2023-03-01 15:50:27
 * @Description: 
 */

import { getPage } from '../lib/page'

export const getSchema = async (uiSchema, ctx)=>{
    return {
        "type": "service",
        "body": [
            {
              "type": "button",
              "label": "新建",
              "id": "u:standard_new",
              "level": "default",
                "onEvent": {
                  "click": {
                    "actions": [
                        {
                            "actionType": "custom",
                            "script": `SteedosUI.openNewRecordDialog(context.props.data, doAction)`
                        }
                    ],
                    "weight": 0
                  }
                },
                "className": ""
            }
        ],
        "regions": [
            "body"
        ],
        "className": "p-0 border-0",
        "id": "u:aef99d937b10"
    }
}