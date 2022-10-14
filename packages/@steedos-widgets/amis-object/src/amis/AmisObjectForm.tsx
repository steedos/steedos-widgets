/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-14 16:04:43
 * @Description: 
 */
import { getFormSchema, getViewSchema } from '@steedos-widgets/amis-lib'
import { keys, pick, difference } from 'lodash';

export const AmisObjectForm = async (props) => {
  const { $schema, recordId, mode, layout, labelAlign } = props;
  let objectApiName = props.objectApiName || "space_users";
  const schemaKeys = difference(keys($schema), ["type"]);
  const formSchema = pick(props, schemaKeys);
  const defaults = {
    formSchema
  };
  const options: any = {
    recordId,
    mode: mode,
    layout: layout === 'vertical' ? 'normal' : layout,
    labelAlign,
    defaults
  }
  if (mode === 'edit') {
    return (await getFormSchema(objectApiName, options)).amisSchema;
  } else {
    // formInitProps
    if(!recordId){
      options.formInitProps = {
        queryOptions: "top: 1"
      };
    }
    return (await getViewSchema(objectApiName, recordId, options)).amisSchema;
  }
}