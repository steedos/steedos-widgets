/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-13 17:27:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-13 17:54:01
 * @Description: 
 */


export const getMarkdownFieldSchema = (field, readonly, ctx)=>{
    if(readonly){
        return {
            "type": "markdown",
            "name": field.name
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
                "name": field.name
              }
            ]
          }
    }
}

export const getHtmlFieldSchema = (field, readonly, ctx)=>{
    if(readonly){
        return {
            "type": "html",
            "name": field.name
          }
    }else{
        return {
            "type": "group",
            "body": [
              {
                "type": "editor",
                "name": field.name,
                "language": "markdown"
              },
              {
                "type": "html",
                "name": field.name
              }
            ]
          }
    }
}