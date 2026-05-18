/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-08 10:11:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-29 13:58:36
 * @Description: 
 */
import './AmisInstanceDetail.less';
import { getInstanceInfo , getFlowFormSchema, getApplicant, autoUpgradeInstance, fetchAutoNumber} from '@steedos-widgets/amis-lib'

export const AmisInstanceDetail = async (props) => {
    const {instanceId, boxName, data, print} = props;
    if (boxName == 'draft') {
      await autoUpgradeInstance(instanceId);
    }

    // 给本步骤有权限的自动编号字段赋值
    if(boxName === "inbox" || boxName === "draft"){
      try {
        await fetchAutoNumber(instanceId);
      } catch (e) {
        console.error('自动编号失败', e);
      }
    }

    // console.log('AmisInstanceDetail===>', props);
    const instanceInfo = await getInstanceInfo({instanceId: instanceId, box: boxName, print});
    // console.log('AmisInstanceDetail===instanceInfo>', instanceInfo);
    const schema = await getFlowFormSchema(instanceInfo, boxName, print) as any;
    const applicant = await getApplicant(instanceInfo.applicant);
    // 将含有特殊字符的 key 同步生成安全版 key，避免 amis 表达式因找不到变量而回退默认值
    const normalizedValues = {};
    if (instanceInfo.approveValues) {
      Object.keys(instanceInfo.approveValues).forEach((key) => {
        if (typeof key === 'string' && /[^a-zA-Z0-9_$\u4e00-\u9fff.]/.test(key)) {
          const safeKey = key.replace(/[）)]/g, '').replace(/[^a-zA-Z0-9_$\u4e00-\u9fff.]/g, '_');
          normalizedValues[safeKey] = instanceInfo.approveValues[key];
        }
      });
    }
    schema.data = {
        "&": "$$",
        recordLoaded: true,
        submit_date: instanceInfo.submit_date,
        applicant_name: instanceInfo.applicant_name,
        related_instances: instanceInfo.related_instances,
        historyApproves: instanceInfo.historyApproves,
        approveValues: instanceInfo.approveValues,
        boxName,
        ...instanceInfo.approveValues,
        ...normalizedValues,
        context: Object.assign({}, data.context, instanceInfo),
        title: instanceInfo.name,
        record: instanceInfo,
        applicant: applicant
      }
    // console.log(`AmisInstanceDetail schema`, props, schema)
    return schema;
}