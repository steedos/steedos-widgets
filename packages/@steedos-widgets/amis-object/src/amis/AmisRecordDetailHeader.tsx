/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-17 13:12:15
 * @Description: 
 */
import './AmisRecordDetailHeader.less'
import { getRecordDetailHeaderSchema , getUISchema} from '@steedos-widgets/amis-lib'

export const AmisRecordDetailHeader = async (props) => {
  // console.log(`AmisRecordDetailHeader=====>`, props)
  //sticky在最新版ios上存在bug，因此暂时去除手机版sticky
  const { className = 'sm:sticky top-0 sm:z-10 p-0 bg-white sm:m-4 sm:shadow-sm sm:border sm:rounded', schemaFilter, showButtons, showBackButton } = props;
  const objectUiSchema = await getUISchema(props.objectApiName || "space_users", false);
  const defaultOnEvent = {}
  const { $schema, recordId, onEvent = defaultOnEvent, showRecordTitle = true } = props;
  let objectApiName = props.objectApiName || "space_users";
  const schema = (await getRecordDetailHeaderSchema(objectApiName, recordId, {showRecordTitle, formFactor: props.data.formFactor, showButtons, showBackButton, display: props.data.display, _inDrawer: props.data._inDrawer})).amisSchema;
  schema.className += " " + className;
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