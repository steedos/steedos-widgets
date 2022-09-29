/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:21
 * @Description: 
 */
import {getRecordDetailRelatedListSchema} from '@steedos-widgets/amis-lib'


export const AmisRecordDetailRelatedList = async (props) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { $schema } = props;
  return (await getRecordDetailRelatedListSchema($schema.objectApiName, $schema.recordId, $schema.relatedObjectApiName)).amisSchema;
}