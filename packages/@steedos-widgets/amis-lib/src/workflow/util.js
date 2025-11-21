/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-08 16:26:26
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-11-11 21:23:23
 * @Description: 
 */
import _, { find, last, clone, sortBy, filter, groupBy, indexOf } from "lodash";
import { i18next } from "@steedos-widgets/amis-lib";

const isOpinionField = (field_formula)=>{
    return (field_formula?.indexOf("{traces.") > -1 || field_formula?.indexOf("{signature.traces.") > -1 || field_formula?.indexOf("{yijianlan:") > -1 || field_formula?.indexOf("{\"yijianlan\":") > -1 || field_formula?.indexOf("{'yijianlan':") > -1)
}

export const getOpinionFieldStepsName = (field, top_keywords) => {
    const field_formula = field.formula;
    var foo1, opinionFields;
    opinionFields = new Array();
    if (isOpinionField(field_formula)) {
      if (field_formula) {
        foo1 = field_formula.split(";");
        foo1.forEach(function(foo) {
          var json_formula, s1, sf, _ref, _ref1;
          json_formula = {};
          try {
            json_formula = eval("(" + foo + ")");
          } catch (_error) {
            json_formula = {};
          }
          if (json_formula != null ? json_formula.yijianlan : void 0) {
            sf = {};
            sf.stepName = json_formula.yijianlan.step;
            sf.image_sign = json_formula.yijianlan.image_sign || false;
            sf.only_cc_opinion = json_formula.yijianlan.only_cc || false;
            sf.default_description = json_formula.yijianlan["default"];
            sf.only_handler = json_formula.yijianlan.only_handler;
            sf.top_keywords = json_formula.yijianlan.top_keywords || top_keywords;
            return opinionFields.push(sf);
          } else if ((field_formula != null ? field_formula.indexOf("{traces.") : void 0) > -1 || (field_formula != null ? field_formula.indexOf("{signature.traces.") : void 0) > -1) {
            sf = {
              only_cc_opinion: false,
              image_sign: false,
              top_keywords: top_keywords
            };
            if (foo.indexOf("{signature.") > -1) {
              sf.image_sign = true;
              foo = foo.replace("{signature.", "");
            }
            s1 = foo.replace("{", "").replace("}", "");
            if (s1.split(".").length > 1) {
              sf.stepName = s1.split(".")[1];
              if (opinionFields.filterProperty("stepName", sf.stepName).length > 0) {
                if ((_ref = opinionFields.findPropertyByPK("stepName", sf.stepName)) != null) {
                  _ref.only_cc_opinion = true;
                }
              } else {
                if (s1.split(".").length > 2) {
                  if (((_ref1 = s1.split(".")[2]) != null ? _ref1.toLocaleLowerCase() : void 0) === 'cc') {
                    sf.only_cc_opinion = true;
                  }
                }
              }
            }
            return opinionFields.push(sf);
          }
        });
      }
    }
    return opinionFields;
}

const getTraceApprovesGroupBySteps = (instance, flow) => {
  if (!instance || !flow) {
    return {};
  }

  const steps = flow.steps;
  const tracesResult = {};

  (instance.traces || []).forEach(trace => {
    const step = find(steps, s => s._id === trace.step);
    const approves = [];

    (trace.approves || []).forEach(approve => {
      let judge_name = '';
      if (trace.is_finished === true) {
        if (approve.judge === 'approved') {
          judge_name = i18next.t("Instance State approved");
        } else if (approve.judge === 'rejected') {
          judge_name = i18next.t("Instance State rejected");
        } else if (approve.judge === 'terminated') {
          judge_name = i18next.t("Instance State terminated");
        } else if (approve.judge === 'reassigned') {
          judge_name = i18next.t("Instance State reassigned");
        } else if (approve.judge === 'relocated') {
          judge_name = i18next.t("Instance State relocated");
        } else if (!approve.judge) {
          judge_name = "";
        } else {
          judge_name = "";
        }
      } else {
        judge_name = i18next.t("Instance State pending");
      }

      approves.push({
        _id: approve._id,
        handler: approve.user,
        handler_name: approve.handler_name,
        handler_organization_name: approve.handler_organization_name,
        handler_organization_fullname: approve.handler_organization_fullname,
        finish_date: approve.finish_date,
        judge: approve.judge,
        judge_name: judge_name,
        description: approve.description,
        is_finished: approve.is_finished,
        type: approve.type,
        opinion_fields_code: approve.opinion_fields_code,
        sign_field_code: approve.sign_field_code,
        is_read: approve.is_read,
        sign_show: approve.sign_show
      });
    });

    if (step) {
      if (tracesResult.hasOwnProperty(step.name)) {
        tracesResult[step.name] = tracesResult[step.name].concat(approves);
      } else {
        tracesResult[step.name] = approves;
      }
    }
  });

  return tracesResult;
}

