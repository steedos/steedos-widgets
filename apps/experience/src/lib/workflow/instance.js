import { fetchAPI, getSteedosAuth } from "@steedos-widgets/amis-lib";
import _, { find, isEmpty } from "lodash";
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 17:47:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-24 10:26:50
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

const getFormVersion = (instance)=>{
  if (instance.form.current._id === instance.form_version) {
    return instance.form.current;
  } else {
    return find(instance.form.historys, (history) => {
      return history._id === instance.form_version;
    });
  }
}

const getStep = ({ flowVersion, stepId }) => {
  return find(flowVersion.steps, (step) => {
    return step._id === stepId;
  });
};

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
        applicant_name,
        submitter,
        submit_date,
        record_ids,
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
  let userApprove = null
  let trace = null;
  let step = null;
  const instance = result.data.instance;
  if(!instance){
    return undefined;
  }
  if(box === 'inbox' || box === 'draft'){
    userApprove = getUserApprove({ instance, userId });
  }
  const flowVersion = getFlowVersion(instance);
  const formVersion = getFormVersion(instance);
  
  if(userApprove){
    trace = getTrace({ instance, traceId: userApprove.trace });
    step = getStep({ flowVersion, stepId: trace.step });
  }
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
    submit_date: instance.submit_date ? amisRequire("moment")(instance.submit_date).format("YYYY-MM-DD") : '',
    state: instance.state,
    approveValues: values,
    title: instance.name || instance.form.name,
    name: instance.name || instance.form.name,
    fields: _.map(formVersion.fields, (field)=>{
      return Object.assign({}, field, {permission: step?.permissions[field.code]})
    }),
    flowVersion: flowVersion,
    formVersion: formVersion,
    step: step,
    trace: trace,
    approve: userApprove,
    record_ids: instance.record_ids,
    related_instances: instance.related_instances,
  };
};
