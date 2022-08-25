"use strict";
(() => {
var exports = {};
exports.id = 303;
exports.ids = [303];
exports.modules = {

/***/ 8930:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ FromNow)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function FromNow({ date  }) {
    const { 0: timer , 1: setTimer  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
    const { 0: text , 1: setText  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const fromNow = (date)=>{
        return amisRequire("moment")(date).fromNow();
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (timer) {
            clearInterval(timer);
        }
        setText(fromNow(date));
        setTimer(setInterval(()=>{
            setText(fromNow(date));
        }, 1000 * 60));
    }, [
        date
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: text
    });
}


/***/ }),

/***/ 3840:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": () => (/* binding */ RelatedLink)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6820);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-09 11:09:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-20 17:49:19
 * @Description:
 */ 


const RelatedLink = ({ schema , object_name , foreign_key , app_id , record_id , masterObjectName , recordCount , formFactor  })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
        href: _components_functions__WEBPACK_IMPORTED_MODULE_3__/* .SteedosUI.Router.getObjectRelatedViewPath */ .h.Router.getObjectRelatedViewPath({
            formFactor,
            appId: app_id,
            masterObjectName: masterObjectName,
            masterRecordId: record_id,
            objectName: object_name,
            foreignKey: foreign_key
        }),
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "slds-grid slds-page-header rounded-none p-2 bg-white border-0 shadow-none",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("header", {
                    className: "slds-media slds-media--center slds-has-flexi-truncate",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            "aria-hidden": "true",
                            className: "slds-media__figure stencil slds-avatar slds-avatar_small",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                //  style={{backgroundColor: "#3c97dd"}}
                                className: "extraSmall forceEntityIcon",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: `uiImage slds-icon_container slds-icon-standard-${schema.uiSchema.icon?.replaceAll("_", "-")}`,
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                        className: "slds-icon slds-page-header__icon",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                            xlinkHref: `/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`
                                        })
                                    })
                                })
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "slds-media__body",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                className: "slds-card__header-title",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                    className: "slds-card__header-link baseCard__header-title-container font-normal",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                className: "slds-truncate slds-m-right--xx-small",
                                                children: schema.uiSchema.label
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                className: "slds-shrink-none slds-m-right--xx-small",
                                                children: [
                                                    "(",
                                                    recordCount,
                                                    ")"
                                                ]
                                            })
                                        ]
                                    })
                                })
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-no-flex",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "slds-icon_container null slds-icon__svg--default",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                            className: "slds-icon slds-icon-text-default slds-icon_x-small",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#chevronright"
                            })
                        })
                    })
                })
            ]
        })
    });
};


/***/ }),

/***/ 1264:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": () => (/* binding */ RelatedsLink)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_FromNow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8930);
/* harmony import */ var _components_object_RecordRelatedListButtons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5125);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1185);
/* harmony import */ var _components_object_RelatedLink__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3840);
/* harmony import */ var _lib_record__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(237);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_6__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_6__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 15:23:18
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-20 17:48:49
 * @Description: 
 */ 







