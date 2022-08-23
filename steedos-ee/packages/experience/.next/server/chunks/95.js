"use strict";
exports.id = 95;
exports.ids = [95];
exports.modules = {

/***/ 1095:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ AmisRender)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_amis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9345);
/* harmony import */ var _lib_steedos_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8282);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-23 15:52:51
 * @Description: 
 */ 




const AmisRender = ({ id , schema , data , router , className ,  })=>{
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const steedosAuth = (0,_lib_steedos_client__WEBPACK_IMPORTED_MODULE_3__/* .getSteedosAuth */ .Z0)();
        const defData = (0,lodash__WEBPACK_IMPORTED_MODULE_4__.defaultsDeep)({}, data, {
            data: {
                context: {
                    rootUrl: (0,_lib_steedos_client__WEBPACK_IMPORTED_MODULE_3__/* .getRootUrl */ .N0)(),
                    userId: steedosAuth.userId,
                    tenantId: steedosAuth.spaceId,
                    authToken: steedosAuth.token
                }
            }
        });
        // 如果已存在,则先销毁, 再创建新实例
        if (SteedosUI.refs[id]) {
            try {
                SteedosUI.refs[id].unmount();
            } catch (error) {
                console.error(`error`, id);
            }
        }
        SteedosUI.refs[id] = (0,_lib_amis__WEBPACK_IMPORTED_MODULE_2__/* .amisRender */ .Ac)(`#${id}`, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.defaultsDeep)(defData, schema), data, {}, {
            router: router
        });
    }, [
        schema
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        id: `${id}`,
        className: `app-wrapper ${className}`,
        onClick: (e)=>{
            return (0,_lib_amis__WEBPACK_IMPORTED_MODULE_2__/* .amisRootClick */ .oo)(router, e);
        }
    });
};


/***/ }),

/***/ 9345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ac": () => (/* binding */ amisRender),
/* harmony export */   "oo": () => (/* binding */ amisRootClick)
/* harmony export */ });
/* unused harmony export getEvn */
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5725);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_0__);
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 11:31:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-23 15:53:07
 * @Description:
 */ 
const normalizeLink = (to, location = window.location)=>{
    to = to || "";
    if (to && to[0] === "#") {
        to = location.pathname + location.search + to;
    } else if (to && to[0] === "?") {
        to = location.pathname + to;
    }
    const idx = to.indexOf("?");
    const idx2 = to.indexOf("#");
    let pathname = ~idx ? to.substring(0, idx) : ~idx2 ? to.substring(0, idx2) : to;
    let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : "";
    let hash = ~idx2 ? to.substring(idx2) : location.hash;
    if (!pathname) {
        pathname = location.pathname;
    } else if (pathname[0] != "/" && !/^https?\:\/\//.test(pathname)) {
        let relativeBase = location.pathname;
        const paths = relativeBase.split("/");
        paths.pop();
        let m;
        while(m = /^\.\.?\//.exec(pathname)){
            if (m[0] === "../") {
                paths.pop();
            }
            pathname = pathname.substring(m[0].length);
        }
        pathname = paths.concat(pathname).join("/");
    }
    return pathname + search + hash;
};
const amisRootClick = (router, e)=>{
    if (e.target.nodeName.toLocaleLowerCase() === "a" && e.target.href) {
        e.preventDefault();
        router.push(e.target.href);
    }
};
const getEvn = (router)=>{
    return {
        theme: "antd",
        notify: (type, msg)=>{
            var ref;
            if ((ref = msg.props) === null || ref === void 0 ? void 0 : ref.schema.tpl) {
                var ref1;
                SteedosUI.message[type]((ref1 = msg.props) === null || ref1 === void 0 ? void 0 : ref1.schema.tpl);
            } else if (typeof msg == "string") {
                SteedosUI.message[type](msg);
            } else {
                console.warn("notify", type, msg);
            }
        },
        confirm: (msg)=>{
            return new Promise((resolve, reject)=>{
                SteedosUI.Modal.confirm({
                    title: msg,
                    onOk: ()=>{
                        resolve();
                    },
                    okText: "\u786E\u8BA4",
                    cancelText: "\u53D6\u6D88"
                });
            });
        },
        jumpTo: (to, action)=>{
            if (to === "goBack") {
                return window.history.back();
            }
            to = normalizeLink(to);
            if (action && action.actionType === "url") {
                action.blank === false ? router.push(to) : window.open(to);
                return;
            }
            // 主要是支持 nav 中的跳转
            if (action && to && action.target) {
                window.open(to, action.target);
                return;
            }
            if (/^https?:\/\//.test(to)) {
                window.location.replace(to);
            } else {
                router.push(to);
            }
        }
    };
};
const amisRender = (root, schema, data = {}, env = {}, options)=>{
    let amis = amisRequire("amis/embed");
    const { router  } = options;
    return amis.embed(root, schema, data, Object.assign(getEvn(router), env));
};


/***/ })

};
;