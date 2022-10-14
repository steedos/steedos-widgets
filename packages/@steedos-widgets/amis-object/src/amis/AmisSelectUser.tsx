import { getSelectUserSchema } from '@steedos-widgets/amis-lib';

export const AmisSelectUser = async (props) => {
  console.log(`AmisSelectUser props`, props)
  const { $schema, data } = props;
  const amisSchema: any = await getSelectUserSchema({
    name: $schema.name,
    multiple: $schema.multiple,
    searchable: $schema.searchable,
    onEvent: $schema.onEvent,
    filters: $schema.filters
  }, false, {});
  console.log('amisSchema11==>', amisSchema)
  amisSchema.name = $schema.name;
  // 不可以写label因为设计器中会显示两次
  // amisSchema.label = $schema.label;
  console.log('amisSchema22==>', amisSchema)
  return amisSchema;
}
