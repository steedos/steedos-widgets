/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:25
 * @Description: 
 */
import {getFormSchema} from '@steedos-labs/amis-lib'

export const AmisObjectForm = async (props) => {
  const { $schema } = props;
  console.log(`AmisObjectForm props`, props)
  return (await getFormSchema($schema.objectName, {recordId: $schema.recordId})).amisSchema
}