/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-02 18:05:51
 * @Description: 
 */
import { getRecordDetailHeaderSchema , getUISchema} from '@steedos-widgets/amis-lib'

export const AmisRecordDetailHeader = async (props) => {
  const objectUiSchema = await getUISchema(props.objectApiName || "space_users", false);
  const defaultOnEvent = {
    "recordLoaded": {
      "actions": [
        {
          "actionType": "reload",
          "data": {
            "name": `\${record.${objectUiSchema?.NAME_FIELD_KEY || 'name'}}`
          }
        },
        {
          "actionType": "setValue",
          "args": {
            value: {
              "record": "${record}",
              "recordLoaded": true,
            }
          }
        }
      ]
    }
  }
  const { $schema, recordId, onEvent = defaultOnEvent } = props;
  let objectApiName = props.objectApiName || "space_users";
  const schema = (await getRecordDetailHeaderSchema(objectApiName, recordId)).amisSchema;
  return Object.assign({}, schema, {onEvent: onEvent})
}