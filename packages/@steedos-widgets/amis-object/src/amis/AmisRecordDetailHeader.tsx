/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-04 15:13:47
 * @Description: 
 */
import { getRecordDetailHeaderSchema , getUISchema} from '@steedos-widgets/amis-lib'

export const AmisRecordDetailHeader = async (props) => {
  // console.log(`AmisRecordDetailHeader=====>`, props)
  const { className = 'bg-gray-100 border-b sm:shadow sm:rounded sm:border border-slate-300 p-4' } = props;
  const objectUiSchema = await getUISchema(props.objectApiName || "space_users", false);
  const defaultOnEvent = {
    "recordLoaded": {
      "actions": [
        {
          "actionType": "reload",
          "data": {
            "name": `\${record.${objectUiSchema?.NAME_FIELD_KEY || 'name'}}`,
            "record": "${record}",
            "recordLoaded": true
          }
        },
        {
          "actionType": "setValue",
          "args": {
            "value": {
              "recordLoaded": true,
            }
          }
        }
      ]
    }
  }
  const { $schema, recordId, onEvent = defaultOnEvent, showRecordTitle = true } = props;
  let objectApiName = props.objectApiName || "space_users";
  const schema = (await getRecordDetailHeaderSchema(objectApiName, recordId, {showRecordTitle})).amisSchema;
  schema.className = className;
  // console.log(`AmisRecordDetailHeader======>`, Object.assign({}, schema, {onEvent: onEvent}))
  return Object.assign({}, schema, {onEvent: onEvent})
}