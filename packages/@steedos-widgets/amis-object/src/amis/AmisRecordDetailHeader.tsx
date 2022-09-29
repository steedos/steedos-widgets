/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:21
 * @Description: 
 */
import {getRecordDetailHeaderSchema} from '@steedos-widgets/amis-lib'

export const AmisRecordDetailHeader = async (props) => {
  // console.log(`AmisRecordDetailHeader props==>`, props)
  const { $schema, objectApiName, recordId } = props;
  return (await getRecordDetailHeaderSchema(objectApiName, recordId)).amisSchema
}