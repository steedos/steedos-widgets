/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:21
 * @Description: 
 */
import { getTableSchema, conditionsToFilters } from '@steedos-widgets/amis-lib'
import { keys, pick, difference } from 'lodash';

export const AmisObjectTable = async (props) => {
  // console.log(`AmisObjectTable props`, props)
  const { $schema, filters, amisCondition, top, sortField, sortOrder, extraColumns, data, defaultData } = props;
  const columns = props.columns || [];
  let defaults = props.defaults;
  let objectApiName = props.objectApiName || "space_users";

  if(!defaults){
    const schemaKeys = difference(keys($schema), ["type", "objectApiName", "columns", "extraColumns"]);
    const listSchema = pick(props, schemaKeys);
    defaults = {
      listSchema
    };
  }
  const amisFilters = amisCondition && conditionsToFilters(amisCondition);
  const tableFilters = filters || amisFilters;

  let amisSchema = (await getTableSchema(data.appId, objectApiName, columns, { filters : tableFilters, top, sortField, sortOrder, extraColumns, defaults })).amisSchema;
  amisSchema.data = Object.assign({}, data, defaultData);
  return amisSchema;
}