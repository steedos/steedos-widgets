/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-08 10:11:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-29 13:58:36
 * @Description: 
 */
import './AmisInstanceDetail.less';
import { getInstanceInfo , getFlowFormSchema} from '@steedos-widgets/amis-lib'

export const AmisInstanceDetail = async (props) => {
    // console.log(`AmisInstanceDetail`, props)
    const {instanceId, boxName, data} = props;
    const instanceInfo = await getInstanceInfo({instanceId: instanceId, box: boxName});
    // console.log(`AmisInstanceDetail instanceInfo`, instanceId, boxName, instanceInfo)
    const schema = await getFlowFormSchema(instanceInfo, boxName);
    // console.log(`AmisInstanceDetail schema`, schema);

    schema.data = {
        "&": "$$",
        recordLoaded: true,
        submit_date: instanceInfo.submit_date,
        applicant_name: instanceInfo.applicant_name,
        related_instances: instanceInfo.related_instances,
        historyApproves: instanceInfo.historyApproves,
        boxName,
        ...instanceInfo.approveValues,
        context: Object.assign({}, data.context, instanceInfo),
        record: instanceInfo,
        applicant: instanceInfo.applicant._id
      }
    // console.log(`AmisInstanceDetail schema`, schema)
    return schema;
}