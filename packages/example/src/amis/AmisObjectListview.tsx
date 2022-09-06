/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:21
 * @Description: 
 */
import {getListSchema} from '@steedos-widgets/amis-lib'

export const AmisObjectListView = async (props) => {
  console.log(`AmisObjectListView props`, props)
  const { $schema, data } = props;
  return (await getListSchema(data.appId, $schema.objectName, $schema.listviewName)).amisSchema
}