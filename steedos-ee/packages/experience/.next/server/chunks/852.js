"use strict";
exports.id = 852;
exports.ids = [852];
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

/***/ 1223:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "g": () => (/* binding */ ListButtons)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_buttons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4413);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_object_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2767);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-25 17:26:03
 * @Description: 
 */ 





function ListButtons(props) {
    const { app_id , tab_id , schema , formFactor  } = props;
    const { 0: buttons , 1: setButtons  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        if (schema && schema.uiSchema) {
            setButtons((0,_lib_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getListViewButtons */ .Iv)(schema.uiSchema, {
                app_id: app_id,
                tab_id: tab_id,
                router: router
            }));
        }
    }, [
        schema
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: schema?.uiSchema && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
            children: [
                schema?.uiSchema?.permissions?.allowCreate && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                    onClick: (event)=>{
                        const listViewId = SteedosUI.getRefId({
                            type: "listview",
                            appId: app_id,
                            name: schema?.uiSchema?.name
                        });
                        _lib_buttons__WEBPACK_IMPORTED_MODULE_1__/* .standardButtonsTodo.standard_new.call */ .QU.standard_new.call({}, event, {
                            listViewId,
                            appId: app_id,
                            uiSchema: schema.uiSchema,
                            formFactor: formFactor,
                            router: router
                        });
                    },
                    className: "antd-Button antd-Button--default",
                    children: "\u65B0\u5EFA"
                }),
                buttons?.map((button)=>{
                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_Button__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .z, {
                        button: button,
                        data: {
                            app_id: app_id,
                            tab_id: tab_id,
                            object_name: schema.uiSchema.name,
                            dataComponentId: SteedosUI.getRefId({
                                type: "listview",
                                appId: app_id,
                                name: schema.uiSchema.name
                            })
                        },
                        scopeClassName: "inline-block"
                    }, button.name);
                }),
                schema?.uiSchema?.permissions?.allowDelete && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                    onClick: (event)=>{
                        const listViewId = SteedosUI.getRefId({
                            type: "listview",
                            appId: app_id,
                            name: schema?.uiSchema?.name
                        });
                        _lib_buttons__WEBPACK_IMPORTED_MODULE_1__/* .standardButtonsTodo.batch_delete.call */ .QU.batch_delete.call({}, event, {
                            listViewId,
                            uiSchema: schema.uiSchema
                        });
                    },
                    className: "antd-Button antd-Button--default",
                    children: "\u5220\u9664"
                })
            ]
        })
    });
}


/***/ }),

/***/ 3852:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": () => (/* binding */ ListviewHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1185);
/* harmony import */ var _heroicons_react_solid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1143);
/* harmony import */ var _heroicons_react_solid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_heroicons_react_solid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_object_ListButtons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1223);
/* harmony import */ var _components_FromNow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8930);
/* harmony import */ var _components_object_SearchableFieldsFilter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9825);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_1__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-03 16:46:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-19 11:03:27
 * @Description:
 */ 







