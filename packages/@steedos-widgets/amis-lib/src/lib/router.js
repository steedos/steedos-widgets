/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 17:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-19 15:25:50
 * @Description:
 */


export const Router = {
    getTabDisplayAs(tab_id){
        var urlSearch = new URLSearchParams(document.location.search); 
        if(urlSearch.has('display')){
            return urlSearch.get('display')
        }
        // const key = `tab.${tab_id}.display`;
        const key = `page_display`;
        const value = localStorage.getItem(key)
        return value ? value : 'grid'
    },
  
    setTabDisplayAs(tab_id, displayAs){
        const key = `tab.${tab_id}.display`;
        localStorage.setItem(key, displayAs)
    },
    getAppPath({formFactor, appId}){
        return `/app/${appId}`;
    },
    getPagePath(){
        //TODO
    },
    getObjectListViewPath({formFactor, appId, objectName, listViewName}){
        return `/app/${appId}/${objectName}/grid/${listViewName}`;
    },
    getObjectDetailPath(props){
        const {formFactor, appId, objectName, recordId, listViewName, _templateType} = props;
        // var urlParams = new URLSearchParams(window.location.search);
        // if(objectName === 'instances'){
        //     return `/workflow/space/\${context.tenantId}/\${listName}/${recordId}`;
        // }
        const displayAs =  Router.getTabDisplayAs(objectName); //urlParams.get("display") ||
        if(_templateType === 'JavaScript'){
            return `/app/${appId}/${objectName}/view/${recordId}?display=${displayAs}&side_object=<%=item.objectName%>&side_listview_id=<%=item.listName%>`;
        }
        return `/app/${appId}/${objectName}/view/${recordId}?display=${displayAs}&side_object=\${objectName}&side_listview_id=\${listName}`;
    },
    getObjectRelatedViewPath({formFactor, appId, masterObjectName, masterRecordId, objectName, foreignKey}){
        return `/app/${appId}/${masterObjectName}/${masterRecordId}/${objectName}/grid?related_field_name=${foreignKey}`;
    },

}