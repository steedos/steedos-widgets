/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-01-21 10:56:30
 */
import { getAmisInputTableSchema, i18next } from '@steedos-widgets/amis-lib'

export const AmisInputTable = async (props) => {
  // console.log("AmisInputTable props", props);
  // columns内存在inlineEditMode属性， 控制字段级的內联模式
  const { $schema, fields, name, id, data, columns, amis, className, tableClassName, headerToolbar, footerToolbar, 
    inlineEditMode, strictMode, dialog, primaryKey, showOperation, fieldPrefix, autoGeneratePrimaryKeyValue, mode } = props;
  const amisSchema = await getAmisInputTableSchema(props);
  // console.log("=AmisInputTable==amisSchema====", amisSchema);
  return amisSchema;
}