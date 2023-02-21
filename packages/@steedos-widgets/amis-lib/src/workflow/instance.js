import { fetchAPI, getSteedosAuth } from "@steedos-widgets/amis-lib";
import _, { find, isEmpty } from "lodash";
import { getOpinionFieldStepsName } from './util';
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 17:47:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-15 18:14:45
 * @Description:
 */

const getTrace = ({ instance, traceId }) => {
  return find(instance.traces, (trace) => {
    return trace._id === traceId;
  });
};

const getUserApprove = ({ instance, userId }) => {
  const currentTrace = find(instance.traces, (trace) => {
    return trace.is_finished != true;
  });
  let currentApprove = null;
  if (currentTrace) {
    currentApprove = find(currentTrace.approves, (approve) => {
      return approve.is_finished != true && approve.handler == userId;
    });
  }

  //传阅的approve返回最新一条
  if (!currentApprove || currentApprove.type == "cc") {
    // 当前是传阅
    _.each(instance.traces, function (t) {
      _.each(t.approves, function (a) {
        if (a.type == "cc" && a.handler == userId && a.is_finished == false) {
          currentApprove = a;
        }
      });
    });
  }

  if (!currentApprove) return;

  if (currentApprove._id) {
    currentApprove.id = currentApprove._id;
  }
  return currentApprove;
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

const getFlowVersion = (instance) => {
  if (instance.flow.current._id === instance.flow_version) {
    return instance.flow.current;
  } else {
    return find(instance.flow.historys, (history) => {
      return history._id === instance.flow_version;
    });
  }
};

const getFormVersion = (instance) => {
  if (instance.form.current._id === instance.form_version) {
    return instance.form.current;
  } else {
    return find(instance.form.historys, (history) => {
      return history._id === instance.form_version;
    });
  }
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

export const getInstanceInfo = async ({ instanceId, box }) => {
  const userId = getSteedosAuth().userId;
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
          name
          current,
          historys
        },
        flow_version,
        flow:flow__expand{
          _id,
          name,
          perms,
          current,
          historys
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
  const flowVersion = getFlowVersion(instance);
  const formVersion = getFormVersion(instance);

  if (userApprove) {
    trace = getTrace({ instance, traceId: userApprove.trace });
    step = getStep({ flowVersion, stepId: trace.step });
  }

  const lastCCStep = getLastCCStep(instance, userId);

  const values = getApproveValues({
    instance,
    trace,
    step,
    approve: userApprove,
    box,
  });

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
      ? amisRequire("moment")(instance.submit_date).format("YYYY-MM-DD")
      : "",
    state: instance.state,
    approveValues: values,
    title: instance.name || instance.form.name,
    name: instance.name || instance.form.name,
    fields: _.map(formVersion.fields, (field) => {
      return Object.assign({}, field, {
        permission:  userApprove?.type != 'cc' && (step?.permissions[field.code] || ( isCurrentStepOpinionField(field, step) ? 'editable' : '')),
      }) ;
    }),
    flowVersion: flowVersion,
    formVersion: formVersion,
    step: step,
    lastCCStep: lastCCStep,
    trace: trace,
    approve: userApprove,
    record_ids: instance.record_ids,
    related_instances: instance.related_instances,
    forward_from_instance: instance.forward_from_instance,
    cc_users: instance.cc_users,
    traces: instance.traces,
    historyApproves: _.map(instance.traces, (trace) => {
      return Object.assign(
        {
          children: _.map(trace.approves, (approve) => {
            let finishDate = approve.finish_date;
            let judge = approve.judge;
            let userName = approve.user_name;
            let opinion = approve.description;
            if(approve.type === 'cc'){
              userName = `${userName} (传阅)`
              opinion = approve.cc_description;
            }
            if (!finishDate) {
              finishDate = approve.is_read ? "已读" : "未处理";
              judge = null;
            } else {
              finishDate =
                amisRequire("moment")(finishDate).format("YYYY-MM-DD HH:mm");
            }

            switch (judge) {
              case "submitted":
                judge = "";
                break;
              case "returned":
                judge = "已退回";
                break;
              case "terminated":
                judge = "被取回";
                break;
              case "pending":
                judge = "审核中";
                break;
              case "approved":
                judge = "已核准";
                break;
              case "rejected":
                judge = "已驳回";
                break;
              case "finished":
                judge = "已完成";
                break;
              case "reassigned":
                judge = "转签核";
                break;
              case "inhand":
                judge = "处理中";
                break;
              case "relocated":
                judge = "重定位";
                break;
              case "readed":
                judge = "已阅";
                break;
              default:
                break;
            }
            return {
              name: "",
              user_name: userName,
              finish_date: finishDate,
              judge: judge,
              opinion: opinion,
            };
          }),
        },
        { name: trace.name, judge: "" }
      );
    }),
  };
};
