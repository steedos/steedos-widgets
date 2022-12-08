/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-08 10:32:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-08 14:59:02
 * @Description: 
 */

import { getRecordDetailSchema } from '@steedos-widgets/amis-lib'

export const AmisRecordDetail = async (props) => {
    const { $schema, appId, objectApiName = "space_users", onEvent } = props;
    const schema = (await getRecordDetailSchema(objectApiName, appId)).amisSchema;
    return Object.assign({}, schema, {onEvent: onEvent}) 
  }