import { getObjectListHeaderFieldsFilterBar } from './header';
import { Router } from "@steedos-widgets/amis-lib";
import { getExportExcelToolbarButtonSchema } from './toolbars/export_excel';
import { getSettingListviewToolbarButtonSchema } from './toolbars/setting_listview'; 
import { i18next } from "../../../i18n"
import * as Fields from './fields/index';

const getDisplayAsButton = function(objectName, defaultEnableSplit){
  let displayAs = Router.getTabDisplayAs(objectName, defaultEnableSplit);
  let buttons = [
    {
      "type": "button",
      "label": i18next.t('frontend_display_type_is_table'),
      "onClick": "const key = 'tab_"+objectName+"_display';sessionStorage.setItem(key, 'grid');let url = document.location.pathname; var urlSearch = new URLSearchParams(document.location.search); if(urlSearch.get(\"side_object\") && urlSearch.get(\"side_listview_id\")){url=`/app/${props.data.appId}/${urlSearch.get(\"side_object\")}/grid/${urlSearch.get(\"side_listview_id\")}`;}; props.env.jumpTo(url + '?display=grid');",
      "rightIcon": displayAs != 'split' ? "fa fa-check" : null,
      "rightIconClassName": "m-l-sm"
    },
    {
      "type": "button",
      "label": i18next.t('frontend_display_type_is_split'),
      "onClick": "const key = 'tab_"+objectName+"_display';sessionStorage.setItem(key, 'split');const url = document.location.pathname + '?display=split'; props.env.jumpTo(url);",
      "rightIcon": displayAs === 'split' ? "fa fa-check" : null,
      "rightIconClassName": "m-l-sm"
    }
  ];
  const displayAsLabel = displayAs === 'split'? i18next.t('frontend_display_type_is_split') : i18next.t('frontend_display_type_is_table');
  return {
    "type": "dropdown-button",
    "icon": "fa fa-table-columns",
    //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
    // "tooltip": `${i18next.t('frontend_display_as')} ${displayAsLabel}`,
    "btnClassName": "antd-Button--iconOnly bg-white !p-2 rounded text-gray-500",
    "align": "right",
    "visibleOn": "${window:innerWidth > 768 && !!!isLookup && !!isObjectListview}",
    "buttons": [ 
      {
        "label": i18next.t('frontend_display_as'),
        "children": buttons
      }
    ]
  };
}


const onFieldsFilterToggleScript = `
const scope = event.context.scoped;
const filterForm = scope.getComponents().find(function(n){
  return n.props.type === "form";
});
const filterService = filterForm.context.getComponents().find(function(n){
  return n.props.type === "service";
});
let toShowFieldsFilter = !!!filterService.props.data.showFieldsFilter;
filterService.setData({showFieldsFilter: toShowFieldsFilter});
//触发amis crud 高度重算
doAction({
  "actionType": "broadcast",
  "args": {
    "eventName": "@height.changed." + event.data.objectName
  },
  "data": {
    "timeOut": 1000
  }
});
// 手机端在显示搜索栏时隐藏crud上的刷新按钮，因为点击后crud高度显示有问题
let crudService = scope.getComponentById("service_listview_" + event.data.objectName);
crudService && crudService.setData({showFieldsFilter: toShowFieldsFilter});
// if(filterService.props.data.showFieldsFilter){
//   if(isMobile){
//     // 手机上只能通过取消按钮来关闭搜索栏
//     return;
//   }
//   let buttonCancel = SteedosUI.getClosestAmisComponentByType(filterForm.context, "button", { 
//     direction: "down", 
//     name: "btn_filter_form_cancel" 
//   });
//   buttonCancel.props.dispatchEvent('click', {}).then(function(){
//     resizeWindow();
//   });
// }
// else{
//   if(isMobile){
//     // 手机端在显示搜索栏时隐藏crud上的刷新按钮，因为点击后crud高度显示有问题
//     let crudService = scope.getComponentById("service_listview_" + event.data.objectName);
//     crudService && crudService.setData({showFieldsFilter: true});
//   }
// }
`;