function ListviewHeader({ schema , onListviewChange , formFactor  }) {
    //   const [selectedListView, setSelectedListView] = useState();
    const { 0: showFieldsFilter , 1: setShowFieldsFilter  } = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
    const { 0: queryInfo , 1: setQueryInfo  } = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)();
    const { 0: filter , 1: setFilter  } = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)();
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const { app_id , tab_id , listview_id  } = router.query;
    const selectedListView = schema.uiSchema.list_views[listview_id];
    const listViewId = SteedosUI.getRefId({
        type: "listview",
        appId: app_id,
        name: schema?.uiSchema?.name
    });
    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(()=>{
        if (schema) {
            window.addEventListener("message", (event)=>{
                const { data  } = event;
                if (data.type === "listview.loaded") {
                    if (schema) {
                        setTimeout(()=>{
                            if (SteedosUI.getRef(listViewId) && SteedosUI.getRef(listViewId).getComponentByName) {
                                const listViewRef = SteedosUI.getRef(listViewId).getComponentByName(`page.listview_${schema.uiSchema.name}`);
                                setQueryInfo({
                                    count: listViewRef.props.data.count,
                                    dataUpdatedAt: listViewRef.props.dataUpdatedAt
                                });
                            }
                        }, 300);
                    }
                }
            });
        //   if (!selectedListView) {
        //     setSelectedListView(schema.uiSchema.list_views[listview_id]);
        //   }
        }
    }, [
        schema
    ]);
    const refreshList = (e)=>{
        SteedosUI.getRef(listViewId).getComponentByName(`page.listview_${schema.uiSchema.name}`).handleAction({}, {
            actionType: "reload"
        });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(()=>{
        if (!(0,lodash__WEBPACK_IMPORTED_MODULE_3__.isEmpty)(listview_id) && (0,lodash__WEBPACK_IMPORTED_MODULE_3__.isFunction)(onListviewChange)) {
            setFilter(null);
            onListviewChange(selectedListView);
        }
    }, [
        listview_id
    ]);
    const showFilter = ()=>{
        SteedosUI.ListView.showFilter(schema.uiSchema.name, {
            listView: selectedListView,
            data: {
                filters: SteedosUI.ListView.getVisibleFilter(selectedListView, filter)
            },
            onFilterChange: (filter)=>{
                const scope = SteedosUI.getRef(listViewId);
                // amis updateProps 的 callback 2.1.0版本存在不执行的bug ,先通过延迟刷新.
                scope.updateProps({
                    data: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.defaultsDeep)({
                        filter: SteedosUI.ListView.getQueryFilter(selectedListView, filter)
                    }, schema.amisSchema.data)
                }, ()=>{
                    refreshList();
                    setFilter(filter);
                });
                setTimeout(()=>{
                    refreshList();
                    setFilter(filter);
                }, 300);
            }
        });
    };
    const filterToggler = ()=>{
        // if(!showFieldsFilter){
        //     setShowFieldsFilter(true)
        // }
        setShowFieldsFilter(!showFieldsFilter);
    };
    const onChange = (value)=>{
        router.push(`/app/${app_id}/${tab_id}/grid/${value.name}`);
    // setSelectedListView
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "slds-page-header bg-slate-50 shadow-none rounded-none border-none",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
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
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        children: schema?.uiSchema?.label
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Listbox, {
                                                        value: selectedListView,
                                                        onChange: onChange,
                                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                            className: "relative w-[1/2]",
                                                            children: [
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Listbox.Button, {
                                                                    className: "relative w-full cursor-default pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                            className: "slds-page-header__title slds-truncate",
                                                                            children: selectedListView?.label || schema?.uiSchema?.list_views.all?.label
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                            className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2",
                                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_solid__WEBPACK_IMPORTED_MODULE_2__.SelectorIcon, {
                                                                                className: "h-5 w-5 text-gray-400",
                                                                                "aria-hidden": "true"
                                                                            })
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Transition, {
                                                                    as: react__WEBPACK_IMPORTED_MODULE_5__.Fragment,
                                                                    leave: "transition ease-in duration-100",
                                                                    leaveFrom: "opacity-100",
                                                                    leaveTo: "opacity-0",
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Listbox.Options, {
                                                                        className: "absolute z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                                                                        children: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.values)(schema?.uiSchema?.list_views).map((listView, personIdx)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Listbox.Option, {
                                                                                value: listView,
                                                                                className: ({ active  })=>`relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-sky-100 text-sky-900" : "text-gray-900"}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                                        className: `block truncate ${(selectedListView?.name ? selectedListView.name : "all") === listView.name ? "font-medium" : "font-normal"}`,
                                                                                        children: listView.label
                                                                                    }),
                                                                                    (selectedListView?.name ? selectedListView.name : "all") === listView.name ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                                        className: "absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600",
                                                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_solid__WEBPACK_IMPORTED_MODULE_2__.CheckIcon, {
                                                                                            className: "h-5 w-5",
                                                                                            "aria-hidden": "true"
                                                                                        })
                                                                                    }) : null
                                                                                ]
                                                                            }, personIdx))
                                                                    })
                                                                })
                                                            ]
                                                        })
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
                                className: "slds-page-header__control space-x-1",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_ListButtons__WEBPACK_IMPORTED_MODULE_6__/* .ListButtons */ .g, {
                                    app_id: app_id,
                                    tab_id: tab_id,
                                    schema: schema,
                                    formFactor: formFactor
                                })
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "slds-page-header__row",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "slds-page-header__col-meta",
                        children: queryInfo && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                            className: "slds-page-header__meta-text mb-0",
                            children: [
                                queryInfo.count,
                                " \u9879 \u2022",
                                " ",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_FromNow__WEBPACK_IMPORTED_MODULE_7__/* .FromNow */ .L, {
                                    date: queryInfo.dataUpdatedAt
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "slds-page-header__col-controls",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "slds-page-header__controls",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-page-header__control",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                        onClick: filterToggler,
                                        className: "slds-button slds-button_icon slds-button_icon-border-filled",
                                        title: "Quick Search",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                className: "slds-button__icon",
                                                "aria-hidden": "true",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                    xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#search"
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                className: "slds-assistive-text",
                                                children: "Quick Search"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-page-header__control",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                        className: "slds-button slds-button_icon slds-button_icon-border-filled",
                                        title: "Refresh List",
                                        onClick: refreshList,
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                className: "slds-button__icon",
                                                "aria-hidden": "true",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                    xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#refresh"
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                className: "slds-assistive-text",
                                                children: "Refresh List"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-page-header__control",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                        className: "slds-button-group-list mb-0",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                                className: "slds-button slds-button_icon slds-button_icon-border-filled",
                                                onClick: showFilter,
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                        className: "slds-button__icon",
                                                        "aria-hidden": "true",
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                            xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#filterList"
                                                        })
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "slds-assistive-text",
                                                        children: "\u8FC7\u6EE4\u5668"
                                                    }),
                                                    !(0,lodash__WEBPACK_IMPORTED_MODULE_3__.isEmpty)(filter) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "slds-notification-badge slds-incoming-notification slds-show-notification min-h-[0.5rem] min-w-[0.5rem]"
                                                    })
                                                ]
                                            })
                                        })
                                    })
                                })
                            ]
                        })
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Transition, {
                as: react__WEBPACK_IMPORTED_MODULE_5__.Fragment,
                show: showFieldsFilter,
                leave: "transition ease-in duration-100",
                leaveFrom: "opacity-100",
                leaveTo: "opacity-0",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "w-full",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_SearchableFieldsFilter__WEBPACK_IMPORTED_MODULE_8__/* .SearchableFieldsFilter */ .c, {
                        schema: schema,
                        listViewId: listViewId,
                        onClose: ()=>{
                            if (showFieldsFilter) {
                                const scope = SteedosUI.getRef(listViewId);
                                scope.getComponentByName(`page.listview_${schema.uiSchema.name}`).handleFilterReset();
                                setShowFieldsFilter(false);
                            }
                        }
                    })
                })
            })
        ]
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9825:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": () => (/* binding */ SearchableFieldsFilter)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_AmisRender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1095);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lib_objects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6195);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 15:46:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-08 15:55:16
 * @Description:
 */ 




function SearchableFieldsFilter({ schema , listViewId , appId , onClose  }) {
    const { 0: searchableFields , 1: setSearchableFields  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)((0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)((0,lodash__WEBPACK_IMPORTED_MODULE_4__.filter)((0,lodash__WEBPACK_IMPORTED_MODULE_4__.values)(schema.uiSchema.fields), (field)=>{
        return field.searchable;
    }), "name"));
    const { 0: searchableFieldsSchema , 1: setSearchableFieldsSchema  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)();
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        if (!(0,lodash__WEBPACK_IMPORTED_MODULE_4__.isEmpty)(searchableFields)) {
            //   const scope = SteedosUI.getRef(listViewId);
            // scope.getComponentByName(`page.listview_${schema.uiSchema.name}`).handleFilterReset();
            (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getSearchableFieldsFilterSchema */ .mp)((0,lodash__WEBPACK_IMPORTED_MODULE_4__.sortBy)((0,lodash__WEBPACK_IMPORTED_MODULE_4__.compact)((0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(searchableFields, (fieldName)=>{
                return schema.uiSchema.fields[fieldName];
            })), "sort_no")).then((data)=>{
                setSearchableFieldsSchema(data);
            });
        }
    }, [
        searchableFields
    ]);
    const onSearch = (e)=>{
        const scope = SteedosUI.getRef(SteedosUI.getRefId({
            type: "fieldsSearch",
            appId: appId,
            name: schema.uiSchema.name
        }));
        const formValues = scope.getComponentByName("listview-filter-form").getValues();
        SteedosUI.getRef(listViewId).getComponentByName(`page.listview_${schema.uiSchema.name}`).handleFilterSubmit(formValues);
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "mt-4 border-gray slds-grid slds-grid_vertical slds-nowrap ",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "slds-filters",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-filters__body p-0",
                    children: searchableFieldsSchema && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_1__/* .AmisRender */ .k, {
                        id: SteedosUI.getRefId({
                            type: "fieldsSearch",
                            appId: appId,
                            name: schema.uiSchema.name
                        }),
                        schema: searchableFieldsSchema,
                        router: router
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-filters__footer slds-grid slds-shrink-none flex justify-between p-0",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "space-x-4",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                className: "slds-button slds-button_neutral",
                                type: "button",
                                onClick: onSearch,
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                        className: "slds-button__icon slds-button__icon_left",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                            xlinkHref: `/assets/icons/utility-sprite/svg/symbols.svg#search`
                                        })
                                    }),
                                    "\u641C\u7D22"
                                ]
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                className: "slds-button_reset slds-text-link slds-col_bump-left",
                                type: "button",
                                onClick: ()=>{
                                    return SteedosUI.Field.showFieldsTransfer(schema.uiSchema.name, {
                                        fields: searchableFields
                                    }, (values)=>{
                                        setSearchableFields(values.fields);
                                    }, ()=>{
                                    // console.log(`取消操作!!!`)
                                    });
                                },
                                children: "\u8BBE\u7F6E\u641C\u7D22\u9879"
                            })
                        ]
                    })
                })
            ]
        })
    });
}


/***/ })

};
;