const RelatedsLink = ({ app_id , record_id , relateds , formFactor  })=>{
    const { 0: relatedsQueryInfo , 1: setRelatedsQueryInfo  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        (0,_lib_record__WEBPACK_IMPORTED_MODULE_8__/* .getRelatedsCount */ .r)(record_id, relateds).then((res)=>{
            setRelatedsQueryInfo(res);
        });
    }, [
        record_id,
        relateds
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "divide-y",
        children: relateds?.map((related)=>{
            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_RelatedLink__WEBPACK_IMPORTED_MODULE_7__/* .RelatedLink */ .l, {
                ...related,
                app_id: app_id,
                record_id: record_id,
                formFactor: formFactor,
                recordCount: relatedsQueryInfo[related.object_name]
            });
        })
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1975:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Record),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5152);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6859);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lib_objects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6195);
/* harmony import */ var _components_AmisRender__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1095);
/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2113);
/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_auth_next__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _pages_api_auth_nextauth___WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6295);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1185);
/* harmony import */ var _components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2917);
/* harmony import */ var _components_mobile_object_RecordHeader__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(8985);
/* harmony import */ var _components_object_RelatedsLink__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(1264);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_9__, _components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__, _components_mobile_object_RecordHeader__WEBPACK_IMPORTED_MODULE_11__, _components_object_RelatedsLink__WEBPACK_IMPORTED_MODULE_12__]);
([_headlessui_react__WEBPACK_IMPORTED_MODULE_9__, _components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__, _components_mobile_object_RecordHeader__WEBPACK_IMPORTED_MODULE_11__, _components_object_RelatedsLink__WEBPACK_IMPORTED_MODULE_12__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-22 17:40:03
 * @Description:
 */ 











function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
function Record({ formFactor  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const { app_id , tab_id , record_id  } = router.query;
    const { 0: isEditing , 1: setIsEditing  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const { 0: schema , 1: setSchema  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    const { 0: relateds , 1: setRelateds  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    const doEditing = ()=>{
        if (!formFactor) {
            return;
        }
        editRecord(tab_id, record_id, formFactor);
    };
    const doReadonly = ()=>{
        if (!formFactor) {
            return;
        }
        viewRecord(tab_id, record_id, formFactor);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        doReadonly();
    }, [
        router
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        if (isEditing) {
            doEditing();
        } else {
            doReadonly();
        }
    }, [
        formFactor
    ]);
    const viewRecord = (tab_id, record_id, formFactor)=>{
        if (tab_id && record_id) {
            const p1 = (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getObjectRelateds */ .ke)(app_id, tab_id, record_id, formFactor);
            const p2 = (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getViewSchema */ .DM)(tab_id, record_id, {
                recordId: record_id,
                tabId: tab_id,
                appId: app_id,
                formFactor: formFactor
            });
            Promise.all([
                p1,
                p2
            ]).then((values)=>{
                setRelateds(values[0]);
                const schema = values[1];
                setSchema(schema);
                setIsEditing(false);
            });
        }
    };
    const editRecord = (tab_id, record_id, formFactor)=>{
        if (tab_id && record_id) {
            (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getFormSchema */ .KR)(tab_id, {
                recordId: record_id,
                tabId: tab_id,
                appId: app_id,
                formFactor: formFactor
            }).then((data)=>{
                setSchema(data);
                setIsEditing(true);
            });
        }
    };
    const getTabs = ()=>{
        const tabs = [
            {
                label: "\u8BE6\u60C5",
                name: "detail",
                component: ()=>{
                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: schema?.amisSchema && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_6__/* .AmisRender */ .k, {
                            id: SteedosUI.getRefId({
                                type: "detail",
                                appId: app_id,
                                name: schema.uiSchema.name
                            }),
                            schema: schema?.amisSchema || {},
                            router: router
                        })
                    });
                }
            }, 
        ];
        if (relateds && relateds.length > 0) {
            tabs.push({
                label: "\u76F8\u5173",
                name: "relateds",
                component: ()=>{
                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_RelatedsLink__WEBPACK_IMPORTED_MODULE_12__/* .RelatedsLink */ .R, {
                            app_id: app_id,
                            record_id: record_id,
                            relateds: relateds,
                            formFactor: formFactor
                        })
                    });
                }
            });
        }
        return tabs;
    };
    const Header = formFactor === "SMALL" ? _components_mobile_object_RecordHeader__WEBPACK_IMPORTED_MODULE_11__/* .RecordHeader */ .b : _components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__/* .RecordHeader */ .b;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "slds-grid slds-wrap",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "slds-col slds-size_1-of-1 row region-header bg-slate-50",
                children: schema && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                    schema: schema,
                    formFactor: formFactor
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "slds-col slds-size_1-of-1 row region-main",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "z-9 relative shadow-none border-none",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Group, {
                        vertical: true,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.List, {
                                className: "pl-4 flex space-x-1 border-b bg-slate-50",
                                children: getTabs().map((item)=>{
                                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab, {
                                        className: ({ selected  })=>classNames("px-10", selected ? "border-b-2 border-sky-500 text-black" : "text-current"),
                                        children: item.label
                                    }, item.name);
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Panels, {
                                className: "flex-1 p-4 overflow-y-auto ",
                                children: getTabs().map((item)=>{
                                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Panel, {
                                        className: classNames("bg-white shadow-none", "p-2"),
                                        children: item.component()
                                    }, item.name);
                                })
                            })
                        ]
                    })
                })
            })
        ]
    });
};
async function getServerSideProps(context) {
    const session = context.req.session || await (0,next_auth_next__WEBPACK_IMPORTED_MODULE_7__.unstable_getServerSession)(context.req, context.res, _pages_api_auth_nextauth___WEBPACK_IMPORTED_MODULE_8__/* .authOptions */ .L);
    if (!session) {
        return {
            redirect: {
                destination: "/login?callbackUrl=/app",
                permanent: false
            }
        };
    }
    return {
        props: {}
    };
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5725:
/***/ ((module) => {

module.exports = require("antd");

/***/ }),

/***/ 2167:
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ 9344:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 6517:
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ 3227:
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ 2113:
/***/ ((module) => {

module.exports = require("next-auth/next");

/***/ }),

/***/ 7449:
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ 4899:
/***/ ((module) => {

module.exports = require("next-auth/providers/keycloak");

/***/ }),

/***/ 4140:
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 9716:
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 6368:
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 3280:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 6724:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 2796:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ 8743:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 5832:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/loadable.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4406:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/page-path/denormalize-page-path.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 299:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-next-pathname-info.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 5789:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-next-pathname-info.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 4567:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/path-has-prefix.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 7849:
/***/ ((module) => {

module.exports = require("react-dom/client");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 1185:
/***/ ((module) => {

module.exports = import("@headlessui/react");;

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [952,859,152,664,282,295,95,397,767,125,384], () => (__webpack_exec__(1975)));
module.exports = __webpack_exports__;

})();