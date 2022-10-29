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
  const { $schema, filters, amisCondition, top, sortField, sortOrder, data } = props;
  const columns = props.columns || [];
  let objectApiName = props.objectApiName || "space_users";
  const schemaKeys = difference(keys($schema), ["type", "objectApiName", "columns"]);
  const listSchema = pick(props, schemaKeys);
  const amisFilters = amisCondition && conditionsToFilters(amisCondition);
  const tableFilters = filters || amisFilters;
  const defaults = {
    listSchema
  };
  return (await getTableSchema(data.appId, objectApiName, columns, { filters : tableFilters, top, sortField, sortOrder, defaults })).amisSchema
}