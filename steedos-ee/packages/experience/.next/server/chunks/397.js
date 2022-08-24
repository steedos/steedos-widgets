"use strict";
exports.id = 397;
exports.ids = [397];
exports.modules = {

/***/ 6820:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "h": () => (/* binding */ functions_SteedosUI)
});

// EXTERNAL MODULE: external "antd"
var external_antd_ = __webpack_require__(5725);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "react-dom/client"
var client_ = __webpack_require__(7849);
// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(6517);
var external_lodash_default = /*#__PURE__*/__webpack_require__.n(external_lodash_);
;// CONCATENATED MODULE: ./src/components/functions/modal.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:36:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-15 10:37:37
 * @Description: 
 */ 



const newFunctionComponent = (Component)=>{
    return (props)=>{
        // const ref = useRef(null);
        const { 0: isVisible , 1: setIsVisible  } = (0,external_react_.useState)(true);
        const defProps = {
            width: "70%",
            style: {
                width: "70%",
                maxWidth: "950px",
                minWidth: "480px"
            }
        };
        const show = ()=>{
            setIsVisible(true);
        };
        const close = ()=>{
            setIsVisible(false);
        };
        if (!(0,external_lodash_.has)(props, "ref")) {
            window.SteedosUI.refs[props.name] = {
                show: show,
                close: close
            };
        }
        return /*#__PURE__*/ jsx_runtime_.jsx(Component, {
            visible: isVisible,
            onCancel: close,
            onClose: close,
            ...defProps,
            ...props
        }) //ref={ref}
        ;
    };
};
const newComponentRender = (prefix, Component)=>{
    return (props, container)=>{
        if (!props.name) {
            props.name = `${prefix}-${props.name || "default"}`;
        }
        if (!container) {
            container = document.getElementById(`steedos-${prefix}-root-${props.name}`);
            if (!container) {
                container = document.createElement("div");
                container.setAttribute("id", `steedos-${prefix}-root-${props.name}`);
                document.body.appendChild(container);
            }
        }
        const element = /*#__PURE__*/ external_react_default().createElement(newFunctionComponent(Component), props);
        const root = (0,client_.createRoot)(container);
        root.render(element);
    };
};
const Modal = (0,external_lodash_.assign)(newComponentRender("modal", external_antd_.Modal), {
    info: external_antd_.Modal.info,
    success: external_antd_.Modal.success,
    error: external_antd_.Modal.error,
    warning: external_antd_.Modal.warning,
    confirm: external_antd_.Modal.confirm
});
const Drawer = newComponentRender("drawer", external_antd_.Drawer);

// EXTERNAL MODULE: ./src/components/AmisRender.jsx
var AmisRender = __webpack_require__(1095);
// EXTERNAL MODULE: ./src/lib/objects.js + 4 modules
var objects = __webpack_require__(6195);
;// CONCATENATED MODULE: ./src/components/object/Form.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 16:50:40
 * @Description: 
 */ 


function Form({ appId , objectName , recordId , className , data , formFactor  }) {
    const { 0: schema , 1: setSchema  } = (0,external_react_.useState)(null);
    (0,external_react_.useEffect)(()=>{
        if (formFactor && objectName && recordId) {
            (0,objects/* getFormSchema */.KR)(objectName, {
                recordId: recordId,
                tabId: objectName,
                appId: appId,
                formFactor: formFactor
            }).then((data)=>{
                setSchema(data);
            });
        }
    }, [
        formFactor
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: schema && /*#__PURE__*/ jsx_runtime_.jsx(AmisRender/* AmisRender */.k, {
            id: SteedosUI.getRefId({
                type: "form",
                appId: appId,
                name: objectName
            }),
            schema: schema.amisSchema,
            data: data,
            className: className
        })
    });
}

// EXTERNAL MODULE: ./src/lib/steedos.client.js
var steedos_client = __webpack_require__(8282);
;// CONCATENATED MODULE: ./src/components/functions/sObject.jsx





const editRecordHandle = (props)=>{
    const { appId , name , title , objectName , recordId , type , options , router , refId , data , onSubmitted , onCancel , formFactor  } = props;
    if (type === "modal") {
        SteedosUI.Modal(Object.assign({
            name: name,
            title: title,
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false,
            // footer: null,
            cancelText: "\u53D6\u6D88",
            okText: "\u786E\u5B9A",
            onOk: (e)=>{
                const scope = SteedosUI.getRef(SteedosUI.getRefId({
                    type: `form`,
                    appId: appId,
                    name: objectName
                }));
                const form = scope.getComponentByName(`page_edit_${recordId}.form_edit_${recordId}`);
                form.handleAction({}, {
                    type: "submit"
                }).then((data)=>{
                    if (data) {
                        SteedosUI.getRef(name).close();
                        if ((0,external_lodash_.isFunction)(onSubmitted)) {
                            onSubmitted(e, data);
                        }
                    }
                });
            },
            onCancel: (e)=>{
                SteedosUI.getRef(name).close();
                if ((0,external_lodash_.isFunction)(onCancel)) {
                    onCancel(e);
                }
            },
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(Form, {
                appId: appId,
                objectName: objectName,
                recordId: recordId,
                data: data,
                formFactor: formFactor
            })
        }, options?.props));
    } else if (type === "drawer") {
        SteedosUI.Drawer(Object.assign({
            name: name,
            title: title,
            destroyOnClose: true,
            maskClosable: false,
            footer: null,
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(Form, {
                appId: appId,
                objectName: objectName,
                recordId: recordId,
                data: data,
                formFactor: formFactor
            }),
            mask: false,
            size: "large",
            style: null,
            extra: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_antd_.Space, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_.Button, {
                        onClick: (e)=>{
                            SteedosUI.getRef(name).close();
                            if ((0,external_lodash_.isFunction)(onCancel)) {
                                onCancel(e);
                            }
                        },
                        children: "\u53D6\u6D88"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_.Button, {
                        type: "primary",
                        onClick: (e)=>{
                            const scope = SteedosUI.getRef(SteedosUI.getRefId({
                                type: `form`,
                                appId: appId,
                                name: objectName
                            }));
                            const form = scope.getComponentByName(`page_edit_${recordId}.form_edit_${recordId}`);
                            form.handleAction({}, {
                                type: "submit"
                            }).then((data)=>{
                                if (data) {
                                    SteedosUI.getRef(name).close();
                                    if ((0,external_lodash_.isFunction)(onSubmitted)) {
                                        onSubmitted(e, data);
                                    }
                                }
                            });
                        },
                        children: "\u786E\u8BA4"
                    })
                ]
            })
        }, options?.props));
    } else {
        router.push(`/app/${appId}/${objectName}/view/new`);
    }
};
const getGraphqlFieldsQuery = (fields)=>{
    const fieldsName = [
        "_id"
    ];
    fields.push("record_permissions");
    //TODO 此处需要考虑相关对象查询
    (0,external_lodash_.each)(fields, (fieldName)=>{
        if (fieldName.indexOf(".") > -1) {
            fieldName = fieldName.split(".")[0];
        }
        fieldsName.push(`${fieldName}`);
    });
    return `${fieldsName.join(" ")}`;
};
const getFindOneQuery = (objectName, id, fields)=>{
    objectName = objectName.replace(/\./g, "_");
    const queryFields = getGraphqlFieldsQuery(fields);
    let queryOptions = "";
    let alias = "record";
    const queryOptionsArray = [
        `id: "${id}"`
    ];
    if (queryOptionsArray.length > 0) {
        queryOptions = `(${queryOptionsArray.join(",")})`;
    }
    return `{${alias}:${objectName}__findOne${queryOptions}{${queryFields}}}`;
};
const SObject = {
    //TODO 清理router参数传递
    newRecord: (props)=>{
        return editRecordHandle(props);
    },
    editRecord: (props)=>{
        return editRecordHandle(props);
    },
    getRecord: async (objectName, recordId, fields)=>{
        const result = await (0,steedos_client/* fetchAPI */.Io)("/graphql", {
            method: "post",
            body: JSON.stringify({
                query: getFindOneQuery(objectName, recordId, fields)
            })
        });
        return result.data.record;
    }
};

;// CONCATENATED MODULE: ./src/components/functions/amis.jsx
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-02 11:19:09
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-05 11:15:42
 * @Description:
 */ // # 日期类型: date, datetime  支持操作符: "=", "<>", "<", ">", "<=", ">="
// # 文本类型: text, textarea, html  支持操作符: "=", "<>", "contains", "notcontains", "startswith"
// # 选择类型: lookup, master_detail, select 支持操作符: "=", "<>"
// # 数值类型: currency, number  支持操作符: "=", "<>", "<", ">", "<=", ">="
// # 布尔类型: boolean  支持操作符: "=", "<>"
// # 数组类型: checkbox, [text]  支持操作符: "=", "<>"

const DATE_DATETIME_BETWEEN_VALUES = [
    "last_year",
    "this_year",
    "next_year",
    "last_quarter",
    "this_quarter",
    "next_quarter",
    "last_month",
    "this_month",
    "next_month",
    "last_week",
    "this_week",
    "next_week",
    "yestday",
    "today",
    "tomorrow",
    "last_7_days",
    "last_30_days",
    "last_60_days",
    "last_90_days",
    "last_120_days",
    "next_7_days",
    "next_30_days",
    "next_60_days",
    "next_90_days",
    "next_120_days", 
];
/**
 *
 */ const opMaps = {
    equal: "=",
    not_equal: "!=",
    less: "<",
    less_or_equal: "<=",
    greater: ">",
    greater_or_equal: ">=",
    between: "between",
    not_between: "not_between",
    is_empty: "is_empty",
    is_not_empty: "is_not_empty",
    select_equals: "=",
    select_not_equals: "!=",
    select_any_in: "in",
    select_not_any_in: "<>",
    like: "contains",
    not_like: "notcontains",
    starts_with: "startswith",
    ends_with: "endswith"
};
const isGroup = (item)=>{
    return _.has(item, "conjunction");
};
const conditionGroupToFilters = (group)=>{
    const filters = [];
    const { conjunction , children  } = group;
    if (conjunction && children) {
        children.forEach((item)=>{
            if (filters.length > 0) {
                filters.push(conjunction);
            }
            if (isGroup(item)) {
                const filter = conditionGroupToFilters(item);
                if (filter && filter.length > 0) {
                    filters.push(filter);
                }
            } else {
                const filter1 = conditionItemToFilters(item);
                if (filter1) {
                    filters.push(filter1);
                }
            }
        });
    }
    return filters;
};
const conditionItemToFilters = (item)=>{
    const { left , op , right  } = item;
    if (left && left.type === "field") {
        if (op) {
            if (op.startsWith("between:")) {
                const array = op.split(":");
                return [
                    left.field,
                    array[0],
                    array[1]
                ];
            } else {
                if (right != null) {
                    return [
                        left.field,
                        opMaps[op],
                        right
                    ];
                }
            }
        }
    }
};
// const conditionChildrenToFilters = (children)=>{
// }
const filterToConditionItem = (filter)=>{
    if (filter.length === 3) {
        const op = external_lodash_default().findKey(opMaps, (value)=>{
            return value === filter[1];
        });
        if (op === "between" && external_lodash_default().includes(DATE_DATETIME_BETWEEN_VALUES, filter[2])) {
            return {
                left: {
                    type: "field",
                    field: filter[0]
                },
                op: `${op}:${filter[2]}`
            };
        } else {
            return {
                left: {
                    type: "field",
                    field: filter[0]
                },
                op: op,
                right: filter[2]
            };
        }
    } else {
        console.warn(`无效的filter:${JSON.stringify(filter)}`);
    }
};
const filterObjectToArray = (filter)=>{
    if (!external_lodash_default().isArray(filter) && external_lodash_default().isObject(filter)) {
        return [
            filter.field,
            filter.operation,
            filter.value
        ];
    }
    return filter;
};
const filtersToConditionGroup = (filters)=>{
    filters = filterObjectToArray(filters);
    const conditions = {
        conjunction: "and",
        children: []
    };
    if (!filters || filters.length == 0) {
        return conditions;
    }
    filters.forEach((filter)=>{
        filter = filterObjectToArray(filter);
        if (filter === "or" || filter === "and") {
            conditions.conjunction = filter;
        } else {
            if (filter.length === 3 && filter.indexOf("and") == -1 && filter.indexOf("or") == -1) {
                conditions.children.push(filterToConditionItem(filter));
            } else {
                conditions.children.push(filtersToConditionGroup(filter));
            }
        }
    });
    return conditions;
};
const conditionsToFilters = (conditions)=>{
    return conditionGroupToFilters(conditions);
};
const filtersToConditions = (filters)=>{
    return filtersToConditionGroup(filters);
};

