/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-08 10:32:17
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-04-12 23:59:26
 * @Description: 
 */

import { getRecordServiceSchema } from '@steedos-widgets/amis-lib'

export const AmisRecordService = async (props) => {
  // console.log(`AmisRecordService======>`, props)
  const { className, $schema, appId, objectApiName = "space_users", recordId, fields, body } = props;
  const schema = (await getRecordServiceSchema(objectApiName, appId)).amisSchema;
  schema.className = className;
  if (body) {
    schema.body = body;
  }
  return schema
}