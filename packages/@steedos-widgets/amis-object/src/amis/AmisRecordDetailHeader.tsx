/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-18 10:56:38
 * @Description: 
 */
import './AmisRecordDetailHeader.less'
import { getRecordDetailHeaderSchema , getUISchema} from '@steedos-widgets/amis-lib'

export const AmisRecordDetailHeader = async (props) => {
  // console.log(`AmisRecordDetailHeader=====>`, props)
  //sticky在最新版ios上存在bug，因此暂时去除手机版sticky
  const { className = 'sm:sticky top-0 z-10 p-0 bg-gray-100', schemaFilter, showButtons, showBackButton } = props;
  const objectUiSchema = await getUISchema(props.objectApiName || "space_users", false);
  const defaultOnEvent = {}
  const { $schema, recordId, onEvent = defaultOnEvent, showRecordTitle = true } = props;
  let objectApiName = props.objectApiName || "space_users";
  const schema = (await getRecordDetailHeaderSchema(objectApiName, recordId, {showRecordTitle, formFactor: props.data.formFactor, showButtons, showBackButton, display: props.data.display})).amisSchema;
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
  // console.log(`AmisRecordDetailHeader==>`, config)
  return config
}