;// CONCATENATED MODULE: ./src/components/functions/listView.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 17:10:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-05 15:56:49
 * @Description: 
 */ 





const filtersAmisSchema = __webpack_require__(575);
const canSaveFilter = (listView)=>{
    if (listView._id && listView.owner === (0,steedos_client/* getSteedosAuth */.Z0)()?.userId) {
        return true;
    } else {
        return false;
    }
};
const saveFilters = async (listView, filters)=>{
    const api = "/api/listview/filters";
    await (0,steedos_client/* fetchAPI */.Io)(api, {
        method: "post",
        body: JSON.stringify({
            id: listView._id,
            filters: filters
        })
    });
    await (0,objects/* getUISchema */.NW)(listView.object_name, true);
};
const ListView = {
    showFilter: (objectName, { listView , data , props , onFilterChange  })=>{
        const pageName = `${objectName}-list-filter`;
        const amisScopeId = `amis-${pageName}`;
        const canSave = canSaveFilter(listView);
        if (data.filters) {
            data.filters = filtersToConditions(data.filters);
        }
        SteedosUI.Drawer(Object.assign({
            name: pageName,
            title: "\u8FC7\u6EE4\u5668",
            destroyOnClose: true,
            maskClosable: false,
            footer: null,
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(AmisRender/* AmisRender */.k, {
                id: amisScopeId,
                schema: filtersAmisSchema,
                data: {
                    data: Object.assign({}, data, {
                        objectName: objectName
                    })
                }
            }),
            mask: false,
            width: 550,
            style: null,
            extra: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_antd_.Space, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_.Button, {
                        onClick: (e)=>{
                            SteedosUI.getRef(pageName).close();
                        },
                        children: "\u53D6\u6D88"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_.Button, {
                        type: "primary",
                        onClick: async (e)=>{
                            const formValues = SteedosUI.getRef(amisScopeId).getComponentById("filtersForm").getValues();
                            const filters = conditionsToFilters(formValues.filters);
                            if (canSave) {
                                saveFilters(listView, filters);
                            }
                            if ((0,external_lodash_.isFunction)(onFilterChange)) {
                                onFilterChange(filters);
                            }
                            SteedosUI.getRef(pageName).close();
                        },
                        children: canSave ? "\u4FDD\u5B58" : "\u5E94\u7528"
                    })
                ]
            })
        }, props));
    },
    getVisibleFilter: (listView, userFilter)=>{
        if (userFilter) {
            return userFilter;
        }
        ;
        const canSave = canSaveFilter(listView);
        if (canSave) {
            return listView.filters;
        }
    },
    getQueryFilter: (listView, userFilter)=>{
        const canSave = canSaveFilter(listView);
        if (canSave) {
            return getVisibleFilter(listView, userFilter);
        } else {
            if ((0,external_lodash_.isEmpty)(userFilter)) {
                return listView.filters;
            } else {
                return [
                    listView.filters,
                    "and",
                    userFilter
                ];
            }
        }
    }
};

;// CONCATENATED MODULE: ./src/components/functions/field.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-06 13:33:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-08 15:21:25
 * @Description: 
 */ 

const schema = __webpack_require__(4056);
const Field = {
    showFieldsTransfer: (objectName, data, onOk, onCancel)=>{
        const name = `${objectName}-fields-transfer`;
        const amisScopeId = `amis-${name}`;
        SteedosUI.Modal(Object.assign({
            name: name,
            title: "\u9009\u62E9\u5B57\u6BB5",
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false,
            // footer: null,
            cancelText: "\u53D6\u6D88",
            okText: "\u786E\u5B9A",
            onOk: async (e)=>{
                const formValues = SteedosUI.getRef(amisScopeId).getComponentByName("page.form").getValues();
                SteedosUI.getRef(name).close();
                return await onOk(formValues);
            },
            onCancel: (e)=>{
                SteedosUI.getRef(name).close();
                if ((0,external_lodash_.isFunction)(onCancel)) {
                    onCancel(e);
                }
            },
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(AmisRender/* AmisRender */.k, {
                id: amisScopeId,
                schema: schema,
                data: {
                    data: Object.assign({}, data, {
                        objectName: objectName
                    })
                }
            })
        }, {}));
    }
};

;// CONCATENATED MODULE: ./src/components/functions/router.jsx
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 17:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 17:29:37
 * @Description:
 */ const Router = {
    getAppPath ({ formFactor , appId  }) {
        return `/${formFactor === "SMALL" ? "mapp" : "app"}/${appId}`;
    },
    getPagePath () {
    //TODO
    },
    getObjectListViewPath ({ formFactor , appId , objectName , listViewName  }) {
        return `/${formFactor === "SMALL" ? "mapp" : "app"}/${appId}/${objectName}/grid/${listViewName}`;
    },
    getObjectDetailPath ({ formFactor , appId , objectName , recordId  }) {
        return `/${formFactor === "SMALL" ? "mapp" : "app"}/${appId}/${objectName}/view/${recordId}`;
    },
    getObjectRelatedViewPath ({ formFactor , appId , masterObjectName , masterRecordId , objectName , foreignKey  }) {
        return `/${formFactor === "SMALL" ? "mapp" : "app"}/${appId}/${masterObjectName}/${masterRecordId}/${objectName}/grid?related_field_name=${foreignKey}`;
    }
};

;// CONCATENATED MODULE: ./src/components/functions/index.jsx
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 15:54:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 17:26:23
 * @Description: 
 */ 





const functions_SteedosUI = Object.assign({}, {
    Router: Router,
    Field: Field,
    ListView: ListView,
    Object: SObject,
    Modal: Modal,
    Drawer: Drawer,
    refs: {},
    getRef (name) {
        return functions_SteedosUI.refs[name];
    },
    router: ()=>{
    // TODO
    },
    message: external_antd_.message,
    notification: external_antd_.notification,
    components: {
        Button: external_antd_.Button,
        Space: external_antd_.Space
    },
    getRefId: ({ type , appId , name  })=>{
        switch(type){
            case "listview":
                return `amis-${appId}-${name}-listview`;
            case "form":
                return `amis-${appId}-${name}-form`;
            case "detail":
                return `amis-${appId}-${name}-detail`;
            default:
                return `amis-${appId}-${name}-${type}`;
        }
    }
});
if (false) {}


/***/ }),

/***/ 7733:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    listView: {
        newRecordMode: "drawer",
        editRecordMode: "drawer",
        perPage: 20
    }
});


/***/ }),

/***/ 7804:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "OMIT_FIELDS": () => (/* binding */ OMIT_FIELDS),
  "convertSFieldToAmisField": () => (/* binding */ convertSFieldToAmisField),
  "getAmisFieldType": () => (/* binding */ getAmisFieldType),
  "getAmisStaticFieldType": () => (/* binding */ getAmisStaticFieldType),
  "getBaseFields": () => (/* binding */ getBaseFields),
  "getFieldSearchable": () => (/* binding */ getFieldSearchable),
  "getGridFieldSubFields": () => (/* binding */ getGridFieldSubFields),
  "getObjectFieldSubFields": () => (/* binding */ getObjectFieldSubFields),
  "getPermissionFields": () => (/* binding */ getPermissionFields),
  "getSelectFieldOptions": () => (/* binding */ getSelectFieldOptions)
});

// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(6517);
// EXTERNAL MODULE: ./src/lib/objects.js + 4 modules
var objects = __webpack_require__(6195);
;// CONCATENATED MODULE: ./src/lib/converter/amis/fields/lookup.js