// function getObjectHeaderQuickSearchBox(mainObject, fields, formFactor, { isLookup = false, keywordsSearchBoxName = "__keywords", crudId } = {}){
function getObjectHeaderQuickSearchBox(mainObject, fields, formFactor, { isLookup = false, keywordsSearchBoxName = "__keywords" } = {}){
  const searchableFieldsLabel = [];
  _.each(mainObject.fields, function (field) {
    if (Fields.isFieldQuickSearchable(field, mainObject.NAME_FIELD_KEY)) {
      searchableFieldsLabel.push(field.label);
    }
  });

  const listViewPropsStoreKey = location.pathname + "/crud";
  let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
  let crudKeywords = "";
  if(localListViewProps && !isLookup){
    localListViewProps = JSON.parse(localListViewProps);
    crudKeywords = (localListViewProps && localListViewProps.__keywords) || "";
  }

  const onChangeScript = `
    const scope = event.context.scoped;
    let crud = SteedosUI.getClosestAmisComponentByType(scope, "crud");
    // let crudService = crud && SteedosUI.getClosestAmisComponentByType(crud.context, "service", {name: "service_object_table_crud"});
    let __changedSearchBoxValues = {};
    __changedSearchBoxValues["${keywordsSearchBoxName}"] = event.data["${keywordsSearchBoxName}"];
    // crudService && crudService.setData({__changedSearchBoxValues: __changedSearchBoxValues});
    // 这里不用crudService而用crud是因为lookup字段弹出的列表中的crudService中的变量无法传入crud的发送适配器中
    // crud && crud.setData({__changedSearchBoxValues: __changedSearchBoxValues});
    if(crud){
      let crudData = crud.getData();
      crudData.__changedSearchBoxValues = __changedSearchBoxValues;
      crud.setData(crudData);
    }
  `;

  // 之前onSearchScript中加上了onChangeScript中的脚本，是因为amis 3.2不能用change事件执行onChangeScript
  // 而点击回车按键又不会触发blur事件，所以只能每次回车事件中额外再执行一次onChangeScript
  // 等升级到amis 3.4+，blur事件换成change事件执行onChangeScript，就可以不用在onSearchScript中执行onChangeScript了
  // 基于amis3.6，已经不再用blur事件触发onChangeScript，所以这里把之前加上的onChangeScript去掉了，如果以后还要换blur来触发onChangeScript脚本的话，这里又要加回onChangeScript脚本
  // 这里重新额外先执行下onChangeScript，是因为不执行还有bug：[Bug]: amis升级到6.3后列表快速搜索功能，有时点击右上角的刷新按钮会按上次搜索的过滤条件请求数据 #6734
  const onSearchScript = `
    ${onChangeScript}

    // 下面的脚本只为解决点击搜索表单取消按钮，再重新在其中输入过滤条件但是不点击搜索按钮或回车按键触发搜索，此时在快速搜索框输入过滤条件按回车按键会把搜索表单中的过滤条件清空的问题
    // const scope = event.context.scoped;
    // 如果点击过顶部搜索栏表单的取消按钮，会把此处event.data.__super.__super.__super中的搜索表单项的所有字段设置为null
    // 点击取消按钮后继续在表单项中输入过滤条件且最后没有点击回车按键或点击表单项搜索按钮的话，在快速搜索中点击回车按钮提交搜索会所顶部搜索表单中的字段值清空
    let filterForm = SteedosUI.getClosestAmisComponentByType(scope, "form");
    if(!filterForm){
      return;
    }
    let isLookup = event.data.isLookup;
    let __lookupField = event.data.__lookupField;
    let __changedFilterFormValuesKey = "__changedFilterFormValues";
    if(isLookup && __lookupField){
      let lookupTag = "__lookup__" + __lookupField.name + "__" + __lookupField.reference_to;
      if(__lookupField.reference_to_field){
        lookupTag += "__" + __lookupField.reference_to_field;
      }
      __changedFilterFormValuesKey += lookupTag;
    }
    setTimeout(function(){
      filterForm && filterForm.setValues(event.data[__changedFilterFormValuesKey]);
    }, 500);
  `;

  // const onBlurScript = `
  //   // 失去焦点事件触发搜索，先去掉，因为会有bug，见：[Bug]: 列表上快速搜索输入框输入内容后点击放大镜界面上列表未显示过滤后的内容 #6742
  //   const value = event.data.value;
  //   setTimeout(function(){
  //     const scope = event.context.scoped;
  //     const sb = SteedosUI.getClosestAmisComponentByType(scope, "search-box");
  //     sb.handleSearch(value);
  //   }, 500);
  // `;

  return {
    "type": "tooltip-wrapper",
    "id": "steedos_crud_toolbar_quick_search",
    "align": "right",
    "title": "",
    "content": "可搜索字段：" + searchableFieldsLabel.join(","),
    "placement": "bottom",
    "tooltipTheme": "dark",
    "trigger": "click",
    "className": formFactor !== 'SMALL' ? "mr-1" : '',
    "visible": !!searchableFieldsLabel.length,
    "body": [
      {
        "type": "search-box",
        "name": keywordsSearchBoxName,
        "placeholder": "快捷搜索",
        "value": crudKeywords,
        "mini": true,
        "clearable": true,//因为清除并不会触发失去焦点事件，只有禁用，但是它会触发change事件，所以等升级到amis 3.4+后可以重新放开
        "clearAndSubmit": true,
        "searchImediately": false,
        "onEvent": {
          "search": {
            "actions": [
              {
                "actionType": "custom",
                "script": onSearchScript
              }
            ]
          },
          "change": { //amis 3.2change事件中setData会卡，升级到amis 3.4+应该不会再卡了，所以这里换回change事件，如果还是会卡就要考虑重新换成blur事件
            "actions": [
              {
                "actionType": "custom",
                "script": onChangeScript
              },
            ]
          },
          // "blur": { 
          //   "actions": [
          //     {
          //       "actionType": "custom",
          //       "script": onBlurScript
          //     },
          //   ]
          // }
        }
      }
    ]
  }
}

