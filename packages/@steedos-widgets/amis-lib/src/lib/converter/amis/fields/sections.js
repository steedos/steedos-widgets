/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-26 16:02:08
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-10-12 18:25:05
 * @Description: 
 */
import * as Fields from '../fields';
import * as lodash from 'lodash';
import { i18next } from '../../../../i18n'

const getFieldSchemaArray = (formFields, ctx) => {
  let fieldSchemaArray = [];
  fieldSchemaArray.length = 0
  const recordId = ctx && ctx.recordId;

  lodash.forEach(formFields, (field) => {
    if (!field.group || field.group == 'null' || field.group == '-')
      field.group = i18next.t('frontend_field_group_generalization')
    const fieldName = field.name;
    let isObjectField = /\w+\.\w+/.test(fieldName)
    if (field.type == 'grid' || field.type == 'object') {
      // field.group = field.label
      field.is_wide = true;
    }

    let forceHidden = false;
    if(!recordId && field.readonly && !ctx.isEditor){
      // 新建记录时，只读字段先隐藏，后续支持显示后，即任务：https://github.com/steedos/steedos-platform/issues/3164 完成后再放开
      // 表单只读时所有字段都是readonly，设计器中如果forceHidden会造成整个表单在只读的时候显示为空白了，所以要排除掉
      forceHidden = true;
    }

    if (!isObjectField) {
      if (!field.hidden && !forceHidden) {
        fieldSchemaArray.push(Object.assign({ name: fieldName }, field, { permission: { allowEdit: true } }))
      }
    }
  })
  return fieldSchemaArray;
}

const getSection = async (formFields, permissionFields, fieldSchemaArray, sectionName, ctx) => {
  if (!ctx) {
    ctx = {};
  }
  const sectionFields = lodash.filter(fieldSchemaArray, { 'group': sectionName });
  if (sectionFields.length == lodash.filter(sectionFields, ['hidden', true]).length) {
    return;
  }

  const fieldSetBody = [];

  for (const perField of sectionFields) {
    let field = perField;
    if (perField.type === 'grid') {
      field = await Fields.getGridFieldSubFields(perField, formFields);
      // console.log(`perField.type grid ===> field`, field)
    } else if (perField.type === 'object') {
      field = await Fields.getObjectFieldSubFields(perField, formFields);
      // console.log(`perField.type object ===> field`, field)
    }
    if (field.name.indexOf(".") < 0) {
      ctx.__formFields = formFields;
      const amisField = await Fields.convertSFieldToAmisField(field, field.readonly, ctx);
      // console.log(`${field.name} amisField`, field, amisField)
      if (amisField) {
        fieldSetBody.push(amisField);
      }
    }
  }

  // fieldSet 已支持显隐控制
  const sectionFieldsVisibleOn = lodash.map(lodash.compact(lodash.map(fieldSetBody, 'visibleOn')), (visibleOn) => {
    let visible = visibleOn;
    if(visible.indexOf('${')>-1){
      visible = visible.substring(visible.indexOf('{')+1, visible.indexOf('}'))
    }
    return visible ? "("+visible+")" : visible;
  });

  let section = {
    "type": "fieldSet",
    "title": sectionName,
    "collapsable": true,
    "body": fieldSetBody,
  }

  if (ctx.enableTabs) {
    section = {
      "title": sectionName,
      "body": fieldSetBody,
    }
  }

  if (sectionFieldsVisibleOn.length > 0 && fieldSetBody.length === sectionFieldsVisibleOn.length) {
    section.visibleOn = `${sectionFieldsVisibleOn.join(" || ")}`
  }

  const fieldGroups = ctx.fieldGroups;
  const group = fieldGroups && fieldGroups.find(function(groupItem){
    return groupItem.group_name == sectionName;
  });
  let groupVisibleOn = group && group.visible_on;
  if (groupVisibleOn) {
    if (groupVisibleOn.startsWith("{{")) {
      groupVisibleOn = `${groupVisibleOn.substring(2, groupVisibleOn.length - 2).replace(/formData./g, 'data.')}`
    } else {
      groupVisibleOn = `${groupVisibleOn.replace(/formData./g, 'data.')}`
    }
    if (section.visibleOn) {
      section.visibleOn = `${section.visibleOn + " && " + groupVisibleOn}`;
    }
    else {
      section.visibleOn = groupVisibleOn;
    }
  }
  return section
}

export const getSections = async (permissionFields, formFields, ctx) => {
  if (!ctx) {
    ctx = {};
  }
  const fieldSchemaArray = getFieldSchemaArray(formFields, ctx)
  const _sections = lodash.groupBy(fieldSchemaArray, 'group');
  const sections = [];
  var sectionVisibleOns = [];
  for (const key in _sections) {
    const section = await getSection(formFields, permissionFields, fieldSchemaArray, key, ctx);
    if (section.body.length > 0) {
      if (section.visibleOn) {
        sectionVisibleOns.push("("+section.visibleOn+")");
      }
      else{
        sectionVisibleOns.push("true");
      }
      sections.push(section)
    }
  }
  /*
  为了实现只有一个分组时隐藏该分组标题，需要分三种情况(分组如果没有visibleon属性就代表一定显示，有visibleon需要进行判断)
  1 当前分组为隐藏时，标题就设置为隐藏
  2 当前分组为显示时，其他分组只要有一个是显示，就显示该分组标题
  3 当前分组为显示时，其他分组都隐藏，就隐藏该分组标题
  */
  sections.forEach((section, index) => {
    var tempSectionVisibleOns = sectionVisibleOns.slice();
    tempSectionVisibleOns.splice(index, 1);
    section.headingClassName = {
      "hidden": `!((${tempSectionVisibleOns.join(" || ") || 'false'}) && ${sectionVisibleOns[index]})`
    }
  });

  if (ctx.enableTabs) {
    // TODO: 以下sectionHeaderVisibleOn代码逻辑是为实现只有一个选项卡时给选项卡添加sectionHeaderVisibleOn样式类来把选项卡顶部卡头隐藏
    // 但是 amis filter过滤器有两个bug造成此功能不好实现：
    // 1.filter过滤器只支持对象数组，并不支持boolean或字符串数组，见： https://github.com/baidu/amis/issues/7078
    // 2.filter过滤器的返回结果无法进一步获取最终过滤后的数组长度，见：https://github.com/baidu/amis/issues/7077
    // let sectionHeaderVisibleOn = "false";
    // if(sectionVisibleOns.length){
    //   sectionHeaderVisibleOn = "[" + sectionVisibleOns.join(",") + "]" + "|filter:equals:true.length > 1";
    // }
    // console.log("===sectionHeaderVisibleOn===", sectionHeaderVisibleOn);
    // sectionHeaderVisibleOn = "[true]|filter:equals:true.length > 1";
    // sectionHeaderVisibleOn = "false";
    // sectionHeaderVisibleOn = "[1,1,1]|filter:equals:1.length > 1";
    return [
      {
        "type": "tabs",
        // "className": {
        //   "hiddenFormTabs": `!(${sectionHeaderVisibleOn})`
        // },
        "tabs": sections,
        "tabsMode": ctx.tabsMode
      }
    ]
  }

  return sections;
}