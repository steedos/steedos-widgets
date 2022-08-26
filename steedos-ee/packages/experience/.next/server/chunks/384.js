"use strict";
exports.id = 384;
exports.ids = [384];
exports.modules = {

/***/ 8985:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ RecordHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1185);
/* harmony import */ var _lib_buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4413);
/* harmony import */ var _components_object_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2767);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_3__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







function RecordHeader({ schema , formFactor , permissions  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const { app_id , tab_id , record_id  } = router.query;
    const { 0: record , 1: setRecord  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: moreButtons , 1: setMoreButtons  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const loadButtons = (schema)=>{
        let buttons = [];
        if (schema && schema.uiSchema) {
            if (permissions?.allowEdit) {
                buttons.push({
                    label: "\u7F16\u8F91",
                    name: "edit",
                    todo: (event)=>{
                        _lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .standardButtonsTodo.standard_edit.call */ .QU.standard_edit.call({}, event, {
                            recordId: record_id,
                            appId: app_id,
                            uiSchema: schema.uiSchema,
                            formFactor: formFactor,
                            router: router,
                            options: {
                                props: {
                                    width: "100%",
                                    style: {
                                        width: "100%"
                                    },
                                    bodyStyle: {
                                        padding: "0px",
                                        paddingTop: "0px"
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
        buttons = _.concat(buttons, (0,_lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .getObjectDetailButtons */ .vU)(schema.uiSchema, {
            app_id: app_id,
            tab_id: tab_id,
            router: router
        }));
        buttons = _.concat(buttons, (0,_lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .getObjectDetailMoreButtons */ .ud)(schema.uiSchema, {
            app_id: app_id,
            tab_id: tab_id,
            router: router
        }));
        setMoreButtons(buttons);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (schema) {
            loadButtons(schema);
            window.addEventListener("message", function(event) {
                const { data  } = event;
                if (data.type === "record.loaded") {
                    const { record  } = data;
                    setRecord(record);
                }
            });
        }
    }, [
        schema
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "slds-page-header slds-page-header_record-home shadow-none border-none bg-slate-50",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "slds-page-header__row",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-page-header__col-title",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "slds-media",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-media__figure",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: "slds-icon_container slds-icon-standard-opportunity",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                        className: "slds-icon slds-page-header__icon",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                            xlinkHref: `/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`
                                        })
                                    })
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-media__body",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-page-header__name",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "slds-page-header__name-title",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    children: schema?.uiSchema?.label
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "slds-page-header__title slds-truncate",
                                                    children: record ? record[schema?.uiSchema?.NAME_FIELD_KEY] : ""
                                                })
                                            ]
                                        })
                                    })
                                })
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-page-header__col-actions",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "slds-page-header__controls",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "slds-page-header__control",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                className: "slds-button-group-list",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                    children: moreButtons?.length > 0 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu, {
                                            as: "div",
                                            className: "slds-dropdown-trigger slds-dropdown-trigger_click",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Button, {
                                                        className: "border-0",
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                                className: "slds-icon slds-icon-text-default slds-icon_x-small",
                                                                "aria-hidden": "true",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                                    xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#threedots_vertical"
                                                                })
                                                            })
                                                        })
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Transition, {
                                                    as: react__WEBPACK_IMPORTED_MODULE_1__.Fragment,
                                                    enter: "transition ease-out duration-100",
                                                    enterFrom: "transform opacity-0 scale-95",
                                                    enterTo: "transform opacity-100 scale-100",
                                                    leave: "transition ease-in duration-75",
                                                    leaveFrom: "transform opacity-100 scale-100",
                                                    leaveTo: "transform opacity-0 scale-95",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Items, {
                                                        className: "absolute right-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:rounded-[2px]",
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            className: "",
                                                            children: moreButtons?.map((button, index)=>{
                                                                return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Item, {
                                                                    children: ({ active  })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_Button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                                                            button: button,
                                                                            inMore: true,
                                                                            data: {
                                                                                app_id: app_id,
                                                                                tab_id: tab_id,
                                                                                object_name: schema.uiSchema.name
                                                                            },
                                                                            className: `${active ? "bg-violet-500 text-white" : "text-gray-900"} slds-dropdown__item group flex w-full items-center border-0 px-2 py-2`
                                                                        })
                                                                }, index);
                                                            })
                                                        })
                                                    })
                                                })
                                            ]
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            ]
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2917:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ RecordHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1185);
/* harmony import */ var _lib_buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4413);
/* harmony import */ var _components_object_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2767);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_3__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







