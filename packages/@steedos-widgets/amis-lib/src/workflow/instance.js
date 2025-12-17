import { fetchAPI, getSteedosAuth } from "@steedos-widgets/amis-lib";
import _, { find, isEmpty } from "lodash";
import { getUserApprove, getOpinionFieldStepsName, getTraceApprovesByStep, isOpinionOfField, isMyApprove, showApprove, showApproveDefaultDescription, showApproveSignImage } from './util';
import i18next from "i18next";

const flowVersionCache = new Map();
const formVersionCache = new Map();

const getMoment = ()=>{
  if(window.amisRequire){
    return window.amisRequire("moment");
  }else if(window.moment){
    return window.moment;
  }
}

const getTrace = ({ instance, traceId }) => {
  return find(instance.traces, (trace) => {
    return trace._id === traceId;
  });
};

const getApproveValues = ({ instance, trace, step, approve, box }) => {
  let instanceValues = null;
  if (!approve || approve.type === "cc") {
    instanceValues = instance.values;
  } else {
    if (box === "draft") {
      instanceValues = approve.values;
    } else if (box === "inbox") {
      if (
        step.step_type == "counterSign" ||
        (step.cc_has_edit_permission && !trace.is_finished)
      ) {
        //TODO
        instanceValues = instance.values;
      } else {
        if (isEmpty(approve.values)) {
          instanceValues = instance.values;
        } else {
          instanceValues = approve.values;
        }
      }
    } else if (
      box === "outbox" ||
      box === "pending" ||
      box == "completed" ||
      box == "monitor"
    ) {
      instanceValues = instance.values;
    } else {
      instanceValues = instance.values;
    }
  }
  return instanceValues;
};

const getFlowVersion = async (instance) => {
  const cacheKey = `${instance.flow._id}_${instance.flow_version}`;
  
  if (!flowVersionCache.has(cacheKey)) {
    const result = await fetchAPI(`/api/workflow/flow/${instance.flow._id}/version/${instance.flow_version}`, {
      method: "get"
    });
    flowVersionCache.set(cacheKey, result);
  }
  
  return flowVersionCache.get(cacheKey);
};

const getFormVersion = async (instance) => {
  const cacheKey = `${instance.form._id}_${instance.form_version}`;
  
  if (!formVersionCache.has(cacheKey)) {
    const result = await fetchAPI(`/api/workflow/form/${instance.form._id}/version/${instance.form_version}`, {
      method: "get"
    });
    formVersionCache.set(cacheKey, result);
  }
  
  return formVersionCache.get(cacheKey);
};

const getStep = ({ flowVersion, stepId }) => {
  return find(flowVersion.steps, (step) => {
    return step._id === stepId;
  });
};

const getLastCCStep = ({ traces }, userId) => {
  var i, step_id, trace_id, user_id;

  user_id = userId;

  trace_id = null;

  step_id = null;

  i = traces.length - 1;

  while (i >= 0) {
    if (!trace_id && traces[i].is_finished) {
      _.each(traces[i].approves, function (ap) {
        if (!trace_id) {
          if (
            ap.is_finished &&
            ap.user === user_id &&
            (!ap.type || ap.type == "cc") &&
            ["approved", "submitted", "rejected"].includes(ap.judge)
          ) {
            trace_id = ap.trace;
          }
          if (trace_id) {
            step_id = traces[i].step;
          }
        }
      });
    }
    i--;
  }

  return step_id;
};

const isCurrentStepOpinionField = (field, currentStep)=>{
  return _.includes(_.map(getOpinionFieldStepsName(field), 'stepName'), currentStep?.name);
}

const isNeedToShowSignImage = (is_finished, judge, traceShowSignImage) => {
  if (traceShowSignImage === false) {
    return false;
  }
  if (!is_finished) {
    return false;
  }
  if (['returned', 'terminated', 'retrieved'].includes(judge)) {
    return false;
  }
  return true;
}

// 缓存存储
const signCache = new Map();
const getSpaceUserSign = async (space, handler) => {
  // 生成缓存键
  const cacheKey = `${space}_${handler}`;
  
  // 检查缓存
  if (signCache.has(cacheKey)) {
    return signCache.get(cacheKey);
  }
  
  // 调用API
  const result = await fetchAPI(`/api/v1/space_user_signs?filters=[["space","=","${space}"],["user","=","${handler}"]]&fields=["sign"]`);
  
  let sign = null;
  if (result?.data?.items && result.data.items.length > 0) {
    sign = result.data.items[0].sign;
  }
  
  // 写入缓存
  signCache.set(cacheKey, sign);
  
  return sign;
}