const _ = __webpack_require__(6517);
const graphql = __webpack_require__(1306);
const Tpl = __webpack_require__(6898);
const Field = __webpack_require__(7804);
const Table = __webpack_require__(2696);
const List = __webpack_require__(5158);
const getReferenceTo = async (field)=>{
    let referenceTo = field.reference_to;
    if (!referenceTo) {
        return;
    }
    if (referenceTo === "users") {
        referenceTo = "space_users";
        field.reference_to_field = "user";
    }
    const refObjectConfig = await (0,objects/* getUISchema */.NW)(referenceTo);
    let valueField = null;
    let valueFieldName = field.reference_to_field;
    if (!valueFieldName) {
        valueFieldName = refObjectConfig.idFieldName || "_id";
    }
    if (valueFieldName === "_id") {
        valueField = {
            name: "_id",
            label: "ID",
            type: "text",
            toggled: false
        };
    } else {
        valueField = refObjectConfig.fields[valueFieldName] || {
            name: valueFieldName
        };
    }
    return {
        objectName: referenceTo,
        valueField: valueField,
        labelField: refObjectConfig.fields[refObjectConfig.NAME_FIELD_KEY || "name"]
    };
};
async function lookupToAmisPicker(field, readonly, ctx) {
    let referenceTo = await getReferenceTo(field);
    if (!referenceTo) {
        return;
    }
    const refObjectConfig = await (0,objects/* getUISchema */.NW)(referenceTo.objectName);
    const tableFields = [];
    let i = 0;
    const searchableFields = [];
    const fieldsArr = [];
    _.each(refObjectConfig.fields, (field, field_name)=>{
        if (field_name != "_id" && !field.hidden) {
            if (!_.has(field, "name")) {
                field.name = field_name;
            }
            fieldsArr.push(field);
        }
    });
    _.each(_.sortBy(fieldsArr, "sort_no"), function(field) {
        if (i < 5) {
            if (!_.find(tableFields, function(f) {
                return f.name === field.name;
            })) {
                i++;
                tableFields.push(field);
                if (field.searchable) {
                    searchableFields.push(field.name);
                }
            }
        }
    });
    const fields = {
        [referenceTo.labelField.name]: referenceTo.labelField,
        [referenceTo.valueField.name]: referenceTo.valueField
    };
    _.each(tableFields, (tableField)=>{
        if (!tableField.hidden) {
            fields[tableField.name] = tableField;
        }
    });
    const source = await getApi({
        name: referenceTo.objectName
    }, null, fields, {
        expand: true,
        alias: "rows",
        queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`
    });
    source.data.$term = "$term";
    source.data.$self = "$$";
    source.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        var filters = [];
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.data.$term){
            filters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            filters = [["${referenceTo.valueField.name}", "=", selfData.value]];
        }
        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(keyValue){
                    filters.push([key, "contains", keyValue]);
                }
            })
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `;
    let top = 20;
    if (refObjectConfig.paging && refObjectConfig.paging.enabled === false) {
        top = 1000;
    }
    ;
    let pickerSchema = null;
    if (ctx.formFactor === "SMALL") {
        pickerSchema = List.getListSchema(tableFields, {
            top: top,
            ...ctx,
            actions: false
        });
    } else {
        pickerSchema = Table.getTableSchema(tableFields, {
            top: top,
            ...ctx
        });
    }
    const data = {
        type: Field.getAmisStaticFieldType("picker", readonly),
        labelField: referenceTo.labelField.name,
        valueField: referenceTo.valueField.name,
        modalMode: "dialog",
        source: source,
        size: "lg",
        pickerSchema: pickerSchema,
        joinValues: false,
        extractValue: true
    };
    if (field.multiple) {
        data.multiple = true;
        data.extractValue = true;
    }
    if (readonly) {
        data.tpl = Tpl.getLookupTpl(field, ctx);
    }
    return data;
}
async function lookupToAmisSelect(field, readonly, ctx) {
    let referenceTo = await getReferenceTo(field);
    let apiInfo;
    if (referenceTo) {
        apiInfo = await getApi({
            name: referenceTo.objectName
        }, null, {
            [referenceTo.labelField.name]: Object.assign({}, referenceTo.labelField, {
                alias: "label"
            }),
            [referenceTo.valueField.name]: Object.assign({}, referenceTo.valueField, {
                alias: "value"
            })
        }, {
            expand: false,
            alias: "options",
            queryOptions: `filters: {__filters}, top: {__top}`
        });
    } else {
        apiInfo = {
            method: "post",
            url: graphql.getApi(),
            data: {
                query: '{objects(filters: ["_id", "=", "-1"]){_id}}',
                $: "$$"
            }
        };
    }
    apiInfo.data.$term = "$term";
    apiInfo.data.$value = `$${field.name}.${referenceTo ? referenceTo.valueField.name : "_id"}`;
    _.each(field.depend_on, function(fName) {
        apiInfo.data[fName] = `$${fName}`;
    });
    apiInfo.data["$"] = `$$`;
    apiInfo.data["rfield"] = `\${object_name}`;
    // [["_id", "=", "$${field.name}._id"],"or",["name", "contains", "$term"]]
    apiInfo.requestAdaptor = `
        var filters = '[]';
        var top = 10;
        if(api.data.$term){
            filters = '["name", "contains", "'+ api.data.$term +'"]';
        }else if(api.data.$value){
            filters = '["_id", "=", "'+ api.data.$value +'"]';
        }
        api.data.query = api.data.query.replace(/{__filters}/g, filters).replace('{__top}', top);
        return api;
    `;
    let labelField = referenceTo ? referenceTo.labelField.name : "";
    let valueField = referenceTo ? referenceTo.valueField.name : "";
    if (field._optionsFunction) {
        apiInfo.adaptor = `
        payload.data.options = eval(${field._optionsFunction})(api.data);
        return payload;
        `;
        labelField = "label";
        valueField = "value";
    }
    const data = {
        type: Field.getAmisStaticFieldType("select", readonly),
        joinValues: false,
        extractValue: true,
        labelField: labelField,
        valueField: valueField,
        autoComplete: apiInfo
    };
    if (_.has(field, "defaultValue") && !(_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))) {
        data.value = field.defaultValue;
    }
    if (field.multiple) {
        data.multiple = true;
        data.extractValue = true;
    }
    if (readonly) {
        data.tpl = Tpl.getLookupTpl(field, ctx);
    }
    return data;
}
async function getApi(object, recordId, fields, options) {
    const data = await graphql.getFindQuery(object, recordId, fields, options);
    return {
        method: "post",
        url: graphql.getApi(),
        data: data,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
async function lookupToAmis(field, readonly, ctx) {
    let referenceTo = await getReferenceTo(field);
    if (!referenceTo) {
        return await lookupToAmisSelect(field, readonly, ctx);
    }
    const refObject = await (0,objects/* getUISchema */.NW)(referenceTo.objectName);
    // 此处不参考 steedos 的 enable_enhanced_lookup 规则. 如果默认是开启弹出选择,用户选择过程操作太繁琐, 所以默认是关闭弹出选择.
    if (refObject.enable_enhanced_lookup == true) {
        return await lookupToAmisPicker(field, readonly, ctx);
    } else {
        return await lookupToAmisSelect(field, readonly, ctx);
    }
}

// EXTERNAL MODULE: ./src/lib/steedos.client.js
var steedos_client = __webpack_require__(8282);
;// CONCATENATED MODULE: ./src/lib/converter/amis/fields/index.js



const Fields = __webpack_require__(7804);
const fields_Tpl = __webpack_require__(6898);
const fields_ = __webpack_require__(6517);
const OMIT_FIELDS = [
    "created",
    "created_by",
    "modified",
    "modified_by"
];
// const Lookup = require('./lookup');
const AmisFormInputs = [
    "text",
    "date",
    "file",
    "image",
    "datetime",
    "time",
    "number",
    "currency",
    "percent",
    "password",
    "url",
    "email"
];
function getBaseFields(readonly) {
    let calssName = "m-1";
    if (readonly) {
        calssName = `${calssName} slds-form-element_readonly`;
    }
    return [
        {
            name: "createdInfo",
            label: "\u521B\u5EFA\u4EBA",
            type: "static",
            labelClassName: "text-left",
            className: calssName,
            tpl: fields_Tpl.getCreatedInfoTpl()
        },
        {
            name: "modifiedInfo",
            label: "\u4FEE\u6539\u4EBA",
            type: "static",
            labelClassName: "text-left",
            className: calssName,
            tpl: fields_Tpl.getModifiedInfoTpl()
        }
    ];
}
;
function getAmisStaticFieldType(type, readonly) {
    if (!readonly) {
        if (fields_.includes(AmisFormInputs, type)) {
            return `input-${type}`;
        }
        return type;
    }
    if (fields_.includes([
        "text"
    ], type)) {
        return `static-${type}`;
    } else {
        return "static";
    }
}
;
function getAmisFieldType(sField) {
    switch(sField.type){
        case "text":
            return "text";
        case "textarea":
            return "textarea";
        case "html":
            return "html";
        case "select":
            return "select";
        case "boolean":
            return "checkbox";
        case "date":
            return "date";
        case "datetime":
            return "datetime";
        case "number":
            return "number";
        case "currency":
            return "number";
        case "percent":
            return "number";
        case "password":
            return "password";
        case "lookup":
            // TODO 根据字段配置返回 select || picker
            return "select";
        case "master_detail":
            // TODO 根据字段配置返回 select || picker
            return "picker";
        case "autonumber":
            return "text";
        case "url":
            return "url";
        case "email":
            return "email";
        case "image":
            return "image";
        case "formula":
            break;
        case "summary":
            break;
        case "grid":
            return "table";
        default:
            console.log("convertData default", sField.type);
            break;
    }
}
;
function getObjectFieldSubFields(mainField, fields) {
    const newMainField = Object.assign({
        subFields: []
    }, mainField);
    const subFields = fields_.filter(fields, function(field) {
        return field.name.startsWith(`${mainField.name}.`);
    });
    newMainField.subFields = subFields;
    return newMainField;
}
function getGridFieldSubFields(mainField, fields) {
    const newMainField = Object.assign({
        subFields: []
    }, mainField);
    const subFields = fields_.filter(fields, function(field) {
        return field.name.startsWith(`${mainField.name}.`);
    });
    newMainField.subFields = subFields;
    return newMainField;
}
/**
 * TODO 处理权限
 * @param {*} object steedos object
 * @param {*} userSession 
 */ function getPermissionFields(object, userSession) {
    const permissionFields = [];
    const fieldsArr = [];
    fields_.each(object.fields, (field, field_name)=>{
        if (!fields_.has(field, "name")) {
            field.name = field_name;
        }
        fieldsArr.push(field);
    });
    fields_.each(fields_.sortBy(fieldsArr, "sort_no"), function(field) {
        if (!field.hidden) {
            permissionFields.push(Object.assign({}, field, {
                permission: {
                    allowEdit: true
                }
            }));
        }
    });
    return permissionFields;
}
function getSelectFieldOptions(field) {
    const dataType = field.data_type || "text";
    const options = [];
    fields_.each(field.options, (item)=>{
        switch(dataType){
            case "number":
                options.push({
                    label: item.label,
                    value: Number(item.value)
                });
                break;
            case "text":
                options.push({
                    label: item.label,
                    value: String(item.value)
                });
                break;
            case "boolean":
                options.push({
                    label: item.label,
                    value: item.value === "false" ? false : true
                });
                break;
            default:
                break;
        }
    });
    return options;
}
async function convertSFieldToAmisField(field, readonly, ctx) {
    let rootUrl = null;
    // 创建人和修改人、创建时间和修改时间不显示
    if (fields_.includes(OMIT_FIELDS, field.name) && ctx.showSystemFields != true) {
        return;
    }
    const baseData = {
        name: ctx.fieldNamePrefix ? `${ctx.fieldNamePrefix}${field.name}` : field.name,
        label: field.label,
        labelRemark: field.inlineHelpText,
        required: fields_.has(ctx, "required") ? ctx.required : field.required
    };
    let convertData = {};
    // if(_.includes(OMIT_FIELDS, field.name)){
    //     readonly = true;
    // }
    switch(field.type){
        case "text":
            convertData.type = getAmisStaticFieldType("text", readonly);
            break;
        case "textarea":
            convertData.type = getAmisStaticFieldType("textarea", readonly);
            convertData.tpl = `<b><%=data.${field.name}%></b>`;
            break;
        case "html":
            convertData = {
                type: "editor",
                language: "html",
                value: field.defaultValue || ""
            };
            break;
        // convertData = {
        //     type: getAmisStaticFieldType('html', readonly)
        // }
        // break;
        case "select":
            convertData = {
                type: getAmisStaticFieldType("select", readonly),
                joinValues: false,
                options: getSelectFieldOptions(field),
                extractValue: true,
                clearable: true,
                labelField: "label",
                valueField: "value",
                tpl: readonly ? fields_Tpl.getSelectTpl(field) : null
            };
            if (fields_.has(field, "defaultValue") && !(fields_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))) {
                const dataType = field.data_type || "text";
                if (field.defaultValue != null) {
                    if (dataType === "text") {
                        convertData.value = String(field.defaultValue);
                    } else if (dataType === "number") {
                        convertData.value = Number(field.defaultValue);
                    } else if (dataType === "boolean") {
                        convertData.value = field.defaultValue === "false" ? false : true;
                    }
                }
            }
            if (field.multiple) {
                convertData.multiple = true;
                convertData.extractValue = true;
            }
            break;
        case "boolean":
            convertData = {
                type: getAmisStaticFieldType("checkbox", readonly),
                option: field.inlineHelpText,
                tpl: readonly ? fields_Tpl.getSwitchTpl(field) : null
            };
            break;
        case "input-date-range":
            convertData = {
                type: "input-date-range",
                inputFormat: "YYYY-MM-DD",
                format: "YYYY-MM-DDT00:00:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTpl(field) : null
            };
            break;
        case "date":
            convertData = {
                type: getAmisStaticFieldType("date", readonly),
                inputFormat: "YYYY-MM-DD",
                format: "YYYY-MM-DDT00:00:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTpl(field) : null
            };
            break;
        case "input-datetime-range":
            convertData = {
                type: "input-datetime-range",
                inputFormat: "YYYY-MM-DD HH:mm",
                format: "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null,
                utc: true
            };
            break;
        case "datetime":
            convertData = {
                type: getAmisStaticFieldType("datetime", readonly),
                inputFormat: "YYYY-MM-DD HH:mm",
                format: "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null,
                utc: true
            };
            break;
        case "input-time-range":
            convertData = {
                type: "input-time-range",
                inputFormat: "HH:mm",
                timeFormat: "1970-01-01THH:mm:00.000[Z]",
                format: "1970-01-01THH:mm:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null
            };
            break;
        case "time":
            convertData = {
                type: getAmisStaticFieldType("time", readonly),
                inputFormat: "HH:mm",
                timeFormat: "1970-01-01THH:mm:00.000[Z]",
                format: "1970-01-01THH:mm:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null
            };
            break;
        case "number":
            convertData = {
                type: getAmisStaticFieldType("number", readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            };
            break;
        case "currency":
            //TODO
            convertData = {
                type: getAmisStaticFieldType("number", readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            };
            break;
        case "input-array":
            convertData = Object.assign({}, field, baseData);
            break;
        case "input-range":
            convertData = {
                type: "input-range",
                min: field.min,
                max: field.max,
                value: [
                    0,
                    0
                ],
                multiple: true,
                showInput: true
            };
            break;
        case "percent":
            //TODO
            convertData = {
                type: getAmisStaticFieldType("number", readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            };
            break;
        case "password":
            convertData = {
                type: getAmisStaticFieldType("password", readonly),
                tpl: readonly ? fields_Tpl.getPasswordTpl(field) : null
            };
            break;
        case "lookup":
            convertData = await lookupToAmis(field, readonly, ctx) //TODO
            ;
            break;
        case "master_detail":
            convertData = await lookupToAmis(field, readonly, ctx) //TODO
            ;
            break;
        case "autonumber":
            break;
        case "url":
            convertData = {
                type: getAmisStaticFieldType("url", readonly)
            };
            break;
        case "email":
            convertData = {
                type: getAmisStaticFieldType("email", readonly)
            };
            break;
        case "image":
            rootUrl = (0,steedos_client/* absoluteUrl */.GR)("/api/files/images/");
            convertData = {
                type: getAmisStaticFieldType("image", readonly),
                receiver: {
                    method: "post",
                    url: "${context.rootUrl}/s3/images",
                    adaptor: `
var rootUrl = ${JSON.stringify(rootUrl)};
payload = {
    status: response.status == 200 ? 0 : response.status,
    msg: response.statusText,
    data: {
        value: payload._id,
        filename: payload.original.name,
        url: rootUrl + payload._id,
    }
}
return payload;
                    `,
                    headers: {
                        Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    }
                }
            };
            if (field.multiple) {
                convertData.multiple = true;
                convertData.joinValues = false;
                convertData.extractValue = true;
            }
            break;
        case "file":
            rootUrl = (0,steedos_client/* absoluteUrl */.GR)("/api/files/files/");
            convertData = {
                type: getAmisStaticFieldType("file", readonly),
                receiver: {
                    method: "post",
                    url: "${context.rootUrl}/s3/files",
                    adaptor: `
var rootUrl = ${JSON.stringify(rootUrl)};
payload = {
    status: response.status == 200 ? 0 : response.status,
    msg: response.statusText,
    data: {
        value: payload._id,
        name: payload.original.name,
        url: rootUrl + payload._id,
    }
}
return payload;
                    `,
                    headers: {
                        Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    }
                }
            };
            if (field.multiple) {
                convertData.multiple = true;
                convertData.joinValues = false;
                convertData.extractValue = true;
            }
            break;
        case "formula":
            break;
        case "summary":
            break;
        case "code":
            convertData = {
                type: "editor",
                language: field.language,
                value: field.defaultValue || ""
            };
            break;
        case "toggle":
            convertData = {
                type: "switch"
            };
            break;
        case "grid":
            convertData = {
                type: "input-table",
                strictMode: false,
                affixHeader: false,
                // needConfirm: true,  此属性设置为false后，导致table不能编辑。
                editable: !readonly,
                addable: !readonly,
                removable: !readonly,
                draggable: !readonly,
                columns: []
            };
            fields_.each(field.subFields, function(subField) {
                const subFieldName = subField.name.replace(`${field.name}.$.`, "").replace(`${field.name}.`, "");
                const gridSub = convertSFieldToAmisField(Object.assign({}, subField, {
                    name: subFieldName
                }), readonly);
                if (gridSub) {
                    delete gridSub.name;
                    delete gridSub.label;
                    convertData.columns.push({
                        name: subFieldName,
                        label: subField.label,
                        quickEdit: readonly ? false : gridSub
                    });
                }
            });
            break;
        default:
            break;
    }
    if (!fields_.isEmpty(convertData)) {
        if (field.is_wide) {
            convertData.className = "col-span-2 m-1";
        } else {
            convertData.className = "m-1";
        }
        if (readonly) {
            convertData.className = `${convertData.className} slds-form-element_readonly`;
        }
        convertData.labelClassName = "text-left";
        if (readonly) {
            convertData.quickEdit = false;
        }
        if (field.visible_on) {
            convertData.visibleOn = `\$${field.visible_on.substring(1, field.visible_on.length - 1).replace(/formData./g, "")}`;
        }
        return Object.assign({}, baseData, convertData);
    }
}
async function getFieldSearchable(perField, permissionFields, ctx) {
    let field = perField;
    if (field.type === "grid") {
        field = await Fields.getGridFieldSubFields(perField, permissionFields);
    } else if (perField.type === "object") {
        field = await Fields.getObjectFieldSubFields(perField, permissionFields);
    }
    let fieldNamePrefix = "__searchable__";
    if (field.name.indexOf(".") < 0) {
        let _field = (0,external_lodash_.cloneDeep)(field);
        if ((0,external_lodash_.includes)([
            "textarea",
            "html",
            "code",
            "autonumber"
        ], field.type)) {
            _field.type = "text";
        }
        if (field.type === "number" || field.type === "currency") {
            _field.type = "input-array";
            _field.inline = true;
            _field.addable = false;
            _field.removable = false;
            _field.value = [
                null,
                null
            ];
            _field.items = {
                type: "input-number"
            };
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.type === "date") {
            _field.type = "input-date-range";
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.type === "datetime") {
            _field.type = "input-datetime-range";
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.type === "time") {
            _field.type = "input-time-range";
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.reference_to === "users") {
            _field.reference_to = "space_users";
            _field.reference_to_field = "user";
        }
        _field.readonly = false;
        _field.disabled = false;
        _field.multiple = true;
        _field.is_wide = false;
        _field.defaultValue = undefined;
        const amisField = await Fields.convertSFieldToAmisField(_field, false, Object.assign({}, ctx, {
            fieldNamePrefix: fieldNamePrefix,
            required: false,
            showSystemFields: true
        }));
        if (amisField) {
            return amisField;
        }
    }
}


/***/ }),

/***/ 5158:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCardSchema": () => (/* binding */ getCardSchema),
/* harmony export */   "getListSchema": () => (/* binding */ getListSchema)
/* harmony export */ });
/* harmony import */ var _components_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6820);
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-23 09:12:14
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-20 17:44:38
 * @Description: 
 */ 
