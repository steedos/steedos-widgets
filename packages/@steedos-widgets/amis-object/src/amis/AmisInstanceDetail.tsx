/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-08 10:11:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-29 13:58:36
 * @Description: 
 */
import './AmisInstanceDetail.less';
import { getInstanceInfo , getFlowFormSchema, getApplicant, autoUpgradeInstance, fetchAutoNumber} from '@steedos-widgets/amis-lib'
import i18next from "i18next";

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
    // 记录不存在时，直接返回提示 schema，不继续调用 getFlowFormSchema（issue #800 兜底）
    if (!instanceInfo) {
        // 同步清掉 PageRecordDetail.tsx 加上的 loading 遮罩与滑动动画，避免空态被遮挡或被向右滑走
        try {
            const $w = (window as any).$;
            if ($w) {
                $w('body').removeClass('steedos-detail-loading');
                $w('.page-object-detail-wrapper').removeClass('slide-out-bottom').addClass('slide-in-top');
            }
        } catch(e) {}
        // 警示三角图标（Heroicons ExclamationTriangle，amber-500 描边），用 span 包裹以便 offsetWidth 检测可见
        const svgHtml = "<span class='empty-record-icon' style='display:block;margin-bottom:16px'><svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='#f59e0b'><path stroke-linecap='round' stroke-linejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.732 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'/></svg></span>";
        const body: any[] = [
            { type: 'html', html: svgHtml },
            { type: 'tpl', tpl: i18next.t('frontend_no_records_found'), className: 'empty-record-title text-xl text-gray-800 font-medium mb-4' }
        ];
        // 打印场景（print=true）不显示返回按钮；其它统一调用全局 window.goBack() 返回上一页
        if (!print) {
            body.push({
                type: 'button', label: i18next.t('frontend_back_to_list'), level: 'primary', className: 'empty-record-back-btn',
                onEvent: { click: { actions: [ { actionType: 'custom', script: 'window.goBack && window.goBack()' } ] } }
            });
        }
        return {
            type: 'wrapper',
            // 用 inline style 100vh 实现垂直居中（占满视口高度，不依赖 Tailwind JIT 任意值类）
            className: 'flex flex-col items-center justify-center p-8 text-center bg-white',
            style: { minHeight: '100vh' },
            body,
            data: {
                recordLoaded: true,
                recordNotFound: true
            }
        };
    }
    // console.log('AmisInstanceDetail===instanceInfo>', instanceInfo);
    const schema = await getFlowFormSchema(instanceInfo, boxName, print) as any;
    const applicant = await getApplicant(instanceInfo.applicant);
    // 将含有特殊字符的 key 同步生成安全版 key，避免 amis 表达式因找不到变量而回退默认值
    const normalizedValues = {};
    const safeFieldNameMap = {};
    if (instanceInfo.approveValues) {
      Object.keys(instanceInfo.approveValues).forEach((key) => {
        if (typeof key === 'string' && /[^a-zA-Z0-9_$\u4e00-\u9fff.]/.test(key)) {
          const safeKey = key.replace(/[）)]/g, '').replace(/[^a-zA-Z0-9_$\u4e00-\u9fff.]/g, '_');
          normalizedValues[safeKey] = instanceInfo.approveValues[key];
          safeFieldNameMap[key] = safeKey;
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
        __safeFieldNameMap: safeFieldNameMap,
        context: Object.assign({}, data.context, instanceInfo, { __safeFieldNameMap: safeFieldNameMap }),
        title: instanceInfo.name,
        record: instanceInfo,
        applicant: applicant
      }
    // console.log(`AmisInstanceDetail schema`, props, schema)
    return schema;
}
