import { getSelectUserSchema } from '@steedos-widgets/amis-lib';

export const AmisSelectUser = async (props) => {
  console.log(`AmisSelectUser props`, props)
  const { $schema, data } = props;

  const multiple = typeof $schema.multiple === "boolean" ? $schema.multiple : false;
  const searchable = typeof $schema.searchable === "boolean" ? $schema.searchable : true;

  const amisSchema: any = await getSelectUserSchema({ name: $schema.name }, false, {
    multiple: multiple,
    searchable: searchable,
  });
  amisSchema.name = $schema.name;
  amisSchema.label = $schema.label;
  return amisSchema;
}
  