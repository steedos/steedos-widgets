/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-07-07 09:46:39
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-07-07 10:58:19
 */
import en_us from "./locales/en-US.json"
import zh_cn from "./locales/zh-CN.json"
import { i18next } from '@steedos-widgets/amis-lib';


i18next.addResources('en-US', 'liveblocks', en_us);
i18next.addResources('zh-CN', 'liveblocks', zh_cn);

export { i18next };