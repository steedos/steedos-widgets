/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-08 16:26:26
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-08 16:28:42
 * @Description: 
 */

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
