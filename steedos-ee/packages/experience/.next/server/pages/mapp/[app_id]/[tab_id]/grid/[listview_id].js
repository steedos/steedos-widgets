"use strict";
(() => {
var exports = {};
exports.id = 367;
exports.ids = [367];
exports.modules = {

/***/ 9794:
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
/* harmony import */ var _components_object_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2767);
/* harmony import */ var _components_FromNow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8930);
/* harmony import */ var _lib_buttons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(4413);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_1__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-03 16:46:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-25 17:11:15
 * @Description:
 */ 








function ListviewHeader({ schema , onListviewChange , formFactor  }) {
    //   const [selectedListView, setSelectedListView] = useState();
    const { 0: buttons , 1: setButtons  } = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(null);
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
            if (schema && schema.uiSchema) {
                setButtons((0,_lib_buttons__WEBPACK_IMPORTED_MODULE_8__/* .getListViewButtons */ .Iv)(schema.uiSchema, {
                    app_id: app_id,
                    tab_id: tab_id,
                    router: router
                }));
            }
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
            props: {
                width: "100%",
                style: {
                    width: "100%"
                }
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
        if (!showFieldsFilter) {
            setShowFieldsFilter(true);
        }
    };
    const onChange = (value)=>{
        router.push(SteedosUI.Router.getObjectListViewPath({
            formFactor,
            appId: app_id,
            objectName: tab_id,
            listViewName: value.name
        }));
    };
    const moreButtons = [
        {
            label: "\u65B0\u5EFA",
            name: "new",
            todo: (event)=>{
                const listViewId = SteedosUI.getRefId({
                    type: "listview",
                    appId: app_id,
                    name: schema?.uiSchema?.name
                });
                _lib_buttons__WEBPACK_IMPORTED_MODULE_8__/* .standardButtonsTodo.standard_new.call */ .QU.standard_new.call({}, event, {
                    listViewId,
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
        }
    ];
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "slds-page-header relative rounded-none",
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
                                            children: [
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
                                                                            className: ({ active  })=>`relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-sky-50 text-sky-900" : "text-gray-900"}`,
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
                                                }),
                                                queryInfo && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
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
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "slds-page-header__controls space-x-4",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-page-header__control",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                    className: "slds-icon slds-icon-text-default slds-icon_x-small",
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
                                            className: "slds-icon slds-icon-text-default slds-icon_x-small",
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
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Menu, {
                                as: "div",
                                className: "slds-dropdown-trigger slds-dropdown-trigger_click",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Menu.Button, {
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
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Transition, {
                                        as: react__WEBPACK_IMPORTED_MODULE_5__.Fragment,
                                        enter: "transition ease-out duration-100",
                                        enterFrom: "transform opacity-0 scale-95",
                                        enterTo: "transform opacity-100 scale-100",
                                        leave: "transition ease-in duration-75",
                                        leaveFrom: "transform opacity-100 scale-100",
                                        leaveTo: "transform opacity-0 scale-95",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Menu.Items, {
                                            className: "absolute right-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:rounded-[2px]",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "",
                                                children: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.concat)(moreButtons, buttons)?.map((button, index)=>{
                                                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Menu.Item, {
                                                        children: ({ active  })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_Button__WEBPACK_IMPORTED_MODULE_6__/* .Button */ .z, {
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
                })
            ]
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6143:
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
/* harmony import */ var _components_mobile_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(9794);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_9__, _components_mobile_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_10__]);
([_components_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_9__, _components_mobile_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 16:50:48
 * @Description: 
 */ 









function Page({ formFactor  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const { app_id , tab_id  } = router.query;
    const { 0: schema , 1: setSchema  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)();
    const listViewId = SteedosUI.getRefId({
        type: "listview",
        appId: app_id,
        name: schema?.uiSchema?.name
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
    const Header = formFactor === "SMALL" ? _components_mobile_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_10__/* .ListviewHeader */ .z : _components_object_ListviewHeader__WEBPACK_IMPORTED_MODULE_9__/* .ListviewHeader */ .z;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "slds-card slds-card_boundary slds-grid slds-grid--vertical shadow-none border-none",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "",
                children: formFactor && schema?.uiSchema.name === tab_id && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                    schema: schema,
                    onListviewChange: (listView)=>{
                        getListviewSchema(listView?.name);
                    },
                    formFactor: formFactor
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "",
                children: schema?.amisSchema && schema?.uiSchema.name === tab_id && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_7__/* .AmisRender */ .k, {
                    className: "steedos-listview",
                    id: listViewId,
                    schema: schema?.amisSchema || {},
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
var __webpack_exports__ = __webpack_require__.X(0, [952,859,152,282,295,95,397,767,852], () => (__webpack_exec__(6143)));
module.exports = __webpack_exports__;

})();