const Tpl = __webpack_require__(6898);
function getListBody(fields, options) {
    const columns = [];
    _.each(fields, function(field) {
        const tpl = Tpl.getFieldTpl(field, options);
        let type = "text";
        if (tpl) {
            type = "tpl";
        }
        if (!field.hidden && !field.extra) {
            columns.push({
                name: field.name,
                label: field.label,
                sortable: field.sortable,
                // searchable: field.searchable,
                width: field.width,
                type: type,
                tpl: tpl,
                toggled: field.toggled
            });
        }
    });
    return {
        "type": "hbox",
        "columns": columns
    };
}
function getDefaultParams(options) {
    return {
        perPage: options.top || 10
    };
}
function getListSchema(fields, options) {
    return {
        mode: "list",
        name: "thelist",
        draggable: false,
        headerToolbar: [
            "reload"
        ],
        defaultParams: getDefaultParams(options),
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: true,
        labelTpl: `\${name}`,
        listItem: {
            body: [
                ...getListBody(fields, options).columns
            ],
            actions: options.actions === false ? null : [
                {
                    icon: "fa fa-eye",
                    label: "\u67E5\u770B",
                    type: "button",
                    actionType: "link",
                    link: _components_functions__WEBPACK_IMPORTED_MODULE_0__/* .SteedosUI.Router.getObjectDetailPath */ .h.Router.getObjectDetailPath({
                        formFactor: options.formFactor,
                        appId: options.appId,
                        objectName: options.tabId,
                        recordId: `\${_id}`
                    })
                }
            ]
        }
    };
}
function getCardSchema(fields, options) {
    let title = null;
    const titleField = _.find(fields, (f)=>{
        return f.name === options.labelFieldName;
    });
    if (titleField) {
        title = Tpl.getFieldTpl(titleField, options);
    }
    return {
        mode: "cards",
        name: "cards",
        draggable: false,
        headerToolbar: [
            "statistics",
            "pagination"
        ],
        defaultParams: getDefaultParams(options),
        syncLocation: false,
        keepItemSelectionOnPageChange: false,
        checkOnItemClick: false,
        labelTpl: `\${${options.labelFieldName}}`,
        card: {
            "type": "card",
            "header": {
                "title": title
            },
            "body": [
                ...getListBody(_.filter(fields, (f)=>{
                    return f.name != options.labelFieldName;
                }), options).columns
            ]
        }
    };
}


/***/ }),

/***/ 2696:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTableApi": () => (/* binding */ getTableApi),
/* harmony export */   "getTableSchema": () => (/* binding */ getTableSchema)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7733);
const Tpl = __webpack_require__(6898);
const Fields = __webpack_require__(7804);
const _ = __webpack_require__(6517);
const graphql = __webpack_require__(1306);

