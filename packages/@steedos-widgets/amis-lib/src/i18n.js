/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-25 21:06:56
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-26 10:17:05
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en_us from "./locales/en-US.json"
import zh_cn from "./locales/zh-CN.json"

const resources = {
  "en": {
    translation: en_us
  },
  "zh-CN": {
    translation: zh_cn
  }
};

const getUserLanguage = () => {
  var lan = Builder.settings.context?.user?.language || window.navigator.language;
  if(lan === 'en' || lan.startsWith('en-')){
    lan = 'en'
  }
  return lan;
}

var locale = "zh-CN";
if (typeof window != 'undefined') {
  window.steedosI18next = i18n;
  locale = getUserLanguage();
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: locale,
    interpolation: {
      escapeValue: false
    }
  });
export { i18n as i18next, getUserLanguage };