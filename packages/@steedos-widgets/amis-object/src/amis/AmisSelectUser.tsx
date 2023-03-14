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
  amisSchema.name = $schema.name;
  amisSchema.label = $schema.label;
  return amisSchema;
}
