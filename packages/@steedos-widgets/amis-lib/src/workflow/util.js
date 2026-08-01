/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-08 16:26:26
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-12-16 19:42:49
 * @Description: 
 */
import _, { find, last, clone, sortBy, filter, groupBy, indexOf } from "lodash";
import i18next from "i18next";

const isWorkflowMultiLookupField = (field) => {
  const config = field?.config || field?.steedos_field || {};
  const type = config.type || field?.type;
  const multiple = config.multiple === true
    || config.multiple === 'true'
    || config.pickerMultiple === true
    || config.pickerMultiple === 'true'
    || field?.multiple === true
    || field?.multiple === 'true'
    || field?.pickerMultiple === true
    || field?.pickerMultiple === 'true'
    || field?.is_multiselect === true;
  return type === 'lookup' && multiple;
};

/**
 * 收集 Workflow 3.0 表单中多选 lookup 字段在 values 中的路径。
 * section 只负责布局，不增加数据层级；table 的子字段位于每一行记录中。
 */
export const getWorkflowMultiLookupFieldPaths = (fields) => {
  const paths = [];

  const walk = (items, parentPath = []) => {
    (items || []).forEach((field) => {
      if (!field || typeof field !== 'object') {
        return;
      }

      const config = field.config || field.steedos_field || {};
      const type = config.type || field.type;
      const code = field.code || config.name || field.name;

      if (code && isWorkflowMultiLookupField(field)) {
        paths.push(parentPath.concat(code));
      }

      if (Array.isArray(field.fields)) {
        const childParentPath = type === 'table' && code
          ? parentPath.concat(code)
          : parentPath;
        walk(field.fields, childParentPath);
      }
    });
  };

  walk(fields);
  return paths;
};

/**
 * workflow-form-v2 的多选 lookup 在不同选择数量和值格式下，可能返回
 * 逗号字符串、单个对象或数组。在调用 Workflow API 前统一恢复为数组。
 */
export const normalizeWorkflowMultiLookupValues = (values, lookupFieldPaths) => {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return values;
  }

  const normalizeValue = (value) => {
    if (Array.isArray(value)) {
      return value.reduce((result, item) => result.concat(normalizeValue(item)), []);
    }
    if (value === null || value === undefined) {
      return [];
    }
    if (typeof value === 'string') {
      if (!value.trim()) {
        return [];
      }
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [value];
  };

  const normalizeAtPath = (target, path, index = 0) => {
    if (!target || typeof target !== 'object') {
      return target;
    }
    if (Array.isArray(target)) {
      return target.map((item) => normalizeAtPath(item, path, index));
    }

    const result = Object.assign({}, target);
    const key = path[index];
    if (index === path.length - 1) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = normalizeValue(result[key]);
      }
      return result;
    }

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = normalizeAtPath(result[key], path, index + 1);
    }
    return result;
  };

  return (lookupFieldPaths || []).reduce((result, path) => {
    if (!Array.isArray(path) || path.length === 0) {
      return result;
    }
    return normalizeAtPath(result, path);
  }, Object.assign({}, values));
};

/**
 * 统一包装 workflow-form-v2 的 getValues，使插件按钮等外部调用方也能拿到数组。
 */
export const wrapWorkflowMultiLookupFormGetValues = (form, lookupFieldPaths) => {
  if (!form
    || typeof form.getValues !== 'function'
    || !Array.isArray(lookupFieldPaths)
    || lookupFieldPaths.length === 0) {
    return form;
  }

  const stateKey = '__workflowMultiLookupGetValuesNormalizer';
  const existingState = form[stateKey];
  if (existingState) {
    existingState.lookupFieldPaths = lookupFieldPaths;
    return form;
  }

  const state = {
    lookupFieldPaths,
    originalGetValues: form.getValues.bind(form),
  };
  const normalizedGetValues = () => normalizeWorkflowMultiLookupValues(
    state.originalGetValues(),
    state.lookupFieldPaths,
  );

  state.normalizedGetValues = normalizedGetValues;
  Object.defineProperty(form, 'getValues', {
    configurable: true,
    enumerable: true,
    get: () => normalizedGetValues,
    set: (nextGetValues) => {
      // workflow-form-v2 重渲染时会更新 Scoped component 的方法。
      // 保留对外的规范化入口，只替换底层原始 getValues 实现。
      if (typeof nextGetValues === 'function' && nextGetValues !== normalizedGetValues) {
        state.originalGetValues = nextGetValues.bind(form);
      }
    },
  });
  form[stateKey] = state;
  return form;
};

