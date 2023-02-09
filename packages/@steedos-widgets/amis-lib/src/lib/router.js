/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 17:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-09 16:26:37
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
        const {formFactor, appId, objectName, recordId, listViewName} = props;
        // if(objectName === 'instances'){
        //     return `/workflow/space/\${context.tenantId}/\${listName}/${recordId}`;
        // }
        return `/app/${appId}/${objectName}/view/${recordId}?main_object=\${objectName}&main_listview_id=\${$listviewId}`;
    },
    getObjectRelatedViewPath({formFactor, appId, masterObjectName, masterRecordId, objectName, foreignKey}){
        return `/app/${appId}/${masterObjectName}/${masterRecordId}/${objectName}/grid?related_field_name=${foreignKey}`;
    }
}