/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-26 16:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 11:25:18
 * @Description: 
 */
import * as Fields from '../fields';
import * as lodash from 'lodash';

const getFieldSchemaArray = (mergedSchema)=>{
  let fieldSchemaArray = [];
  fieldSchemaArray.length = 0

  const fieldsArr = [];
  lodash.forEach(mergedSchema.fields, (field, fieldName)=>{
    if(!lodash.has(field, "name")){
      field.name = fieldName
    }
        fieldsArr.push(field)
  })

  lodash.forEach(lodash.sortBy(mergedSchema.fields, "sort_no"), (field) => {
    if (!field.group || field.group == 'null' || field.group == '-')
      field.group = '通用'
    const fieldName = field.name;
    let isObjectField = /\w+\.\w+/.test(fieldName)
    if (field.type == 'grid' || field.type == 'object') {
      // field.group = field.label
      field.is_wide = true;
    }
    
    if (!isObjectField){
      if(!field.hidden){
          fieldSchemaArray.push(Object.assign({name: fieldName}, field, {permission: {allowEdit: true}}))
      }
    }
  })
  return fieldSchemaArray;
}

const getSection = async (permissionFields, fieldSchemaArray, sectionName, ctx) => {
  const sectionFields = lodash.filter(fieldSchemaArray, { 'group': sectionName });
  if(sectionFields.length == lodash.filter(sectionFields, ['hidden', true]).length){
    return ;
  }

  const fieldSetBody = [];

  for (const perField of sectionFields) {
    let field = perField;
      if(perField.type === 'grid'){
          field = await Fields.getGridFieldSubFields(perField, permissionFields);
      }else if(perField.type === 'object'){
          field = await Fields.getObjectFieldSubFields(perField, permissionFields);
      }
      if(field.name.indexOf(".") < 0){
          const amisField = await Fields.convertSFieldToAmisField(field, field.readonly, ctx);
          if(amisField){
              fieldSetBody.push(amisField);
          }
      }
  }

  // fieldSet 暂不支持显隐控制
  // const sectionFieldsVisibleOn = lodash.map(lodash.compact(lodash.map(fieldSetBody, 'visibleOn')) , (visibleOn)=>{
  //   return `(${visibleOn.substring(2, visibleOn.length -1)})`;
  // });

  const section = {
    "type": "fieldSet",
    "title": sectionName,
    "collapsable": true,
    "body": fieldSetBody,
  }
  // if(sectionFieldsVisibleOn.length > 0){
  //   section.visibleOn = `\${${sectionFieldsVisibleOn.join(" || ")}}`
  // }
  return section
}

export const getSections = async (permissionFields, mergedSchema, ctx) => {
  const fieldSchemaArray = getFieldSchemaArray(mergedSchema)
  const _sections = lodash.groupBy(fieldSchemaArray, 'group');
  const sections = [];
  for (const key in _sections) {
    const section = await getSection(permissionFields, fieldSchemaArray, key, ctx);
    if(section.body.length > 0){
      sections.push(section)
    }
  }
  return sections;
}