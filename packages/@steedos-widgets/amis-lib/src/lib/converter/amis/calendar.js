import { getApi } from './fields/table';
import { each } from 'lodash';

export async function getCalendarApi(mainObject, fields, options) {
  if (!options) {
    options = {};
  }
  const searchableFields = [];
  let { globalFilter, filter, sort, top, setDataToComponentId = '' } = options;

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

  let valueField = mainObject.key_field || '_id';
  const api = await getApi(mainObject, null, fields, { alias: 'rows', limit: top, queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"` });
  api.data.$term = "$term";
  api.data.$self = "$$";
  api.data.filter = "$filter"
  api.requestAdaptor = `
    console.log("===requestAdaptor==api===", api);
    let selfData = JSON.parse(JSON.stringify(api.data.$self));
    console.log("===requestAdaptor==selfData===", selfData);
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
    return api;
  `
  api.adaptor = `
    window.postMessage(Object.assign({type: "listview.loaded"}), "*");
    const setDataToComponentId = "${setDataToComponentId}";
    if(setDataToComponentId){
        SteedosUI.getRef(api.body.$self.scopeId)?.getComponentById(setDataToComponentId)?.setData({$count: payload.data.count})
    }
    console.log("===adaptor==payload===", payload);
    const rows = payload.data.rows || [];
    const events = rows.map(function(n){
      return {
        id: n._id,
        title: n.name,
        start: n.start,
        end: n.end
      }
    });
    console.log("===adaptor==api===", api);
    console.log("===adaptor==events===", events);
    const selfData = api.data.$self;
    const successCallback = selfData.successCallback;
    const failureCallback = selfData.failureCallback;
    successCallback(events);
    return payload;
  `;
  return api;
}

/**
 * 列表视图Calendar amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export async function getObjectCalendar(objectSchema, listView, options) {
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

  let sort = options.sort;
  if(!sort){
      const sortField = options.sortField;
      const sortOrder = options.sortOrder;
      if(sortField){
          let sortStr = sortField + ' ' + sortOrder || 'asc';
          sort = sortStr;
      }
  }

  const api = await getCalendarApi(objectSchema, fields, options);

  const getEventsScript = `
    const api = ${JSON.stringify(api)};
    console.log('getEventsScript==api====', api); 
    console.log('getEventsScript==event.data====', event.data); 
    event.data.calendarOptions = ${JSON.stringify(calendarOptions)};
    doAction({
      "actionType": 'ajax',
      "args": {
        "api": api
      },
    });
  `;

  const amisSchema = {
    "type": "steedos-fullcalendar",
    "label": "",
    "name": "fullcalendar",
    "onEvent": {
      "getEvents": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": getEventsScript
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
            "script": "console.log('select'); console.log(event);"
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
            "script": "console.log('eventClick'); console.log(event);"
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
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('eventChange'); console.log(event);"
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