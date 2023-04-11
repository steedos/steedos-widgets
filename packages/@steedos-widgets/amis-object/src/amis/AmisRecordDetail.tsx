/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-08 10:32:17
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-04-11 11:28:41
 * @Description: 
 */

import { getRecordDetailSchema } from '@steedos-widgets/amis-lib'

export const AmisRecordDetail = async (props) => {
    // console.log(`AmisRecordDetail======>`, props)
    const { className, $schema, appId, objectApiName = "space_users", recordId, onEvent, defaultData, body } = props;
    const schema = (await getRecordDetailSchema(objectApiName, appId)).amisSchema;
    // 在非记录页组件下全局作用域下无recordId，会导致表单接口sendOn始终为false，无法发起请求。
    let recordDetailData: any = {};
    if(recordId){
      recordDetailData.recordId = recordId;
    }
    schema.data = Object.assign({}, schema.data, recordDetailData);
    schema.className = className;

    if(body){
      schema.body = body;
    }
    return schema
  }