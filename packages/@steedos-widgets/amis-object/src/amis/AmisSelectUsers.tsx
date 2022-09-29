export const AmisSelectUsers = async (props) => {
  console.log(`AmisSelectUsers props`, props)
  const { $schema, data } = props;
  const multiple = typeof $schema.multiple === "boolean" ? $schema.multiple : false;
  const searchable = typeof $schema.searchable === "boolean" ? $schema.searchable : false;
  const sourceUrl = "${context.rootUrl}/service/api/amis-metadata-space_users/space_users/options";
  return {
    "type": "select",
    "label": $schema.label,
    "name": $schema.name,
    "multiple": multiple,
    "searchable": searchable,
    "selectMode": "associated",
    "leftMode": "tree",
    "source": sourceUrl,
    "deferApi": sourceUrl + "?ref=${ref}&dep=${value}",
    "searchApi": sourceUrl + "?term=${term}"
  }
}