export const getWorkflowMultiLookupNormalizationScript = (fields) => {
  const lookupFieldPaths = getWorkflowMultiLookupFieldPaths(fields);
  if (lookupFieldPaths.length === 0) {
    return '';
  }
  return `
    formValues = BuilderAmisObject.AmisLib.normalizeWorkflowMultiLookupValues(formValues, ${JSON.stringify(lookupFieldPaths)});
    formValues = syncSafeFieldNames(formValues);
  `;
};

const isOpinionField = (field_formula)=>{
    return (field_formula?.indexOf("{traces.") > -1 || field_formula?.indexOf("{signature.traces.") > -1 || field_formula?.indexOf("{yijianlan:") > -1 || field_formula?.indexOf("{\"yijianlan\":") > -1 || field_formula?.indexOf("{'yijianlan':") > -1)
}

// 判断当前审批单是否应使用"指定审批步骤、处理人"全节点处理人选择向导。
// 条件：box in (draft, inbox) + state=draft + flow.allow_select_step
// box='draft' 覆盖正常草稿，box='inbox' 覆盖转发后的草稿任务。
export const shouldUseAllStepSelection = (instance) => {
    if (!instance || !instance.flow) {
        return false;
    }
    return (instance.box === 'draft' || instance.box === 'inbox')
        && instance.state === 'draft'
        && instance.flow.allow_select_step === true;
};

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

    const stepNames = [];
    if (step?.name) {
      stepNames.push((step.name || '').trim());
    }
    if (trace.name) {
      stepNames.push((trace.name || '').trim());
    }
    _.uniq(stepNames).forEach((stepName) => {
      if (!stepName) {
        return;
      }
      if (tracesResult.hasOwnProperty(stepName)) {
        tracesResult[stepName] = tracesResult[stepName].concat(approves);
      } else {
        tracesResult[stepName] = approves;
      }
    });
  });

  return tracesResult;
}

export const getTraceApprovesByStep = (instance, flow, stepName, only_cc_opinion, options = {}) => {
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
  let matchedStepName = stepName;
  if (!approves.length && stepName) {
    const normalizedStepName = String(stepName).trim().replace(/审批$/, '');
    const normalizedMatchedStepName = _.find(_.keys(tracesObj), (name) => {
      return String(name).trim().replace(/审批$/, '') === normalizedStepName;
    });
    if (normalizedMatchedStepName) {
      matchedStepName = normalizedMatchedStepName;
      approves = clone(tracesObj[normalizedMatchedStepName] || []);
    }
  }
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
    if (options.includeHiddenApproves) {
      return a.judge !== 'terminated' && (is_completed ? ((a.is_finished || a.finish_date) && a.finish_date) : true);
    }
    if (is_completed) {
      return a._display === true && (a.is_finished || a.finish_date) && a.finish_date;
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
  if (approve.type === "cc" && approve.sign_field_code && approve.sign_field_code !== field.name) {
    return false;
  }
  if (!approve?.is_read && !approve?.finish_date) {
    return false;
  }
  if (!(approve.is_finished || approve.finish_date)) {
    return false;
  }
  return ["approved", "rejected", "submitted", "readed"].includes(approve.judge);
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

export const isCC = ({ instance, approve, userId }) => {
  if (!instance)
    return false;

  if (approve && approve.type != "cc") {
    return false;
  }

  if (instance.cc_users && instance.cc_users.includes(userId))
    return true;

  return false;
};
