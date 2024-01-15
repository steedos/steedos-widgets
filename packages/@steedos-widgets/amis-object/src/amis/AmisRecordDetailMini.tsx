/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-15 15:52:02
 * @Description: 
 */
import './AmisRecordDetailMini.less'
import { getRecordDetailMiniSchema} from '@steedos-widgets/amis-lib'
import { has, isEmpty } from 'lodash';

export const AmisRecordDetailMini = async (props) => {
//   console.log(`AmisRecordDetailMini=====>`, props)
  let { className, $schema, appId, objectApiName = "space_users", fields, body, style, onEvent, recordId } = props;

  const schemaData: any = {}

  if(has(props.data, "recordId") && props.data.recordId !== "${recordId}"){
    recordId = props.data.recordId;
    schemaData.recordId = recordId;
  }

  if(has(props.data, "value")){
    recordId = props.data.value;
    schemaData.recordId = recordId;
  }

  if(has(props.data, "objectName") && props.data.objectName !== "${objectName}"){
    objectApiName = props.data.objectName;
    schemaData.objectName = objectApiName;
  }

  const options: any = {
    onEvent: $schema.onEvent, 
    data: $schema.data, 
    recordId
}
  if(props.$$editor){
    options.isEditor = true;
  }
  console.log(`AmisRecordDetailMini==2=>`, objectApiName, options)
  const schema = await getRecordDetailMiniSchema(objectApiName, appId, options);
  if(!isEmpty(schemaData)){
    schema.data = schemaData;
  }
//   console.log(`AmisRecordDetailMini===>`, schema)
  return schema
}