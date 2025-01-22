/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:16:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-22 15:55:36
 * @Description: 
 */
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { AmisRender } from "../../components/AmisRender";

export const AppList = () => {
  
  return (
    <AmisRender schema = {{
            type: 'steedos-object-form',
            objectApiName: 'space_users',
            "mode": "edit",
            "enableInitApi": false,
            "className": "",
            recordId: 'zT7rgJNvjeqHCk6n4',
          
          }} data ={{}} env = {{}} />
  );
};
