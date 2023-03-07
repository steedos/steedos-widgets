/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-08 10:32:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-07 12:40:53
 * @Description: 
 */

import { getRecordDetailSchema } from '@steedos-widgets/amis-lib'

export const AmisRecordDetail = async (props) => {
    // console.log(`AmisRecordDetail======>`, props)
    const { $schema, appId, objectApiName = "space_users", recordId, onEvent, defaultData } = props;
    const schema = (await getRecordDetailSchema(objectApiName, appId, { onEvent })).amisSchema;
    // 在非记录页组件下全局作用域下无recordId，会导致表单接口sendOn始终为false，无法发起请求。
    let recordDetailData: any = {};
    if(recordId){
      recordDetailData.recordId = recordId;
    }
    schema.data = Object.assign({}, schema.data, recordDetailData);
    return schema
  }