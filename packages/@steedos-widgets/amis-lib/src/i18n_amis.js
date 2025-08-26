/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-23 21:36:26
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-26 11:49:26
 */
import en_us from "./locales/amis/en-US.json"
import zh_cn from "./locales/amis/zh-CN.json"

const resourcesMap = {
  "en-US": en_us,
  "zh-CN": zh_cn,
};

const getUserLanguage = () => {
  var lan = Builder.settings.context?.user?.language || window.navigator.language;
  if (lan === 'en') {
    lan = 'en-US'
  }
  return lan;
}

var locale = "zh-CN";
if (typeof window != 'undefined') {
  locale = getUserLanguage();
}

function getAmisLocaleResource() {
  var rs = resourcesMap[locale];
  if (rs) {
    return rs;
  }
  return resourcesMap["zh-CN"];
}

if (typeof window != 'undefined') {
  var currentAmis = (window.amisRequire && window.amisRequire('amis')) || Amis;
  currentAmis && currentAmis.registerLocale(locale, getAmisLocaleResource())
}

export { getAmisLocaleResource };