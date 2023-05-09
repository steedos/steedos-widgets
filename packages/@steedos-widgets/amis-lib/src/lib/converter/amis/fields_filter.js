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

export async function getObjectFieldsFilterFormSchema(ctx) {

  if (!ctx) {
    ctx = {};
  }
  const formSchema = {
    "type": "service",
    "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
    "className": ctx.formFactor === 'SMALL' ? "slds-filters__body p-0 mb-2" : "slds-filters__body p-0 sm:grid sm:gap-2 sm:grid-cols-4 mb-2",
    "schemaApi": {
      method: 'post',
      url: `\${context.rootUrl}/graphql?reload=\${filterFormSearchableFields|join}`,
      data: {
        $self: "$$",
        query: "{\n data: objects(filters: [[\"_id\",\"=\",null]],top: 1, skip: 0){_id}\n    }"
      },
      requestAdaptor: `
        return {
          ...api,
          data: {
            query: api.data.query
          }
        };
      `,
      adaptor: `
          if(payload.errors){
              payload.status = 2;
              payload.msg = window.t ? window.t(payload.errors[0].message) : payload.errors[0].message;
          }
          const selfData = api.body.$self;
          const filterFormSearchableFields = selfData.filterFormSearchableFields;
          const uiSchema = selfData.uiSchema;
          const fields = uiSchema.fields;
          const searchableFields = [];

          const resolveAll = function(values){
            payload.data = {
              "body": values
            };
            return payload;
          }

          const rejectAll = function(){
            console.warn("run function getFieldSearchable failed.");
          }

          return Promise.all(filterFormSearchableFields.map(function (item) {
            const field = _.clone(fields[item]);
            if (
              !_.includes(
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
              delete field.defaultValue;
              delete field.required;
              delete field.is_wide;
              delete field.readonly;
              delete field.hidden;
              delete field.omit;
              var ctx = ${JSON.stringify(ctx)};
              const amisField = window.getFieldSearchable(field, fields, ctx);
              return amisField;
            }
          })).then(resolveAll, rejectAll);
      `,
      headers: {
        Authorization: "Bearer ${context.tenantId},${context.authToken}"
      }
    }
  };

  return formSchema;
}

export async function getObjectFieldsFilterBarSchema(objectSchema, ctx) {
  if (!ctx) {
    ctx = {};
  }
  const filterFormSchema = await getObjectFieldsFilterFormSchema(ctx);
  const onSearchScript = `
    const scope = event.context.scoped;
    var filterForm = scope.parent.parent.getComponents().find(function(n){
      return n.props.type === "form";
    });
    filterForm.handleFormSubmit(event)
    // var filterFormValues = filterForm.getValues();
    // var listView = scope.parent.parent.parent.getComponents().find(function(n){
    //   return n.props.type === "crud";
    // });
    // const removedValues = {};
    // // 设置搜索项中移除搜索项后，filterFormValues未把其字段的空值保存为own property，即hasOwnProperty属性中
    // // 这会造成handleFilterSubmit时把移除掉的搜索项字段之前的值加到过滤条件中
    // for(var k in filterFormValues){
    //   if(filterFormValues[k] === "" && !filterFormValues.hasOwnProperty(k)){
    //     removedValues[k] = "";
    //   }
    // }
    // listView.handleFilterSubmit(Object.assign({}, removedValues, filterFormValues));
  `;
  const onResetScript = `
    const scope = event.context.scoped;
    var filterForm = scope.parent.parent.getComponents().find(function(n){
      return n.props.type === "form";
    });
    var filterFormValues = filterForm.getValues();
    var listView = scope.parent.parent.parent.getComponents().find(function(n){
      return n.props.type === "crud";
    });
    const removedValues = {};
    for(var k in filterFormValues){
      if(/^__searchable__/.test(k)){
        removedValues[k] = "";
      }
    }
    if(!event.data.isLookup){
      // 刷新浏览器后，filterFormValues值是空的，只能从本地存储中取出并重置为空值
      const listViewId = event.data.listViewId;
      const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
      let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
      if(localListViewProps){
        localListViewProps = JSON.parse(localListViewProps);
        for(var k in localListViewProps){
          removedValues[k] = "";
        }
      }
    }
    listView.handleFilterSubmit(removedValues);
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
    let defaultSearchableFields = sessionStorage.getItem(searchableFieldsStoreKey);
    if(defaultSearchableFields){
      defaultSearchableFields = defaultSearchableFields.split(",");
    }
    if(_.isEmpty(defaultSearchableFields) && data.uiSchema){
      let listView = data.uiSchema.list_views[data.listName];
      const sFields = listView && listView.searchable_fields;
      if(sFields && sFields.length){
        defaultSearchableFields = _.map(sFields, 'field');
      }
    }
    if(_.isEmpty(defaultSearchableFields) && data.uiSchema){
      defaultSearchableFields = _.map(
        _.sortBy(_.filter(_.values(data.uiSchema.fields), (field) => {
          return field.searchable;
        }), "sort_no"),
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
      let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
      if(localListViewProps){
        localListViewProps = JSON.parse(localListViewProps);
        let filterFormValues = _.pickBy(localListViewProps, function(n,k){
          return /^__searchable__/g.test(k);
        });
        if(!_.isEmpty(filterFormValues)){
          setData({ ...filterFormValues });
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
    sessionStorage.setItem(searchableFieldsStoreKey, value);

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
    let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
    if(localListViewProps){
      localListViewProps = JSON.parse(localListViewProps);
      // const removedValues = {};
      removedKeys.forEach(function(key){
        delete localListViewProps[key];
        // removedValues[key] = "";
      });
      sessionStorage.setItem(listViewPropsStoreKey, JSON.stringify(localListViewProps));
    }
    //触发amis crud 高度重算
    setTimeout(()=>{
      window.dispatchEvent(new Event("resize"))
    }, 100)
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
    // "id": `service_listview_filter_form_${objectSchema.name}`,
    "dataProvider": {
      "inited": dataProviderInited
    },
    "body": {
      "type": "wrapper",
      "body": {
        "type": "wrapper",
        "body": [filterFormSchema, {
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
                "label": "重置",
                "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "custom",
                        "script": onResetScript
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

