/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-05 14:09:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-09 10:53:53
 * @Description: 
 */
window.Steedos = {};

window.lodash = _;

// i18n

window.t = (key, parameters, locale)=>{
    if(!key){
        return key;
    }
    if (locale === "zh-cn") {
        locale = "zh-CN";
    }
    let keys;
    if(_.isArray(key)){
        keys = key;
    }else{
        keys = [`CustomLabels.${key}`, key];
    }
    if ((parameters != null) && !(_.isObject(parameters))) {
        return i18next.t(keys, { lng: locale, postProcess: 'sprintf', sprintf: [parameters], keySeparator: false});
    } else {
        return i18next.t(keys, Object.assign({lng: locale}, {keySeparator: false}, parameters));
    }
};

window.TAPi18n = {
    __: window.t
};

i18next.init({ 
    lng: 'zh-CN',
    debug: false,
    fallbackNS: [],  //'translation'
    fallbackLng: [],
    interpolation: {
        prefix: "{$",
        suffix: "}"
    }
 });


fetch(`${STEEDOS_ROOT_URL || ''}/locales/zh-CN/translation`).then(response => response.json()).then(data =>{
    i18next.addResourceBundle('zh-CN', 'translation', data);
})
