/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-30 10:45:46
 * @Description: 
 */
import { getListSchema } from '@steedos-widgets/amis-lib'
import { keys, pick, difference } from 'lodash';

export const AmisObjectListView = async (props) => {
  // console.log(`AmisObjectListView props`, props)
  const { $schema, top, showHeader, headerSchema, ctx, data, defaultData } = props;
  const urlListNameMatchs = location.pathname.match(/grid\/(\w+)/);
  const urlListName = urlListNameMatchs && urlListNameMatchs[1]
  let listName = urlListName || props.listName;

  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users";

  if (!(ctx && ctx.defaults)) {
    // 支持把crud组件任意属性通过listSchema属性传入到底层crud组件中
    const schemaKeys = difference(keys($schema), ["type", "showHeader","id"]);
    const listSchema = pick(props, schemaKeys);
    defaults = {
      listSchema
    };
  }

  // 支持通过直接定义headerSchema属性来定制表头，而不一定要通过ctx.defaults.headerSchema传入
  if(headerSchema){
    defaults.headerSchema = headerSchema;
  }

  const amisSchemaData = Object.assign({}, data, defaultData);
  const listViewId = ctx?.listViewId || amisSchemaData.listViewId;
  let amisSchema: any = (await getListSchema(amisSchemaData.appId, objectApiName, listName, { top, showHeader, defaults, ...ctx, listViewId })).amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData, { listName });
  return amisSchema;
}