export function getObjectHeaderToolbar(mainObject, fields, formFactor, { 
  showDisplayAs = false, hiddenCount = false, headerToolbarItems,
  filterVisible = true, isLookup = false, keywordsSearchBoxName } = {}){
  // console.log(`getObjectHeaderToolbar====>`, filterVisible)
  // console.log(`getObjectHeaderToolbar`, mainObject)

  const isMobile = window.innerWidth < 768;
  if(isMobile){
    showDisplayAs = false;
  }
  let toolbarCount;
  if(!hiddenCount){
    toolbarCount = {
      "type": "tpl",
      "align": "left",
      "className": "text-gray-500 mr-2",
      "tpl":  "${count} " + i18next.t('frontend_record_sum')
    };
  }
  let toolbarReloadButton;
  const onReloadScript = `
    // 触发搜索，而不是reload，因为使用search-box可以在amissdk是3.6.3-patch.8+实现在非第一页的情况下，快速搜索输入框中过滤条件变更时再点刷新可以自动跳转翻页到第一页
    const scope = event.context.scoped;
    const sb = SteedosUI.getClosestAmisComponentByType(scope, "search-box");
    if (sb) {
      const sbValue = sb.state.value;
      sb.handleSearch(sbValue);
    }else{
      var listView = scope.parent.getComponents().find(function(n){
        return n.props.type === "crud";
      });
      listView.handleChangePage(1);
    }
    
  `;
  toolbarReloadButton = {
    // "type": "reload",//不可以直接使用reload，因为它不会设置页码到第一页，这在加载更多按钮的翻页模式下会有问题
    "type": "button",
    "align": "right",
    //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
    // "tooltip": i18next.t('frontend_button_reload_tooltip'),
    "tooltipPlacement": "top",
    "className": "bg-white p-2 rounded text-gray-500",
    "label": "",
    "icon": "fa fa-sync",
    // "visibleOn": "${!showFieldsFilter}",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "custom",
            "script": onReloadScript
          }
        ]
      }
    },
  };
  // if(formFactor === 'SMALL'){
  //   // 后续如果换成加载更多按钮的翻页模式的话，不可以直接使用下面的reload，需要换成上面的自定义脚本模式
  //   toolbarReloadButton = {
  //     "type": "reload",
  //     "align": "right",
  //     //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
  //     // "tooltip": i18next.t('frontend_button_reload_tooltip'),
  //     "tooltip":"",
  //     "tooltipPlacement": "top",
  //     "className": "bg-white p-2 rounded text-gray-500"
  //   };
  // }
  // else{
  //   toolbarReloadButton = {
  //     "type": "reload",
  //     "align": "right",
  //     //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
  //     // "tooltip": i18next.t('frontend_button_reload_tooltip'),
  //     "tooltip":"",
  //     "tooltipPlacement": "top",
  //     "className": "bg-white p-2 rounded text-gray-500"
  //   };
  // }
  let toolbarFilter;
  if(filterVisible){
    toolbarFilter ={
      "label": i18next.t('frontend_button_search_tooltip'),
      "icon": "fa fa-filter",
      //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
      // "tooltip": i18next.t('frontend_button_search_tooltip'),
      // "tooltipPlacement": "top",
      "type": "button",
      "badge": {
        "offset": [
          -5,
          1
        ],
        "size":8,
        "animation": true,
        "visibleOn": "${isFieldsFilterEmpty == false && isLookup != true}"
      },
      "align": "right",
      "className": "bg-white p-2 rounded text-gray-500",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "custom",
              "script": onFieldsFilterToggleScript
            }
          ]
        }
      },
      "id": "steedos_crud_toolbar_filter"
    };
  }
  let toolbarDisplayAsButton = getDisplayAsButton(mainObject?.name, mainObject?.enable_split);
  let toolbarDQuickSearchBox = getObjectHeaderQuickSearchBox(mainObject, fields, formFactor, { isLookup, keywordsSearchBoxName });

  // toolbars返回的数组元素不可以是空对象{}，比如hiddenCount ? {} : {"type": "tpl",...}，因为空对象最终还是会生成一个空的.antd-Crud-toolbar-item dom
  // 当出现空的.antd-Crud-toolbar-item dom时会影响toolbar元素的maring-right css样式计算，如果有动态需要应该加到动态数组变量toolbars中
  let toolbars = [];
  if(formFactor === 'SMALL'){
    // if(toolbarCount){
    //   toolbars.push(toolbarCount);
    // }
    // toolbars.push(toolbarReloadButton);
    toolbars.push(toolbarDQuickSearchBox);
    if(toolbarFilter){
      toolbars.push(toolbarFilter);
    }
    toolbars.push(toolbarDisplayAsButton);
    return [
      // "bulkActions",
      ...(headerToolbarItems || []),
      ...toolbars,
  ]
  }else{
    toolbars.push(toolbarDQuickSearchBox);
    toolbars.push(toolbarReloadButton);
    toolbars.push(toolbarDisplayAsButton);
    if(mainObject?.permissions?.allowCreateListViews){
      toolbars.push(getSettingListviewToolbarButtonSchema());
    }
    if(toolbarFilter){
      toolbars.push(toolbarFilter);
    }
    if(toolbarCount){
      toolbars.push(toolbarCount);
    }
    return [
      // "filter-toggler",
      ...(headerToolbarItems || []),
      "bulkActions",
      // 不能放开crud columns-toggler否则crud card模式会报错
      // {
      //   "type": "columns-toggler",
      //   "className": "hidden"
      // },
      ...toolbars,
      // {
      //     "type": "columns-toggler",
      //     "className": "mr-2"
      // },
      // getExportExcelToolbarButtonSchema(),
      // {
      //     "type": "drag-toggler",
      //     "align": "right"
      // },
      // {
      //     "type": "pagination",
      //     "align": "right"
      // }
    ]
  }


    
}

