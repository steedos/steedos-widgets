/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:25
 * @Description: 
 */
import {getFormSchema} from '@steedos-widgets/amis-lib'

export const AmisObjectForm = async (props) => {
  const { $schema } = props;
  const options = {
    recordId: $schema.recordId,
    mode: $schema.mode,
    layout: $schema.layout
  }
  return (await getFormSchema($schema.objectApiName, options)).amisSchema
}