import { getFieldSearchable } from "./fields/index";
import { includes, map } from "lodash";

export async function getObjectFieldsFilterButtonSchema(objectSchema) {
  // const amisListViewId = `listview_${objectSchema.name}`;
  return {
    "type": "button",
    "label": "",
    "icon": "fa fa-search",
    "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "broadcast",
            "args": {
              "eventName": "broadcast_toggle_fields_filter"
            }
          }
        ]
      }
    }
  }
}

export async function getObjectFieldsFilterFormSchema(objectSchema, fields, ctx) {
  if(!ctx){
    ctx = {};
  }
  const body = [];
  for (let field of fields) {
    if (
      !includes(
        [
          "grid",
          "avatar",
          "image",
          "object",
          "[object]",
          "[Object]",
          "[grid]",
          "[text]",
          "audio",
          "file",
        ],
        field.type
      )
    ) {
      delete field.defaultValue
      delete field.required
      delete field.is_wide
      delete field.readonly
      delete field.hidden
      delete field.omit
      const amisField = await getFieldSearchable(field, fields, ctx);
      if (amisField) {
        body.push(amisField);
      }
    }
  }
  let persistDataKeys = map(body, "name");
  if(ctx.enableSearchableFieldsVisibleOn){
    body.forEach(function(fieldItem){
      fieldItem.visibleOn = `this.filterFormSearchableFields && this.filterFormSearchableFields.indexOf("${fieldItem.fieldName}") > -1`;
      // fieldItem.clearValueOnHidden = true;//这个属性会把form字段值删除，但是点击搜索时crud还是把值给传递到过滤条件(api.requestAdaptor的data.$self)中了，应该是crud的bug
    });
  }

  // const onBroadcastSearchableFieldsChangeScript = `
  //   const data = event.data;
  //   const listViewId = data.listViewId;
  //   const searchableFields = data.fields;
  //   const preSearchableFields = data.__super.__super.fields;
  //   const removedFields = _.difference(preSearchableFields, searchableFields);
  //   const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
  //   let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
  //   if(localListViewProps){
  //     // 当变更可搜索字段时，如果被移除的可搜索字段在本地存储中已经存入过滤条件中则应该清除本地存储中相关字段的过滤条件。
  //     localListViewProps = JSON.parse(localListViewProps);
  //     let removedKeys = [];
  //     _.each(localListViewProps, function(n,k){
  //       // __searchable__开头的不在searchableFields范围则清除其值
  //       let isRemoved = !!removedFields.find(function(fieldName){
  //         return new RegExp("__searchable__\.*" + fieldName + "$").test(k);
  //       });
  //       if(isRemoved){
  //         removedKeys.push(k);
  //       }
  //     });
  //     const removedValues = {};
  //     removedKeys.forEach(function(key){
  //       delete localListViewProps[key];
  //       removedValues[key] = "";
  //     });
  //     doAction({
  //       actionType: 'setValue',
  //       args: {
  //         value: removedValues
  //       }
  //     });
  //     localStorage.setItem(listViewPropsStoreKey, JSON.stringify(localListViewProps));
  //   }
  // `;

  return {
    title: "",
    type: "form",
    // debug: true,
    name: "listview-filter-form",
    id: `listview_filter_form_${objectSchema.name}`,
    mode: "normal",
    wrapWithPanel: false,
    className: `sm:grid sm:gap-2 sm:grid-cols-4 mb-2`,
    data: {
      "&": "${filterFormValues || {}}",
      ...ctx.initData
    },
    // persistData: "crud:${id}",
    // persistDataKeys: persistDataKeys,
    body: body,
    // "onEvent": {
    //   "broadcastSearchableFieldsChange": {
    //     "actions": [
    //       {
    //         "actionType": "custom",
    //         "script": onBroadcastSearchableFieldsChangeScript
    //       }
    //     ]
    //   }
    // }
  };
}

