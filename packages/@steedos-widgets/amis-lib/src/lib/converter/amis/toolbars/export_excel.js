import { i18next } from "../../../../i18n"

export const getExportExcelToolbarButtonSchema = ()=>{
    return {
        "type": "button",
        "icon": "fa fa-download",
        "align": "right", 
        "className": "bg-white p-2 rounded text-gray-500",
        "tooltipPlacement": "top",
        "visibleOn": "${!isLookup && global.user.is_space_admin}",
        //TODO: dropdown-button只支持在按钮上方配置提示，对于上方按钮的点击会有影响，为保持统一，暂时去除，等待amis优化，https://github.com/baidu/amis/issues/7330
        // "tooltip": i18next.t('frontend_export_excel'),
        "onEvent": {
          "click": { 
            "weight": 0,
            "actions": [
              {
                "args": {
                  "api": {
                    "url": "${context.rootUrl}/api/record/export/${objectName}",
                    "method": "get",
                    "messages": {},
                    "requestAdaptor": `${requestAdaptor()}`,
                    "data": {
                      "uiSchema": "${uiSchema}",
                      "listName": "${listName}"
                    },
                    "headers": {
                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    }
                  }
                },
                "actionType": "download"
              }
            ]
          }
        }
    }
}

function requestAdaptor(){
  return `
    // 获取列表视图的属性
    let uiSchema = api.body.uiSchema;
    let list_views = uiSchema.list_views;
    let list_views_name = api.body.listName;
    let col = list_views[list_views_name].columns;
    let sort_test = list_views[list_views_name].sort;
    
    // 获取下载字段
    let select = [];
    _.each(col, (col) => {
        if (col.field == undefined)
            select.push(col);
        else select.push(col.field);
    });
    
    // 获取排序字段
    
    let sort = [];
    _.forEach(sort_test, (sortField) => {
        if (sortField.field_name == undefined)
            sort.push(sortField);
        else sort.push([sortField.field_name, sortField.order]);
    })
    
    let orders = [];
    _.map(sort, (value) => {
        let order_tmp = [];
        if (value[1] == "desc")
            order_tmp = value[0] + ' desc';
        else
            order_tmp = value[0];
        orders.push(order_tmp);
    });
    let order = orders.join(',');
    
    let filename = uiSchema.label + "-" + list_views[list_views_name].label;
    
    url_tmp = api.url.split('?')[0];
    api.url = url_tmp + "?$select=" + encodeURIComponent(select.toString()) + "&filename=" + encodeURIComponent(filename);

    // 判断sort 和 filters
    if (sort.length > 0) {
        api.url += "&$orderby=" + encodeURIComponent(order);
    }
    let filters = list_views[list_views_name].filters;
    if (filters && filters.length > 0) {
        api.url = api.url + "&filters=" + encodeURIComponent(JSON.stringify(filters));
    }
    return api;
  `
}

