/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-25 20:44:20
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-26 11:42:16
 */
import en from "./locales/en.json"
import zh_cn from "./locales/zh-CN.json"

if (typeof window != 'undefined') {
    console.log(' i18n addResources widgets-meta en', en);
    console.log(' i18n addResources widgets-meta zh-CN', zh_cn);
    (window as any).steedosI18next.addResources('en', 'widgets-meta', en);
    (window as any).steedosI18next.addResources('zh-CN', 'widgets-meta', zh_cn);
}

export {  };