function getOperation(fields) {
    const controls = [];
    _.each(fields, function(field) {
        controls.push(Fields.convertSFieldToAmisField(field, true));
    });
    return {
        "type": "operation",
        "label": "\u64CD\u4F5C",
        "width": 100,
        fixed: "right",
        "buttons": [
            {
                "type": "button",
                "icon": "fa fa-eye",
                "actionType": "dialog",
                "tooltip": "\u67E5\u770B",
                "dialog": {
                    "title": "\u67E5\u770B",
                    "body": {
                        "type": "form",
                        "controls": controls
                    }
                }
            }
        ]
    };
}
//获取name字段，如果没有，则_index字段添加链接
function getDetailColumn() {}
function getTableColumns(fields, options) {
    const columns = [
        {
            name: "_index",
            type: "text",
            width: 32,
            placeholder: ""
        }
    ];
    _.each(fields, function(field) {
        if ((field.is_name || field.name === options.labelFieldName) && options.objectName === "cms_files") {
            columns.push({
                "type": "button",
                "label": `\${${field.name}}`,
                "type": "button",
                "actionType": "ajax",
                "api": {
                    "url": "${context.rootUrl}/api/files/files/${versions[0]}?download=true",
                    "method": "get",
                    "headers": {
                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    },
                    "responseType": "blob",
                    "dataType": "form-data"
                },
                "id": "u:6c8291d1029f",
                "level": "link"
            });
        } else {
            const tpl = Tpl.getFieldTpl(field, options);
            let type = "text";
            if (tpl) {
                type = "tpl";
            }
            if (!field.hidden && !field.extra) {
                columns.push({
                    name: field.name,
                    label: field.label,
                    sortable: field.sortable,
                    // searchable: field.searchable,
                    width: field.width,
                    type: type,
                    tpl: tpl,
                    toggled: field.toggled
                });
            }
        }
    });
    // columns.push(getOperation(fields));
    return columns;
}
function getDefaultParams(options) {
    return {
        perPage: options.top || _config__WEBPACK_IMPORTED_MODULE_0__/* ["default"].listView.perPage */ .Z.listView.perPage
    };
}
function getTableSchema(fields, options) {
    if (!options) {
        options = {};
    }
    return {
        mode: "table",
        name: "thelist",
        draggable: false,
        headerToolbar: [
            "reload"
        ],
        defaultParams: getDefaultParams(options),
        columns: getTableColumns(fields, options),
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: true,
        labelTpl: `\${${options.labelFieldName}}`,
        autoFillHeight: false
    };
}
async function getTableApi(mainObject, fields, options) {
    const searchableFields = [];
    let { globalFilter , filter  } = options;
    if (_.isArray(filter)) {
        filter = _.map(filter, function(item) {
            if (item.operation) {
                return [
                    item.field,
                    item.operation,
                    item.value
                ];
            } else {
                return item;
            }
        });
    }
    _.each(fields, function(field) {
        if (field.searchable) {
            searchableFields.push(field.name);
        }
    });
    let valueField = mainObject.key_field || "_id";
    const api = await getApi(mainObject, null, fields, {
        alias: "rows",
        queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`
    });
    api.data.$term = "$term";
    api.data.$self = "$$";
    api.data.filter = "$filter";
    api.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        ${globalFilter ? `var filters = ${JSON.stringify(globalFilter)};` : "var filters = [];"}
        if(_.isEmpty(filters)){
            filters = api.data.filter || [${JSON.stringify(filter)}];
        }else{
            filters = [filters, 'and', api.data.filter || [${JSON.stringify(filter)}]]
        }
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.data.$term){
            filters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            filters = [["${valueField.name}", "=", selfData.value]];
        }

        var searchableFilter = [];
        _.each(selfData, (value, key)=>{
            if(!_.isEmpty(value) || _.isBoolean(value)){
                if(_.startsWith(key, '__searchable__between__')){
                    searchableFilter.push([\`\${key.replace("__searchable__between__", "")}\`, "between", value])
                }else if(_.startsWith(key, '__searchable__')){
                    if(_.isString(value)){
                        searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "contains", value])
                    }else{
                        searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "=", value])
                    }
                }
            }
        });

        if(searchableFilter.length > 0){
            if(filters.length > 0 ){
                filters = [filters, 'and', searchableFilter];
            }else{
                searchableFilter = filters;
            }
        }

        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(keyValue){
                    filters.push([key, "contains", keyValue]);
                }
            })
        }

        if(selfData.__keywords && allowSearchFields){
            const keywordsFilters = [];
            allowSearchFields.forEach(function(key, index){
                const keyValue = selfData.__keywords;
                if(keyValue){
                    keywordsFilters.push([key, "contains", keyValue]);
                    if(index < allowSearchFields.length - 1){
                        keywordsFilters.push('or');
                    }
                }
            })
            filters.push(keywordsFilters);
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `;
    api.adaptor = `
    _.each(payload.data.rows, function(item, index){
        item._index = index + 1;
    })
    window.postMessage(Object.assign({type: "listview.loaded"}), "*")
    return payload;
    `;
    return api;
}
async function getApi(object, recordId, fields, options) {
    const data = await graphql.getFindQuery(object, recordId, fields, options);
    return {
        method: "post",
        url: graphql.getApi(),
        data: data,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}


/***/ }),

/***/ 1306:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getApi": () => (/* binding */ getApi),
/* harmony export */   "getFieldsTemplate": () => (/* binding */ getFieldsTemplate),
/* harmony export */   "getFindOneQuery": () => (/* binding */ getFindOneQuery),
/* harmony export */   "getFindQuery": () => (/* binding */ getFindQuery),
/* harmony export */   "getSaveDataTpl": () => (/* binding */ getSaveDataTpl),
/* harmony export */   "getSaveQuery": () => (/* binding */ getSaveQuery),
/* harmony export */   "getSaveRequestAdaptor": () => (/* binding */ getSaveRequestAdaptor),
/* harmony export */   "getScriptForRemoveUrlPrefixForImgFields": () => (/* binding */ getScriptForRemoveUrlPrefixForImgFields),
/* harmony export */   "getScriptForSimplifiedValueForFileFields": () => (/* binding */ getScriptForSimplifiedValueForFileFields)
/* harmony export */ });
/* harmony import */ var _lib_objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6195);
const _ = __webpack_require__(6517);

