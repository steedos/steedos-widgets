/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 17:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-06-20 13:50:15
 * @Description:
 */


export const Router = {
    getTabDisplayAs(tab_id){
        var urlSearch = new URLSearchParams(document.location.search); 
        if(urlSearch.has('display')){
            return urlSearch.get('display')
        }
        const key = `tab_${tab_id}_display`;
        // const key = `page_display`;
        const value = localStorage.getItem(key)
        return value ? value : 'grid'
    },
  
    setTabDisplayAs(tab_id, displayAs){
        const key = `tab_${tab_id}_display`;
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
        if(_templateType === 'JavaScript'){
            return `/app/${appId}/${objectName}/view/${recordId}?side_object=<%=item.objectName%>&side_listview_id=<%=item.listName%>`;
        }
        return `/app/${appId}/${objectName}/view/${recordId}?side_object=\${objectName}&side_listview_id=\${listName}`;
    },
    getObjectRelatedViewPath({formFactor, appId, masterObjectName, masterRecordId, objectName, foreignKey}){
        return `/app/${appId}/${masterObjectName}/${masterRecordId}/${objectName}/grid?related_field_name=${foreignKey}`;
    },

}