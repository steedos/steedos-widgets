import { getFieldSearchable } from "./fields/index";
import { includes, map } from "lodash";
import { i18next } from "../../../i18n"
export async function getObjectFieldsFilterButtonSchema(objectSchema) {
  // const amisListViewId = `listview_${objectSchema.name}`;
  return {
    "type": "button",
    "label": "",
    "icon": "fa fa-search",
    "className": "bg-white p-2 rounded border-gray-300",
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
    "className": ctx.formFactor === 'SMALL' ? "slds-filters__body p-0 mb-2 overflow-y-auto overflow-x-hidden" : "slds-filters__body p-0 sm:grid sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-1",
    "style":{
      "max-height":ctx.formFactor === 'SMALL'?"30vh":"unset"
    },
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
          const uiSchema = selfData.uiSchema;
          const fields = uiSchema.fields;
          const filterFormSearchableFields = (selfData.filterFormSearchableFields || []).filter(function(item){
            return !!fields[item]
          });
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
              field && window.isFieldTypeSearchable(field.type)
            ) {
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
  const searchableFields = ctx.searchable_fields;
  const autoOpenFilter = !!ctx.auto_open_filter;
  const btnSearchId = "btn_filter_form_search_" + new Date().getTime();
  const filterFormSchema = await getObjectFieldsFilterFormSchema(ctx);
  const keywordsSearchBoxName = ctx.keywordsSearchBoxName || "__keywords";
  const onSearchScript = `
    let isLookup = event.data.isLookup;
    let __lookupField = event.data.__lookupField;
    const scope = event.context.scoped;
    let crud = SteedosUI.getClosestAmisComponentByType(scope, "crud");
    var filterForm = scope.parent.parent.getComponents().find(function(n){
      return n.props.type === "form";
    });
    // 使用filterForm.getValues()的话，并不能拿到本地存储中的过滤条件，所以需要从event.data中取，因为本地存储中的过滤条件自动填充到表单上时filterForm.getValues()拿不到。
    let filterFormValues = event.data;
    filterFormValues = JSON.parse(JSON.stringify(filterFormValues)); //只取当层数据域中数据，去除__super层数据
    const changedFilterFormValues = _.pickBy(filterFormValues, function(n,k){return /^__searchable__/.test(k);});
    // 同步__changedFilterFormValues中的值
    // crud && crud.setData({__changedFilterFormValues: {}});
    let __changedFilterFormValuesKey = "__changedFilterFormValues";
    if(isLookup && __lookupField){
      let lookupTag = "__lookup__" + __lookupField.name + "__" + __lookupField.reference_to;
      if(__lookupField.reference_to_field){
        lookupTag += "__" + __lookupField.reference_to_field;
      }
      __changedFilterFormValuesKey += lookupTag;
    }
    if(crud){
      let crudData = crud.getData();
      crudData[__changedFilterFormValuesKey] = changedFilterFormValues;
      crud.setData(crudData);
    }
    filterForm.handleFormSubmit(event);
    // var filterFormValues = filterForm.getValues();
    // var listView = scope.parent.parent.parent.getComponents().find(function(n){
    //   return n.props.type === "crud";
    // });
    // const removedValues = {};
    // // 设置搜索项中移除搜索项后，filterFormValues未把其字段的空值保存为own property，即hasOwnProperty属性中
    // // 这会造成handleFilterSubmit时把移除掉的搜索项字段之前的值加到过滤条件中
    // for(var k in filterFormValues){
    //   if(filterFormValues[k] === "" && !filterFormValues.hasOwnProperty(k)){
    //     removedValues[k] = null;
    //   }
    // }
    // listView.handleFilterSubmit(Object.assign({}, removedValues, filterFormValues));
    // 点击搜索的时候自动收起搜索栏
    //触发amis crud 高度重算
    doAction({
      "actionType": "broadcast",
      "args": {
        "eventName": "@height.changed.${objectSchema.name}"
      },
      "data": {
        "timeOut": 500
      }
    });
    const filterService = filterForm.context.getComponents().find(function(n){
      return n.props.type === "service";
    });
    let showFieldsFilter = true;
    // const isMobile = window.innerWidth < 768;
    // if(event.data.__from_fields_filter_settings_confirm){
    //   // 如果是从设置搜索项点击确认按钮触发的搜索事件不应该自动关闭搜索栏
    //   showFieldsFilter = true;
    // }
    // else if(isMobile){
    //   // 如果是手机端，点击搜索后自动关闭搜索栏
    //   showFieldsFilter = false;
    // }
    // else if(event.data.displayAs === "split") {
    //   // PC上分栏模式下的列表，始终按手机上效果处理，即自动关闭搜索栏
    //   showFieldsFilter = false;
    // }
    // else if(window.innerHeight >= 1200){
    //   // 高分辨率屏幕（2k+），列表高度比较高，没必要自动关闭搜索栏
    //   showFieldsFilter = true;
    // }
    filterService.setData({showFieldsFilter});
    // resizeWindow();//已迁移到搜索栏表单提交事件中执行，因为表单项change后也会触发表单提交了
    let isFieldsFilterEmpty = SteedosUI.isFilterFormValuesEmpty(filterFormValues);
    let crudService = crud && SteedosUI.getClosestAmisComponentByType(crud.context, "service", {name: "service_object_table_crud"});
    crudService && crudService.setData({isFieldsFilterEmpty, showFieldsFilter});
  `;
  const onCancelScript = `
    // console.log("===onCancelScript=form==");
    let isLookup = event.data.isLookup;
    let __lookupField = event.data.__lookupField;
    const scope = event.context.scoped;
    var filterForm = scope.parent.parent.getComponents().find(function(n){
      return n.props.type === "form";
    });
    var filterFormValues = filterForm.getValues();
    let crud = SteedosUI.getClosestAmisComponentByType(scope, "crud");
    const removedValues = {};
    for(var k in filterFormValues){
      if(/^__searchable__/.test(k)){
        removedValues[k] = null;
      }
    }
    if(!event.data.isLookup){
      // 刷新浏览器后，filterFormValues值是空的，只能从本地存储中取出并重置为空值
      const listName = event.data.listName;
      const listViewPropsStoreKey = location.pathname + "/crud";
      let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
      if(localListViewProps){
        localListViewProps = JSON.parse(localListViewProps);
        for(var k in localListViewProps){
          if(/^__searchable__/.test(k)){
            removedValues[k] = null;
          }
        }
      }
    }
    else{
      const keywordsSearchBoxName = "${keywordsSearchBoxName}";
      //lookup字段保留快速搜索条件
      removedValues[keywordsSearchBoxName] = filterFormValues[keywordsSearchBoxName];
    }
    filterForm.setValues(removedValues);//会把表单提交到toolbar的快速搜索区域，造成在快速搜索框中触发搜索时再次把搜索表单中的字段值清除掉的bug，已单独在快速搜索框那边添加搜索事件代码处理过了
    // 以下方法都无法实现清除表单值
    // filterForm.setValues({}, true)
    // filterForm.reset();
    // filterForm.handleAction({},{
    //   "actionType": "setValue",
    //   "args": {
    //     "value": removedValues
    //   }
    // });
    // 下面触发clear动作可以清除表单值，且不会把表单提交到toolbar的快速搜索区域，但是会把金额等范围字段清空成非范围字段
    // filterForm.handleAction({},{
    //   "actionType": "clear"
    // });

    // 清除__changedFilterFormValues中的值
    // crud && crud.setData({__changedFilterFormValues: {}});
    let __changedFilterFormValuesKey = "__changedFilterFormValues";
    if(isLookup && __lookupField){
      let lookupTag = "__lookup__" + __lookupField.name + "__" + __lookupField.reference_to;
      if(__lookupField.reference_to_field){
        lookupTag += "__" + __lookupField.reference_to_field;
      }
      __changedFilterFormValuesKey += lookupTag;
    }
    if(crud){
      let crudData = crud.getData();
      crudData[__changedFilterFormValuesKey] = {};
      crud.setData(crudData);
    }
    filterForm.handleFormSubmit(event);
    // crud.handleFilterSubmit(removedValues);

    let filterFormService = SteedosUI.getClosestAmisComponentByType(filterForm.context, "service");
    filterFormService.setData({showFieldsFilter: !!!filterFormService.props.data.showFieldsFilter});
    //触发amis crud 高度重算
    doAction({
      "actionType": "broadcast",
      "args": {
        "eventName": "@height.changed.${objectSchema.name}"
      },
      "data": {
        "timeOut": 100
      }
    });
    
    // 移除搜索按钮上的红点
    // let crudService = scope.getComponentById("service_listview_" + event.data.objectName);
    let crudService = crud && SteedosUI.getClosestAmisComponentByType(crud.context, "service", {name: "service_object_table_crud"});
    crudService && crudService.setData({isFieldsFilterEmpty: true, showFieldsFilter: false});
    `;
  /**
  给lookup字段配置filter_form_data时可以配置为amis变量，也可以配置为事态key-value键值对象值：
  ```
  "filter_form_data": "${selectedPublicGroupFilterFormData|toJson}"
  ```
  or
  ```
  "filter_form_data": {
      "public_group_ids": [
          "67addbef39f9a4503789b38d"
      ]
  }
  ```
   */
  const filterFormValues = ctx.filter_form_data;
  const dataProviderInited = `
    const searchableFields = ${JSON.stringify(searchableFields)};
    const autoOpenFilter = ${autoOpenFilter};
    const objectName = data.objectName;
    const isLookup = data.isLookup;
    const listName = data.listName;
    let searchableFieldsStoreKey = location.pathname + "/searchable_fields";
    if(isLookup){
      searchableFieldsStoreKey += "/lookup/" + objectName;
    }
    searchableFieldsStoreKey = searchableFieldsStoreKey + "/" + (data.context && data.context.userId);
    let defaultSearchableFields = localStorage.getItem(searchableFieldsStoreKey);
    if(defaultSearchableFields){
      defaultSearchableFields = defaultSearchableFields.split(",");
    }
    if(_.isEmpty(defaultSearchableFields) && searchableFields){
      if(searchableFields.length){
        defaultSearchableFields = _.map(searchableFields, 'field');
      }
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
          return field.filterable;
        }), "sort_no"),
        "name"
      );
    }
    setData({ filterFormSearchableFields: defaultSearchableFields });
    if(isLookup){
      let filterFormValues = ${_.isObject(filterFormValues) ? JSON.stringify(filterFormValues) : ('"' + filterFormValues + '"')} || {};
      const isAmisFormula = typeof filterFormValues === "string" && filterFormValues.indexOf("\${") > -1;
      if (isAmisFormula){
        filterFormValues = AmisCore.evaluate(filterFormValues, data) || {};
      }
      if (_.isObject(filterFormValues) || !_.isEmpty(filterFormValues)){
        let fields = data.uiSchema && data.uiSchema.fields;
        filterFormValues = SteedosUI.getSearchFilterFormValues(filterFormValues, fields);
        setData({ ...filterFormValues });
      }
      // looup字段过滤器不在本地缓存记住过滤条件，所以初始始终隐藏过滤器
      setData({ showFieldsFilter: autoOpenFilter });
    }
    else{
      const listViewPropsStoreKey = location.pathname + "/crud";
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
          // 有过滤条件时只显示搜索按钮上的红点，不自动展开搜索栏
          if(!_.isEmpty(omitedEmptyFormValue)){
            let crudService = SteedosUI.getRef(data.$scopeId).parent.getComponentById("service_listview_" + data.objectName)
            crudService && crudService.setData({isFieldsFilterEmpty: false});
            // setData({ showFieldsFilter: true });//自动展开搜索栏
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
    let searchableFieldsStoreKey = location.pathname + "/searchable_fields";
    if(isLookup){
      searchableFieldsStoreKey += "/lookup/" + objectName;
    }
    searchableFieldsStoreKey = searchableFieldsStoreKey + "/" + (data.context && data.context.userId);
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
      removedValues[key] = null;
    });
    filterForm.setValues(removedValues);//这里使用filterInnerForm也可以

    if(isLookup){
      return;
    }
    
    // 列表视图crud支持本地缓存，所以需要进一步清除浏览器本地缓存里面用户在可搜索项中移除的字段值
    const listViewPropsStoreKey = location.pathname + "/crud";
    let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
    if(localListViewProps){
      localListViewProps = JSON.parse(localListViewProps);
      _.each(localListViewProps, function(n,k){
        // __searchable__开头的不在searchableFields范围则清除其值
        let isRemoved = !!removedFields.find(function(fieldName){
          return new RegExp("__searchable__\.*" + fieldName + "$").test(k);
        });
        if(isRemoved){
          delete localListViewProps[k];
        }
      });
      sessionStorage.setItem(listViewPropsStoreKey, JSON.stringify(localListViewProps));
    }
    //触发amis crud 高度重算
    doAction({
      "actionType": "broadcast",
      "args": {
        "eventName": "@height.changed.${objectSchema.name}"
      },
      "data": {
        "timeOut": 100
      }
    });
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
                "level": "primary",
                "id": btnSearchId,
                "label": i18next.t('frontend_fields_filter_button_search'),
                "icon": "fa fa-search",
                // "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
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
                "label": i18next.t('frontend_form_reset'),
                "name": "btn_filter_form_cancel",
                // "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "custom",
                        "script": onCancelScript
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": i18next.t('frontend_fields_filter_button_settings'),
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "dialog",
                        "dialog": {
                          "type": "dialog",
                          "size": "md",
                          "title": i18next.t('frontend_fields_filter_button_settings'),
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
                                    "data": {
                                      "$self": "$$"
                                    },
                                    "requestAdaptor": "",
                                    "adaptor": `
                                      if(payload.errors){
                                          payload.status = 2;
                                          payload.msg = window.t ? window.t(payload.errors[0].message) : payload.errors[0].message;
                                      }
                                      const selfData = api.body.$self;
                                      const uiSchema = selfData.uiSchema;
                                      const fields = uiSchema.fields;
                                      const options = ((payload.data && payload.data.options) || []).filter(function(item){
                                        let field = fields[item.value];
                                        // TODO: 暂时禁用location类型字段的列表搜索
                                        return !!field && window.isFieldTypeSearchable(field.type) && field.type !== 'location'
                                      });
                                      payload.data = {
                                        "options": options
                                      };
                                      return payload;
                                    `
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
                          "actions": [
                            {
                              "type": "button",
                              "label": i18next.t('frontend_form_cancel'),
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
                              "label": i18next.t('frontend_form_confirm'),
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "actionType": "custom",
                                      "script": onSearchableFieldsChangeScript
                                    },
                                    // 自动触发搜索事件会造成bug，应该是升级amis到6.4造成的，见：https://github.com/steedos/steedos-platform/issues/7121
                                    // 变更搜索项后，用户一般会点击搜索按钮，所以这里不自动触发搜索事件
                                    // {
                                    //   "actionType": "click",
                                    //   "componentId": btnSearchId,
                                    //   "args": {
                                    //     "__from_fields_filter_settings_confirm": true
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
                "level": "link"
              }
            ],
            "size": "xs",
            "className": "space-x-2"
          },
          "size": "xs",
          "className": "slds-filters__footer slds-grid slds-shrink-none flex justify-between p-0"
        }],
        "size": "xs",
        "className": "slds-filters px-0"
      },
      "size": "xs",
      "className": `p-0`,
      "visibleOn": "this.showFieldsFilter",
    },
    "className": "bg-white"
  };
}

