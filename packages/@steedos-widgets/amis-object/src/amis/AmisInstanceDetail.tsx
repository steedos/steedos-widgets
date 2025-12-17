/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-08 10:11:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-29 13:58:36
 * @Description: 
 */
import './AmisInstanceDetail.less';
import { getInstanceInfo , getFlowFormSchema, getApplicant, autoUpgradeInstance} from '@steedos-widgets/amis-lib'

export const AmisInstanceDetail = async (props) => {
    const {instanceId, boxName, data, print} = props;
    if (boxName == 'draft') {
      await autoUpgradeInstance(instanceId);
    }
    // console.log('AmisInstanceDetail===>', props);
    const instanceInfo = await getInstanceInfo({instanceId: instanceId, box: boxName, print});
    // console.log('AmisInstanceDetail===instanceInfo>', instanceInfo);
    const schema = await getFlowFormSchema(instanceInfo, boxName, print) as any;
    const applicant = await getApplicant(instanceInfo.applicant);
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
        applicant: applicant
      }
    // console.log(`AmisInstanceDetail schema`, props, schema)
    return schema;
}