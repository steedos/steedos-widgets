import './index.less';

import { sampleSize, has, isArray, isEmpty, isString, pick, includes, clone, forEach, each, isObject, get } from 'lodash';

import { AmisSteedosField } from '../AmisSteedosField'

function generateRandomString(length = 5) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return sampleSize(characters, length).join('');
}

// 通用函数生成器
const createFieldFunction = (type: string) => {
  return async (props) => {
    if(!props.config){
        props.config = {}
    };

    if(!props.config.object){
        props.config.object = props.data?.objectName || '';
    }

    if(!props.config.name){
        props.config.name = `f${generateRandomString(5)}`;
    }

    if(props.config.type === 'textarea'){
      if(!props.config.rows){
        props.config.rows = 3;
      }
    }

    if(props.config.type === 'select'){
      if(!props.config.options){
        props.config.options = [{
          label: '选项1',
          value: 'v1'
        },{
          label: '选项2',
          value: 'v2'
        }]
      }
    }

    if( includes(['number', 'currency', 'percent', 'summary'], props.config.type)){
      if(!props.config.precision){
        props.config.precision = 18;
      }
      if(!props.config.scale && props.config.scale != 0){
        props.config.scale = 2;
      }
    }

    if(props.config.type === 'autonumber'){
      if(!props.config.formula){
        props.config.formula = '自动编号{YYYY}{MM}{DD}{000}'
      }
    }

    

    if(has(props, '$$editor')){
      const t = (window as any).steedosI18next.t;
      // props.config = Object.assign({}, props.config, {label: `${props.config.label}:${props.config.name}`})
      if(props.config.hidden || props.config.visible_on === '{{false}}'){
        props.config = Object.assign({}, props.config, {label: `${props.config.label}(${t('widgets-meta:hidden', '隐藏')})`, visible_on: null})
      }else if(props.config.type === 'autonumber' && props.config.autonumber_enable_modify != true){
        props.config = Object.assign({}, props.config, {label: `${props.config.label}(${t('widgets-meta:hidden', '隐藏')})`, autonumber_enable_modify: true})
      }

      if(props.config.amis){
        if(isString(props.config.amis)){
          props.config.amis = JSON.parse(props.config.amis);
        }
        props.config.amis.mode = 'horizontal';
      }else {
        props.config.amis = {
          mode: 'horizontal'
        };
      }

      if(props.config.multiple){
        if(props.config.amis){
          props.config.amis.multiple = true
        }else{
          props.config.amis = {
            multiple: true
          }
        }
      }

    }

    if(props.config.type === 'table'){
      props.config.amis.type = 'input-table';
      const schema = props.config;
      if(has(props, '$$editor')){
        delete schema.visibleOn
      }
      schema.className = `sfield-item sfield-item-${props.config.type} ${schema.className || ''}`
      return schema
    }
    const schema = await AmisSteedosField(props);
    if(has(props, '$$editor')){
      delete schema.visibleOn
    }
    schema.className = `sfield-item sfield-item-${props.config.type} ${schema.className || ''}`
    return schema;
    // {
    //   type: "steedos-field",
    //   config: Object.assign({}, props.config || {}, {
    //     type: type
    //   })
    // };
  }
}

// 针对每个字段类型生成函数和元数据
const fieldTypes = [
  { name: "Text", type: "text", title: "文本", icon: "fa-fw fa fa-list-alt" },
  { name: "Textarea", type: "textarea", title: "多行文本", icon: "fa-fw fa fa-list-alt" },
  { name: "Html", type: "html", title: "HTML", icon: "fa-fw fa fa-code" },
  { name: "Lookup", type: "lookup", title: "查找", icon: "fa-fw fa fa-search" },
  { name: "MasterDetail", type: "master_detail", title: "主细节", icon: "fa-fw fa fa-link" },
  { name: "Select", type: "select", title: "选择", icon: "fa-fw fa fa-list" },
  { name: "Boolean", type: "boolean", title: "布尔", icon: "fa-fw fa fa-check" },
  { name: "Date", type: "date", title: "日期", icon: "fa-fw fa fa-calendar" },
  { name: "Datetime", type: "datetime", title: "日期时间", icon: "fa-fw fa fa-clock" },
  { name: "Time", type: "time", title: "时间", icon: "fa-fw fa fa-clock" },
  { name: "Number", type: "number", title: "数字", icon: "fa-fw fa fa-calculator" },
  { name: "Currency", type: "currency", title: "货币", icon: "fa-fw fa fa-money" },
  { name: "Percent", type: "percent", title: "百分比", icon: "fa-fw fa fa-percent" },
  { name: "Image", type: "image", title: "图片", icon: "fa-fw fa fa-image" },
  { name: "File", type: "file", title: "文件", icon: "fa-fw fa fa-file" },
  { name: "Code", type: "code", title: "代码", icon: "fa-fw fa fa-code" },
  { name: "Markdown", type: "markdown", title: "Markdown", icon: "fa-fw fa fa-markdown" },
  { name: "Color", type: "color", title: "颜色", icon: "fa-fw fa fa-palette" },
  { name: "Toggle", type: "toggle", title: "切换", icon: "fa-fw fa fa-toggle-on" },
  { name: "Password", type: "password", title: "密码", icon: "fa-fw fa fa-key" },
  { name: "Autonumber", type: "autonumber", title: "自动编号", icon: "fa-fw fa fa-hashtag" },
  { name: "Url", type: "url", title: "URL", icon: "fa-fw fa fa-link" },
  { name: "Email", type: "email", title: "电子邮件", icon: "fa-fw fa fa-envelope" },
  { name: "Location", type: "location", title: "位置", icon: "fa-fw fa fa-map-marker" },
  { name: "Formula", type: "formula", title: "公式", icon: "fa-fw fa fa-sigma" },
  { name: "Summary", type: "summary", title: "累计汇总", icon: "fa-fw fa fa-sum" },
  { name: "Table", type: "table", title: "表格", icon: "fa-fw fa fa-table" }
];

// 生成每个字段类型的函数
const generatedFunctions: any = fieldTypes.reduce((acc, {name, type}) => {
  acc[`SteedosField${name}`] = createFieldFunction(type);
  return acc;
}, {});

// 导出所有生成的函数
export const {
  SteedosFieldText,
  SteedosFieldTextarea,
  SteedosFieldHtml,
  SteedosFieldLookup,
  SteedosFieldMasterDetail,
  SteedosFieldSelect,
  SteedosFieldBoolean,
  SteedosFieldDate,
  SteedosFieldDatetime,
  SteedosFieldTime,
  SteedosFieldNumber,
  SteedosFieldCurrency,
  SteedosFieldPercent,
  SteedosFieldImage,
  SteedosFieldFile,
  SteedosFieldCode,
  SteedosFieldMarkdown,
  SteedosFieldColor,
  SteedosFieldToggle,
  SteedosFieldPassword,
  SteedosFieldAutonumber,
  SteedosFieldUrl,
  SteedosFieldEmail,
  SteedosFieldLocation,
  SteedosFieldFormula,
  SteedosFieldSummary,
  SteedosFieldTable
} = generatedFunctions;

export default generatedFunctions;
