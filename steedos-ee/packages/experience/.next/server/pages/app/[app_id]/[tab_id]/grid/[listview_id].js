"use strict";
(() => {
var exports = {};
exports.id = 459;
exports.ids = [459];
exports.modules = {

/***/ 6568:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Page),
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
/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2113);
/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_auth_next__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_AmisRender__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1095);
/* harmony import */ var _pages_api_auth_nextauth___WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6295);
/* harmony import */ var _components_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3852);
/* harmony import */ var _components_Loading__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(9597);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_9__]);
_components_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_9__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 15:31:41
 * @Description: 
 */ 









function Page({ formFactor  }) {
    var ref;
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const { app_id , tab_id  } = router.query;
    const { 0: schema , 1: setSchema  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)();
    const listViewId = SteedosUI.getRefId({
        type: "listview",
        appId: app_id,
        name: schema === null || schema === void 0 ? void 0 : (ref = schema.uiSchema) === null || ref === void 0 ? void 0 : ref.name
    });
    const getListviewSchema = (listviewName)=>{
        (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getListSchema */ .$R)(app_id, tab_id, listviewName, {
            formFactor: formFactor
        }).then((data)=>{
            setSchema(data);
        });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        if (!tab_id || !formFactor) return;
        getListviewSchema(undefined);
    }, [
        tab_id,
        formFactor
    ]);
    if (!schema) return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_Loading__WEBPACK_IMPORTED_MODULE_10__/* .Loading */ .g, {})
    });
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "flex flex-col flex-1 overflow-hidden",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "border-b",
                children: formFactor && (schema === null || schema === void 0 ? void 0 : schema.uiSchema.name) === tab_id && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_9__/* .ListviewHeader */ .z, {
                    formFactor: formFactor,
                    schema: schema,
                    onListviewChange: (listView)=>{
                        getListviewSchema(listView === null || listView === void 0 ? void 0 : listView.name);
                    }
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "flex-1 min-h-0 overflow-y-auto",
                children: (schema === null || schema === void 0 ? void 0 : schema.amisSchema) && (schema === null || schema === void 0 ? void 0 : schema.uiSchema.name) === tab_id && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_7__/* .AmisRender */ .k, {
                    className: "steedos-listview",
                    id: listViewId,
                    schema: (schema === null || schema === void 0 ? void 0 : schema.amisSchema) || {},
                    router: router
                })
            })
        ]
    });
};
async function getServerSideProps(context) {
    const session = context.req.session || await (0,next_auth_next__WEBPACK_IMPORTED_MODULE_6__.unstable_getServerSession)(context.req, context.res, _pages_api_auth_nextauth___WEBPACK_IMPORTED_MODULE_8__/* .authOptions */ .L);
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

/***/ 1143:
/***/ ((module) => {

module.exports = require("@heroicons/react/solid");

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

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 5832:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/loadable.js");

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
var __webpack_exports__ = __webpack_require__.X(0, [952,859,152,282,295,95,397,767,852,597], () => (__webpack_exec__(6568)));
module.exports = __webpack_exports__;

})();