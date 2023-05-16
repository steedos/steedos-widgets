import { getObjectListHeaderFieldsFilterBar } from './header';
import { Router } from "@steedos-widgets/amis-lib";
import { getExportExcelToolbarButtonSchema } from './toolbars/export_excel';
import { getSettingListviewToolbarButtonSchema } from './toolbars/setting_listview'; 

const getDisplayAsButton = function(objectName, showDisplayAs){
  let displayAs = Router.getTabDisplayAs(objectName);
  let buttons = [
    {
      "type": "button",
      "label": "表格",
      "onClick": "let url = document.location.pathname; var urlSearch = new URLSearchParams(document.location.search); if(urlSearch.get(\"side_object\") && urlSearch.get(\"side_listview_id\")){url=`/app/${props.data.appId}/${urlSearch.get(\"side_object\")}/grid/${urlSearch.get(\"side_listview_id\")}`;}; props.env.jumpTo(url + '?display=grid');",
      "rightIcon": displayAs != 'split' ? "fa fa-check" : null,
      "rightIconClassName": "m-l-sm"
    },
    {
      "type": "button",
      "label": "分栏视图",
      "onClick": "const url = document.location.pathname + '?display=split'; props.env.jumpTo(url);",
      "rightIcon": displayAs === 'split' ? "fa fa-check" : null,
      "rightIconClassName": "m-l-sm"
    }
  ];
  return {
    "type": "dropdown-button",
    "icon": "fa fa-table-columns",
    "btnClassName": "antd-Button--iconOnly bg-white p-2 rounded border-gray-300 text-gray-500",
    "align": "right",
    "visibleOn": "${window:innerWidth > 768 && !!!isLookup}",
    "buttons": [ 
      {
        "label": "显示为",
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
// filterService.setData({showFieldsFilter: !!!filterService.props.data.showFieldsFilter});
let resizeWindow = function(){
  //触发amis crud 高度重算
  setTimeout(()=>{
    window.dispatchEvent(new Event("resize"))
  }, 500);
}
let isMobile = Steedos.isMobile();
if(filterService.props.data.showFieldsFilter){
  if(isMobile){
    // 手机上只能通过取消按钮来关闭搜索栏
    return;
  }
  let buttonCancel = SteedosUI.getClosestAmisComponentByType(filterForm.context, "button", { 
    direction: "down", 
    name: "btn_filter_form_cancel" 
  });
  buttonCancel.props.dispatchEvent('click', {}).then(function(){
    resizeWindow();
  });
}
else{
  filterService.setData({showFieldsFilter: true});
  resizeWindow();
  if(isMobile){
    // 手机端在显示搜索栏时隐藏刷新按钮
    let crudService = scope.getComponentById("service_listview_" + event.data.objectName);
    crudService && crudService.setData({showFieldsFilter: true});
  }
}
`;


export function getObjectHeaderToolbar(mainObject, formFactor, {showDisplayAs = false, hiddenCount = false, headerToolbarItems, filterVisible = true} = {}){
  // console.log(`getObjectHeaderToolbar====>`, filterVisible)
  const isMobile = window.innerWidth < 768;
  if(isMobile){
    showDisplayAs = false;
  }
  if(formFactor === 'SMALL'){
    const onReloadScript = `
      const scope = event.context.scoped;
      var listView = scope.parent.getComponents().find(function(n){
        return n.props.type === "crud";
      });
      listView.handleChangePage(1);
    `;
    return [
      // "bulkActions",
      ...(headerToolbarItems || []),
      hiddenCount ? {} :{
        "type": "tpl",
        "tpl": "${count} 个项目"
      },
      {
        // "type": "reload",//不可以直接使用reload，因为它不会设置页码到第一页
        "type": "button",
        "align": "right",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
        "label": "",
        "icon": "fa fa-sync",
        "visibleOn": "${!showFieldsFilter}",
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
      },
      filterVisible ? {
        "label": "",
        "icon": "fa fa-search",
        "type": "button",
        "badge": {
          "offset": [
            -5,
            1
          ],
          "size":8,
          "animation": true,
          "visibleOn": "${isFieldsFilterEmpty == false}"
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
        }
      } : {},
      getDisplayAsButton(mainObject?.name, showDisplayAs)
  ]
  }else{
    return [
      // "filter-toggler",
      ...(headerToolbarItems || []),
      "bulkActions",
      {
        "type": "columns-toggler",
        "className": "hidden"
      },
      // {
      //     "type": "columns-toggler",
      //     "className": "mr-2"
      // },
      hiddenCount ? {} : {
        "type": "tpl",
        "tpl":  "${count} 个项目"
      },
      {
        "type": "reload",
        "align": "right",
        "tooltipPlacement": "bottom",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
      },
      getExportExcelToolbarButtonSchema(),
      filterVisible ? {
        "label": "",
        "icon": "fa fa-search",
        "type": "button",
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
        }
      } : {},
      getSettingListviewToolbarButtonSchema(),
      getDisplayAsButton(showDisplayAs)
      // {
      //   "type": "search-box",
      //   "align": "right",
      //   "name": "__keywords",
      //   "placeholder": "请输入关键字",
      //   "mini": true
      // },
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

export function getObjectFooterToolbar(mainObject, formFactor) {
  if (formFactor === 'SMALL') {
    return [
      "load-more",
    ]
  }
  else {
    return [
      "switch-per-page",
      "statistics",
      "pagination"
    ]
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
