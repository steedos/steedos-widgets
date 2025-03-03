/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-12-25 13:52:44
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-03 10:42:45
 */
import { getTablesGridSchema } from "./tables";

export const AmisTablesGrid = async (props: any) => {
  const { $schema, data, defaultData, className = "", tableId, baseId = "default", mode = "edit", env, style, agGridLicenseKey, filters, beforeUpdateData } = props;
  // console.log('AmisTablesGrid===', props);
  const amisSchemaData = Object.assign({}, data, defaultData);
  // const appId = data?.appId || defaultData?.appId;
  let tableSchema = await getTablesGridSchema(tableId, baseId, mode, { env, data, agGridLicenseKey, filters, beforeUpdateData });
  let amisSchema: any = tableSchema.amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  amisSchema.className = `${amisSchema.className} ${className}`;
  amisSchema.style = style;
  return amisSchema;
}