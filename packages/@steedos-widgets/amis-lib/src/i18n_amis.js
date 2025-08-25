/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-23 21:36:26
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-25 21:34:58
 */
import en from "./locales/amis/en.json"
import zh_cn from "./locales/amis/zh-CN.json"
import { getUserLanguage } from "./i18n"

const resourcesMap = {
  "en": en,
  "zh-CN": zh_cn,
};

var locale = "zh-CN";
if (typeof window != 'undefined') {
  locale = getUserLanguage();
}

function getAmisLocaleResource() {
  if (resourcesMap[locale]) {
    return resourcesMap[locale];
  }
  return resourcesMap["zh-CN"];
}

if (typeof window != 'undefined') {
  window.amisRequire("amis").registerLocale(locale, getAmisLocaleResource())
}

export { getAmisLocaleResource };