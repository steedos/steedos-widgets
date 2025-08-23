import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en_us from "./locales/en-US.json"
import zh_cn from "./locales/zh-CN.json"

const resources = {
  "en-US": {
    translation: en_us
  },
  "zh-CN": {
    translation: zh_cn
  }
};

var locale = "zh-CN";
if (typeof window != 'undefined') {
  var currentLocale = Builder.settings.context?.user?.locale;//window.Builder?.settings.locale
  if (currentLocale == "en-us") {
    locale = "en-US";
  } else if (currentLocale == "zh-cn") {
    locale = "zh-CN";
  }
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
export { i18n as i18next };