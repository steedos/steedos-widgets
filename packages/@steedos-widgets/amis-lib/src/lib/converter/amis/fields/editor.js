/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-13 17:27:54
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-06-16 15:58:21
 * @Description: 
 */


export const getMarkdownFieldSchema = (field, readonly, ctx)=>{
    if(readonly){
        return {
            "type": "markdown",
            "name": field.name,
            "options": {
                "linkify": true,
                "html": true,
                "breaks": true
            }
          }
    }else{
        return {
            "type": "group",
            "body": [
              {
                "type": "editor",
                "name": field.name,
                "language": "markdown",
              },
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
    }
}

export const getHtmlFieldSchema = (field, readonly, ctx)=>{
    if(readonly){
        return {
            "type": "control",
            "label": field.label,
            "body": {
              "type": "html",
              "name": field.name
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