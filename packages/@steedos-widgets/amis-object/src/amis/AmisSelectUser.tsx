import { getSelectUserSchema, getIdsPickerSchema } from '@steedos-widgets/amis-lib';

export const AmisSelectUser = async (props) => {
  console.log(`AmisSelectUser props`, props)
  const { $schema, data, ids } = props;
  let amisSchema: any;
  if(ids){
    amisSchema = await getIdsPickerSchema({
      name: $schema.name,
      multiple: $schema.multiple,
      searchable: $schema.searchable,
      onEvent: $schema.onEvent,
      filters: $schema.filters,
      reference_to: "users",
      ids
    }, false, {});
  }
  else{
    amisSchema = await getSelectUserSchema({
      name: $schema.name,
      multiple: $schema.multiple,
      searchable: $schema.searchable,
      onEvent: $schema.onEvent,
      filters: $schema.filters
    }, false, {});
  }
  amisSchema.name = $schema.name;
  amisSchema.label = $schema.label;
  return amisSchema;
}
