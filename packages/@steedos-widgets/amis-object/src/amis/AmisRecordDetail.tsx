/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-08 10:32:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-13 18:40:42
 * @Description: 
 */

import { getRecordDetailSchema } from '@steedos-widgets/amis-lib'
import { has } from 'lodash';

export const AmisRecordDetail = async (props) => {
    // console.log(`AmisRecordDetail======>`, props)
    const { className, $schema, appId, objectApiName = "space_users", recordId, onEvent, defaultData, body } = props;
    const schema = (await getRecordDetailSchema(objectApiName, appId)).amisSchema;
    // 在非记录页组件下全局作用域下无recordId，会导致表单接口sendOn始终为false，无法发起请求。
    // let recordDetailData: any = {};
    // if(recordId){
    //   recordDetailData.recordId = recordId;
    // }
    // schema.data = Object.assign({}, schema.data, recordDetailData);

    if(has(props, "recordId") && $schema.recordId !== "${recordId}"){
      schema.data.recordId = props.recordId;
    }
    schema.className = className;

    if(body){
      schema.body = body;
    }
    // console.log(`AmisRecordDetail====schema==>`, schema)
    return schema
  }