export const getInstanceInfo = async (props) => {
  const { instanceId, box, print } = props;
  const userId = getSteedosAuth().userId;
  let flowFields = '';
  if(print){
    flowFields = ',print_template'
  }
  const query = `{
      instance: instances__findOne(id:"${instanceId}"){
        _id,
        space,
        name,
        state,
        values,
        applicant,
        cc_users,
        applicant_name,
        submitter,
        submit_date,
        record_ids,
        forward_from_instance,
        related_instances: related_instances__expand{
          _id,
          name
        },
        traces,
        form_version,
        form:form__expand{
          _id,
          name,
          style,
          mode,
          wizard_mode
        },
        flow_version,
        flow:flow__expand{
          _id,
          name,
          perms,
          allow_select_step${flowFields}
        }
      }
    }
    `;

  const result = await fetchAPI("/graphql", {
    method: "post",
    body: JSON.stringify({
      query: query,
    }),
  });
  
  const moment = getMoment();
  let userApprove = null;
  let trace = null;
  let step = null;
  const instance = result.data.instance;
  if (!instance) {
    return undefined;
  }
  if (box === "inbox" || box === "draft") {
    userApprove = getUserApprove({ instance, userId });
  }
  const flowVersion = await getFlowVersion(instance);
  const formVersion = await getFormVersion(instance);

  instance.flowVersion = flowVersion;
  instance.formVersion = formVersion;

  if (userApprove) {
    trace = getTrace({ instance, traceId: userApprove.trace });
    step = getStep({ flowVersion, stepId: trace.step });
  }

  let currentStep = getStep({ flowVersion, stepId: _.last(instance.traces).step });

  const lastCCStep = getLastCCStep(instance, userId);

  const values = getApproveValues({
    instance,
    trace,
    step,
    approve: userApprove,
    box,
  });

  const flowPermissions = await fetchAPI(`/api/workflow/v2/flow_permissions/${instance.flow._id}`, {
    method: "get",
  });

  const signImageCache = new Map();
  const approvalCommentsFields = {};
  _.each(formVersion.fields, (field) => {
    if (field.config?.type === "approval_comments") {
      approvalCommentsFields[field.code] = _.clone(field.config);
    }
    if (field.type === 'section') {
      _.each(field.fields, (subField) => {
        if (subField.config?.type === "approval_comments") {
          approvalCommentsFields[subField.code] = _.clone(subField.config);
        }
      });
    }
  });
  const myApproveFields = [];
  for (const field of _.values(approvalCommentsFields)) {
    const fieldSteps = _.clone(field.steps);
    if (fieldSteps && fieldSteps.length > 0) {
      let fieldComments = [];
      for (const fieldStep of fieldSteps) {
        const only_cc_opinion = fieldStep.show_cc && !fieldStep.show_handler;
        const stepApproves = getTraceApprovesByStep(instance, flowVersion, fieldStep.name, only_cc_opinion);
        for (const approve of stepApproves) {
          let userName = approve.handler_name;
          approve.isOpinionOfField = isOpinionOfField(approve, field);
          if (approve.isOpinionOfField) {
            approve.isMyApprove = isMyApprove({ approve, only_cc_opinion, box, currentApprove: userApprove, field });
            if (approve.isMyApprove) {
              myApproveFields.push(field);
            }
            approve.showApprove = showApprove(approve, field);
            if (approve.showApprove && !approve.description && fieldStep.default && showApproveDefaultDescription(approve)) {
              approve.description = fieldStep.default
            }
            if (approve.description){
              approve.description = approve.description.replace(/\n/g, "<br/>");
            }
            if (moment && approve.finish_date){
              approve.finishDateFormated = moment(approve.finish_date).format("YYYY-MM-DD");
            }
            let showSignImage = fieldStep.show_image_sign && showApproveSignImage(approve.judge);
            if (showSignImage){
              let userSign, userSignImage;
              if (signImageCache.has(approve.handler)) {
                userSign = signImageCache.get(approve.handler);
              } else {
                userSign = await getSpaceUserSign(instance.space, approve.handler);
                signImageCache.set(approve.handler, userSign);
              }
              if (userSign){
                userSignImage = `<img class="image-sign" alt="${userName}" src="/api/v6/files/download/cfs.avatars.filerecord/${userSign}" />`;
              }
              approve.showApproveSignImage = !!userSign;
              approve.userSignImage = userSignImage;
            }
          }
        };
        fieldComments = _.union(fieldComments, stepApproves);
      };
      field.comments = fieldComments.filter((comment) => {
        return comment.isOpinionOfField && (comment.isMyApprove || (comment.showApprove && !!comment.description));
      });
    }
  };

  if (step?.permissions) {
    // 字段字段
    _.each(approvalCommentsFields, (field) => {
      delete step.permissions[field.name];
      if (_.find(myApproveFields, { name: field.name })) {
        step.permissions[field.name] = 'editable';
      }
    });
  }
  return {
    box: box,
    _id: instanceId,
    space: instance.space,
    flow: instance.flow,
    form: instance.form,
    applicant: instance.applicant,
    applicant_name: instance.applicant_name,
    submitter: instance.submitter,
    submit_date: instance.submit_date
      ? (moment && moment(instance.submit_date).format("YYYY-MM-DD"))
      : "",
    state: instance.state,
    approveValues: values,
    title: instance.name || instance.form.name,
    name: instance.name || instance.form.name,
    fields: _.map(formVersion.fields, (field) => {
      const newField = Object.assign({}, field, {
        // permission:  userApprove?.type != 'cc' && (step?.permissions[field.code] || ( isCurrentStepOpinionField(field, step) ? 'editable' : '')),
        permission:  userApprove?.type != 'cc' && step?.permissions[field.code],
      }) ;
      if(field.type === 'section'){
        newField.fields = _.map(field.fields, (sfield) => {
          return Object.assign({}, sfield, {
            // permission:  userApprove?.type != 'cc' && (step?.permissions[sfield.code] || ( isCurrentStepOpinionField(sfield, step) ? 'editable' : '')),
            permission:  userApprove?.type != 'cc' && step?.permissions[sfield.code],
            type: sfield._type || sfield.type
          });
        })
      }
      return newField;
    }),
    flowVersion: flowVersion,
    formVersion: formVersion,
    step: step,
    lastCCStep: lastCCStep,
    trace: trace,
    currentStep,
    flowPermissions: flowPermissions?.permissions || [],
    approve: userApprove,
    record_ids: instance.record_ids,
    related_instances: instance.related_instances,
    forward_from_instance: instance.forward_from_instance,
    cc_users: instance.cc_users,
    traces: instance.traces,
    historyApproves: await Promise.all(_.map(instance.traces, async (trace) => {
      const tStep = _.find(flowVersion.steps, (item)=>{
        return item._id === trace.step
      })
      return Object.assign(
        {
          children: await Promise.all(_.map(trace.approves, async (approve) => {
            let finishDate = approve.finish_date;
            let judge = approve.judge;
            let judgeValue = approve.judge;
            let userName = approve.user_name;
            let opinion = approve.description;
            let type = approve.type;
            const traceShowSignImage = true;
            let showSignImage = isNeedToShowSignImage(approve.is_finished, approve.judge, traceShowSignImage);
            let userSign;
            if (showSignImage) {
              if (signImageCache.has(approve.handler)) {
                userSign = signImageCache.get(approve.handler);
              } else {
                userSign = await getSpaceUserSign(instance.space, approve.handler);
                signImageCache.set(approve.handler, userSign);
              }
              if (userSign){
                userName = `<img class="image-sign" alt="${userName}" src="/api/v6/files/download/cfs.avatars.filerecord/${userSign}" />`;
              }
            }
            if(approve.type === 'cc'){
              userName = `${userName} (传阅)`
              opinion = approve.cc_description;
            }
            if (!finishDate) {
              finishDate = approve.is_read ? i18next.t('frontend_workflow_approval_history_read') : i18next.t('frontend_workflow_approval_history_unprocessed');
              judge = null;
            } else {
              finishDate = moment && moment(finishDate).format("YYYY-MM-DD HH:mm");
            }

            switch (judge) {
              case "submitted":
                judge = "";
                break;
              case "returned":
                judge = i18next.t('frontend_workflow_approval_judge_returned');//"已退回"
                break;
              case "terminated":
                judge = i18next.t('frontend_workflow_approval_judge_terminated');//"被取回";
                break;
              case "pending":
                judge = i18next.t('frontend_workflow_approval_judge_pending');//"审核中";
                break;
              case "approved":
                judge = i18next.t('frontend_workflow_approval_judge_approved');//"已核准";
                break;
              case "rejected":
                judge = i18next.t('frontend_workflow_approval_judge_rejected');//"已驳回";
                break;
              case "finished":
                judge = i18next.t('frontend_workflow_approval_judge_finished');//"已完成";
                break;
              case "reassigned":
                judge = i18next.t('frontend_workflow_approval_judge_reassigned');//"转签核";
                break;
              case "inhand":
                judge = i18next.t('frontend_workflow_approval_judge_inhand');//"处理中";
                break;
              case "relocated":
                judge = i18next.t('frontend_workflow_approval_judge_relocated');//"重定位";
                break;
              case "readed":
                judge = i18next.t('frontend_workflow_approval_judge_readed');//"已阅";
                break;
              default:
                break;
            }
            return {
              name: "",
              user_name: userName,
              finish_date: finishDate,
              judge: judge,
              judgeValue: judgeValue,
              opinion: opinion,
              type: 'approve',
              approve_type: type || '',
              step_type: tStep.step_type, 
              step_id: tStep._id
            };
          })),
        },
        { name: trace.name, type: 'trace', judge: "", judgeValue: trace.judge, step_type: tStep.step_type, step_id: tStep._id}
      );
    })),
    approvalCommentsFields
  };
};



export const getApplicant = async (userId) => {
  const result = await fetchAPI(`/api/formula/user/${userId}`, {
    method: "get"
  });
  return result;
}