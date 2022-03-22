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
        group: "Salesforce",
        name: "salesforce-button",
        componentName: "SalesforceButton",
        title: "SF Button",
        docUrl: "",
        screenshot: "",
        icon: "fa-fw fa fa-list-alt",
        npm: {
            package: "@steedos-widgets/design-system",
            version: "{{version}}",
            exportName: "Icon",
            main: "",
            destructuring: true,
            subName: ""
        },
        props: [
            {
                name: "label",
                propType: "string"
            },
        ],
        preview: {
            label: "Hello Button",
        },
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        // settings for amis.
        amis: {}
    };
    var Button = __assign(__assign({}, config$2), { snippets: [
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
                scaffold: __assign({ type: config$2.name }, config$2.preview),
                previewSchema: __assign({ type: config$2.name }, config$2.preview),
                panelTitle: "设置",
                panelControls: [
                    {
                        type: "text",
                        name: "label",
                        label: "标题"
                    },
                ]
            }
        } });

    var config$1 = {
        group: "Salesforce",
        name: "salesforce-icon",
        componentName: "SalesforceIcon",
        title: "SF Icon",
        docUrl: "",
        screenshot: "",
        icon: "fa-fw fa fa-list-alt",
        npm: {
            package: "@steedos-widgets/design-system",
            version: "{{version}}",
            exportName: "Icon",
            main: "",
            destructuring: true,
            subName: ""
        },
        props: [
            {
                name: "category",
                propType: "string"
            },
            {
                name: "name",
                propType: "string"
            },
            {
                name: "size",
                propType: "string"
            },
        ],
        preview: {
            category: "standard",
            name: "address",
            size: "large",
        },
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        // settings for amis.
        amis: {}
    };
    var Icon = __assign(__assign({}, config$1), { snippets: [
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
                scaffold: __assign({ type: config$1.name }, config$1.preview),
                previewSchema: __assign({ type: config$1.name }, config$1.preview),
                panelTitle: "设置",
                panelControls: [
                    {
                        type: "text",
                        name: "category",
                        label: "Category"
                    },
                    {
                        type: "text",
                        name: "name",
                        label: "Name"
                    },
                    {
                        type: "text",
                        name: "size",
                        label: "Size"
                    },
                ]
            }
        } });

    var config = {
        group: "Salesforce",
        name: "salesforce-icon-settings",
        componentName: "SalesforceIconSettings",
        title: "SF Icon Settings",
        docUrl: "",
        screenshot: "",
        icon: "fa-fw fa fa-list-alt",
        npm: {
            package: "@steedos-widgets/design-system",
            version: "{{version}}",
            exportName: "IconSettings",
            main: "",
            destructuring: true,
            subName: ""
        },
        props: [],
        preview: {},
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        // settings for amis.
        amis: {}
    };
    var IconSettings = __assign(__assign({}, config), { snippets: [
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
                scaffold: __assign({ type: config.name }, config.preview),
                previewSchema: __assign({ type: config.name }, config.preview),
                panelTitle: "设置",
                panelControls: []
            }
        } });

    var components = [Button, Icon, IconSettings];
    var componentList = [
        {
            title: "Design System",
            icon: "",
            children: [Button, Icon, IconSettings]
        }
    ];
    var meta = {
        componentList: componentList,
        components: components
    };

    return meta;

}));
