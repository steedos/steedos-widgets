/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-24 14:30:04
 * @Description: 
 */
import { getCalendarSchema } from '@steedos-widgets/amis-lib'

export const AmisObjectCalendar = async (props) => {
  console.log(`AmisObjectCalendar props`, props)
  const { $schema, top, sort, filters, filtersFunction, title, currentView, startDateExpr, endDateExpr, allDayExpr, textExpr, data, defaultData, className="", onEvent} = props;

  let objectApiName = props.objectApiName || "events";

  const amisSchemaData = Object.assign({}, data, defaultData);
  let schema: any = (await getCalendarSchema(amisSchemaData.appId, objectApiName, {
    title,
    currentView,
    startDateExpr,
    endDateExpr,
    allDayExpr,
    textExpr
  }, { top, sort, filter: filters, filtersFunction, onEvent }));
  const uiSchema = schema.uiSchema;
  const amisSchema = schema.amisSchema;
  const serviceData = Object.assign({}, amisSchema.data, amisSchemaData, { objectName: objectApiName, uiSchema });
  return {
    "type": "service",
    "body": amisSchema,
    "className": `${className}`,
    "data": serviceData
  }
}