export function getObjectFooterToolbar(mainObject, formFactor, options) {
  // crud card模式与table模式两种情况下showPageInput默认值不一样，所以需要显式设置为false
  if (formFactor === 'SMALL') {
    // return [
    //   "load-more",
    // ]
    if(options.displayAs === 'split'){
      return [
        {
          "type": "switch-per-page",
          "visibleOn": "${count >= 20}"
        },
        {
          "type": "pagination",
          "maxButtons": 5,
          "showPageInput": false
        }
      ]
    }else{
      return [
        // "statistics",
        {
          "type": "pagination",
          "maxButtons": 5,
          "showPageInput": true,
          "layout": "total,pager,go"
        }
      ]
    }
  }
  else {
    if(options && options.isRelated){
      return [
        {
          "type": "pagination",
          "maxButtons": 10,
          "showPageInput": false
        }
      ]

    }
    else{
      const no_pagination = mainObject.paging && (mainObject.paging.enabled === false);
      const is_lookup = options.isLookup;
      const commonConfig = [
        {
          "type": "pagination",
          "maxButtons": 10,
          "showPageInput": false
        }
      ];

      if (no_pagination && is_lookup) {
        return commonConfig;
      } else {
        return [{
          "type": "switch-per-page",
          "visibleOn": "${count >= 20}"
        }, ...commonConfig];
      }
    }
  }
}

