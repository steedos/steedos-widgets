/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-25 21:06:56
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-26 10:17:05
 */
import * as i18next from "i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import en_us from "./locales/en-US.json"
import zh_cn from "./locales/zh-CN.json"
import widget_en from './locales/widgets/en.json'
import widget_zh from './locales/widgets/zh-CN.json'
import { map } from 'lodash';

const resources = {
  "en": {
    translation: en_us,
    'widgets-meta': widget_en
  },
  "zh-CN": {
    translation: zh_cn,
    'widgets-meta': widget_zh
  }
};

const getUserLanguage = () => {
  var lan = Builder.settings.context?.user?.language || Builder.settings.locale || window.navigator.language;
  if(lan === 'en' || lan.startsWith('en-')){
    lan = 'en'
  }
  return lan;
}

var locale = "zh-CN";
if (typeof window != 'undefined') {
  window.steedosI18next = i18next;
  // locale = getUserLanguage();
}

if (!i18next.isInitialized) {
  i18next
    // .use(LanguageDetector)
    .init({
      // lng: locale,
      fallbackLng: 'zh-CN',
      resources,
    }, ()=>{
      console.log("i18next initialized:", locale);
      // i18next.addResources('en', 'translation', en_us);
      // i18next.addResources('en', 'widgets-meta', widget_en);
      // i18next.addResources('zh-CN', 'translation', zh_cn);
      // i18next.addResources('zh-CN', 'widgets-meta', widget_zh);
    });
} else {
  i18next.addResources('en', 'translation', en_us);
  i18next.addResources('en', 'widgets-meta', widget_en);
  i18next.addResources('zh-CN', 'translation', zh_cn);
  i18next.addResources('zh-CN', 'widgets-meta', widget_zh);
}


export { getUserLanguage };