import {getSpaceUsersPickerSchema} from '@steedos-widgets/amis-lib'

export const AmisSpaceUsersPicker = async (props) => {
  // console.log(`AmisSpaceUsersPicker props`, props)
  const { $schema, data } = props;
  const options = { id: $schema.id };
  return (await getSpaceUsersPickerSchema($schema.name, options)).amisSchema
}
