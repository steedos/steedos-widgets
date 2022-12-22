import { getApi, getRecordPermissionsApi } from './fields/table';
import { getSaveApi } from './api';
import { each, values } from 'lodash';
import * as graphql from './graphql'

export async function getCalendarApi(mainObject, fields, options) {
  if (!options) {
    options = {};
  }
  const searchableFields = [];
  let { globalFilter, filter, sort, top, setDataToComponentId = '' } = options;

  if(!top){
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
    ${globalFilter ? `var filters = ${JSON.stringify(globalFilter)};` : 'var filters = [];'}
    if(_.isEmpty(filters)){
        filters = api.data.filter || ${JSON.stringify(filter)};
    }else{
        filters = [filters, 'and', api.data.filter || ${JSON.stringify(filter)}]
    }
    const eventFetchInfo = selfData.fetchInfo;
    const calendarOptions = selfData.calendarOptions || {};
    const startDateExpr = calendarOptions.startDateExpr || "start";
    const endDateExpr = calendarOptions.endDateExpr || "end";
    const eventDurationFilters = [[endDateExpr, ">=", eventFetchInfo.start], [startDateExpr, "<=", eventFetchInfo.end]];
    if(_.isEmpty(filters)){
      filters = eventDurationFilters;
    }else{
        filters = [filters, 'and', eventDurationFilters]
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
    var searchableFilter = [];
    _.each(selfData, (value, key)=>{
        if(!_.isEmpty(value) || _.isBoolean(value)){
            if(_.startsWith(key, '__searchable__between__')){
                searchableFilter.push([\`\${key.replace("__searchable__between__", "")}\`, "between", value])
            }else if(_.startsWith(key, '__searchable__')){
                if(_.isString(value)){
                    searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "contains", value])
                }else{
                    searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "=", value])
                }
            }
        }
    });

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
        SteedosUI.getRef(api.body.$self.scopeId)?.getComponentById(setDataToComponentId)?.setData({$count: payload.data.count})
    }
    const rows = payload.data.rows || [];
    const selfData = api.data.$self;
    const calendarOptions = selfData.calendarOptions || {};
    const startDateExpr = calendarOptions.startDateExpr || "start";
    const endDateExpr = calendarOptions.endDateExpr || "end";
    const allDayExpr = calendarOptions.allDayExpr || "is_all_day";
    const textExpr = calendarOptions.textExpr || "name";
    const events = rows.map(function(n){
      return {
        id: n["${idFieldName}"],
        title: n[textExpr],
        start: n[startDateExpr],
        end: n[endDateExpr],
        allDay: n[allDayExpr]
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
  const startDateExpr = calendarOptions.startDateExpr || "start";
  const endDateExpr = calendarOptions.endDateExpr || "end";
  const allDayExpr = calendarOptions.allDayExpr || "is_all_day";
  // const textExpr = calendarOptions.textExpr || "name";
  formData[startDateExpr] = "${event.data.event.start}";
  formData[endDateExpr] = "${event.data.event.end}";
  formData[allDayExpr] = "${event.data.event.allDay}";
  // formData[textExpr] = "${event.data.event.title}";
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
export async function getObjectCalendar(objectSchema, listView, options) {
  const permissions = objectSchema.permissions;
  if (!options) {
    options = {};
  }

  const calendarOptions = listView.options || {};
  const titleFields = calendarOptions.title || ["name"];
  let fields = [];
  each(titleFields, function (n) {
    if (objectSchema.fields[n]) {
      fields.push(objectSchema.fields[n]);
    }
  });

  const allDayExpr = calendarOptions.allDayExpr || "is_all_day";
  if (objectSchema.fields[allDayExpr]) {
    fields.push(objectSchema.fields[allDayExpr]);
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
    const calendarOptions = ${JSON.stringify(calendarOptions)} || {};
    const startDateExpr = calendarOptions.startDateExpr || "start";
    const endDateExpr = calendarOptions.endDateExpr || "end";
    const allDayExpr = calendarOptions.allDayExpr || "is_all_day";
    const textExpr = calendarOptions.textExpr || "name";
    doc[startDateExpr] = data.start;
    doc[endDateExpr] = data.end;
    doc[allDayExpr] = data.allDay;
    doc[textExpr] = data.title;
    // ObjectForm会认作用域下的变量值
    // TODO: 待组件支持initValues属性后应该改掉，不应该通过data直接传值
    // TODO: 全天事件属性传入doc了但是没有生效，需要手动在ObjectForm中勾选全天事件
    event.data = doc;
    const title = "新建 ${objectSchema.label}";
    doAction(
      {
        "actionType": "dialog",
        "dialog": {
          "type": "dialog",
          "title": title,
          "body": [
            {
              "type": "steedos-object-form",
              "objectApiName": "\${objectName}",
              "mode": "edit",
              "onEvent": {
                "submitSucc": {
                  "weight": 0,
                  "actions": [
                    {
                      "actionType": "custom",
                      "script": "event.data.view?.calendar.refetchEvents();"
                    }
                  ]
                }
              }
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
      "actionType": "dialog",
      "dialog": {
        "type": "dialog",
        "title": "",
        "body": [
          {
            "type": "steedos-record-detail",
            "objectApiName": "\${objectName}",
            "recordId": data.event && data.event.id
          }
        ],
        "closeOnEsc": false,
        "closeOnOutside": false,
        "showCloseButton": true,
        "size": "lg",
        "actions": []
      }
    });
  `;

  const recordId = "${event.id}";
  const recordPermissionsApi = getCalendarRecordPermissionsApi(objectSchema, recordId);
  const recordSaveApi = getCalendarRecordSaveApi(objectSchema, calendarOptions);
  const amisSchema = {
    "type": "steedos-fullcalendar",
    "label": "",
    "name": "fullcalendar",
    "editable": permissions.allowEdit,
    "selectable": permissions.allowCreate,
    "selectMirror": permissions.allowCreate,
    "onEvent": {
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
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": onEventClickScript
          }
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
              "msg": "您没有编辑该记录的权限！",
              "position": "top-center"
            }
          },
          {
            "actionType": 'ajax',
            "expression": "event.data.editable",
            "args": {
              "api": recordSaveApi,
              "messages": {
                "success": objectSchema.label + "修改成功",
                "failed": objectSchema.label + "修改失败！"
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
    }
  };
  return amisSchema;
}