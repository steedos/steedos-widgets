import { getObjectListHeaderFieldsFilterBar } from './header';
import { Router } from "@steedos-widgets/amis-lib";
import { getExportExcelToolbarButtonSchema } from './toolbars/export_excel';
import { getSettingListviewToolbarButtonSchema } from './toolbars/setting_listview'; 
import { i18next } from "../../../i18n"
import * as Fields from './fields/index';

const getDisplayAsButton = function(objectName, showDisplayAs){
  let displayAs = Router.getTabDisplayAs(objectName);
  let buttons = [
    {
      "type": "button",
      "label": i18next.t('frontend_display_type_is_table'),
      "onClick": "const key = 'tab_"+objectName+"_display';localStorage.setItem(key, 'grid');let url = document.location.pathname; var urlSearch = new URLSearchParams(document.location.search); if(urlSearch.get(\"side_object\") && urlSearch.get(\"side_listview_id\")){url=`/app/${props.data.appId}/${urlSearch.get(\"side_object\")}/grid/${urlSearch.get(\"side_listview_id\")}`;}; props.env.jumpTo(url + '?display=grid');",
      "rightIcon": displayAs != 'split' ? "fa fa-check" : null,
      "rightIconClassName": "m-l-sm"
    },
    {
      "type": "button",
      "label": i18next.t('frontend_display_type_is_split'),
      "onClick": "const key = 'tab_"+objectName+"_display';localStorage.setItem(key, 'split');const url = document.location.pathname + '?display=split'; props.env.jumpTo(url);",
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
    "btnClassName": "antd-Button--iconOnly bg-white !p-2 rounded border-gray-300 text-gray-500",
    "align": "right",
    "visibleOn": "${window:innerWidth > 768 && !!!isLookup}",
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
let resizeWindow = function(){
  //触发amis crud 高度重算
  setTimeout(()=>{
    window.dispatchEvent(new Event("resize"))
  }, 500);
}
resizeWindow();
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
        "placeholder": "快速搜索",
        "value": crudKeywords,
        "clearable": true,
        "clearAndSubmit": true
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
      "tpl":  "${count} " + i18next.t('frontend_record_sum')
    };
  }
  let toolbarReloadButton;
  if(formFactor === 'SMALL'){
    // const onReloadScript = `
    //   const scope = event.context.scoped;
    //   var listView = scope.parent.getComponents().find(function(n){
    //     return n.props.type === "crud";
    //   });
    //   listView.handleChangePage(1);
    // `;
    // toolbarReloadButton = {
    //   // "type": "reload",//不可以直接使用reload，因为它不会设置页码到第一页，这在加载更多按钮的翻页模式下会有问题
    //   "type": "button",
    //   "align": "right",
    //   //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
    //   // "tooltip": i18next.t('frontend_button_reload_tooltip'),
    //   "tooltipPlacement": "top",
    //   "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
    //   "label": "",
    //   "icon": "fa fa-sync",
    //   "visibleOn": "${!showFieldsFilter}",
    //   "onEvent": {
    //     "click": {
    //       "actions": [
    //         {
    //           "actionType": "custom",
    //           "script": onReloadScript
    //         }
    //       ]
    //     }
    //   },
    // };

    // 后续如果换成加载更多按钮的翻页模式的话，不可以直接使用下面的reload，需要换成上面的自定义脚本模式
    toolbarReloadButton = {
      "type": "reload",
      "align": "right",
      //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
      // "tooltip": i18next.t('frontend_button_reload_tooltip'),
      "tooltip":"",
      "tooltipPlacement": "top",
      "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
    };
  }
  else{
    toolbarReloadButton = {
      "type": "reload",
      "align": "right",
      //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
      // "tooltip": i18next.t('frontend_button_reload_tooltip'),
      "tooltip":"",
      "tooltipPlacement": "top",
      "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
    };
  }
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
      "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
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
  let toolbarDisplayAsButton = getDisplayAsButton(mainObject?.name, showDisplayAs);
  let toolbarDQuickSearchBox = getObjectHeaderQuickSearchBox(mainObject, fields, formFactor, { isLookup, keywordsSearchBoxName });

  // toolbars返回的数组元素不可以是空对象{}，比如hiddenCount ? {} : {"type": "tpl",...}，因为空对象最终还是会生成一个空的.antd-Crud-toolbar-item dom
  // 当出现空的.antd-Crud-toolbar-item dom时会影响toolbar元素的maring-right css样式计算，如果有动态需要应该加到动态数组变量toolbars中
  let toolbars = [];
  if(formFactor === 'SMALL'){
    if(toolbarCount){
      toolbars.push(toolbarCount);
    }
    toolbars.push(toolbarReloadButton);
    if(toolbarFilter){
      toolbars.push(toolbarFilter);
    }
    toolbars.push(toolbarDisplayAsButton);
    toolbars.push(toolbarDQuickSearchBox);
    return [
      // "bulkActions",
      ...(headerToolbarItems || []),
      ...toolbars,
  ]
  }else{
    if(toolbarCount){
      toolbars.push(toolbarCount);
    }
    if(toolbarFilter){
      toolbars.push(toolbarFilter);
    }
    toolbars.push(toolbarReloadButton);
    if(mainObject?.permissions?.allowCreateListViews){
      toolbars.push(getSettingListviewToolbarButtonSchema());
    }
    toolbars.push(toolbarDisplayAsButton);
    toolbars.push(toolbarDQuickSearchBox);
    return [
      // "filter-toggler",
      ...(headerToolbarItems || []),
      "bulkActions",
      {
        "type": "columns-toggler",
        "className": "hidden"
      },
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
  if (formFactor === 'SMALL') {
    // return [
    //   "load-more",
    // ]
    return [
      {
        "type": "pagination",
        "maxButtons": 5
      }
    ]
  }
  else {
    if(options && options.isRelated){
      return [
        "statistics",
        "pagination"
      ]

    }
    else{
      return [
        "switch-per-page",
        "statistics",
        "pagination"
      ]
    }
  }
}

export async function getObjectFilter(objectSchema, fields, options) {
  const fieldsFilterBarSchema = await getObjectListHeaderFieldsFilterBar(objectSchema, null, options);
  return {
    "title": "",
    "submitText": "",
    "className": "",
    // "debug": true,
    "mode": "normal",
    "wrapWithPanel": false,
    "body": [
      fieldsFilterBarSchema
    ]
  }
}
