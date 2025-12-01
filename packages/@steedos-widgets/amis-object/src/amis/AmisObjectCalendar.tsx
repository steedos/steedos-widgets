/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-12-01 15:49:34
 * @Description: 
 */
import { getCalendarSchema } from '@steedos-widgets/amis-lib'

export const AmisObjectCalendar = async (props) => {
  console.log(`AmisObjectCalendar props`, props)
  const { $schema, top, sort, filters, filtersFunction, title, currentView, startDateExpr, endDateExpr, allDayExpr, textExpr, groups, resources, data, defaultData, className="", onEvent, config} = props;

  let objectApiName = props.objectApiName || "events";

  const amisSchemaData = Object.assign({}, data, defaultData);
  const id = props.id || `steedos_object_calendar_${objectApiName}`;
  let schema: any = (await getCalendarSchema(amisSchemaData.appId, objectApiName, {
    title,
    currentView,
    startDateExpr,
    endDateExpr,
    allDayExpr,
    textExpr,
    groups, 
    resources
  }, { top, sort, filter: filters, filtersFunction, onEvent, config, id }));
  const uiSchema = schema.uiSchema;
  const amisSchema = schema.amisSchema;
  // const serviceData = Object.assign({}, amisSchema.data, amisSchemaData, { objectName: objectApiName, uiSchema });
  const serviceData = Object.assign({}, { objectName: objectApiName, uiSchema });
  return {
    "type": "service",
    "body": amisSchema,
    "id": `service_${id}`,
    "className": `${className}`,
    "data": serviceData,
    "onEvent":{
      [`@data.changed.${objectApiName}`]: {
        "actions": [
            {
              "actionType": "custom",
              "script": "context.props.data.calendarApi.refetchEvents()"
            }
        ]
    }
    }
  }
}