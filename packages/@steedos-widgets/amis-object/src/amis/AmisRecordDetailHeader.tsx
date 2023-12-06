/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-13 16:12:37
 * @Description: 
 */
import './AmisRecordDetailHeader.less'
import { getRecordDetailHeaderSchema , getUISchema} from '@steedos-widgets/amis-lib'

export const AmisRecordDetailHeader = async (props) => {
  // console.log(`AmisRecordDetailHeader=====>`, props)
  //sticky在最新版ios上存在bug，因此暂时去除手机版sticky
  const { className = 'sm:sticky top-0 z-10 bg-gray-100 border-b sm:rounded sm:border border-gray-300 p-4', schemaFilter } = props;
  const objectUiSchema = await getUISchema(props.objectApiName || "space_users", false);
  const defaultOnEvent = {
    "recordLoaded": {
      "actions": [
        {
          "actionType": "reload",
          "data": {
            "name": `\${event.data.record.${objectUiSchema?.NAME_FIELD_KEY || 'name'}}`,
            "record": `\${event.data.record}`,
            "_id": "\${event.data.record._id}",
            "recordId": "\${event.data.record._id}",
            "recordLoaded": true,
          },
          "expression": `\${event.data.objectName == '${objectUiSchema?.name}'}`
        }
      ]
    }
  }
  const { $schema, recordId, onEvent = defaultOnEvent, showRecordTitle = true } = props;
  let objectApiName = props.objectApiName || "space_users";
  const schema = (await getRecordDetailHeaderSchema(objectApiName, recordId, {showRecordTitle, formFactor: props.data.formFactor})).amisSchema;
  schema.className = className;
  // console.log(`AmisRecordDetailHeader======>`, Object.assign({}, schema, {onEvent: onEvent}))

  let config = Object.assign({}, schema, {onEvent: onEvent})

  if(schemaFilter && typeof schemaFilter === 'string'){
    let schemaFilterFun = new Function(
      'config',
      'props',
      schemaFilter
    );
    try {
      const _config = await schemaFilterFun(config, props);
      config = _config || config;
    } catch (e) {
      console.warn(e);
    }
  }

  return config
}