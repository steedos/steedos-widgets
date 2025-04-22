/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-08 10:32:17
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-22 18:24:38
 * @Description: 
 */
// import './AmisRecordDetailHeader.less'
import { getRecordDetailSchema } from '@steedos-widgets/amis-lib'
import { has } from 'lodash';
import './AmisRecordDetail.less'

export const AmisRecordDetail = async (props) => {
    // console.log(`AmisRecordDetail======>`, props)
    const { className, $schema, appId, objectApiName = "space_users", recordId, onEvent, defaultData, body, showButtons, showBackButton } = props;
    const schema = (await getRecordDetailSchema(objectApiName, appId, {showButtons, showBackButton})).amisSchema;
    // 在非记录页组件下全局作用域下无recordId，会导致表单接口sendOn始终为false，无法发起请求。
    // let recordDetailData: any = {};
    // if(recordId){
    //   recordDetailData.recordId = recordId;
    // }
    // schema.data = Object.assign({}, schema.data, recordDetailData);

    if(has(props, "recordId") && $schema.recordId !== "${recordId}"){
      if(!schema.data){
        schema.data = {}
      }
      schema.data.recordId = props.recordId;
    }
    if(has(props, "objectApiName") && props.objectApiName && $schema.objectApiName !== "${objectName}"){
      if(!schema.data){
        schema.data = {}
      }
      schema.data.objectName = props.objectApiName;
    }

    schema.className = className;

    if(body){
      schema.body = body;
    }
    schema.data = Object.assign({}, $schema.data, schema.data)
    // console.log(`AmisRecordDetail====schema==>`, schema, props);
    return schema
  }