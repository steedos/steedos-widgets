/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-06 15:42:34
 * @Description: 
 */
import { getRecordDetailRelatedListSchema } from '@steedos-widgets/amis-lib'


export const AmisRecordDetailRelatedList = async (props) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { objectApiName, recordId, relatedObjectApiName, data, relatedKey, top = 5 } = props;
  if(!objectApiName || !relatedObjectApiName){
    return {
      "type": "alert",
      "body": "缺少父级对象或相关列表对象",
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  const schema = (await getRecordDetailRelatedListSchema(objectApiName, recordId, relatedObjectApiName, relatedKey, top)).amisSchema;
  return schema
}