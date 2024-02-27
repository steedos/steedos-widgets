/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-01-21 10:56:30
 */
import './AmisInputTable.less';
import { getAmisInputTableSchema, i18next } from '@steedos-widgets/amis-lib'

export const AmisInputTable = async (props) => {
  // console.log("AmisInputTable props", props);
  // columns内存在inlineEditMode属性， 控制字段级的內联模式；存在wrap属性，控制列表单元格是否换行，规则与列表视图相同
  const { $schema, fields, name, id, data, columns, amis, className, tableClassName, headerToolbar, footerToolbar,
    inlineEditMode, strictMode, dialog, primaryKey, showOperation, fieldPrefix, autoGeneratePrimaryKeyValue, mode,
    disabledOn, disabled, visibleOn, visible, hiddenOn, hidden, enableDialog, enableTree } = props;
  const extendProps = {};
  if (props.disabledOn || props.disabled) {
    extendProps["addable"] = false;
    extendProps["editable"] = false;
    extendProps["removable"] = false;
  }

  if (props.enableDialog === false) {
    extendProps["inlineEditMode"] = true;
  }
  const amisSchema = await getAmisInputTableSchema(Object.assign({}, props, extendProps));
  // console.log("=AmisInputTable==amisSchema====", amisSchema);
  return amisSchema;
}