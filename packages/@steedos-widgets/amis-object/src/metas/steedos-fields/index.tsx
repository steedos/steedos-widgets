// 通用元数据配置生成器
const createMetaConfig = (name: string, type: string, title: string, icon: string) => {
    const metaConfig: any = {
        componentType: 'amisSchema',
        group: "字段",
        componentName: `SteedosField${name}`,
        title: title,
        docUrl: "",
        screenshot: "",
        npm: {
          package: "@steedos-widgets/amis-object",
          version: "{{version}}",
          exportName: `SteedosField${name}`,
          main: "",
          destructuring: true,
          subName: ""
        },
        preview: {
        },
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        amis: {
            name: `sfield-${name.toLowerCase()}`,
            icon: icon
        }
    };

    return {
        ...metaConfig,
        snippets: [
            {
                title: metaConfig.title,
                screenshot: "",
                schema: {
                    componentName: metaConfig.componentName,
                    props: metaConfig.preview
                }
            }
        ],
        amis: {
            render: {
                type: metaConfig.amis.name,
                usage: "renderer",
                weight: 1,
                framework: "react"
            },
            plugin: {
                rendererName: metaConfig.amis.name,
                $schema: '/schemas/UnkownSchema.json',
                name: metaConfig.title,
                isBaseComponent: true,
                description: metaConfig.title,
                tags: [metaConfig.group],
                order: -9999,
                icon: metaConfig.amis.icon,
                scaffold: {
                    type: metaConfig.amis.name,
                    config: {
                      "type": type,
                      "label": title,
                      "amis": {}
                    }
                  },
                  previewSchema: {
                    type: metaConfig.amis.name,
                    config: {
                      "type": type,
                      "label": title,
                      "amis": {}
                    }
                  },
                panelTitle: "设置",
                panelControls: [
                    {
                      "type": "tabs",
                      tabsMode: 'line',
                      className: 'editor-prop-config-tabs',
                      linksClassName: 'editor-prop-config-tabs-links',
                      contentClassName: 'no-border editor-prop-config-tabs-cont',
                      "tabs": [
                        {
                          "title": "通用",
                          "className": 'ae-formItemControl-body',
                          "body": [
                            {
                              "type": "input-text",
                              "name": "config.object",
                              "value": "${objectName}",
                              "disabled": true,
                              "label": "对象",
                              "required": true
                            },
                            {
                              "name": "config.type",
                              "label": "字段类型",
                              "required": true,
                              "type": "select",
                              "joinValues": false,
                              "options": [
                                  {
                                      "label": "文本",
                                      "value": "text"
                                  },
                                  {
                                      "label": "长文本",
                                      "value": "textarea"
                                  },
                                  {
                                      "label": "富文本",
                                      "value": "html"
                                  },
                                  {
                                      "label": "代码",
                                      "value": "code"
                                  },
                                  {
                                      "label": "Markdown",
                                      "value": "markdown"
                                  },
                                  {
                                      "label": "选择框",
                                      "value": "select"
                                  },
                                  {
                                      "label": "颜色",
                                      "value": "color"
                                  },
                                  {
                                      "label": "复选框",
                                      "value": "boolean"
                                  },
                                  {
                                      "label": "开关",
                                      "value": "toggle"
                                  },
                                  {
                                      "label": "日期",
                                      "value": "date"
                                  },
                                  {
                                      "label": "日期时间",
                                      "value": "datetime"
                                  },
                                  {
                                      "label": "时间",
                                      "value": "time"
                                  },
                                  {
                                      "label": "数值",
                                      "value": "number"
                                  },
                                  {
                                      "label": "金额",
                                      "value": "currency"
                                  },
                                  {
                                      "label": "百分比",
                                      "value": "percent"
                                  },
                                  {
                                      "label": "密码",
                                      "value": "password"
                                  },
                                  {
                                      "label": "相关表关系",
                                      "value": "lookup"
                                  },
                                  {
                                      "label": "主/子表关系",
                                      "value": "master_detail"
                                  },
                                  {
                                      "label": "自动编号",
                                      "value": "autonumber"
                                  },
                                  {
                                      "label": "网址",
                                      "value": "url"
                                  },
                                  {
                                      "label": "邮件地址",
                                      "value": "email"
                                  },
                                  {
                                      "label": "地理位置",
                                      "value": "location"
                                  },
                                  {
                                      "label": "图片",
                                      "value": "image"
                                  },
                                  {
                                      "label": "附件",
                                      "value": "file"
                                  },
                                  {
                                      "label": "公式",
                                      "value": "formula"
                                  },
                                  {
                                      "label": "累计汇总",
                                      "value": "summary"
                                  }
                              ],
                              "extractValue": true,
                              "clearable": true,
                              "labelField": "label",
                              "valueField": "value",
                              "labelClassName": "text-left",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}",
                              "searchable": true
                            },
                            {
                              "name": "config.label",
                              "label": "显示名称",
                              "labelRemark": "",
                              "description": "",
                              "required": true,
                              "type": "input-text",
                              "labelClassName": "text-left",
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.name",
                              "label": "API 名称",
                              "labelRemark": "API 名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符",
                              "description": "",
                              "required": true,
                              "type": "input-text",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}",
                              "validateOnChange": true,
                              "validations": {
                                  "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                              }
                            },
                            {
                              "name": "config.autonumber_enable_modify",
                              "label": "允许修改编号",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "visibleOn": "config.type === 'autonumber' ? true: false",
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.rows",
                              "label": "多行文本行数",
                              "labelRemark": "",
                              "description": "",
                              "requiredOn": "config.type === 'textarea' ? true: false",
                              "type": "input-number",
                              "precision": 0,
                              "visibleOn": "config.type === 'textarea' ? true: false",
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.language",
                              "label": "语言",
                              "requiredOn": "['code'].indexOf(config.type) > -1 ? true: false",
                              "type": "select",
                              "joinValues": false,
                              "options": [
                                  {
                                      "label": "bat",
                                      "value": "bat"
                                  },
                                  {
                                      "label": "c",
                                      "value": "c"
                                  },
                                  {
                                      "label": "coffeescript",
                                      "value": "coffeescript"
                                  },
                                  {
                                      "label": "cpp",
                                      "value": "cpp"
                                  },
                                  {
                                      "label": "csharp",
                                      "value": "csharp"
                                  },
                                  {
                                      "label": "css",
                                      "value": "css"
                                  },
                                  {
                                      "label": "dockerfile",
                                      "value": "dockerfile"
                                  },
                                  {
                                      "label": "fsharp",
                                      "value": "fsharp"
                                  },
                                  {
                                      "label": "go",
                                      "value": "go"
                                  },
                                  {
                                      "label": "handlebars",
                                      "value": "handlebars"
                                  },
                                  {
                                      "label": "html",
                                      "value": "html"
                                  },
                                  {
                                      "label": "ini",
                                      "value": "ini"
                                  },
                                  {
                                      "label": "java",
                                      "value": "java"
                                  },
                                  {
                                      "label": "javascript",
                                      "value": "javascript"
                                  },
                                  {
                                      "label": "json",
                                      "value": "json"
                                  },
                                  {
                                      "label": "less",
                                      "value": "less"
                                  },
                                  {
                                      "label": "lua",
                                      "value": "lua"
                                  },
                                  {
                                      "label": "markdown",
                                      "value": "markdown"
                                  },
                                  {
                                      "label": "msdax",
                                      "value": "msdax"
                                  },
                                  {
                                      "label": "objective-c",
                                      "value": "objective-c"
                                  },
                                  {
                                      "label": "php",
                                      "value": "php"
                                  },
                                  {
                                      "label": "plaintext",
                                      "value": "plaintext"
                                  },
                                  {
                                      "label": "postiats",
                                      "value": "postiats"
                                  },
                                  {
                                      "label": "powershell",
                                      "value": "powershell"
                                  },
                                  {
                                      "label": "pug",
                                      "value": "pug"
                                  },
                                  {
                                      "label": "python",
                                      "value": "python"
                                  },
                                  {
                                      "label": "r",
                                      "value": "r"
                                  },
                                  {
                                      "label": "razor",
                                      "value": "razor"
                                  },
                                  {
                                      "label": "ruby",
                                      "value": "ruby"
                                  },
                                  {
                                      "label": "sb",
                                      "value": "sb"
                                  },
                                  {
                                      "label": "scss",
                                      "value": "scss"
                                  },
                                  {
                                      "label": "shell",
                                      "value": "shell"
                                  },
                                  {
                                      "label": "sol",
                                      "value": "sol"
                                  },
                                  {
                                      "label": "sql",
                                      "value": "sql"
                                  },
                                  {
                                      "label": "swift",
                                      "value": "swift"
                                  },
                                  {
                                      "label": "typescript",
                                      "value": "typescript"
                                  },
                                  {
                                      "label": "vb",
                                      "value": "vb"
                                  },
                                  {
                                      "label": "xml",
                                      "value": "xml"
                                  },
                                  {
                                      "label": "yaml",
                                      "value": "yaml"
                                  }
                              ],
                              "extractValue": true,
                              "clearable": true,
                              "labelField": "label",
                              "valueField": "value",
                              "visibleOn": "['code'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}",
                              "value": "javascript"
                            },
                            {
                              "name": "config.multiple",
                              "label": "多选",
                              "labelRemark": "单选<==>多选 相互切换，请自行重新提交已有记录或在数据库中统一修改此字段的保存格式。",
                              "type": "checkbox",
                              "visibleOn": "['select', 'lookup', 'image','file'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.data_type",
                              "label": "数据类型",
                              "labelRemark": "字段类型为公式时，必须填写此字段。",
                              "requiredOn": "['formula'].indexOf(config.type) > -1 ? true: false",
                              "type": "select",
                              "joinValues": false,
                              "extractValue": true,
                              "clearable": true,
                              "disabledOn": "${config.is_system == true}",
                              "searchable": true,
                              "source": {
                                  "method": "post",
                                  "url": "${context.rootUrl}/graphql?depend_on_type=${config.type}",
                                  "data": {
                                      "query": "{objects(filters: [\"_id\", \"=\", \"-1\"]){_id}}"
                                  },
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "sendOn": "this.config.type",
                                  "adaptor": `
                                    if (context.config.type === "select") {
                                        payload.data.options = [
                                            {
                                                "label": "布尔",
                                                "value": "boolean"
                                            },
                                            {
                                                "label": "数值",
                                                "value": "number"
                                            },
                                            {
                                                "label": "文本",
                                                "value": "text"
                                            }
                                        ]
                                    }else {
                                        payload.data.options = [
                                            {
                                                "label": "布尔",
                                                "value": "boolean"
                                            },
                                            {
                                                "label": "数值",
                                                "value": "number"
                                            },
                                            {
                                                "label": "金额",
                                                "value": "currency"
                                            },
                                            {
                                                "label": "百分比",
                                                "value": "percent"
                                            },
                                            {
                                                "label": "文本",
                                                "value": "text"
                                            },
                                            {
                                                "label": "日期",
                                                "value": "date"
                                            },
                                            {
                                                "label": "日期时间",
                                                "value": "datetime"
                                            }
                                        ]
                                    }
                                    return payload;
                                  `
                              },
                              "visibleOn": "['formula','select'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true
                            },
                            {
                              "type": "input-table",
                              "name": "config.options",
                              "label": "选择项",
                              "labelRemark": "选择项的每个选项显示名及选项值不能为空，背景颜色请设置为ffffff这种格式的16进制数值。",
                              "requiredOn": "config.type === 'select' ? true: false",
                              "visibleOn": "config.type === 'select' ? true: false",
                              "clearValueOnHidden": true,
                              "showIndex": true,
                              "addable": true,
                              "removable": true,
                              "columnsTogglable": false,
                              "needConfirm": false,
                              "footerAddBtn": {
                                "visibleOn": "${!config.is_system}"
                              },
                              "columns": [
                                {
                                  "type": "input-text",
                                  "name": "label",
                                  "label": "显示名",
                                  "required": true,
                                  "disabledOn": "${config.is_system == true}",
                                  "width": 100
                                },
                                {
                                  "type": "input-text",
                                  "name": "value",
                                  "label": "选项值",
                                  "required": true,
                                  "disabledOn": "${config.is_system == true}",
                                  "width": 100
                                },
                                {
                                  "type": "input-color",
                                  "name": "color",
                                  "label": "背景颜色",
                                  "disabledOn": "${config.is_system == true}",
                                  "width": 70
                                },
                                {
                                  "type": "textarea",
                                  "name": "description",
                                  "label": "描述",
                                  "disabledOn": "${config.is_system == true}",
                                  "width": 100
                                },
                                {
                                  "type": "operation",
                                  "label": "操作",
                                  "visibleOn": "${!config.is_system}",
                                  "width": 70,
                                  "fixed": "right"
                                }
                              ]
                            },
                            {
                              "name": "config.precision",
                              "label": "数字位数",
                              "labelRemark": "小数点左边的数字位数",
                              "requiredOn": " (function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })() ",
                              "type": "input-number",
                              "precision": 0,
                              "visibleOn": " (function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })() ",
                              "clearValueOnHidden": true,
                              "value": 18,
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.scale",
                              "label": "小数位数",
                              "labelRemark": "If the field type is a Percent, this indicates the number of decimal places the field will display, for example, two decimal places will display as 10.20%.",
                              "requiredOn": " (function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })() ",
                              "type": "input-number",
                              "min": 0,
                              "precision": 0,
                              "visibleOn": " (function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })() ",
                              "labelClassName": "text-left",
                              "clearValueOnHidden": true,
                              "value": 2,
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.formula",
                              "label": "公式",
                              "labelRemark": "字段类型为自动编号或公式时，必须填写此字段。",
                              "description": "",
                              "requiredOn": "['autonumber', 'formula'].indexOf(config.type) > -1 ? true: false",
                              "type": "input-formula",
                              "visibleOn": "['autonumber', 'formula'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true,
                              "evalMode": false,
                              "disabledOn": "${config.is_system == true}",
                              "variables": "${window:_objectFieldsVariables}"
                            },
                            {
                              "name": "config.show_as_qr",
                              "label": "显示为二维码",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "visibleOn": "config.type === 'url' ? true: false",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.coordinatesType",
                              "label": "坐标类型",
                              "required": false,
                              "type": "input-text",
                              "visibleOn": "['location'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}",
                              "value": "bd09"
                            },
                            {
                              "name": "config.formula_blank_value",
                              "label": "空白字段处理",
                              "labelRemark": "如果您的公式引用了任何数字和货币字段，请指定当这些字段值为空时如何处理公式输出。",
                              "description": "",
                              "requiredOn": "['formula'].indexOf(config.type) > -1 ? true: false",
                              "type": "select",
                              "joinValues": false,
                              "options": [
                                  {
                                      "label": "将空白字段视为零",
                                      "value": "zeroes"
                                  },
                                  {
                                      "label": "将空白字段视为空白",
                                      "value": "blanks"
                                  }
                              ],
                              "extractValue": true,
                              "clearable": true,
                              "labelField": "label",
                              "valueField": "value",
                              "visibleOn": "['formula'].indexOf(config.type) > -1 ? true: false",
                              "labelClassName": "text-left",
                              "clearValueOnHidden": true,
                              "fieldName": "config.formula_blank_value",
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.reference_to",
                              "label": "引用对象",
                              "requiredOn": "['lookup','master_detail'].indexOf(config.type) > -1 ? true: false",
                              "type": "select",
                              "joinValues": false,
                              "extractValue": true,
                              "clearable": true,
                              "disabledOn": "${config.is_system == true}",
                              "searchable": true,
                              "source": {
                                  "method": "post",
                                  "url": "${context.rootUrl}/graphql?reload=${additionalFilters|join}",
                                  "data": {
                                      "orderBy": "${orderBy}",
                                      "orderDir": "${orderDir}",
                                      "pageNo": "${page}",
                                      "pageSize": "${perPage}",
                                      "queryFields": "_id space label:label value:name",
                                      "query": "{options:objects(filters: {__filters}, top: {__top}, sort: \"{__sort}\"){_id space label:label value:name},count:objects__count(filters:{__filters})}",
                                      "$term": "$term",
                                      "$value": "$config.reference_to",
                                      "$": "$$"
                                  },
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "adaptor": "\n            const data = payload.data;\n            var defaultValueOptions = data.defaultValueOptions;\n            // 字段值下拉选项合并到options中\n            data.options = _.unionWith(defaultValueOptions, data.options, function(a,b){\n                return a[\"value\"]=== b[\"value\"];\n            });\n            delete data.defaultValueOptions;\n            payload.data.options = data.options;\n            return payload;\n        ",
                                  "requestAdaptor": "\n        var filters = [];\n        var top = 200;\n        if(api.data.$term){\n            filters = [[\"label\", \"contains\", api.data.$term]];\n        }\n        // else if(api.data.$value){\n        //     filters = [[\"_id\", \"=\", api.data.$value]];\n        // }\n\n        var fieldFilters = undefined;\n        var currentAmis = (window.amisRequire && window.amisRequire('amis')) || Amis;\n        //递归fieldFilters数组，检查每一个元素，判断若是公式，就仅把它解析\n        function traverseNestedArray(arr) {\n            for (let i = 0; i < arr.length; i++) {\n                if (Array.isArray(arr[i])) {\n                    // 如果当前元素是数组，则递归调用自身继续遍历\n                    traverseNestedArray(arr[i]);\n                } else {\n                    // 如果当前元素不是数组，则处理该元素\n                    // 下面正则用于匹配amis公式${}\n                    if(/\\$\\{([^}]*)\\}/.test(arr[i])) {\n                        try{\n                            arr[i] = currentAmis.evaluate(arr[i], api.context);\n                        }catch(ex){\n                            console.error(\"运行lookup过滤公式时出现错误:\",ex);\n                        }\n                    }\n                }\n            }\n        }\n        if(fieldFilters && fieldFilters.length){\n            traverseNestedArray(fieldFilters);\n            filters.push(fieldFilters);\n        }\n\n        if(false && false){\n            if(filters.length > 0){\n                filters = [ [\"user_accepted\", \"=\", true], \"and\", filters ]\n            }else{\n                filters = [[\"user_accepted\", \"=\", true]];\n            }\n        }\n\n        const inFilterForm = undefined;\n\n        const listviewFiltersFunction = undefined;\n\n        if(listviewFiltersFunction && !inFilterForm){\n            const _filters0 = listviewFiltersFunction(filters, api.data.$);\n            if(_filters0 && _filters0.length){\n                filters.push(_filters0);\n            }\n        }\n        \n        const filtersFunction = undefined;\n\n        if(filtersFunction && !inFilterForm){\n            const _filters = filtersFunction(filters, api.data.$);\n            if(_filters && _filters.length > 0){\n                filters.push(_filters);\n            }\n        }\n        var sort = \"\";\n        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', top).replace('{__sort}', sort.trim());\n\n        var defaultValue = api.data.$value;\n        var optionsFiltersOp = \"=\";\n        var optionsFilters = [[\"name\", optionsFiltersOp, []]];\n        if (defaultValue && !api.data.$term) { \n            const defaultValueOptionsQueryData = {\"orderBy\":\"${orderBy}\",\"orderDir\":\"${orderDir}\",\"pageNo\":\"${page}\",\"pageSize\":\"${perPage}\",\"queryFields\":\"_id space label:label value:name\",\"query\":\"{defaultValueOptions:objects(filters:{__options_filters}){_id space label:label value:name}}\"};\n            const defaultValueOptionsQuery = defaultValueOptionsQueryData && defaultValueOptionsQueryData.query && defaultValueOptionsQueryData.query.replace(/^{/,\"\").replace(/}$/,\"\");\n            // 字段值单独请求，没值的时候在请求中返回空\n            optionsFilters = [[\"name\", optionsFiltersOp, defaultValue]];\n            if(filters.length > 0){\n                optionsFilters = [filters, optionsFilters];\n            }\n            if(defaultValueOptionsQuery){\n                api.data.query = \"{\"+api.data.query.replace(/^{/,\"\").replace(/}$/,\"\")+\",\"+defaultValueOptionsQuery+\"}\";\n            } \n        }\n        api.data.query = api.data.query.replace(/{__options_filters}/g, JSON.stringify(optionsFilters));\n        return api;\n    "
                              },
                              "menuTpl": "<div>${label}(${value})</div>",
                              "visibleOn": "['lookup', 'master_detail'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.summary_object",
                              "label": "要汇总的对象",
                              "labelRemark": "字段类型为累计汇总时，必须填写此字段。",
                              "description": "",
                              "requiredOn": "config.type === 'summary' ? true: false",
                              "type": "select",
                              "joinValues": false,
                              "extractValue": true,
                              "clearable": true,
                              "disabledOn": "${config.is_system == true}",
                              "searchable": true,
                              "source": {
                                  "method": "get",
                                  "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${config.object}/detailLists/options?depend_on_object=${config.object}",
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "adaptor": "",
                                  "sendOn": "this.config.object",
                                  "requestAdaptor": ""
                              },
                              "visibleOn": "config.type === 'summary' ? true: false",
                              "clearValueOnHidden": true,
                              "autoComplete": {
                                  "method": "get",
                                  "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${config.object}/detailLists/options?depend_on_object=${config.object}",
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "adaptor": "",
                                  "sendOn": "this.config.object",
                                  "requestAdaptor": ""
                              }
                            },
                            {
                              "name": "config.summary_type",
                              "label": "汇总类型",
                              "labelRemark": "字段类型为累计汇总时，必须填写此字段。",
                              "requiredOn": "config.type === 'summary' ? true: false",
                              "type": "select",
                              "joinValues": false,
                              "options": [
                                  {
                                      "label": "COUNT",
                                      "value": "count"
                                  },
                                  {
                                      "label": "SUM",
                                      "value": "sum"
                                  },
                                  {
                                      "label": "MIN",
                                      "value": "min"
                                  },
                                  {
                                      "label": "MAX",
                                      "value": "max"
                                  },
                                  {
                                      "label": "AVG",
                                      "value": "avg"
                                  }
                              ],
                              "extractValue": true,
                              "clearable": true,
                              "labelField": "label",
                              "valueField": "value",
                              "visibleOn": "config.type === 'summary' ? true: false",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.summary_field",
                              "label": "汇总字段",
                              "labelRemark": "字段类型为累计汇总且汇总类型不是COUNT时，必须填写此字段，只支持聚合数值、金额、日期、日期时间类型的字段。",
                              "description": "",
                              "requiredOn": "config.type === 'summary' && config.summary_type !== 'count' ? true: false",
                              "type": "select",
                              "joinValues": false,
                              "extractValue": true,
                              "clearable": true,
                              "disabledOn": "${config.is_system == true}",
                              "searchable": true,
                              "source": {
                                  "method": "post",
                                  "url": "${context.rootUrl}/graphql?reload=${additionalFilters|join}&depend_on_summary_object=${config.summary_object}&depend_on_summary_type=${config.summary_type}",
                                  "data": {
                                      "orderBy": "${orderBy}",
                                      "orderDir": "${orderDir}",
                                      "pageNo": "${page}",
                                      "pageSize": "${perPage}",
                                      "queryFields": "_id space label:label value:name",
                                      "query": "{options:object_fields(filters: {__filters}, top: {__top}, sort: \"{__sort}\"){_id space label:label value:name},count:object_fields__count(filters:{__filters})}",
                                      "$term": "$term",
                                      "$value": "$config.summary_field",
                                      "summary_object": "$config.summary_object",
                                      "summary_type": "$config.summary_type",
                                      "$": "$$"
                                  },
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "adaptor": "\n           const data = payload.data;\n            var defaultValueOptions = data.defaultValueOptions;\n            // 字段值下拉选项合并到options中\n            data.options = _.unionWith(defaultValueOptions, data.options, function(a,b){\n                return a[\"value\"]=== b[\"value\"];\n            });\n            delete data.defaultValueOptions;\n            payload.data.options = data.options;\n            return payload;\n        ",
                                  "sendOn": "this.config.summary_object && this.config.summary_type",
                                  "requestAdaptor": "\n        var filters = [];\n        var top = 200;\n        if(api.data.$term){\n            filters = [[\"label\", \"contains\", api.data.$term]];\n        }\n        // else if(api.data.$value){\n        //     filters = [[\"_id\", \"=\", api.data.$value]];\n        // }\n\n        var fieldFilters = undefined;\n        var currentAmis = (window.amisRequire && window.amisRequire('amis')) || Amis;\n        //递归fieldFilters数组，检查每一个元素，判断若是公式，就仅把它解析\n        function traverseNestedArray(arr) {\n            for (let i = 0; i < arr.length; i++) {\n                if (Array.isArray(arr[i])) {\n                    // 如果当前元素是数组，则递归调用自身继续遍历\n                    traverseNestedArray(arr[i]);\n                } else {\n                    // 如果当前元素不是数组，则处理该元素\n                    // 下面正则用于匹配amis公式${}\n                    if(/\\$\\{([^}]*)\\}/.test(arr[i])) {\n                        try{\n                            arr[i] = currentAmis.evaluate(arr[i], api.context);\n                        }catch(ex){\n                            console.error(\"运行lookup过滤公式时出现错误:\",ex);\n                        }\n                    }\n                }\n            }\n        }\n        if(fieldFilters && fieldFilters.length){\n            traverseNestedArray(fieldFilters);\n            filters.push(fieldFilters);\n        }\n\n        if(false && false){\n            if(filters.length > 0){\n                filters = [ [\"user_accepted\", \"=\", true], \"and\", filters ]\n            }else{\n                filters = [[\"user_accepted\", \"=\", true]];\n            }\n        }\n\n        const inFilterForm = undefined;\n\n        const listviewFiltersFunction = undefined;\n\n        if(listviewFiltersFunction && !inFilterForm){\n            const _filters0 = listviewFiltersFunction(filters, api.data.$);\n            if(_filters0 && _filters0.length){\n                filters.push(_filters0);\n            }\n        }\n        \n        const filtersFunction = undefined;\n\n        if(filtersFunction && !inFilterForm){\n            const _filters = filtersFunction(filters, api.data.$);\n            if(_filters && _filters.length > 0){\n                filters.push(_filters);\n            }\n        }\n        var sort = \"sort_no asc\";\n        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', top).replace('{__sort}', sort.trim());\n\n        var defaultValue = api.data.$value;\n        var optionsFiltersOp = \"=\";\n        var optionsFilters = [[\"name\", optionsFiltersOp, []]];\n        if (defaultValue && !api.data.$term) { \n            const defaultValueOptionsQueryData = {\"orderBy\":\"${orderBy}\",\"orderDir\":\"${orderDir}\",\"pageNo\":\"${page}\",\"pageSize\":\"${perPage}\",\"queryFields\":\"_id space label:label value:name\",\"query\":\"{defaultValueOptions:object_fields(filters:{__options_filters}){_id space label:label value:name}}\"};\n            const defaultValueOptionsQuery = defaultValueOptionsQueryData && defaultValueOptionsQueryData.query && defaultValueOptionsQueryData.query.replace(/^{/,\"\").replace(/}$/,\"\");\n            // 字段值单独请求，没值的时候在请求中返回空\n            optionsFilters = [[\"name\", optionsFiltersOp, defaultValue]];\n            if(filters.length > 0){\n                optionsFilters = [filters, optionsFilters];\n            }\n            if(defaultValueOptionsQuery){\n                api.data.query = \"{\"+api.data.query.replace(/^{/,\"\").replace(/}$/,\"\")+\",\"+defaultValueOptionsQuery+\"}\";\n            } \n        }\n        api.data.query = api.data.query.replace(/{__options_filters}/g, JSON.stringify(optionsFilters));\n        return api;\n    "
                              },
                              "visibleOn": "config.type === 'summary' && config.summary_object && config.summary_type && config.summary_type !== 'count'",
                              "clearValueOnHidden": true,
                              "autoComplete": {
                                  "method": "get",
                                  "url": "${context.rootUrl}/service/api/@${config.summary_object}/uiSchema?summary_object=${config.summary_object}&summary_type=${config.summary_type}&term=${term}",
                                  "data": {
                                      "summary_type": "${config.summary_type}"
                                  },
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "sendOn": "!!this.config.summary_object && !!this.config.summary_type",
                                  "adaptor": "debugger;const summary_type = api.body.summary_type;\nconst term = api.query.term;\nlet fields = payload.fields;\nlet options = [];\nif (fields) {\n  if (summary_type && summary_type !== \"count\") {\n    if (summary_type === \"sum\" || summary_type === \"avg\") {\n      /*sum/avg类型可以汇总数值、金额、百分比字段*/\n      _.forEach(fields, (value, key) => {\n        let fieldType = value.type;\n        if ([\"formula\", \"summary\"].indexOf(fieldType) > -1) {\n          /*要聚合的字段为公式或汇总字段时，按其字段数据类型判断是否支持聚合*/\n          fieldType = value.data_type;\n        }\n        if ([\"number\", \"currency\", \"percent\"].indexOf(fieldType) > -1) {\n          options.push({ label: value.label, value: value.name });\n        }\n      })\n    }\n    else {\n      /*min、max类型可以汇总数值、金额、百分比、日期、日期时间字段*/\n      _.forEach(fields, (value, key) => {\n        let fieldType = value.type;\n        if ([\"formula\", \"summary\"].indexOf(fieldType) > -1) {\n          /*要聚合的字段为公式或汇总字段时，按其字段数据类型判断是否支持聚合*/\n          fieldType = value.data_type;\n        }\n        if ([\"number\", \"currency\", \"percent\", \"date\", \"datetime\"].indexOf(fieldType) > -1) {\n          options.push({ label: value.label, value: value.name });\n        }\n      })\n    }\n  }\n  if (term) {\n    options = _.filter(options, (item) => {\n      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;\n    })\n  }\n}\npayload = {\n  data: { options: options },\n  msg: \"\",\n  status: 0\n}\nreturn payload;"
                              }
                            },
                            //汇总过滤条件暂时无法直接使用组件，因为数据格式不一致
                            {
                              "name": "config.description",
                              "label": "描述",
                              "required": false,
                              "type": "textarea",
                              "tpl": "<%=(data.config.description || \"\").split(\"\\n\").join('<br>')%>",
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.deleted_lookup_record_behavior",
                              "label": "如果相关表记录被删除怎么办？",
                              "required": true,
                              "type": "select",
                              "joinValues": false,
                              "options": [
                                  {
                                      "label": "清除此字段的值。 如果您将此字段设为必填，您不能选择此选项。",
                                      "value": "clear"
                                  },
                                  {
                                      "label": "不允许删除＂作为相关表关系的一部分的相关表记录＂。",
                                      "value": "retain"
                                  }
                              ],
                              "extractValue": true,
                              "clearable": true,
                              "labelField": "label",
                              "valueField": "value",
                              "visibleOn": " 'lookup' === config.type ? true: false ",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.required==true}",
                              "value": "${IFS(true===config.required, \"retain\", !config.required && !config.deleted_lookup_record_behavior, \"clear\", config.deleted_lookup_record_behavior)}"
                            },
                            {
                              "name": "config.write_requires_master_read",
                              "label": "当用户对主表记录有读取权限时对子表记录可以增删改",
                              "labelRemark": "设置主记录上创建、编辑或删除子记录所需的最低访问级别。此字段仅适用于·主表/子表·字段类型。勾选表示允许具有'读取'访问权限的用户创建、编辑或删除子记录。反之表示允许具有'读取/写入'访问权限的用户创建、编辑或删除子记录的权限。",
                              "type": "checkbox",
                              "visibleOn": "config.type === 'master_detail' ? true: false",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}"
                            }
                          ]
                        },
                        {
                          "title": "表单",
                          "className": 'ae-formItemControl-body',
                          "body": [
                            {
                                "name": "config.visible_on",
                                "label": "显示公式",
                                "type": 'input-formula',
                            },
                            {
                              "name": "config.required",
                              "label": "必填",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "visibleOn": "['autonumber','summary','formula'].indexOf(config.type) > -1 ? false: true",
                              "clearValueOnHidden": true,
                              "fieldName": "config.required"
                            },
                            {
                              "name": "config.is_wide",
                              "label": "宽字段",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "labelClassName": "text-left",
                              "clearValueOnHidden": true,
                              "fieldName": "config.is_wide"
                            },
                            {
                              "name": "config.readonly",
                              "label": "只读",
                              "labelRemark": "只读字段不显示在表单上，数据不会提交到服务端。",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "clearValueOnHidden": true,
                              "fieldName": "config.readonly"
                            },
                            {
                              "name": "config.static",
                              "label": "静态",
                              "labelRemark": "静态字段在表单上显示，用户不可编辑，可动态赋值。",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "clearValueOnHidden": true,
                              "fieldName": "config.static"
                            },
                            {
                              "name": "config.inlineHelpText",
                              "label": "提示文本",
                              "required": false,
                              "type": "textarea",
                              "tpl": "<%=(data.config.inlineHelpText || \"\").split(\"\\n\").join('<br>')%>",
                              "className": "col-span-2 m-0 steedos-textarea-edit ",
                              "labelClassName": "text-left",
                              "clearValueOnHidden": true,
                              "fieldName": "config.inlineHelpText"
                            },
                            {
                              "name": "config.enable_enhanced_lookup",
                              "label": "弹出选择",
                              "labelRemark": "被其他字段引用时，使用弹出框选择记录。",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "visibleOn": "['lookup'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "conig.create",
                              "label": "弹出选择时允许新建",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "visibleOn": "['lookup'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true,
                              "fieldName": "conig.create",
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.depend_on",
                              "label": "依赖字段",
                              "labelRemark": "依赖字段的变化会触发当前字段重算",
                              "description": "",
                              "required": false,
                              "type": "select",
                              "joinValues": false,
                              "extractValue": true,
                              "clearable": true,
                              "disabledOn": "${config.is_system == true}",
                              "visibleOn": "['lookup', 'master_detail'].indexOf(config.type) > -1 ? true: false",
                              "searchable": true,
                              "multiple": true,
                              "source": {
                                  "method": "post",
                                  "url": "${context.rootUrl}/graphql?reload=${additionalFilters|join}",
                                  "data": {
                                      "query": `{options:object_fields(filters: ["object","=","\${config.object}"], top: 200, sort: "created desc"){_id space label:label value:name},count:object_fields__count(filters:["object","=","\${config.object}"])}`,
                                      "$value": "$config.depend_on",
                                      "$": "$$"
                                  },
                                  "sendOn": "this.config.object",
                                  "trackExpression": "${config.object}",
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "adaptor": "\n            const data = payload.data;\n            var defaultValueOptions = data.defaultValueOptions;\n            // 字段值下拉选项合并到options中\n            data.options = _.unionWith(defaultValueOptions, data.options, function(a,b){\n                return a[\"value\"]=== b[\"value\"];\n            });\n            delete data.defaultValueOptions;\n            payload.data.options = data.options;\n            return payload;\n        ",
                                },
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.enable_thousands",
                              "label": "显示千分符",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "visibleOn": "['number','currency','percent'].indexOf(config.type) > -1 ? true: false",
                              "clearValueOnHidden": true,
                              "fieldName": "config.enable_thousands"
                            }
                            //filters
                            //自动填充
                          ]
                        },
                        {
                          "title": "高级",
                          "className": 'ae-formItemControl-body',
                          "body": [
                            {
                              "name": "config.unique",
                              "label": "创建唯一索引",
                              "labelRemark": "默认每天凌晨执行一次创建，已有的索引不重复创建。",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.filterable",
                              "label": "列表页过滤器默认字段",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.index",
                              "label": "创建索引",
                              "labelRemark": "默认每天凌晨执行一次创建，已有的索引不重复创建。",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "clearValueOnHidden": true
                            },
                            {
                              "name": "config.is_name",
                              "label": "名称字段",
                              "required": false,
                              "type": "checkbox",
                              "tpl": null,
                              "visibleOn": "${ARRAYSOME(['text', 'textarea', 'autonumber', 'date', 'datetime', 'time', 'formula', 'lookup', 'master_detail'], item => item === config.type) && !config.multiple}",
                              "clearValueOnHidden": true,
                              "disabledOn": "${config.is_system == true}"
                            },
                            {
                              "name": "config.reference_to_field",
                              "label": "外键字段",
                              "labelRemark": "关联的对象保存到当前对象字段的值；例如：A对象关联B对象后，当A1记录关联了B1记录，默认会存B1记录的_id存到A1记录中。如果修改了外键字段后，会将“外键字段”替换_id存储到A1记录中。",
                              "description": "默认为主键，默认值是_id",
                              "required": false,
                              "type": "select",
                              "joinValues": false,
                              "extractValue": true,
                              "clearable": true,
                              "disabledOn": "${config.is_system == true}",
                              "visibleOn": "['lookup', 'master_detail'].indexOf(config.type) > -1 ? true: false",
                              "searchable": true,
                              "multiple": false,
                              "source": {
                                  "method": "post",
                                  "url": "${context.rootUrl}/graphql?reload=${additionalFilters|join}",
                                  "data": {
                                      "query": `{options:object_fields(filters: ["object","=","\${config.reference_to}"], top: 200, sort: "created desc"){_id space label:label value:name},count:object_fields__count(filters:["object","=","\${config.reference_to}"])}`,
                                      "$value": "$config.reference_to_field",
                                      "$": "$$"
                                  },
                                  "sendOn": "this.config.reference_to",
                                  "trackExpression": "${config.reference_to}",
                                  "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  },
                                  "adaptor": "\n            const data = payload.data;\n            var defaultValueOptions = data.defaultValueOptions;\n            // 字段值下拉选项合并到options中\n            data.options = _.unionWith(defaultValueOptions, data.options, function(a,b){\n                return a[\"value\"]=== b[\"value\"];\n            });\n            delete data.defaultValueOptions;\n            payload.data.options = data.options;\n            return payload;\n        ",
                                },
                              "clearValueOnHidden": true
                            }
                          ]
                        }
                      ]
                    }      
                  ]
            }
        }
    };
};