export async function getObjectFilter(objectSchema, fields, options) {
  const fieldsFilterBarSchema = await getObjectListHeaderFieldsFilterBar(objectSchema, null, options);
  let onSubmitSuccScript = `
    let isLookup = event.data.isLookup;
    if(isLookup){
      return;
    }
    // 列表搜索栏字段值变更后立刻触发提交表单执行crud搜索，所以这里需要额外重算crud高度及筛选按钮红色星号图标显示隐藏
    //触发amis crud 高度重算
    doAction({
      "actionType": "broadcast",
      "args": {
        "eventName": "@height.changed.${objectSchema.name}"
      },
      "data": {
        "timeOut": 1000
      }
    });
    const scope = event.context.scoped;
    // let filterFormValues = event.data;
    let filterForm = SteedosUI.getClosestAmisComponentByType(scope, "form");
    let filterFormService = SteedosUI.getClosestAmisComponentByType(filterForm.context, "service");
    // 使用event.data的话，并不能拿到本地存储中的过滤条件，所以需要从filterFormService中取。
    let filterFormValues = filterFormService.getData();
    filterFormValues = JSON.parse(JSON.stringify(filterFormValues)); //只取当层数据域中数据，去除__super层数据
    let isFieldsFilterEmpty = SteedosUI.isFilterFormValuesEmpty(filterFormValues);
    let crud = SteedosUI.getClosestAmisComponentByType(scope, "crud");
    const changedFilterFormValues = _.pickBy(filterFormValues, function(n,k){return /^__searchable__/.test(k);});
    // 这里不用crudService而用crud是因为lookup字段弹出的列表中的crudService中的变量无法传入crud的发送适配器中
    // crud && crud.setData({__changedFilterFormValues: changedFilterFormValues});
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

    let crudService = crud && SteedosUI.getClosestAmisComponentByType(crud.context, "service", {name: "service_object_table_crud"});
    crudService && crudService.setData({isFieldsFilterEmpty});
  `;
  let onChangeScript = `
    let isLookup = event.data.isLookup;
    let __lookupField = event.data.__lookupField;
    const scope = event.context.scoped;
    // let filterFormValues = event.data;
    let filterForm = SteedosUI.getClosestAmisComponentByType(scope, "form");
    let filterFormService = SteedosUI.getClosestAmisComponentByType(filterForm.context, "service");
    // 使用event.data的话，并不能拿到本地存储中的过滤条件，所以需要从filterFormService中取。
    let filterFormValues = filterFormService.getData();
    filterFormValues = JSON.parse(JSON.stringify(filterFormValues)); //只取当层数据域中数据，去除__super层数据
    let crud = SteedosUI.getClosestAmisComponentByType(scope, "crud");
    const changedFilterFormValues = _.pickBy(filterFormValues, function(n,k){return /^__searchable__/.test(k);});;
    // let crudService = crud && SteedosUI.getClosestAmisComponentByType(crud.context, "service", {name: "service_object_table_crud"});
    // crudService && crudService.setData({__changedFilterFormValues: changedFilterFormValues});
    // 这里不用crudService而用crud是因为lookup字段弹出的列表中的crudService中的变量无法传入crud的发送适配器中
    // crud && crud.setData({__changedFilterFormValues: changedFilterFormValues});
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
  `;
  return {
    "title": "",
    "submitText": "",
    "className": "",
    "debug": false,
    "mode": "normal",
    "wrapWithPanel": false,
    "body": [
      fieldsFilterBarSchema
    ],
    "onEvent": {
      "submitSucc": {
        "actions": [
          {
            "actionType": "custom",
            "script": onSubmitSuccScript
          }
        ]
      },
      "change": {
        "actions": [
          {
            "actionType": "custom",
            "script": onChangeScript
          }
        ]
      }
    }
  }
}
