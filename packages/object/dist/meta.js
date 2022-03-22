(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Meta = factory());
})(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var config$2 = {
        group: "华炎魔方",
        name: "steedos-provider",
        componentName: "SteedosProvider",
        title: "华炎魔方容器",
        docUrl: "",
        screenshot: "",
        icon: "fa-fw fa fa-square-o",
        npm: {
            package: "@steedos-widgets/steedos-object",
            version: "{{version}}",
            exportName: "SteedosProvider",
            main: "",
            destructuring: true,
            subName: ""
        },
        props: [
            {
                name: "rootUrl",
                propType: "string"
            },
        ],
        preview: {
            rootUrl: ""
        },
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        // settings for amis.
        amis: {}
    };
    var SteedosProvider = __assign(__assign({}, config$2), { snippets: [
            {
                title: config$2.title,
                screenshot: "",
                schema: {
                    componentName: config$2.name,
                    props: config$2.preview
                }
            }
        ], amis: {
            render: {
                type: config$2.name,
                usage: "renderer",
                weight: 1,
                framework: "react"
            },
            plugin: {
                rendererName: config$2.name,
                // $schema: '/schemas/UnkownSchema.json',
                name: config$2.title,
                description: config$2.title,
                tags: [config$2.group],
                order: -9999,
                icon: config$2.icon,
                scaffold: __assign({ type: config$2.name, label: config$2.title, name: config$2.name, body: [] }, config$2.preview),
                // 容器类组件必需字段
                regions: [
                    {
                        key: 'body',
                        label: '内容区'
                    },
                ],
                previewSchema: __assign({ type: config$2.name }, config$2.preview),
                panelTitle: "设置",
                panelControls: [
                    {
                        type: "text",
                        name: "rootUrl",
                        label: "标题"
                    },
                ]
            }
        } });

    var config$1 = {
        group: "华炎魔方",
        name: "steedos-object-form",
        componentName: "ObjectForm",
        title: "对象表单",
        docUrl: "",
        screenshot: "",
        icon: "fa-fw fa fa-list-alt",
        npm: {
            package: "@steedos-widgets/steedos-object",
            version: "{{version}}",
            exportName: "ObjectForm",
            main: "",
            destructuring: true,
            subName: ""
        },
        props: [
            {
                name: "objectApiName",
                propType: "string"
            },
        ],
        preview: {
            text: "Submit",
            link: "https://www.steedos.cn"
        },
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        // settings for amis.
        amis: {}
    };
    var ObjectForm = __assign(__assign({}, config$1), { snippets: [
            {
                title: config$1.title,
                screenshot: "",
                schema: {
                    componentName: config$1.name,
                    props: config$1.preview
                }
            }
        ], amis: {
            render: {
                type: config$1.name,
                usage: "renderer",
                weight: 1,
                framework: "react"
            },
            plugin: {
                rendererName: config$1.name,
                // $schema: '/schemas/UnkownSchema.json',
                name: config$1.title,
                description: config$1.title,
                tags: [config$1.group],
                order: -9999,
                icon: config$1.icon,
                scaffold: __assign({ type: config$1.name, label: config$1.title, name: config$1.name }, config$1.preview),
                previewSchema: __assign({ type: config$1.name }, config$1.preview),
                panelTitle: "设置",
                panelControls: [
                    {
                        type: "text",
                        name: "objectApiName",
                        label: "标题"
                    },
                ]
            }
        } });

    var config = {
        group: "华炎魔方",
        name: "steedos-object-listview",
        componentName: "ObjectListView",
        title: "列表视图",
        docUrl: "",
        screenshot: "",
        icon: "fa-fw fa fa-table",
        npm: {
            package: "@steedos-widgets/steedos-object",
            version: "{{version}}",
            exportName: "ObjectListView",
            main: "",
            destructuring: true,
            subName: ""
        },
        props: [
            {
                name: "objectApiName",
                propType: "string"
            },
        ],
        preview: {
            text: "Submit",
            link: "https://www.steedos.cn"
        },
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        // settings for amis.
        amis: {}
    };
    var ObjectListView = __assign(__assign({}, config), { snippets: [
            {
                title: config.title,
                screenshot: "",
                schema: {
                    componentName: config.name,
                    props: config.preview
                }
            }
        ], amis: {
            render: {
                type: config.name,
                usage: "renderer",
                weight: 1,
                framework: "react"
            },
            plugin: {
                rendererName: config.name,
                // $schema: '/schemas/UnkownSchema.json',
                name: config.title,
                description: config.title,
                tags: [config.group],
                order: -9999,
                icon: config.icon,
                scaffold: __assign({ type: config.name, label: config.title, name: config.name }, config.preview),
                previewSchema: __assign({ type: config.name }, config.preview),
                panelTitle: "设置",
                panelControls: [
                    {
                        type: "text",
                        name: "objectApiName",
                        label: "标题"
                    },
                ]
            }
        } });

    var components = [SteedosProvider, ObjectForm, ObjectListView];
    var componentList = [
        {
            title: "对象组件",
            icon: "",
            children: [SteedosProvider, ObjectForm, ObjectListView]
        }
    ];
    var meta = {
        componentList: componentList,
        components: components
    };

    return meta;

}));