// 针对每个字段类型生成函数和元数据
const fieldTypes = [
    { name: "Text", type: "text", title: "文本", icon: "fa-fw fa fa-list-alt" },
    { name: "Textarea", type: "textarea", title: "长文本", icon: "fa-fw fa fa-list-alt" },
    { name: "Html", type: "html", title: "富文本", icon: "fa-fw fa fa-code" },
    { name: "Lookup", type: "lookup", title: "相关表关系", icon: "fa-fw fa fa-search" },
    { name: "MasterDetail", type: "master_detail", title: "主/子表关系", icon: "fa-fw fa fa-link" },
    { name: "Select", type: "select", title: "选择", icon: "fa-fw fa fa-list" },
    { name: "Boolean", type: "boolean", title: "布尔", icon: "fa-fw fa fa-check" },
    { name: "Date", type: "date", title: "日期", icon: "fa-fw fa fa-calendar" },
    { name: "Datetime", type: "datetime", title: "日期时间", icon: "fa-fw fa fa-clock" },
    { name: "Time", type: "time", title: "时间", icon: "fa-fw fa fa-clock" },
    { name: "Number", type: "number", title: "数字", icon: "fa-fw fa fa-calculator" },
    { name: "Currency", type: "currency", title: "货币", icon: "fa-fw fa fa-jpy" },
    { name: "Percent", type: "percent", title: "百分比", icon: "fa-fw fa fa-percent" },
    { name: "Image", type: "image", title: "图片", icon: "fa-fw fa fa-image" },
    { name: "File", type: "file", title: "文件", icon: "fa-fw fa fa-file" },
    { name: "Code", type: "code", title: "代码", icon: "fa-fw fa fa-code" },
    { name: "Markdown", type: "markdown", title: "Markdown", icon: "fa-fw fa fa-markdown" },
    { name: "Color", type: "color", title: "颜色", icon: "fa-fw fa fa-palette" },
    { name: "Toggle", type: "toggle", title: "切换", icon: "fa-fw fa fa-toggle-on" },
    { name: "Password", type: "password", title: "密码", icon: "fa-fw fa fa-key" },
    { name: "Autonumber", type: "autonumber", title: "自动编号", icon: "fa-fw fa fa-hashtag" },
    { name: "Url", type: "url", title: "URL", icon: "fa-fw fa fa-link" },
    { name: "Email", type: "email", title: "电子邮件", icon: "fa-fw fa fa-envelope" },
    { name: "Location", type: "location", title: "位置", icon: "fa-fw fa fa-map-marker" },
    { name: "Formula", type: "formula", title: "公式", icon: "fa-fw fa fa-subscript" },
    { name: "Summary", type: "summary", title: "累计汇总", icon: "fa-fw fa fa-superscript" }
];

const fieldMetas = [];

fieldTypes.forEach(({ name, type, title, icon }) => {
    fieldMetas.push(createMetaConfig(name, type, title, icon));
});

export {
    fieldMetas
};
