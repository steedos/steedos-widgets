/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-13 17:27:54
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-08-28 17:45:38
 * @Description: 
 */
import { i18next } from "../../../../i18n"

export const getMarkdownFieldSchema = (field, readonly, ctx)=>{
    if(readonly){
        return {
            "type": "control",
            "label": field.label,
            "body": {
              "type": "markdown",
              "name": field.name,
              "options": {
                  "linkify": true,
                  "html": true,
                  "breaks": true
              }
            }
          }
    }else{
        return {
            "type": "control",
            "label": field.label,
            "body": [
              {
                "type": "tabs",
                "tabsMode": "strong",
                "className": "steedos-markdown",
                "tabs": [
                  {
                    "title": i18next.t('frontend_form_edit'),
                    "tab": [
                      {
                        "type": "editor",
                        "name": field.name,
                        "language": "markdown",
                      }
                    ]
                  },
                  {
                    "title": i18next.t('frontend_form_preview'),
                    "tab": [
                      {
                        "type": "markdown",
                        "name": field.name,
                        "options": {
                          "linkify": true,
                          "html": true,
                          "breaks": true
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
    }
}

export const getHtmlFieldSchema = (field, readonly, ctx)=>{
    if(readonly){
        // return {
        //     "type": "control",
        //     "label": field.label,
        //     "body": {
        //       "type": "html",
        //       "name": field.name
        //     }
        //   }
        return {
          "type": "input-rich-text",
          "receiver": "${context.rootUrl}/s3/images",
          "name": field.name,
          "options": {
            "plugins": [
              "autoresize"
            ],
            // "max_height": 2000,
            "statusbar": false,
            "readonly": true,
            "toolbar": false,
            "menubar": false
          }
        }
    }else{
        return {
            "type": "input-rich-text",
            "receiver": "${context.rootUrl}/s3/images",
            "name": field.name
        }
        // return {
        //     "type": "group",
        //     "body": [
        //       {
        //         "type": "editor",
        //         "name": field.name,
        //         "language": "html"
        //       },
        //       {
        //         "type": "html",
        //         "name": field.name
        //       }
        //     ]
        //   }
    }
}