export async function getObjectFieldsFilterBarSchema(objectSchema, fields, ctx) {
  if(!ctx){
    ctx = {};
  }
  const filterFormSchema = await getObjectFieldsFilterFormSchema(objectSchema, fields, Object.assign({}, {
    enableSearchableFieldsVisibleOn: true
  }, ctx));
  const onSearchScript = `
    const scope = event.context.scoped;
    var filterForm = scope.getComponents().find(function(n){
      return n.props.type === "form";
    });
    var filterFormValues = filterForm.getValues();
    var listView = scope.parent.parent.parent.getComponents().find(function(n){
      return n.props.type === "crud";
    });
    const removedValues = {};
    // 设置搜索项中移除搜索项后，filterFormValues未把其字段的空值保存为own property，即hasOwnProperty属性中
    // 这会造成handleFilterSubmit时把移除掉的搜索项字段之前的值加到过滤条件中
    for(var k in filterFormValues){
      if(filterFormValues[k] === "" && !filterFormValues.hasOwnProperty(k)){
        removedValues[k] = "";
      }
    }
    listView.handleFilterSubmit(Object.assign({}, removedValues, filterFormValues));
  `;
  const dataProviderInited = `
    const objectName = data.objectName;
    const isLookup = data.isLookup;
    const listViewId = data.listViewId;
    let searchableFieldsStoreKey = location.pathname + "/searchable_fields/";
    if(isLookup){
      searchableFieldsStoreKey += "lookup/" + objectName;
    }
    else{
      searchableFieldsStoreKey += listViewId;
    }
    let defaultSearchableFields = localStorage.getItem(searchableFieldsStoreKey);
    if(!defaultSearchableFields && data.uiSchema){
      let listView = data.uiSchema.list_views[data.listName];
      defaultSearchableFields = listView && listView.searchable_fields;
      if(defaultSearchableFields && defaultSearchableFields.length){
        defaultSearchableFields = _.map(defaultSearchableFields, 'field');
      }
    }
    if(_.isEmpty(defaultSearchableFields) && data.uiSchema){
      defaultSearchableFields = _.map(
        _.filter(_.values(data.uiSchema.fields), (field) => {
          return field.searchable;
        }),
        "name"
      );
    }
    setData({ filterFormSearchableFields: defaultSearchableFields });
    if(isLookup){
      // looup字段过滤器不在本地缓存记住过滤条件，所以初始始终隐藏过滤器
      setData({ showFieldsFilter: false });
    }
    else{
      const listViewPropsStoreKey = location.pathname + "/crud/" + data.listViewId ;
      let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
      if(localListViewProps){
        localListViewProps = JSON.parse(localListViewProps);
        let filterFormValues = _.pickBy(localListViewProps, function(n,k){
          return /^__searchable__/g.test(k);
        });
        if(!_.isEmpty(filterFormValues)){
          setData({ filterFormValues });
          const omitedEmptyFormValue = _.omitBy(filterFormValues, function(n){
            return _.isNil(n) 
              || (_.isObject(n) && _.isEmpty(n)) 
              || (_.isArray(n) && _.isEmpty(n.filter(function(item){return !_.isNil(item)})))
              || (_.isString(n) && n.length === 0);
          });
          // 有过滤条件时自动展开搜索栏
          if(!_.isEmpty(omitedEmptyFormValue)){
            setData({ showFieldsFilter: true });
          }
        }
      }
    }
  `;
  const onSearchableFieldsChangeScript = `
    const data = context.props.data;
    const listName = data.listName;
    const objectName = data.objectName;
    const isLookup = data.isLookup;
    const listViewId = data.listViewId;
    const value = data.fields;
    const scope = event.context.scoped;
    // 这里的filterForm不是name为"listview-filter-form"的内部form，而是crud自带的filter form
    const filterForm = scope.parent.parent.getComponents().find(function(n){
      return n.props.type === "form";
    });
    const filterService = filterForm.context.getComponents().find(function(n){
      return n.props.type === "service";
    });
    filterService.setData({ filterFormSearchableFields: value });
    let searchableFieldsStoreKey = location.pathname + "/searchable_fields/";
    if(isLookup){
      searchableFieldsStoreKey += "lookup/" + objectName;
    }
    else{
      searchableFieldsStoreKey += listViewId;
    }
    localStorage.setItem(searchableFieldsStoreKey, value);

    // ===START===:当变更可搜索字段时，如果被移除的可搜索字段在本地存储中已经存入过滤条件中则应该清除本地存储中相关字段的过滤条件。
    const searchableFields = data.fields;
    let preSearchableFields = data.__super.fields;
    if(typeof preSearchableFields === "string"){
      preSearchableFields = preSearchableFields.split(",");
    }
    const removedFields = _.difference(preSearchableFields, searchableFields);

    // const getClosestAmisComponentByType = function (scope, type, name) {
    //   // 递归children找到listview-filter-form
    //   let re = scope.getComponents().find(function (n) {
    //     return n.props.type === type && n.props.name === name;
    //   });
    //   if (re) {
    //     return re;
    //   }
    //   else {
    //     if (scope.children && scope.children.length) {
    //       for (let i = 0; i < scope.children.length; i++) {
    //         re = getClosestAmisComponentByType(scope.children[i], type, name);
    //         if (re) {
    //           break;
    //         }
    //       }
    //       return re;
    //     }
    
    //   }
    // }
    // // 这里第二层form才是真正要提交到crud过滤条件的form
    // filterInnerForm = getClosestAmisComponentByType(filterForm.context, "form", "listview-filter-form");

    const filterFormValues = filterForm.getValues();
    let removedKeys = [];
    _.each(filterFormValues, function(n,k){
      // __searchable__开头的不在searchableFields范围则清除其值
      let isRemoved = !!removedFields.find(function(fieldName){
        return new RegExp("__searchable__\.*" + fieldName + "$").test(k);
      });
      if(isRemoved){
        removedKeys.push(k);
      }
    });
    const removedValues = {};
    removedKeys.forEach(function(key){
      removedValues[key] = "";
    });
    filterForm.setValues(removedValues);//这里使用filterInnerForm也可以

    if(isLookup){
      return;
    }
    
    // 列表视图crud支持本地缓存，所以需要进一步清除浏览器本地缓存里面用户在可搜索项中移除的字段值
    const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
    let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
    if(localListViewProps){
      localListViewProps = JSON.parse(localListViewProps);
      // const removedValues = {};
      removedKeys.forEach(function(key){
        delete localListViewProps[key];
        // removedValues[key] = "";
      });
      localStorage.setItem(listViewPropsStoreKey, JSON.stringify(localListViewProps));
    }
    // ===END===
  `;
  return {
    "type": "service",
    "name": "service_listview_filter_form",
    "data": {
      // "showFieldsFilter": false
      // "filterFormSearchableFields": ["name"],//默认可搜索项
      // "filterFormValues": {"__searchable__name": "xxx"},//搜索项表单值
      // "listViewId": "${listViewId}"
    },
    "id": `service_listview_filter_form_${objectSchema.name}`,
    "dataProvider": {
      "inited": dataProviderInited
    },
    "body": {
      "type": "wrapper",
      "body": {
        "type": "wrapper",
        "body": [{
          "type": "wrapper",
          "body": [
            filterFormSchema
          ],
          "size": "xs",
          "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
          "className": "slds-filters__body p-0"
        }, {
          "type": "wrapper",
          "body": {
            "type": "wrapper",
            "body": [
              {
                "type": "button",
                "label": "搜索",
                "icon": "fa fa-search",
                "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "custom",
                        "script": onSearchScript
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "设置搜索项",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "dialog",
                        "dialog": {
                          "type": "dialog",
                          "size": "md",
                          "title": "设置搜索项",
                          "body": [
                            {
                              "type": "form",
                              "title": "",
                              "body": [
                                {
                                  "label": "",
                                  "type": "transfer",
                                  "name": "fields",
                                  "id": "u:92c0b3cccca0",
                                  "source": {
                                    "method": "get",
                                    "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options",
                                    "dataType": "json",
                                    "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    },
                                    "data": null,
                                    "requestAdaptor": "",
                                    "adaptor": ""
                                  },
                                  "options": [],
                                  "required": true,
                                  "placeholder": "-",
                                  "className": "col-span-2 m-0",
                                  "checkAll": false,
                                  "searchable": true,
                                  "sortable": true,
                                  "joinValues": false,
                                  "extractValue": true,
                                  "multiple": true
                                }
                              ],
                              "id": "u:e5ac506d5683",
                              "mode": "normal",
                              "persistData": false,
                              "promptPageLeave": true,
                              "name": "form",
                              "debug": false,
                              "actions": [],
                              "panelClassName": "m-0",
                              "bodyClassName": "p-4",
                              "className": "steedos-amis-form"
                            }
                          ],
                          "id": "u:ca99fa9fe1b1",
                          "actions": [
                            {
                              "type": "button",
                              "label": "取消",
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "componentId": "",
                                      "args": {},
                                      "actionType": "closeDialog"
                                    }
                                  ]
                                }
                              },
                              "id": "u:4e447b5ca72a"
                            },
                            {
                              "type": "button",
                              "label": "确认",
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "actionType": "custom",
                                      "script": onSearchableFieldsChangeScript
                                    },
                                    // {
                                    //   "actionType": "broadcast",
                                    //   "eventName": "broadcastSearchableFieldsChange",
                                    //   "args": {
                                    //     "eventName": "broadcastSearchableFieldsChange"
                                    //   },
                                    //   "data": {
                                    //     "fields": "${event.data.fields}"
                                    //   }
                                    // },
                                    {
                                      "componentId": "",
                                      "args": {},
                                      "actionType": "closeDrawer"
                                    }
                                  ]
                                }
                              },
                              "id": "u:14e7388fecd3",
                              "level": "primary"
                            }
                          ],
                          "closeOnEsc": false,
                          "closeOnOutside": false,
                          "showCloseButton": true,
                          "data": {
                            "&": "$$",
                            "objectName": "${objectName}",
                            "listName": "${listName}",
                            "listViewId": "${listViewId}",
                            "uiSchema": "${uiSchema}",
                            "isLookup": "${isLookup}",
                            "context": "${context}",
                            "fields": "${filterFormSearchableFields}"
                          }
                        }
                      }
                    ]
                  }
                },
                "id": "u:b96d84868a5a",
                "level": "link"
              }
            ],
            "size": "xs",
            "className": "space-x-4"
          },
          "size": "xs",
          "className": "slds-filters__footer slds-grid slds-shrink-none flex justify-between p-0"
        }],
        "size": "xs",
        "className": "slds-filters"
      },
      "size": "xs",
      "className": `border-gray-300 border-y slds-grid slds-grid_vertical slds-nowrap ${!ctx.isLookup && "mt-2"}`,
      "visibleOn": "this.showFieldsFilter",
    },
    "className": "bg-white"
  };
}

