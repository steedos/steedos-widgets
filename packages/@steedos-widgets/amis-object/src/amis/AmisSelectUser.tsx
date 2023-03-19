/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-17 16:54:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-19 15:49:15
 * @FilePath: /steedos-ee/Users/yinlianghui/Documents/GitHub/steedos-webapp-nextjs/packages/@steedos-widgets/amis-object/src/amis/AmisSelectUser.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getSelectUserSchema, getIdsPickerSchema } from '@steedos-widgets/amis-lib';

export const AmisSelectUser = async (props) => {
  console.log(`AmisSelectUser props`, props)
  const { $schema, data, ids, idsTrackOn } = props;
  let amisSchema: any;
  if(ids || idsTrackOn){
    amisSchema = await getIdsPickerSchema({
      name: $schema.name,
      multiple: $schema.multiple,
      searchable: $schema.searchable,
      onEvent: $schema.onEvent,
      filters: $schema.filters,
      reference_to: "users"
    }, false, {
      ids, 
      idsTrackOn
    });
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
