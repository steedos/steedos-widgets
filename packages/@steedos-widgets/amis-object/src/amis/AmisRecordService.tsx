/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-08 10:32:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-16 14:04:53
 * @Description: 
 */

import { getRecordServiceSchema } from '@steedos-widgets/amis-lib'
import { has } from 'lodash';

export const AmisRecordService = async (props) => {
  // console.log(`AmisRecordService======>`, props)
  let { className, $schema, appId, objectApiName = "space_users", fields, body, style, onEvent, recordId } = props;

  if(has($schema.data, "recordId") && $schema.data.recordId !== "${recordId}"){
    recordId = $schema.data.recordId;
  }
  if(has($schema.data, "objectName") && $schema.data.objectName !== "${objectName}"){
    objectApiName = $schema.data.objectName;
  }

  const options: any = {onEvent: $schema.onEvent, data: $schema.data, recordId}
  if(props.$$editor){
    options.isEditor = true;
  }
  const schema = (await getRecordServiceSchema(objectApiName, appId, options, body)).amisSchema;
  if(className){
    schema.className = className;
  }
  if (style) {
    if(!schema.style){
      schema.style = {}
    }
    Object.assign(schema.style, style);
  }
  // console.log(`AmisRecordService====schema==>`, schema)
  return schema
}