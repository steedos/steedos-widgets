/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-26 16:02:08
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-06-02 16:54:41
 * @Description: 
 */
import * as Fields from '../fields';
import * as lodash from 'lodash';

const getFieldSchemaArray = (formFields) => {
  let fieldSchemaArray = [];
  fieldSchemaArray.length = 0

  lodash.forEach(formFields, (field) => {
    if (!field.group || field.group == 'null' || field.group == '-')
      field.group = '通用'
    const fieldName = field.name;
    let isObjectField = /\w+\.\w+/.test(fieldName)
    if (field.type == 'grid' || field.type == 'object') {
      // field.group = field.label
      field.is_wide = true;
    }

    if (!isObjectField) {
      if (!field.hidden) {
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
    return visibleOn;
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
  return section
}

export const getSections = async (permissionFields, formFields, ctx) => {
  if (!ctx) {
    ctx = {};
  }
  const fieldSchemaArray = getFieldSchemaArray(formFields)
  const _sections = lodash.groupBy(fieldSchemaArray, 'group');
  const sections = [];
  var sectionVisibleOns = [];
  for (const key in _sections) {
    const section = await getSection(formFields, permissionFields, fieldSchemaArray, key, ctx);
    if (section.body.length > 0) {
      if (section.visibleOn) {
        sectionVisibleOns.push(section.visibleOn);
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
    return [
      {
        "type": "tabs",
        "tabs": sections,
        "tabsMode": ctx.tabsMode
      }
    ]
  }

  return sections;
}