async function getFieldsTemplate(fields, expand) {
    if (expand != false) {
        expand = true;
    }
    let fieldsName = [
        "_id"
    ];
    let displayFields = [];
    let fieldsArr = [];
    if (_.isArray(fields)) {
        fieldsArr = fields;
    } else {
        fieldsArr = _.values(fields);
    }
    for (const field of fieldsArr){
        if (field.name.indexOf(".") < 0) {
            if (expand && (field.type == "lookup" || field.type == "master_detail") && field.reference_to) {
                const refUiSchema = await (0,_lib_objects__WEBPACK_IMPORTED_MODULE_0__/* .getUISchema */ .NW)(field.reference_to);
                const NAME_FIELD_KEY = refUiSchema.NAME_FIELD_KEY || "name";
                fieldsName.push(`${field.name}:${field.name}__expand{_id,${NAME_FIELD_KEY}${field.reference_to_field ? `,${field.reference_to_field}` : ""}}`);
            } else {
                fieldsName.push(field.alias ? `${field.alias}:${field.name}` : field.name);
            }
            if (field.type === "date" || field.type == "datetime" || field.type == "boolean") {
                fieldsName.push(`${field.name}`);
            }
            if (field.type === "date" || field.type == "datetime" || field.type == "boolean" || field.type == "select" || field.type == "file") {
                displayFields.push(`${field.name}`);
            }
        }
    }
    displayFields = _.uniq(displayFields);
    fieldsName = _.uniq(fieldsName);
    if (displayFields.length > 0) {
        return `${fieldsName.join(",")},_display{${displayFields.join(",")}}`;
    }
    return `${fieldsName.join(" ")}`;
}
async function getFindOneQuery(object, recordId, fields, options) {
    let queryOptions = "";
    if (recordId) {
        queryOptions = `(filters:["${object.idFieldName}", "=", "${recordId}"])`;
    }
    let alias = "data";
    if (options) {
        if (options.alias) {
            alias = options.alias;
        }
        if (options.filters) {
            queryOptions = `(filters:${options.filters})`;
        }
        if (options.queryOptions) {
            queryOptions = `(${options.queryOptions})`;
        }
    }
    return {
        query: `{${alias}:${object.name}${queryOptions}{${await getFieldsTemplate(fields)}}}`
    };
}
function getSaveQuery(object, recordId, fields, options) {
    return {
        objectName: "${objectName}",
        $: "$$",
        recordId: "${recordId}",
        modalName: "${modalName}"
    };
}
/*
    img字段值移除URL前缀使其保存时正常保存id,而不是url。
*/ function getScriptForRemoveUrlPrefixForImgFields(fields) {
    let imgFieldsKeys = [];
    let imgFields = {};
    fields.forEach((item)=>{
        if (item.type === "image") {
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!imgFieldsKeys.length) {
        return "";
    }
    return `
        let imgFieldsKeys = ${JSON.stringify(imgFieldsKeys)};
        let imgFields = ${JSON.stringify(imgFields)};
        imgFieldsKeys.forEach((item)=>{
            let imgFieldValue = formData[item];
            if(imgFieldValue && imgFieldValue.length){
                // 因为表单初始化接口的接收适配器中为image字段值添加了url前缀（为了字段编辑时正常显示图片），所以保存时移除（为了字段值保存时正常保存id,而不是url）。
                if(imgFields[item].multiple){
                    if(imgFieldValue instanceof Array){
                        formData[item] = imgFieldValue.map((value)=>{ 
                            let itemValue = value?.split('/');
                            return itemValue[itemValue.length - 1];
                        });
                    }
                }else{
                    let imgValue = imgFieldValue.split('/');
                    formData[item] = imgValue[imgValue.length - 1];
                }
            }
        })
    `;
}
/*
    file字段值重写使其保存时正常保存id。
*/ function getScriptForSimplifiedValueForFileFields(fields) {
    let fileFieldsKeys = [];
    let fileFields = {};
    fields.forEach((item)=>{
        if (item.type === "file") {
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!fileFieldsKeys.length) {
        return "";
    }
    return `
        let fileFieldsKeys = ${JSON.stringify(fileFieldsKeys)};
        let fileFields = ${JSON.stringify(fileFields)};
        fileFieldsKeys.forEach((item)=>{
            let fileFieldValue = formData[item];
            if(fileFieldValue){
                // 因为表单初始化接口的接收适配器中为file字段值重写了值及格式（为了字段编辑时正常显示附件名、点击附件名正常下载），所以保存时还原（为了字段值保存时正常保存id）。
                if(fileFields[item].multiple){
                    if(fileFieldValue instanceof Array && fileFieldValue.length){
                        formData[item] = fileFieldValue.map((value)=>{ 
                            if(typeof value === 'object'){
                                return value.value;
                            }else{
                                return value;
                            }
                        });
                    }
                }else{
                    formData[item] = typeof fileFieldValue === 'object' ? fileFieldValue.value : fileFieldValue;
                }
            }
        })
    `;
}
function getSaveDataTpl(fields) {
    return `
        const formData = api.data.$;
        for (key in formData){
            // image、select等字段清空值后保存的空字符串转换为null。
            if(formData[key] === ''){
                formData[key] = null;
            }
        }
        const objectName = api.data.objectName;
        const fieldsName = Object.keys(formData);
        delete formData.created;
        delete formData.created_by;
        delete formData.modified;
        delete formData.modified_by;
        delete formData._display;
        ${getScriptForRemoveUrlPrefixForImgFields(fields)}
        ${getScriptForSimplifiedValueForFileFields(fields)}
        let query = \`mutation{record: \${objectName}__insert(doc: {__saveData}){_id}}\`;
        if(formData.recordId && formData.recordId !='new'){
            query = \`mutation{record: \${objectName}__update(id: "\${formData._id}", doc: {__saveData}){_id}}\`;
        };
        delete formData._id;
        let __saveData = JSON.stringify(JSON.stringify(formData));
    `;
}
function getSaveRequestAdaptor(fields) {
    return `
        ${getSaveDataTpl(fields)}
        api.data = {query: query.replace('{__saveData}', __saveData)};
        return api;
    `;
}
async function getFindQuery(object, recordId, fields, options) {
    let limit = options.limit || 10;
    let queryOptions = `(top: ${limit})`;
    if (recordId) {
        queryOptions = `(filters:["_id", "=", "${recordId}"], top: ${limit})`;
    }
    let alias = "data";
    if (options) {
        if (options.alias) {
            alias = options.alias;
        }
        if (options.filters) {
            queryOptions = `(filters:${options.filters})`;
        }
        if (options.queryOptions) {
            queryOptions = `(${options.queryOptions})`;
        }
    }
    return {
        orderBy: "${orderBy}",
        orderDir: "${orderDir}",
        pageNo: "${page}",
        pageSize: "${perPage}",
        query: `{${alias}:${object.name}${queryOptions}{${await getFieldsTemplate(fields, options.expand)}},count:${object.name}__count(filters:{__filters})}`
    };
}
function getApi(isMobile) {
    if (isMobile) {
    //TODO 返回 绝对路径
    } else {
        // return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/graphql"
        return `\${context.rootUrl}/graphql`;
    }
}


/***/ }),

/***/ 6898:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCreatedInfoTpl": () => (/* binding */ getCreatedInfoTpl),
/* harmony export */   "getDateTimeTpl": () => (/* binding */ getDateTimeTpl),
/* harmony export */   "getDateTpl": () => (/* binding */ getDateTpl),
/* harmony export */   "getFieldTpl": () => (/* binding */ getFieldTpl),
/* harmony export */   "getLookupTpl": () => (/* binding */ getLookupTpl),
/* harmony export */   "getModifiedInfoTpl": () => (/* binding */ getModifiedInfoTpl),
/* harmony export */   "getNameTpl": () => (/* binding */ getNameTpl),
/* harmony export */   "getPasswordTpl": () => (/* binding */ getPasswordTpl),
/* harmony export */   "getRefObjectNameFieldName": () => (/* binding */ getRefObjectNameFieldName),
/* harmony export */   "getSelectTpl": () => (/* binding */ getSelectTpl),
/* harmony export */   "getSwitchTpl": () => (/* binding */ getSwitchTpl)
/* harmony export */ });
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 09:53:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-20 17:45:00
 * @Description: 
 */ function getCreatedInfoTpl(formFactor) {
    const href = SteedosUI.Router.getObjectDetailPath({
        formFactor,
        appId: "admin",
        objectName: "users",
        recordId: "${created_by._id}"
    });
    return `<div><a href='${href}'>\${created_by.name}</a>\${_display.created}</div>`;
}
function getModifiedInfoTpl(formFactor) {
    const href = SteedosUI.Router.getObjectDetailPath({
        formFactor,
        appId: "admin",
        objectName: "users",
        recordId: "${modified_by._id}"
    });
    return `<div><a href='${href}'>\${modified_by.name}</a>\${_display.modified}</div>`;
}
function getDateTpl(field) {
    return `<div>\${_display.${field.name}}</div>`;
}
function getDateTimeTpl(field) {
    return `<div>\${_display.${field.name}}</div>`;
}
//TODO 处理name字段
function getRefObjectNameFieldName(field) {
    // const refObject = objectql.getObject(field.reference_to);
    // return refObject.NAME_FIELD_KEY;
    return "name";
}
function getSelectTpl(field) {
    return `<div>\${_display.${field.name}}</div>`;
}
function getNameTpl(field, ctx) {
    if (ctx.objectName === "cms_files") {
        return `<a href="\${context.rootUrl}/api/files/files/\${versions[0]}?download=true">\${${field.name}}</a>`;
    }
    const href = SteedosUI.Router.getObjectDetailPath({
        formFactor: ctx.formFactor,
        appId: ctx.appId,
        objectName: ctx.tabId,
        recordId: `\${${ctx.idFieldName}}`
    });
    return `<a href="${href}">\${${field.name}}</a>`;
}
function getLookupTpl(field, ctx) {
    if (!field.reference_to) {
        return getSelectTpl(field);
    }
    const NAME_FIELD_KEY = getRefObjectNameFieldName(field);
    if (field.multiple) {
        const href = SteedosUI.Router.getObjectDetailPath({
            formFactor: ctx.formFactor,
            appId: ctx.appId,
            objectName: field.reference_to,
            recordId: `<%=item._id%>`
        });
        return `
        <% if (data.${field.name} && data.${field.name}.length) { %><% data.${field.name}.forEach(function(item) { %> <a href="${href}"><%=item.${NAME_FIELD_KEY}%></a>  <% }); %><% } %>
        `;
    } else {
        const href1 = SteedosUI.Router.getObjectDetailPath({
            formFactor: ctx.formFactor,
            appId: ctx.appId,
            objectName: field.reference_to,
            recordId: `\${${field.name}._id}`
        });
        return `<a href="${href1}">\${${field.name}.${NAME_FIELD_KEY}}</a>`;
    }
}
function getSwitchTpl(field) {
    return `<% if (data.${field.name}) { %>
    <span class="slds-icon_container slds-icon-utility-check slds-current-color" title="<%=data._display.${field.name}%>">
        <span class="slds-assistive-text"><%=data._display.${field.name}%></span>
    </span>
    <% } %>`;
}
function getPasswordTpl(field) {
    return `<% if (data.${field.name}) { %>
        <span>······</span>
        <% } %>`;
}
function getFieldTpl(field, options) {
    if (field.is_name || field.name === options.labelFieldName) {
        return getNameTpl(field, options);
    }
    switch(field.type){
        case "password":
            return getPasswordTpl(field);
        case "boolean":
            return getSwitchTpl(field);
        case "select":
            return getSelectTpl(field);
        case "date":
            return getDateTpl(field);
        case "datetime":
            return getDateTimeTpl(field);
        case "lookup":
            return getLookupTpl(field, options);
        case "master_detail":
            return getLookupTpl(field, options);
        default:
            break;
    }
}
;


/***/ }),

/***/ 6195:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "KR": () => (/* binding */ getFormSchema),
  "$R": () => (/* binding */ getListSchema),
  "I3": () => (/* binding */ getObjectRelated),
  "ke": () => (/* binding */ getObjectRelateds),
  "mp": () => (/* binding */ getSearchableFieldsFilterSchema),
  "NW": () => (/* binding */ getUISchema),
  "DM": () => (/* binding */ getViewSchema)
});

// UNUSED EXPORTS: getField

// EXTERNAL MODULE: ./src/lib/steedos.client.js
var steedos_client = __webpack_require__(8282);
// EXTERNAL MODULE: ./src/lib/converter/amis/fields/index.js + 1 modules
var amis_fields = __webpack_require__(7804);
;// CONCATENATED MODULE: ./src/lib/converter/amis/api.js


