/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 17:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-14 16:32:05
 * @Description:
 */


export const Router = {
    getAppPath({formFactor, appId}){
        return `/${formFactor === 'SMALL' ? 'mapp': 'app'}/${appId}`;
    },
    getPagePath(){
        //TODO
    },
    getObjectListViewPath({formFactor, appId, objectName, listViewName}){
        return `/${formFactor === 'SMALL' ? 'mapp': 'app'}/${appId}/${objectName}/grid/${listViewName}`;
    },
    getObjectDetailPath({formFactor, appId, objectName, recordId}){
        return `/${formFactor === 'SMALL' ? 'mapp': 'app'}/${appId}/${objectName}/view/${recordId}`;
    },
    getObjectRelatedViewPath({formFactor, appId, masterObjectName, masterRecordId, objectName, foreignKey}){
        return `/${formFactor === 'SMALL' ? 'mapp': 'app'}/${appId}/${masterObjectName}/${masterRecordId}/${objectName}/grid?related_field_name=${foreignKey}`;
    }
}