export const getTraceApprovesByStep = (instance, flow, stepName, only_cc_opinion) => {
  if (!instance) return [];

  const is_completed = instance?.state === "completed";
  let completed_date = 0;
  if (is_completed) {
    let lastTrace = last(instance.traces);
    completed_date = lastTrace && lastTrace.finish_date ? (new Date(lastTrace.finish_date)).getTime() : 0;
  }
  if (is_completed && instance.finish_date) {
    completed_date = (new Date(instance.finish_date)).getTime();
  }

  const tracesObj = getTraceApprovesGroupBySteps(instance, flow);

  let approves = clone(tracesObj[stepName] || []);

  const approve_sort = approvesParam => {
    return sortBy(approvesParam, approve => {
      let date = approve.finish_date ? new Date(approve.finish_date) : new Date();
      return -date.getTime();
    }) || [];
  };

  approves = filter(approves, a => a.type !== "forward" && a.type !== "distribute" && a.type !== "terminated");

  if (only_cc_opinion) {
    approves = filter(approves, a => a.type === "cc");
  }

  let approves_sorted = approve_sort(approves);

  const approvesGroup = groupBy(approves, "handler");

  function hasNext(approve, group) {
    const handlerApproves = group[approve.handler];
    return indexOf(handlerApproves, approve) + 1 < handlerApproves.length;
  }

  function haveDescriptionApprove(approve, group) {
    const handlerApproves = group[approve.handler];
    const descriptionApproves = filter(handlerApproves, a => !!a.description);
    return descriptionApproves.length > 0;
  }

  approves_sorted.forEach(approve => {
    // showBlank为false时，签字字段上配置的默认意见不会生效
    const showBlank = true;//Meteor.settings.public.workflow?.showBlankApproveDescription;
    if (
      approve.sign_show !== false
      && (approve.description
        || (!approve.description && !hasNext(approve, approvesGroup) && !approve.is_finished)
        || showBlank
      )
      && approve.judge !== 'terminated'
    ) {
      approve._display = true;
    }
  });

  approves_sorted = filter(approves_sorted, a => {
    if (is_completed) {
      return a._display === true && a.is_finished && a.finish_date && (new Date(a.finish_date)).getTime() <= completed_date;
    } else {
      return a._display === true;
    }
  });

  return approves_sorted;
}

export const isOpinionOfField = (approve, field) => {
  if (approve.type === "cc" && field.name) {
    return field.name === approve.sign_field_code;
  } else {
    return true;
  }
};

export const isMyApprove = ({ approve, only_cc_opinion, box, currentApprove, field }) => {
  if (box !== 'inbox') {
    return false;
  }

  if (!approve?._id) {
    approve = currentApprove;
  }

  if (
    approve._id === currentApprove?._id &&
    currentApprove?.type === 'cc' &&
    field.name
  ) {
    return _.indexOf(currentApprove?.opinion_fields_code, field.name) > -1;
  }

  if (!(currentApprove?.type === 'cc') && only_cc_opinion) {
    return false;
  }

  if (currentApprove && approve._id === currentApprove._id) {
    return true;
  }

  return false;
};

export const showApprove = (approve, field) => {
  if (!approve.sign_field_code || approve.sign_field_code === field.name) {
    if (approve?.is_read) {
      if (approve.is_finished) {
        return ["approved", "rejected", "submitted", "readed"].includes(approve.judge);
      }
    }
  }
  return false;
};

export const isReaded = (judge) => {
  return ["approved", "rejected", "submitted", "readed"].includes(judge);
};

export const showApproveDefaultDescription = (approve) => {
  if (approve.is_finished && isReaded(approve.judge)) {
    return true;
  }
  return false;
};

export const showApproveSignImage = (judge) => {
  return !['returned', 'terminated', 'retrieved'].includes(judge);
};

export const getUserApprove = ({ instance, userId }) => {
  console.log(`getUserApprove===>`, instance, userId)
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