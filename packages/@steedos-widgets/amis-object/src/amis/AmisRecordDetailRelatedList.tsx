/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:21
 * @Description: 
 */
import { getRecordDetailRelatedListSchema } from '@steedos-widgets/amis-lib'


export const AmisRecordDetailRelatedList = async (props) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { recordId, data } = props;
  let objectApiName = props.objectApiName || "accounts";
  let relatedObjectApiName = props.relatedObjectApiName;
  if(!props.objectApiName || !relatedObjectApiName){
    return {
      "type": "alert",
      "body": "缺少父级对象或相关列表对象",
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  return (await getRecordDetailRelatedListSchema(objectApiName, recordId, relatedObjectApiName)).amisSchema;
}