const graphql = __webpack_require__(1306);
const _ = __webpack_require__(6517);
const API_CACHE = 100;
function getReadonlyFormAdaptor(fields) {
    let scriptStr = "";
    const selectFields = _.filter(fields, function(field) {
        return field.name.indexOf(".") < 0 && (field.type == "select" && field.options || (field.type == "lookup" || field.type == "master_detail") && !field.reference_to);
    });
    _.each(selectFields, function(field) {
        if (!_.includes(amis_fields.OMIT_FIELDS, field.name)) {
            const valueField = field.name;
            if (field.options) {
                const options = JSON.stringify({
                    options: field.options
                });
                scriptStr = scriptStr + `var ${field.name}Options= (${options}).options;`;
            } else if (field.optionsFunction) {
                scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`;
            }
            if (field.multiple) {
                scriptStr = scriptStr + `data.${field.name}__label = _.map(_.filter(${field.name}Options, function(option){return _.includes(data.${field.name}, option.value)}), 'label');`;
            } else {
                scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`;
                scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`;
            }
        }
    });
    // const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to});
    // _.each(refFields, function(field){
    //     if(!_.includes(OMIT_FIELDS, field.name)){
    //         const valueField = field.reference_to_field || '_id';
    //         scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
    //         if(field.multiple){
    //             scriptStr = scriptStr + `data.${field.name}__label = _.map(_.filter(${field.name}Options, function(option){return _.includes(data.${field.name}, option.value)}), 'label');`
    //         }else{
    //             scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
    //             scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
    //         }
    //     }
    // })
    return `
    if(payload.data.data){
        var data = payload.data.data[0];
        ${scriptStr}
        payload.data = data;
        window.postMessage(Object.assign({type: "record.loaded"}, {record: data}), "*")
    }
    return payload;
`;
}
async function getReadonlyFormInitApi(object, recordId, fields) {
    return {
        method: "post",
        url: graphql.getApi() + "?rf=" + new Date().getTime(),
        cache: API_CACHE,
        adaptor: getReadonlyFormAdaptor(fields),
        data: await graphql.getFindOneQuery(object, recordId, fields),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
function getConvertDataScriptStr(fields) {
    const refFields = _.filter(fields, function(field) {
        return field.name.indexOf(".") < 0 && (field.type == "lookup" || field.type == "master_detail") && field.reference_to;
    });
    let scriptStr = "";
    _.each(refFields, function(field) {
        if (!_.includes(amis_fields.OMIT_FIELDS, field.name)) {
            const valueField = field.reference_to_field || "_id";
            if (field.multiple) {
                scriptStr = scriptStr + `data.${field.name} = _.map(data.${field.name}, '${valueField}');`;
            } else {
                scriptStr = scriptStr + `data.${field.name} = data.${field.name} ? data.${field.name}.${valueField}:null;`;
            }
        }
    });
    return scriptStr;
}
/*
    img字段值添加URL前缀使其在amis中正常显示图片。
*/ function getScriptForAddUrlPrefixForImgFields(fields) {
    let imgFieldsKeys = [];
    let imgFields = {};
    let rootUrl = (0,steedos_client/* absoluteUrl */.GR)("/api/files/images/");
    fields.forEach((item)=>{
        if (item.type === "image") {
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!imgFieldsKeys.length) {
        return "";
    }
    return `
                // image字段值添加URL前缀
                let imgFieldsKeys = ${JSON.stringify(imgFieldsKeys)};
                let imgFields = ${JSON.stringify(imgFields)};
                let rootUrl = ${JSON.stringify(rootUrl)};
                imgFieldsKeys.forEach((item)=>{
                    let imgFieldValue = data[item];
                    if(imgFieldValue && imgFieldValue.length){
                        if(imgFields[item].multiple){
                            if(imgFieldValue instanceof Array){
                                data[item] = imgFieldValue.map((value)=>{ return rootUrl + value});
                            }
                        }else{
                            data[item] = rootUrl + imgFieldValue;
                        }
                    }
                })
    `;
}
/*
    file字段值重写使其在amis中正常显示附件名、点击附件名下载文件。
*/ function getScriptForRewriteValueForFileFields(fields) {
    let fileFieldsKeys = [];
    let fileFields = {};
    let fileRootUrl = (0,steedos_client/* absoluteUrl */.GR)("/api/files/files/");
    fields.forEach((item)=>{
        if (item.type === "file") {
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!fileFieldsKeys.length) {
        return "";
    }
    return `
                // file字段值重写以便编辑时正常显示附件名、点击附件名正常下载附件
                let fileFieldsKeys = ${JSON.stringify(fileFieldsKeys)};
                let fileFields = ${JSON.stringify(fileFields)};
                let fileRootUrl = ${JSON.stringify(fileRootUrl)};
                fileFieldsKeys.forEach((item)=>{
                    let fileFieldValue = data[item];
                    if(fileFieldValue && fileFieldValue.length){
                        const fileFieldNames = data._display[item].split(',');
                        if(fileFields[item].multiple){
                            if(fileFieldValue instanceof Array){
                                data[item] = fileFieldValue.map((value, index)=>{ 
                                    return {
                                        value: value,
                                        name: fileFieldNames[index],
                                        url: fileRootUrl + value + "?download=true",
                                        state: "uploaded"
                                    }
                                });
                            }
                        }else{
                            data[item] = {
                                value: fileFieldValue,
                                name: fileFieldNames[0],
                                url: fileRootUrl + fileFieldValue + "?download=true",
                                state: "uploaded"
                            };
                        }
                    }
                })
    `;
}
async function getEditFormInitApi(object, recordId, fields) {
    return {
        method: "post",
        url: graphql.getApi(),
        sendOn: "!!this.recordId",
        cache: API_CACHE,
        adaptor: `
            if(payload.data.data){
                var data = payload.data.data[0];
                if(data){
                    ${getConvertDataScriptStr(fields)}
                    ${getScriptForAddUrlPrefixForImgFields(fields)}
                    ${getScriptForRewriteValueForFileFields(fields)}
                    //初始化接口返回的字段移除字段值为null的字段
                    for (key in data){
                        if(data[key] === null){
                            delete data[key];
                        }
                    }
                };
                payload.data = data;
                delete payload.extensions;
            }
            return payload;
        `,
        data: await graphql.getFindOneQuery(object, recordId, fields),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
function getSaveApi(object, recordId, fields, options) {
    return {
        method: "post",
        url: graphql.getApi(),
        data: graphql.getSaveQuery(object, recordId, fields, options),
        requestAdaptor: graphql.getSaveRequestAdaptor(fields),
        responseData: {
            "recordId": "${record._id}"
        },
        adaptor: `
            return payload;
        `,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
function getBatchDelete(objectName) {
    return {
        method: "post",
        url: graphql.getApi(),
        requestAdaptor: `
            var ids = api.data.ids.split(",");
            var deleteArray = [];
            ids.forEach((id,index)=>{
                deleteArray.push(\`delete__\${index}:${objectName}__delete(id: "\${id}")\`);
            })
            api.data = {query: \`mutation{\${deleteArray.join(',')}}\`};
            return api;
        `,
        data: {
            ids: `\${ids}`
        },
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}

// EXTERNAL MODULE: ./src/lib/converter/amis/fields/table.js
var fields_table = __webpack_require__(2696);
;// CONCATENATED MODULE: ./src/lib/converter/amis/fields/sections.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-26 16:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-20 15:19:15
 * @Description: 
 */ const Fields = __webpack_require__(7804);
const lodash = __webpack_require__(6517);
const getFieldSchemaArray = (mergedSchema)=>{
    let fieldSchemaArray = [];
    fieldSchemaArray.length = 0;
    const fieldsArr = [];
    lodash.forEach(mergedSchema.fields, (field, fieldName)=>{
        if (!lodash.has(field, "name")) {
            field.name = fieldName;
        }
        fieldsArr.push(field);
    });
    lodash.forEach(lodash.sortBy(mergedSchema.fields, "sort_no"), (field)=>{
        if (!field.group || field.group == "null" || field.group == "-") field.group = "\u901A\u7528";
        const fieldName = field.name;
        let isObjectField = /\w+\.\w+/.test(fieldName);
        if (field.type == "grid" || field.type == "object") {
            // field.group = field.label
            field.is_wide = true;
        }
        if (!isObjectField) {
            if (!field.hidden) {
                fieldSchemaArray.push(Object.assign({
                    name: fieldName
                }, field, {
                    permission: {
                        allowEdit: true
                    }
                }));
            }
        }
    });
    return fieldSchemaArray;
};
const getSection = async (permissionFields, fieldSchemaArray, sectionName, ctx)=>{
    const sectionFields = lodash.filter(fieldSchemaArray, {
        "group": sectionName
    });
    if (sectionFields.length == lodash.filter(sectionFields, [
        "hidden",
        true
    ]).length) {
        return;
    }
    const fieldSetBody = [];
    for (const perField of sectionFields){
        let field = perField;
        if (perField.type === "grid") {
            field = await Fields.getGridFieldSubFields(perField, permissionFields);
        } else if (perField.type === "object") {
            field = await Fields.getObjectFieldSubFields(perField, permissionFields);
        }
        if (field.name.indexOf(".") < 0) {
            const amisField = await Fields.convertSFieldToAmisField(field, field.readonly, ctx);
            if (amisField) {
                fieldSetBody.push(amisField);
            }
        }
    }
    // fieldSet 暂不支持显隐控制
    // const sectionFieldsVisibleOn = lodash.map(lodash.compact(lodash.map(fieldSetBody, 'visibleOn')) , (visibleOn)=>{
    //   return `(${visibleOn.substring(2, visibleOn.length -1)})`;
    // });
    const section = {
        "type": "fieldSet",
        "title": sectionName,
        "collapsable": true,
        "body": fieldSetBody
    };
    // if(sectionFieldsVisibleOn.length > 0){
    //   section.visibleOn = `\${${sectionFieldsVisibleOn.join(" || ")}}`
    // }
    return section;
};
const getSections = async (permissionFields, mergedSchema, ctx)=>{
    const fieldSchemaArray = getFieldSchemaArray(mergedSchema);
    const _sections = lodash.groupBy(fieldSchemaArray, "group");
    const sections = [];
    for(const key in _sections){
        const section = await getSection(permissionFields, fieldSchemaArray, key, ctx);
        if (section.body.length > 0) {
            sections.push(section);
        }
    }
    return sections;
};

;// CONCATENATED MODULE: ./src/lib/converter/amis/form.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-07 11:02:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-23 17:52:58
 * @Description: 
 */ 
async function getFormBody(permissionFields, objectConfig, ctx) {
    return await getSections(permissionFields, objectConfig, ctx);
}

// EXTERNAL MODULE: ./src/lib/converter/amis/fields/list.js
var list = __webpack_require__(5158);
// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(6517);
var external_lodash_default = /*#__PURE__*/__webpack_require__.n(external_lodash_);
;// CONCATENATED MODULE: ./src/lib/converter/amis/index.js







function getBulkActions(objectSchema) {
    return [
        {
            "type": "button",
            "level": "danger",
            "label": "\u6279\u91CF\u5220\u9664",
            "actionType": "ajax",
            "confirmText": "\u786E\u5B9A\u8981\u5220\u9664\u5417",
            "id": "batchDelete",
            "api": getBatchDelete(objectSchema.name)
        }
    ];
}
function getHeaderToolbar(mainObject, formFactor) {
    if (formFactor === "SMALL") {
        return [
            "bulkActions",
            {
                "type": "reload",
                "align": "right"
            },
            {
                "type": "search-box",
                "align": "right",
                "name": "__keywords",
                "placeholder": "\u8BF7\u8F93\u5165\u5173\u952E\u5B57",
                "mini": true
            }
        ];
    } else {
        return [
            "filter-toggler",
            "bulkActions",
            // {
            //     "type": "export-excel",
            //     "align": "right"
            // },
            // {
            //     "type": "reload",
            //     "align": "right"
            // },
            // {
            //     "type": "columns-toggler",
            //     "align": "right"
            // },
            {
                "type": "search-box",
                "align": "right",
                "name": "__keywords",
                "placeholder": "\u8BF7\u8F93\u5165\u5173\u952E\u5B57",
                "mini": true
            }
        ];
    }
}
function getToolbar() {
    return [];
}
function footerToolbar() {
    return [
        "statistics",
        // "switch-per-page",
        "pagination"
    ];
}
function getFilter() {
    return {
        "title": "\u6761\u4EF6\u641C\u7D22",
        "submitText": "",
        "body": [
            {
                "type": "input-text",
                "name": "name",
                "placeholder": "\u5408\u540C\u540D\u79F0",
                "addOn": {
                    "label": "\u641C\u7D22",
                    "type": "submit"
                }
            }
        ]
    };
}
async function getObjectList(objectSchema, fields, options) {
    const bulkActions = getBulkActions(objectSchema);
    const bodyProps = {
        toolbar: getToolbar(),
        footerToolbar: footerToolbar(),
        headerToolbar: getHeaderToolbar(objectSchema, options.formFactor),
        bulkActions: bulkActions,
        bodyClassName: ""
    };
    let body = null;
    const id = `listview_${objectSchema.name}`;
    if (options.formFactor === "SMALL") {
        delete bodyProps.bulkActions;
        delete bodyProps.headerToolbar;
        delete bodyProps.footerToolbar;
        body = Object.assign({}, (0,list.getCardSchema)(fields, Object.assign({
            idFieldName: objectSchema.idFieldName,
            labelFieldName: objectSchema.NAME_FIELD_KEY || "name"
        }, options, {
            actions: false
        })), {
            type: "crud",
            primaryField: "_id",
            id: id,
            name: id,
            keepItemSelectionOnPageChange: false,
            api: await (0,fields_table.getTableApi)(objectSchema, fields, options)
        }, bodyProps);
    } else {
        const table = (0,fields_table.getTableSchema)(fields, Object.assign({
            idFieldName: objectSchema.idFieldName,
            labelFieldName: objectSchema.NAME_FIELD_KEY || "name"
        }, options));
        delete table.mode;
        body = Object.assign({}, table, {
            type: "crud",
            primaryField: "_id",
            id: id,
            name: id,
            keepItemSelectionOnPageChange: true,
            api: await (0,fields_table.getTableApi)(objectSchema, fields, options)
        }, bodyProps);
    }
    return {
        type: "service",
        bodyClassName: "",
        name: `page`,
        data: {
            context: {
                rootUrl: (0,steedos_client/* getRootUrl */.N0)(),
                tenantId: (0,steedos_client/* getTenantId */.jM)(),
                authToken: (0,steedos_client/* getAuthToken */.bW)()
            }
        },
        body: body
    };
}
const getGlobalData = (mode)=>{
    const user = (0,steedos_client/* getSteedosAuth */.Z0)();
    return {
        mode: mode,
        user: user,
        spaceId: user.spaceId,
        userId: user.userId
    };
};
async function getObjectForm(objectSchema, ctx) {
    const { recordId , tabId , appId  } = ctx;
    const fields = external_lodash_default().values(objectSchema.fields);
    return {
        type: "page",
        bodyClassName: "p-0",
        regions: [
            "body"
        ],
        name: `page_edit_${recordId}`,
        data: {
            global: getGlobalData("edit"),
            recordId: recordId,
            objectName: objectSchema.name,
            context: {
                rootUrl: (0,steedos_client/* getRootUrl */.N0)(),
                tenantId: (0,steedos_client/* getTenantId */.jM)(),
                authToken: (0,steedos_client/* getAuthToken */.bW)()
            }
        },
        initApi: null,
        initFetch: null,
        body: [
            {
                type: "form",
                mode: ctx.formFactor === "SMALL" ? "normal" : "horizontal",
                persistData: false,
                promptPageLeave: true,
                name: `form_edit_${recordId}`,
                debug: false,
                title: "",
                submitText: "",
                api: await getSaveApi(objectSchema, recordId, fields, {}),
                initApi: await getEditFormInitApi(objectSchema, recordId, fields),
                initFetch: recordId != "new",
                body: await getFormBody(fields, objectSchema, ctx),
                panelClassName: "m-0 sm:rounded-lg shadow-none",
                bodyClassName: "p-0",
                className: "p-4 sm:p-0 steedos-amis-form"
            }
        ]
    };
}
async function getObjectDetail(objectSchema, recordId, ctx) {
    const fields = external_lodash_default().values(objectSchema.fields);
    return {
        type: "service",
        name: `page_readonly_${recordId}`,
        id: `detail_${recordId}`,
        data: {
            global: getGlobalData("read"),
            context: {
                rootUrl: (0,steedos_client/* getRootUrl */.N0)(),
                tenantId: (0,steedos_client/* getTenantId */.jM)(),
                authToken: (0,steedos_client/* getAuthToken */.bW)()
            }
        },
        api: await getReadonlyFormInitApi(objectSchema, recordId, fields),
        body: [
            {
                type: "form",
                mode: ctx.formFactor === "SMALL" ? "normal" : "horizontal",
                persistData: false,
                promptPageLeave: false,
                name: `form_readonly_${recordId}`,
                debug: false,
                title: "",
                data: {
                    "formData": "$$"
                },
                wrapWithPanel: false,
                body: await getFormBody((0,external_lodash_.map)(fields, (field)=>{
                    field.readonly = true;
                }), objectSchema, ctx),
                className: "steedos-amis-form",
                actions: [] // 不显示表单默认的提交按钮
            }
        ]
    };
}

;// CONCATENATED MODULE: ./src/lib/objects.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-23 09:47:38
 * @Description:
 */ 



const objects_ = __webpack_require__(6517);
const UI_SCHEMA_CACHE = {};
const setUISchemaCache = (key, value)=>{
    UI_SCHEMA_CACHE[key] = value;
};
const getUISchemaCache = (key)=>{
    return objects_.cloneDeep(UI_SCHEMA_CACHE[key]);
};
const hasUISchemaCache = (key)=>{
    return objects_.has(UI_SCHEMA_CACHE, key);
};
const getListViewColumns = (listView, formFactor)=>{
    let listViewColumns = [];
    if (formFactor === "SMALL") {
        listViewColumns = !(0,external_lodash_.isEmpty)(listView.mobile_columns) ? listView.mobile_columns : (0,external_lodash_.slice)(listView.columns, 0, 4);
    } else {
        listViewColumns = listView.columns;
    }
    return listViewColumns;
};
async function getUISchema(objectName, force) {
    if (!objectName) {
        return;
    }
    if (hasUISchemaCache(objectName) && !force) {
        return getUISchemaCache(objectName);
    }
    const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
    let uiSchema = null;
    try {
        uiSchema = await (0,steedos_client/* fetchAPI */.Io)(url, {
            method: "get"
        });
        setUISchemaCache(objectName, uiSchema);
        for(const fieldName in uiSchema.fields){
            if (uiSchema.fields) {
                const field = uiSchema.fields[fieldName];
                if ((field.type === "lookup" || field.type === "master_detail") && field.reference_to) {
                    const refUiSchema = await getUISchema(field.reference_to);
                    if (!refUiSchema) {
                        delete uiSchema.fields[fieldName];
                    }
                }
            }
        }
        (0,external_lodash_.each)(uiSchema.list_views, (v, k)=>{
            v.name = k;
            if (!(0,external_lodash_.has)(v, "columns")) {
                v.columns = uiSchema.list_views.all.columns;
            }
        });
    } catch (error) {
        console.error(`getUISchema`, objectName, error);
        setUISchemaCache(objectName, null);
    }
    return getUISchemaCache(objectName);
}
async function getField(objectName, fieldName) {
    const uiSchema = await getUISchema(objectName);
    return uiSchema?.fields[fieldName];
}
// 获取表单页面
async function getFormSchema(objectName, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectForm(uiSchema, ctx);
    return {
        uiSchema,
        amisSchema
    };
}
// 获取只读页面
async function getViewSchema(objectName, recordId, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId, ctx);
    return {
        uiSchema,
        amisSchema
    };
}
// 获取列表视图
async function getListSchema(appName, objectName, listViewName, options = {}) {
    const uiSchema = await getUISchema(objectName);
    const listView = objects_.find(uiSchema.list_views, (listView, name)=>name === listViewName);
    if (!listView) {
        return {
            uiSchema
        };
    }
    let fields = uiSchema.fields;
    const listViewFields = [];
    let listViewColumns = getListViewColumns(listView, options.formFactor);
    if (listView && listViewColumns) {
        objects_.each(listViewColumns, function(column) {
            if (objects_.isString(column) && uiSchema.fields[column]) {
                listViewFields.push(uiSchema.fields[column]);
            } else if (objects_.isObject(column) && uiSchema.fields[column.field]) {
                listViewFields.push(Object.assign({}, uiSchema.fields[column.field], {
                    width: column.width,
                    wrap: column.wrap
                }));
            }
        });
    }
    if (listView && listView.extra_columns) {
        objects_.each(listView.extra_columns, function(column) {
            if (objects_.isString(column)) {
                listViewFields.push({
                    extra: true,
                    name: column
                });
            } else if (objects_.isObject(column)) {
                listViewFields.push({
                    extra: true,
                    name: column.field
                });
            }
        });
    }
    fields = listViewFields;
    const amisSchema = await getObjectList(uiSchema, fields, {
        tabId: objectName,
        appId: appName,
        objectName: objectName,
        ...options,
        filter: listView.filters
    });
    return {
        uiSchema,
        amisSchema
    };
}
// 获取所有相关表
async function getObjectRelateds(appName, objectName, recordId, formFactor) {
    const uiSchema = await getUISchema(objectName);
    const related = [];
    const details = [].concat(uiSchema.details || []);
    if (uiSchema.enable_files) {
        details.push(`cms_files.parent`);
    }
    for (const detail of details){
        const arr = detail.split(".");
        let filter = null;
        const refField = await getField(arr[0], arr[1]);
        if (refField._reference_to || refField.reference_to && !objects_.isString(refField.reference_to)) {
            filter = [
                [
                    `${arr[1]}/o`,
                    "=",
                    objectName
                ],
                [
                    `${arr[1]}/ids`,
                    "=",
                    recordId
                ], 
            ];
        } else {
            filter = [
                `${arr[1]}`,
                "=",
                recordId
            ];
        }
        related.push({
            masterObjectName: objectName,
            object_name: arr[0],
            foreign_key: arr[1],
            schema: await getListSchema(appName, arr[0], "all", {
                globalFilter: filter,
                formFactor: formFactor
            })
        });
    }
    return related;
}
// 获取单个相关表
async function getObjectRelated(appName, masterObjectName, objectName, relatedFieldName, recordId, formFactor) {
    let filter = null;
    const refField = await getField(objectName, relatedFieldName);
    if (refField._reference_to || refField.reference_to && !objects_.isString(refField.reference_to)) {
        filter = [
            [
                `${relatedFieldName}/o`,
                "=",
                masterObjectName
            ],
            [
                `${relatedFieldName}/ids`,
                "=",
                recordId
            ], 
        ];
    } else {
        filter = [
            `${relatedFieldName}`,
            "=",
            recordId
        ];
    }
    const masterObjectUISchema = await getUISchema(masterObjectName, formFactor);
    return {
        masterObjectName: masterObjectName,
        object_name: objectName,
        foreign_key: relatedFieldName,
        schema: await getListSchema(appName, objectName, "all", {
            globalFilter: filter,
            formFactor: formFactor
        }),
        record: await SteedosUI.Object.getRecord(masterObjectName, recordId, [
            masterObjectUISchema.NAME_FIELD_KEY, 
        ]),
        masterObjectUISchema: masterObjectUISchema
    };
}
async function getSearchableFieldsFilterSchema(fields) {
    const body = [];
    for (let field of fields){
        if (!objects_.includes([
            "grid",
            "avatar",
            "image",
            "object",
            "[object]",
            "[Object]",
            "[grid]",
            "[text]",
            "audio",
            "file", 
        ], field.type)) {
            delete field.defaultValue;
            delete field.required;
            delete field.is_wide;
            delete field.readonly;
            delete field.hidden;
            delete field.omit;
            const amisField = await (0,amis_fields.getFieldSearchable)(field, fields, {});
            if (amisField) {
                amisField.className = "min-w-[200px] pr-4 max-w-[350px] grow";
                body.push(amisField);
            }
        }
    }
    return {
        title: "",
        type: "form",
        name: "listview-filter-form",
        mode: "normal",
        wrapWithPanel: false,
        className: "flex flex-row w-full flex-wrap mb-3",
        body: body
    };
}


/***/ }),

/***/ 4056:
/***/ ((module) => {

module.exports = JSON.parse('{"type":"page","body":[{"type":"form","mode":"normal","persistData":false,"promptPageLeave":true,"name":"form","debug":false,"title":"","body":[{"label":"","type":"transfer","name":"fields","options":[],"id":"u:92c0b3cccca0","required":true,"placeholder":"-","source":{"method":"get","url":"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options","data":null,"requestAdaptor":"","adaptor":"","dataType":"json","headers":{"Authorization":"Bearer ${context.tenantId},${context.authToken}"}},"className":"col-span-2 m-0","checkAll":false,"searchable":true,"sortable":true,"joinValues":false,"extractValue":true}],"actions":[],"panelClassName":"m-0","bodyClassName":"p-4","className":"steedos-amis-form"}],"regions":["body"],"data":{},"bodyClassName":"p-0","name":"page","initApi":null,"initFetch":null}');

/***/ }),

/***/ 575:
/***/ ((module) => {

module.exports = JSON.parse('{"type":"page","title":"过滤器","name":"steedos-filters","body":[{"type":"form","title":"过滤器","body":[{"label":"","type":"condition-builder","name":"filters","description":"","id":"filters","source":{"method":"get","url":"${context.rootUrl}/service/api/amis-metadata-listviews/getFilterFields?objectName=${objectName}","dataType":"json","headers":{"Authorization":"Bearer ${context.tenantId},${context.authToken}"}},"disabled":false}],"id":"filtersForm","wrapWithPanel":false}],"regions":["body"],"data":{"recordId":"","initialValues":{},"appId":"builder","title":""}}');

/***/ })

};
;