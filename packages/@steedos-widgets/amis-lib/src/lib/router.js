/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 17:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-10 12:08:35
 * @Description:
 */


export const Router = {
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
        // if(objectName === 'instances'){
        //     return `/workflow/space/\${context.tenantId}/\${listName}/${recordId}`;
        // }
        if(_templateType === 'JavaScript'){
            return `/app/${appId}/${objectName}/view/${recordId}?main_object=<%=item.objectName%>&main_listview_id=<%=item.listName%>`;
        }
        return `/app/${appId}/${objectName}/view/${recordId}?main_object=\${objectName}&main_listview_id=\${listName}`;
    },
    getObjectRelatedViewPath({formFactor, appId, masterObjectName, masterRecordId, objectName, foreignKey}){
        return `/app/${appId}/${masterObjectName}/${masterRecordId}/${objectName}/grid?related_field_name=${foreignKey}`;
    }
}