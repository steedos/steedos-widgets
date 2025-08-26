/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-25 20:44:20
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-25 23:15:44
 */
import en from "./locales/en.json"
import zh_cn from "./locales/zh-CN.json"
import { i18next } from '@steedos-widgets/amis-lib';

i18next.addResources('en', 'metas-amis-object', en);
i18next.addResources('zh-CN', 'metas-amis-object', zh_cn);

if (typeof window != 'undefined') {
    // 直接用(window as any).i18next不生效，只能另外定变量
    (window as any).i18nextMetasAmisObject = i18next;
}

export { i18next };