function RecordHeader({ schema , formFactor , permissions  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const { app_id , tab_id , record_id  } = router.query;
    const { 0: record , 1: setRecord  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: buttons , 1: setButtons  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: moreButtons , 1: setMoreButtons  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const loadButtons = (schema)=>{
        if (schema && schema.uiSchema) {
            setButtons((0,_lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .getObjectDetailButtons */ .vU)(schema.uiSchema, {
                app_id: app_id,
                tab_id: tab_id,
                router: router
            }));
            setMoreButtons((0,_lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .getObjectDetailMoreButtons */ .ud)(schema.uiSchema, {
                app_id: app_id,
                tab_id: tab_id,
                router: router
            }));
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (schema) {
            loadButtons(schema);
            window.addEventListener("message", function(event) {
                const { data  } = event;
                if (data.type === "record.loaded") {
                    const { record  } = data;
                    setRecord(record);
                }
            });
        }
    }, [
        schema
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "slds-page-header slds-page-header_record-home bg-transparent shadow-none border-none pb-0",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "slds-page-header__row",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-page-header__col-title",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "slds-media",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-media__figure",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: "slds-icon_container slds-icon-standard-opportunity",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                        className: "slds-icon slds-page-header__icon",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                            xlinkHref: `/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`
                                        })
                                    })
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-media__body",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-page-header__name",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "slds-page-header__name-title",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    children: schema?.uiSchema?.label
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "slds-page-header__title slds-truncate",
                                                    children: record ? record[schema?.uiSchema?.NAME_FIELD_KEY] : ""
                                                })
                                            ]
                                        })
                                    })
                                })
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-page-header__col-actions",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "slds-page-header__controls",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "slds-page-header__control space-x-1",
                            children: [
                                permissions?.allowEdit && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: (event)=>{
                                        _lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .standardButtonsTodo.standard_edit.call */ .QU.standard_edit.call({}, event, {
                                            recordId: record_id,
                                            appId: app_id,
                                            uiSchema: schema.uiSchema,
                                            formFactor: formFactor,
                                            router: router
                                        });
                                    },
                                    className: "antd-Button antd-Button--default",
                                    children: "\u7F16\u8F91"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                    children: [
                                        buttons?.map((button)=>{
                                            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_Button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                                button: button,
                                                data: {
                                                    app_id: app_id,
                                                    tab_id: tab_id,
                                                    object_name: schema.uiSchema.name,
                                                    dataComponentId: `${app_id}-${tab_id}-${record_id}`
                                                },
                                                scopeClassName: "inline-block"
                                            }, button.name);
                                        }),
                                        moreButtons?.length > 0 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu, {
                                            as: "div",
                                            className: "slds-dropdown-trigger slds-dropdown-trigger_click",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Button, {
                                                        className: "slds-button slds-button_icon-border-filled slds-button_last",
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                                focusable: "false",
                                                                "data-key": "down",
                                                                "aria-hidden": "true",
                                                                className: "slds-button__icon",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                                    xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#down"
                                                                })
                                                            })
                                                        })
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Transition, {
                                                    as: react__WEBPACK_IMPORTED_MODULE_1__.Fragment,
                                                    enter: "transition ease-out duration-100",
                                                    enterFrom: "transform opacity-0 scale-95",
                                                    enterTo: "transform opacity-100 scale-100",
                                                    leave: "transition ease-in duration-75",
                                                    leaveFrom: "transform opacity-100 scale-100",
                                                    leaveTo: "transform opacity-0 scale-95",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Items, {
                                                        className: "absolute right-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:rounded-[2px]",
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            className: "",
                                                            children: moreButtons.map((button, index)=>{
                                                                return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Item, {
                                                                    children: ({ active  })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_Button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                                                            button: button,
                                                                            inMore: true,
                                                                            data: {
                                                                                app_id: app_id,
                                                                                tab_id: tab_id,
                                                                                object_name: schema.uiSchema.name
                                                                            },
                                                                            className: `${active ? "bg-violet-500 text-white" : "text-gray-900"} slds-dropdown__item group flex w-full items-center border-0 px-2 py-2`
                                                                        })
                                                                }, index);
                                                            })
                                                        })
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    })
                })
            ]
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 237:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Q": () => (/* binding */ getRecordPermissions),
/* harmony export */   "r": () => (/* binding */ getRelatedsCount)
/* harmony export */ });
/* harmony import */ var _steedos_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8282);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


const getRelatedsCount = async (masterRecordId, relateds)=>{
    const relatedQuery = [];
    (0,lodash__WEBPACK_IMPORTED_MODULE_1__.each)(relateds, (relate)=>{
        relatedQuery.push(`${relate.object_name}: ${relate.object_name}__count(filters: [["${relate.foreign_key}","=","${masterRecordId}"]])`);
    });
    const query = `
    {
        ${relatedQuery.join(",")}
    }
    `;
    const result = await (0,_steedos_client__WEBPACK_IMPORTED_MODULE_0__/* .fetchAPI */ .Io)("/graphql", {
        method: "POST",
        body: JSON.stringify({
            query
        })
    });
    return result.data;
};
const getRecordPermissions = async (objectName, recordId)=>{
    const result = await (0,_steedos_client__WEBPACK_IMPORTED_MODULE_0__/* .fetchAPI */ .Io)(`/service/api/@${objectName}/recordPermissions/${recordId}`, {
        method: "GET"
    });
    console.log("result", result);
    return result;
};


/***/ })

};
;