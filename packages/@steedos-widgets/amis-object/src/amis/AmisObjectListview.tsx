/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:21
 * @Description: 
 */
import { getListSchema } from '@steedos-widgets/amis-lib'
import { keys, pick, difference } from 'lodash';

export const AmisObjectListView = async (props) => {
  // console.log(`AmisObjectListView props`, props)
  const { $schema, top, showHeader, ctx, data, defaultData } = props;
  let listName = props.listName || location.pathname.match(/grid\/(\w+)/)[1];
  let defaults = {};
  let objectApiName = props.objectApiName || "space_users";

  if(!(ctx && ctx.defaults)){
    const schemaKeys = difference(keys($schema), ["type", "showHeader"]);
    const listSchema = pick(props, schemaKeys);
    defaults = {
      listSchema
    };
  }

  const amisSchemaData = Object.assign({}, data, defaultData);
  let amisSchema: any = (await getListSchema(amisSchemaData.appId, objectApiName, listName, { top, showHeader, defaults, ...ctx })).amisSchema;
  amisSchema.data = amisSchemaData;
  return amisSchema;
}