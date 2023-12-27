import { getApi, getRecordPermissionsApi } from './fields/table';
import { getSaveApi } from './api';
import { each, values } from 'lodash';
import * as graphql from './graphql'
import _, { isEmpty, omitBy, isNil } from 'lodash';
import { i18next } from "../../../i18n"

export const DEFAULT_CALENDAR_OPTIONS = {
  startDateExpr: "start",
  endDateExpr: "end",
  allDayExpr: "is_all_day",
  textExpr: "name"
};

export async function getCalendarApi(mainObject, fields, options) {
  if (!options) {
    options = {};
  }
  const calendarOptions = options.calendarOptions;
  const searchableFields = [];
  let { filter, sort, top, setDataToComponentId = '' } = options;

  if (!top) {
    // 日历请求不翻页
    top = 200;
  }

  if (_.isArray(filter)) {
    filter = _.map(filter, function (item) {
      if (item.operation) {
        return [item.field, item.operation, item.value];
      } else {
        return item
      }
    })
  }
  if (!filter) {
    filter = [];
  }

  _.each(fields, function (field) {
    if (field.searchable) {
      searchableFields.push(field.name);
    }
  })

  const idFieldName = mainObject.idFieldName || "_id";
  let valueField = mainObject.key_field || '_id';
  const api = await getApi(mainObject, null, fields, { alias: 'rows', limit: top, queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"` });
  api.data.$term = "$term";
  api.data.$self = "$$";
  api.data.filter = "$filter";
  api.data.pageSize = top || 10;
  api.requestAdaptor = `
    let selfData = JSON.parse(JSON.stringify(api.data.$self));
    var filters = api.data.filter || ${JSON.stringify(filter)} || [];
    const eventFetchInfo = selfData.fetchInfo;
    const startDateExpr = "${calendarOptions.startDateExpr}";
    const endDateExpr = "${calendarOptions.endDateExpr}";
    const eventDurationFilters = [[endDateExpr, ">=", eventFetchInfo.start], [startDateExpr, "<=", eventFetchInfo.end]];
    if(_.isEmpty(filters)){
      filters = eventDurationFilters;
    }else{
        filters = [filters, 'and', eventDurationFilters]
    }

    if(api.data.$self.additionalFilters){
      filters.push(api.data.$self.additionalFilters)
    }else if(api.data.$self.event.data.additionalFilters){
      filters.push(api.data.$self.event.data.additionalFilters)
    }

    var pageSize = api.data.pageSize || 10;
    var pageNo = api.data.pageNo || 1;
    var skip = (pageNo - 1) * pageSize;
    var orderBy = api.data.orderBy || '';
    var orderDir = api.data.orderDir || '';
    var sort = orderBy + ' ' + orderDir;
    sort = orderBy ? sort : "${sort}";
    var allowSearchFields = ${JSON.stringify(searchableFields)};
    if(api.data.$term){
        filters = [["name", "contains", "'+ api.data.$term +'"]];
    }else if(selfData.op === 'loadOptions' && selfData.value){
        filters = [["${valueField.name}", "=", selfData.value]];
    }
    var searchableFilter = SteedosUI.getSearchFilter(selfData) || [];

    if(searchableFilter.length > 0){
        if(filters.length > 0 ){
            filters = [filters, 'and', searchableFilter];
        }else{
            filters = searchableFilter;
        }
    }

    if(allowSearchFields){
        allowSearchFields.forEach(function(key){
            const keyValue = selfData[key];
            if(_.isString(keyValue)){
                filters.push([key, "contains", keyValue]);
            }else if(_.isArray(keyValue) || _.isBoolean(keyValue) || keyValue){
                filters.push([key, "=", keyValue]);
            }
        })
    }

    if(selfData.__keywords && allowSearchFields){
        const keywordsFilters = [];
        allowSearchFields.forEach(function(key, index){
            const keyValue = selfData.__keywords;
            if(keyValue){
                keywordsFilters.push([key, "contains", keyValue]);
                if(index < allowSearchFields.length - 1){
                    keywordsFilters.push('or');
                }
            }
        })
        filters.push(keywordsFilters);
    }
    api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
    delete api.data.$term;
    delete api.data.filter;
    delete api.data.pageSize;
    delete api.data.pageNo;
    delete api.data.orderBy;
    delete api.data.orderDir;
    return api;
  `
  api.adaptor = `
    window.postMessage(Object.assign({type: "listview.loaded"}), "*");
    const setDataToComponentId = "${setDataToComponentId}";
    if(setDataToComponentId){
        var scope = SteedosUI.getRef(api.body.$self.scopeId);
        var setDataToComponent = scope && scope.getComponentById(setDataToComponentId);
        if(setDataToComponent){
          setDataToComponent.setData({$count: payload.data.count});
        }
        // SteedosUI.getRef(api.body.$self.scopeId)?.getComponentById(setDataToComponentId)?.setData({$count: payload.data.count})
    }
    const rows = payload.data.rows || [];
    const selfData = api.data.$self;
    const events = rows.map(function(n){
      return {
        id: n["${idFieldName}"],
        title: n["${calendarOptions.textExpr}"],
        start: n["${calendarOptions.startDateExpr}"],
        end: n["${calendarOptions.endDateExpr}"],
        allDay: n["${calendarOptions.allDayExpr}"],
        extendedProps: n
      }
    });
    const successCallback = selfData.successCallback;
    const failureCallback = selfData.failureCallback;
    successCallback(events);
    return payload;
  `;
  return api;
}

export function getCalendarRecordPermissionsApi(mainObject, recordId) {
  const api = getRecordPermissionsApi(mainObject, recordId, { alias: 'rows', limit: 1, fields: ["allowEdit"] });
  api.data.$self = "$$";
  api.adaptor = `
    const rows = payload.data.rows || [];
    const selfData = api.data.$self;
    const revert = selfData.revert;
    const recordPermissions = rows[0] && rows[0].recordPermissions;
    const editable = !!(recordPermissions && recordPermissions.allowEdit);
    if(!editable){
      // 没有权限时还原
      revert && revert();
    }
    payload.data.editable = editable;
    return payload;
  `;
  return api;
}

export function getCalendarRecordSaveApi(object, calendarOptions) {
  const formData = {};
  const idFieldName = object.idFieldName || "_id";
  formData[idFieldName] = "${event.data.event.id}";
  const nameFieldKey = object.NAME_FIELD_KEY || "name";
  formData[nameFieldKey] = "${event.data.event.title}";
  formData[calendarOptions.startDateExpr] = "${event.data.event.start}";
  formData[calendarOptions.endDateExpr] = "${event.data.event.end}";
  formData[calendarOptions.allDayExpr] = "${event.data.event.allDay}";
  // formData[calendarOptions.textExpr] = "${event.data.event.title}";
  const apiData = {
    objectName: "${objectName}",
    $: formData,
    $self: "$$"
  };
  const saveDataTpl = `
    const formData = api.data.$;
    const objectName = api.data.objectName;
    let query = \`mutation{record: \${objectName}__update(id: "\${formData.${idFieldName}}", doc: {__saveData}){${idFieldName}}}\`;
    delete formData.${idFieldName};
    let __saveData = JSON.stringify(JSON.stringify(formData));
  `;
  const requestAdaptor = `
    ${saveDataTpl}
    api.data.query = query.replace('{__saveData}', __saveData);
    return api;
  `;

  return {
    method: 'post',
    url: graphql.getApi(),
    data: apiData,
    requestAdaptor: requestAdaptor,
    adaptor: `
        if(payload.errors){
            payload.status = 2;
            payload.msg = payload.errors[0].message;
            const revert = api.data.$self.event.data.revert;
            revert && revert();
        }
        return payload;
    `,
    headers: {
      Authorization: "Bearer ${context.tenantId},${context.authToken}"
    }
  };
}

/**
 * 列表视图Calendar amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export async function getObjectCalendar(objectSchema, calendarOptions, options) {
  const permissions = objectSchema.permissions;
  if (!options) {
    options = {};
  }

  calendarOptions = Object.assign({}, DEFAULT_CALENDAR_OPTIONS, omitBy(calendarOptions, isNil));

  const titleFields = calendarOptions.title || [
    calendarOptions.startDateExpr,
    calendarOptions.endDateExpr,
    calendarOptions.allDayExpr,
    calendarOptions.textExpr
  ];
  let fields = [];
  each(titleFields, function (n) {
    if (objectSchema.fields[n]) {
      fields.push(objectSchema.fields[n]);
    }
  });

  if (objectSchema.fields[calendarOptions.allDayExpr]) {
    fields.push(objectSchema.fields[calendarOptions.allDayExpr]);
  }

  let sort = options.sort;
  if (!sort) {
    const sortField = options.sortField;
    const sortOrder = options.sortOrder;
    if (sortField) {
      let sortStr = sortField + ' ' + sortOrder || 'asc';
      sort = sortStr;
    }
  }
  let initialView = calendarOptions.currentView;
  if (initialView) {
    // day, week, month, agenda
    switch (initialView) {
      case "day":
        initialView = "timeGridDay"
        break;
      case "week":
        initialView = "timeGridWeek"
        break;
      case "month":
        initialView = "dayGridMonth"
        break;
      case "agenda":
        initialView = "listWeek"
        break;
    }
  }
  else {
    initialView = "timeGridWeek";
  }

  options.calendarOptions = calendarOptions;
  const api = await getCalendarApi(objectSchema, fields, options);

  const onGetEventsScript = `
    const api = ${JSON.stringify(api)};
    event.data.calendarOptions = ${JSON.stringify(calendarOptions)};
    doAction({
      "actionType": 'ajax',
      "args": {
        "api": api
      },
    });
  `;

  const onSelectScript = `
    const data = event.data;
    const doc = {};
    doc["${calendarOptions.startDateExpr}"] = data.start;
    doc["${calendarOptions.endDateExpr}"] = data.end;
    doc["${calendarOptions.allDayExpr}"] = data.allDay;
    doc["${calendarOptions.textExpr}"] = data.title;
    // ObjectForm会认作用域下的变量值
    // TODO: 待组件支持initValues属性后应该改掉，不应该通过data直接传值
    // TODO: 全天事件属性传入doc了但是没有生效，需要手动在ObjectForm中勾选全天事件
    const title = "${i18next.t('frontend_form_new')} ${objectSchema.label}";
    doAction(
      {
        "actionType": "dialog",
        "dialog": {
          "type": "dialog",
          "title": title,
          data,
          "body": [
            {
              "type": "steedos-object-form",
              "objectApiName": "\${objectName}",
              "mode": "edit",
              "defaultData": doc,
              //改回为通用的提交事件
              // "onEvent": {
              //   "submitSucc": {
              //     "weight": 0,
              //     "actions": [
              //       {
              //         "actionType": "custom",
              //         "script": "event.data.view?.calendar.refetchEvents();"
              //       }
              //     ]
              //   }
              // }
            }
          ],
          "closeOnEsc": false,
          "closeOnOutside": false,
          "showCloseButton": true,
          "size": "lg"
        }
      });
  `;

  const onEventClickScript = `
    const data = event.data;
    const eventData = data.event;
    const appId = data.appId;
    const objectName = data.objectName;
    const eventId = data.event && data.event.id;
    doAction({
      "actionType": "link",
      "args": {
        "link": "/app/" + appId + "/" + objectName + "/view/" + eventId
      }
    });
    // doAction({
    //   "actionType": "dialog",
    //   "dialog": {
    //     "type": "dialog",
    //     "title": "",
    //     "body": [
    //       {
    //         "type": "steedos-record-detail",
    //         "objectApiName": "\${objectName}",
    //         "recordId": data.event && data.event.id
    //       }
    //     ],
    //     "closeOnEsc": false,
    //     "closeOnOutside": false,
    //     "showCloseButton": true,
    //     "size": "lg",
    //     "actions": []
    //   }
    // });
  `;

  const recordId = "${event.id}";
  const recordPermissionsApi = getCalendarRecordPermissionsApi(objectSchema, recordId);
  const recordSaveApi = getCalendarRecordSaveApi(objectSchema, calendarOptions);

  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '08:00',
    endTime: '18:00',
  };
  if (!isEmpty(calendarOptions.startDayHour)) {
    businessHours.startTime = `${calendarOptions.startDayHour}:00`;
  }
  if (!isEmpty(calendarOptions.endDayHour)) {
    businessHours.endTime = `${calendarOptions.endDayHour}:00`;
  }

  // api.trackExpression="\\\${additionalFilters}";
  const onEvent = {
    "getEvents": {
      "weight": 0,
      "actions": [
        {
          "componentId": "",
          "args": {
          },
          "actionType": "custom",
          "script": onGetEventsScript
        }
        // {
        //   "actionType": "ajax",
        //   "outputVar": "responseResult",
        //   "args": {
        //     "options": {
        //     },
        //     "api": api
        //     // {
        //     //   "url": "111",
        //     //   "method": "post",
        //     //   "data": {
        //     //     "calendarOptions": JSON.stringify(calendarOptions);
        //     //   }
        //     // }
        //   }
        // }
      ]
    },
    "select": {
      "weight": 0,
      "actions": [
        {
          "componentId": "",
          "args": {
          },
          "actionType": "custom",
          "script": onSelectScript
        }
      ]
    },
    "eventClick": {
      "weight": 0,
      "actions": [
        {
          "actionType": "custom",
          "script": onEventClickScript
        },
        // amis 升级到 3.2后，以下的"actionType": "link"方式拿不到appId和objectName了
        // {
        //   "actionType": "link",
        //   "args": {
        //     "link": "/app/${appId}/${objectName}/view/${event.id}"
        //   }
        // }
      ]
    },
    "eventAdd": {
      "weight": 0,
      "actions": [
        {
          "componentId": "",
          "args": {
          },
          "actionType": "custom",
          "script": "console.log('eventAdd'); console.log(event);"
        }
      ]
    },
    "eventChange": {
      "weight": 0,
      "actions": [
        {
          "actionType": 'ajax',
          "args": {
            "api": recordPermissionsApi
          }
        },
        {
          "actionType": "toast",
          "expression": "!event.data.editable",
          "args": {
            "msgType": "error",
            "msg": i18next.t('frontend_message_no_permission_to_edit'),
            "position": "top-center"
          }
        },
        {
          "actionType": 'ajax',
          "expression": "event.data.editable",
          "args": {
            "api": recordSaveApi,
            "messages": {
              "success": objectSchema.label + i18next.t('frontend_message_modification_successful'),
              "failed": objectSchema.label + i18next.t('frontend_message_modification_successful')
            }
          }
        }
      ]
    },
    "eventRemove": {
      "weight": 0,
      "actions": [
        {
          "componentId": "",
          "args": {
          },
          "actionType": "custom",
          "script": "console.log('eventRemove'); console.log(event);"
        }
      ]
    },
    "eventsSet": {
      "weight": 0,
      "actions": [
        {
          "componentId": "",
          "args": {
          },
          "actionType": "custom",
          "script": "console.log('eventsSet'); console.log(event);"
        }
      ]
    },
    "getRef": {
      "weight": 0,
      "actions": [
        {
          "componentId": `service_${options.id}`,
          "args": {
            "value":{
              "calendarRef": "${event.data.calendarRef}"
            }
          },
          "actionType": "setValue",
        }
      ]
    }
  };

  Object.assign(onEvent, options.onEvent);

  const config = options.config || {};
  if(config.eventContent && typeof config.eventContent === "string"){
    const hasReturn = /\breturn\b/.test(config.eventContent);
    if(hasReturn){
      try {
        // 如果是包括return语句的字符串，则按函数解析，见 https://fullcalendar.io/docs/content-injection
        let fn = new Function("arg", config.eventContent);
        config.eventContent = fn;
      } catch (e) {
        console.warn(e);
      }
    }
  }

  if(config.noEventsContent && typeof config.noEventsContent === "string"){
    const hasReturn = /\breturn\b/.test(config.noEventsContent);
    if(hasReturn){
      try {
        // 如果是包括return语句的字符串，则按函数解析，见 https://fullcalendar.io/docs/content-injection
        let fn = new Function("arg", config.noEventsContent);
        config.noEventsContent = fn;
      } catch (e) {
        console.warn(e);
      }
    }
  }

  const amisSchema = {
    "type": "steedos-fullcalendar",
    "label": "",
    "id": options.id,
    "name": "fullcalendar",
    "placeholder":"${additionalFilters}",//用于触发reload
    "editable": permissions.allowEdit,
    "selectable": permissions.allowCreate,
    "selectMirror": permissions.allowCreate,
    "initialView": initialView,
    "businessHours": businessHours,
    "views":{
      listWeek: {
        buttonText: i18next.t('frontend_calendar_listWeek')
      }
    },
    ...config,
    "onEvent": onEvent
  };
  return amisSchema;
}