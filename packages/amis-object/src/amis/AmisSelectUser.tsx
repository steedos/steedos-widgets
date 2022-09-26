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
  // 不可以写label因为设计器中会显示两次
  // amisSchema.label = $schema.label;
  return amisSchema;
}
  