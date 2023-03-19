/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-17 16:54:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-19 22:05:51
 * @FilePath: /steedos-ee/Users/yinlianghui/Documents/GitHub/steedos-webapp-nextjs/packages/@steedos-widgets/amis-object/src/amis/AmisSelectUser.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getSelectUserSchema, getIdsPickerSchema, Field } from '@steedos-widgets/amis-lib';

export const AmisSelectUser = async (props) => {
  console.log(`AmisSelectUser props`, props)
  const { $schema, data, ids, idsTrackOn, readonly = false, ctx = {} } = props;
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
    try {
      const steedosField = {
        type: "lookup", 
        reference_to: "users",
        name: $schema.name,
        multiple: $schema.multiple,
        required: true,
        searchable: $schema.searchable,
        onEvent: $schema.onEvent,
        filters: $schema.filters
      };
      amisSchema = await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
      // console.log(`amisSchema===`, amisSchema)
    } catch (error) {
        console.log(`error`, error)
    }
  }
  amisSchema.name = $schema.name;
  amisSchema.label = $schema.label;
  return amisSchema;
}
