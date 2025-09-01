const t = (window as any).steedosI18next.t;

const config: any = {
    componentType: 'amisSchema',
    group: t('widgets-meta:steedos-field_group', "华炎魔方-原子组件"),
    componentName: "AmisSteedosField",
    title: t('widgets-meta:steedos-field_title', "字段"),
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "AmisSteedosField",
      main: "",
      destructuring: true,
      subName: ""
    },
    preview: {},
    targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
    engines: ["amis"],
    amis: {
      name: 'steedos-field',
      icon: "fa-fw fa fa-list-alt"
    }
};

export default {
  ...config,
  snippets: [
    {
      title: config.title,
      screenshot: "",
      schema: {
        componentName: config.componentName,
        props: config.preview
      }
    }
  ],
  amis: {
    render: {
      type: config.amis.name,
      usage: "renderer",
      weight: 1,
      framework: "react"
    },
    plugin: {
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        config: {
          type: "text",
          label: t('widgets-meta:steedos-field_scaffold_label', "字段1"),
          amis: {}
        }
      },
      previewSchema: {
        type: config.amis.name,
        config: {
          type: "text",
          label: t('widgets-meta:steedos-field_preview_label', "字段1"),
          amis: {}
        }
      },
      panelTitle: t('widgets-meta:steedos-field_panelTitle', "设置"),
      panelControls: [
        {
          type: "tabs",
          tabsMode: "line",
          className: "editor-prop-config-tabs",
          linksClassName: "editor-prop-config-tabs-links",
          contentClassName: "no-border editor-prop-config-tabs-cont",
          tabs: [
            /**
             * Tab General
             */
            {
              title: t('widgets-meta:steedos-field_tab_general', "通用"),
              className: "ae-formItemControl-body",
              body: [
                {
                  type: "input-text",
                  name: "config.object",
                  value: "${objectName}",
                  disabled: true,
                  label: t("widgets-meta:steedos-field_object", "对象"),
                  required: true
                },
                {
                  name: "config.type",
                  label: t("widgets-meta:steedos-field_type", "字段类型"),
                  required: true,
                  type: "select",
                  joinValues: false,
                  options: [
                    { label: t("widgets-meta:steedos-field_type_text", "文本"), value: "text" },
                    { label: t("widgets-meta:steedos-field_type_textarea", "长文本"), value: "textarea" },
                    { label: t("widgets-meta:steedos-field_type_html", "富文本"), value: "html" },
                    { label: t("widgets-meta:steedos-field_type_code", "代码"), value: "code" },
                    { label: t("widgets-meta:steedos-field_type_markdown", "Markdown"), value: "markdown" },
                    { label: t("widgets-meta:steedos-field_type_select", "选择框"), value: "select" },
                    { label: t("widgets-meta:steedos-field_type_color", "颜色"), value: "color" },
                    { label: t("widgets-meta:steedos-field_type_boolean", "复选框"), value: "boolean" },
                    { label: t("widgets-meta:steedos-field_type_toggle", "开关"), value: "toggle" },
                    { label: t("widgets-meta:steedos-field_type_date", "日期"), value: "date" },
                    { label: t("widgets-meta:steedos-field_type_datetime", "日期时间"), value: "datetime" },
                    { label: t("widgets-meta:steedos-field_type_time", "时间"), value: "time" },
                    { label: t("widgets-meta:steedos-field_type_number", "数值"), value: "number" },
                    { label: t("widgets-meta:steedos-field_type_currency", "金额"), value: "currency" },
                    { label: t("widgets-meta:steedos-field_type_percent", "百分比"), value: "percent" },
                    { label: t("widgets-meta:steedos-field_type_password", "密码"), value: "password" },
                    { label: t("widgets-meta:steedos-field_type_lookup", "相关表关系"), value: "lookup" },
                    { label: t("widgets-meta:steedos-field_type_master_detail", "主/子表关系"), value: "master_detail" },
                    { label: t("widgets-meta:steedos-field_type_autonumber", "自动编号"), value: "autonumber" },
                    { label: t("widgets-meta:steedos-field_type_url", "网址"), value: "url" },
                    { label: t("widgets-meta:steedos-field_type_email", "邮件地址"), value: "email" },
                    { label: t("widgets-meta:steedos-field_type_location", "地理位置"), value: "location" },
                    { label: t("widgets-meta:steedos-field_type_image", "图片"), value: "image" },
                    { label: t("widgets-meta:steedos-field_type_file", "附件"), value: "file" },
                    { label: t("widgets-meta:steedos-field_type_formula", "公式"), value: "formula" },
                    { label: t("widgets-meta:steedos-field_type_summary", "累计汇总"), value: "summary" }
                  ],
                  extractValue: true,
                  clearable: true,
                  labelField: "label",
                  valueField: "value",
                  labelClassName: "text-left",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}",
                  searchable: true
                },
                {
                  name: "config.label",
                  label: t("widgets-meta:steedos-field_label", "显示名称"),
                  labelRemark: "",
                  description: "",
                  required: true,
                  type: "input-text",
                  labelClassName: "text-left",
                  clearValueOnHidden: true
                },
                {
                  name: "config.name",
                  label: t("widgets-meta:steedos-field_api_name", "API 名称"),
                  labelRemark: t("widgets-meta:steedos-field_api_name_remark", "API 名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符"),
                  description: "",
                  required: true,
                  type: "input-text",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.autonumber_enable_modify",
                  label: t("widgets-meta:steedos-field_autonumber_enable_modify", "允许修改编号"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  visibleOn: "config.type === 'autonumber' ? true: false",
                  clearValueOnHidden: true
                },
                {
                  name: "config.rows",
                  label: t("widgets-meta:steedos-field_rows", "多行文本行数"),
                  labelRemark: "",
                  description: "",
                  requiredOn: "config.type === 'textarea' ? true: false",
                  type: "input-number",
                  precision: 0,
                  visibleOn: "config.type === 'textarea' ? true: false",
                  clearValueOnHidden: true
                },
                {
                  name: "config.language",
                  label: t("widgets-meta:steedos-field_language", "语言"),
                  requiredOn: "['code'].indexOf(config.type) > -1 ? true: false",
                  type: "select",
                  joinValues: false,
                  options: [
                    { label: "bat", value: "bat" }, { label: "c", value: "c" }, { label: "coffeescript", value: "coffeescript" }, { label: "cpp", value: "cpp" },
                    { label: "csharp", value: "csharp" }, { label: "css", value: "css" }, { label: "dockerfile", value: "dockerfile" }, { label: "fsharp", value: "fsharp" },
                    { label: "go", value: "go" }, { label: "handlebars", value: "handlebars" }, { label: "html", value: "html" }, { label: "ini", value: "ini" },
                    { label: "java", value: "java" }, { label: "javascript", value: "javascript" }, { label: "json", value: "json" }, { label: "less", value: "less" },
                    { label: "lua", value: "lua" }, { label: "markdown", value: "markdown" }, { label: "msdax", value: "msdax" }, { label: "objective-c", value: "objective-c" },
                    { label: "php", value: "php" }, { label: "plaintext", value: "plaintext" }, { label: "postiats", value: "postiats" }, { label: "powershell", value: "powershell" },
                    { label: "pug", value: "pug" }, { label: "python", value: "python" }, { label: "r", value: "r" }, { label: "razor", value: "razor" },
                    { label: "ruby", value: "ruby" }, { label: "sb", value: "sb" }, { label: "scss", value: "scss" }, { label: "shell", value: "shell" },
                    { label: "sol", value: "sol" }, { label: "sql", value: "sql" }, { label: "swift", value: "swift" }, { label: "typescript", value: "typescript" },
                    { label: "vb", value: "vb" }, { label: "xml", value: "xml" }, { label: "yaml", value: "yaml" }
                  ],
                  extractValue: true,
                  clearable: true,
                  labelField: "label",
                  valueField: "value",
                  visibleOn: "['code'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.multiple",
                  label: t("widgets-meta:steedos-field_multiple", "多选"),
                  labelRemark: t("widgets-meta:steedos-field_multiple_remark", "单选<==>多选 相互切换，请自行重新提交已有记录或在数据库中统一修改此字段的保存格式。"),
                  type: "checkbox",
                  visibleOn: "['select', 'lookup', 'image','file'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.data_type",
                  label: t("widgets-meta:steedos-field_data_type", "数据类型"),
                  labelRemark: t("widgets-meta:steedos-field_data_type_remark", "字段类型为公式时，必须填写此字段。"),
                  requiredOn: "['formula'].indexOf(config.type) > -1 ? true: false",
                  type: "select",
                  joinValues: false,
                  extractValue: true,
                  clearable: true,
                  disabledOn: "${config.is_system == true}",
                  searchable: true,
                  source: {
                    method: "post",
                    data: { query: "" },
                    url: "/api/amis/health_check?depend_on_type=${config.type}",
                    sendOn: "this.config.type",
                    adaptor: `
                      if (context.config.type === "select") {
                        payload.data.options = [
                          { label: t('widgets-meta:steedos-field_option_boolean', "布尔"), value: "boolean" },
                          { label: t('widgets-meta:steedos-field_option_number', "数值"), value: "number" },
                          { label: t('widgets-meta:steedos-field_option_text', "文本"), value: "text" }
                        ]
                      } else {
                        payload.data.options = [
                          { label: t('widgets-meta:steedos-field_option_boolean', "布尔"), value: "boolean" },
                          { label: t('widgets-meta:steedos-field_option_number', "数值"), value: "number" },
                          { label: t('widgets-meta:steedos-field_option_currency', "金额"), value: "currency" },
                          { label: t('widgets-meta:steedos-field_option_percent', "百分比"), value: "percent" },
                          { label: t('widgets-meta:steedos-field_option_text', "文本"), value: "text" },
                          { label: t('widgets-meta:steedos-field_option_date', "日期"), value: "date" },
                          { label: t('widgets-meta:steedos-field_option_datetime', "日期时间"), value: "datetime" }
                        ]
                      }
                      return payload;`
                  },
                  visibleOn: "['formula','select'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true
                },
                {
                  type: "input-table",
                  name: "config.options",
                  label: t("widgets-meta:steedos-field_options", "选择项"),
                  labelRemark: t("widgets-meta:steedos-field_options_remark", "选择项的每个选项显示名及选项值不能为空，背景颜色请设置为ffffff这种格式的16进制数值。"),
                  requiredOn: "config.type === 'select' ? true: false",
                  visibleOn: "config.type === 'select' ? true: false",
                  clearValueOnHidden: true,
                  showIndex: true,
                  addable: true,
                  removable: true,
                  columnsTogglable: false,
                  needConfirm: false,
                  footerAddBtn: {
                    visibleOn: "${!config.is_system}"
                  },
                  columns: [
                    {
                      type: "input-text",
                      name: "label",
                      label: t("widgets-meta:steedos-field_options_column_label", "显示名"),
                      required: true,
                      disabledOn: "${config.is_system == true}",
                      width: 100
                    },
                    {
                      type: "input-text",
                      name: "value",
                      label: t("widgets-meta:steedos-field_options_column_value", "选项值"),
                      required: true,
                      disabledOn: "${config.is_system == true}",
                      width: 100
                    },
                    {
                      type: "input-color",
                      name: "color",
                      label: t("widgets-meta:steedos-field_options_column_color", "背景颜色"),
                      disabledOn: "${config.is_system == true}",
                      width: 70
                    },
                    {
                      type: "textarea",
                      name: "description",
                      label: t("widgets-meta:steedos-field_options_column_description", "描述"),
                      disabledOn: "${config.is_system == true}",
                      width: 100
                    },
                    {
                      type: "operation",
                      label: t("widgets-meta:steedos-field_options_column_operation", "操作"),
                      visibleOn: "${!config.is_system}",
                      width: 70,
                      fixed: "right"
                    }
                  ]
                },
                {
                  name: "config.precision",
                  label: t("widgets-meta:steedos-field_precision", "数字位数"),
                  labelRemark: t("widgets-meta:steedos-field_precision_remark", "小数点左边的数字位数"),
                  requiredOn: "(function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })()",
                  type: "input-number",
                  precision: 0,
                  visibleOn: "(function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })()",
                  clearValueOnHidden: true,
                  value: 18,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.scale",
                  label: t("widgets-meta:steedos-field_scale", "小数位数"),
                  labelRemark: t("widgets-meta:steedos-field_scale_remark", "If the field type is a Percent, this indicates the number of decimal places the field will display, for example, two decimal places will display as 10.20%."),
                  requiredOn: "(function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })()",
                  type: "input-number",
                  min: 0,
                  precision: 0,
                  visibleOn: "(function(){ if(['number', 'currency', 'percent', 'summary'].indexOf(config.type) > -1){ return true; } else{ if(['formula'].indexOf(config.type) > -1 && ['number', 'currency', 'percent'].indexOf(config.data_type) > -1){ return true; } else{ return false; } } })()",
                  labelClassName: "text-left",
                  clearValueOnHidden: true,
                  value: 2,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.formula",
                  label: t("widgets-meta:steedos-field_formula", "公式"),
                  labelRemark: t("widgets-meta:steedos-field_formula_remark", "字段类型为自动编号或公式时，必须填写此字段。"),
                  description: "",
                  requiredOn: "['autonumber', 'formula'].indexOf(config.type) > -1 ? true: false",
                  type: "textarea",
                  visibleOn: "['autonumber', 'formula'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.show_as_qr",
                  label: t("widgets-meta:steedos-field_show_as_qr", "显示为二维码"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  visibleOn: "config.type === 'url' ? true: false",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.coordinatesType",
                  label: t("widgets-meta:steedos-field_coordinatesType", "坐标类型"),
                  required: false,
                  type: "input-text",
                  visibleOn: "['location'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}",
                  value: "bd09"
                },
                {
                  name: "config.formula_blank_value",
                  label: t("widgets-meta:steedos-field_formula_blank_value", "空白字段处理"),
                  labelRemark: t("widgets-meta:steedos-field_formula_blank_value_remark", "如果您的公式引用了任何数字和货币字段，请指定当这些字段值为空时如何处理公式输出。"),
                  description: "",
                  requiredOn: "['formula'].indexOf(config.type) > -1 ? true: false",
                  type: "select",
                  joinValues: false,
                  options: [
                    { label: t("widgets-meta:steedos-field_option_formulazeroes", "将空白字段视为零"), value: "zeroes" },
                    { label: t("widgets-meta:steedos-field_option_formulablanks", "将空白字段视为空白"), value: "blanks" }
                  ],
                  extractValue: true,
                  clearable: true,
                  labelField: "label",
                  valueField: "value",
                  visibleOn: "['formula'].indexOf(config.type) > -1 ? true: false",
                  labelClassName: "text-left",
                  clearValueOnHidden: true,
                  fieldName: "config.formula_blank_value",
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.reference_to",
                  label: t("widgets-meta:steedos-field_reference_to", "引用对象"),
                  requiredOn: "['lookup','master_detail'].indexOf(config.type) > -1 ? true: false",
                  type: "select",
                  joinValues: false,
                  extractValue: true,
                  clearable: true,
                  disabledOn: "${config.is_system == true}",
                  searchable: true,
                  source: {
                    method: "post",
                    url: "${context.rootUrl}/graphql?reload=${additionalFilters|join}",
                    data: {
                      orderBy: "${orderBy}",
                      orderDir: "${orderDir}",
                      pageNo: "${page}",
                      pageSize: "${perPage}",
                      queryFields: "_id space label:label value:name",
                      query: "{options:objects(filters: {__filters}, top: {__top}, sort: \"{__sort}\"){_id space label:label value:name},count:objects__count(filters:{__filters})}",
                      "$term": "$term",
                      "$value": "$config.reference_to",
                      "$": "$$"
                    },
                    headers: {
                      Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: "\n            const data = payload.data;\n            var defaultValueOptions = data.defaultValueOptions;\n            data.options = _.unionWith(defaultValueOptions, data.options, function(a,b){ return a[\"value\"]=== b[\"value\"]; });\n            delete data.defaultValueOptions;\n            payload.data.options = data.options;\n            return payload;\n        ",
                    requestAdaptor: "......" // 按原样复制（太长省略，逻辑未变，不含界面文本）
                  },
                  menuTpl: "<div>${label}(${value})</div>",
                  visibleOn: "['lookup', 'master_detail'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true
                },
                {
                  name: "config.summary_object",
                  label: t("widgets-meta:steedos-field_summary_object", "要汇总的对象"),
                  labelRemark: t("widgets-meta:steedos-field_summary_object_remark", "字段类型为累计汇总时，必须填写此字段。"),
                  description: "",
                  requiredOn: "config.type === 'summary' ? true: false",
                  type: "select",
                  joinValues: false,
                  extractValue: true,
                  clearable: true,
                  disabledOn: "${config.is_system == true}",
                  searchable: true,
                  source: {
                    method: "get",
                    url: "${context.rootUrl}/service/api/amis-metadata-objects/objects/${config.object}/detailLists/options?depend_on_object=${config.object}",
                    headers: {
                      Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: "",
                    sendOn: "this.config.object",
                    requestAdaptor: ""
                  },
                  visibleOn: "config.type === 'summary' ? true: false",
                  clearValueOnHidden: true,
                  autoComplete: {
                    method: "get",
                    url: "${context.rootUrl}/service/api/amis-metadata-objects/objects/${config.object}/detailLists/options?depend_on_object=${config.object}",
                    headers: {
                      Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: "",
                    sendOn: "this.config.object",
                    requestAdaptor: ""
                  }
                },
                {
                  name: "config.summary_type",
                  label: t("widgets-meta:steedos-field_summary_type", "汇总类型"),
                  labelRemark: t("widgets-meta:steedos-field_summary_type_remark", "字段类型为累计汇总时，必须填写此字段。"),
                  requiredOn: "config.type === 'summary' ? true: false",
                  type: "select",
                  joinValues: false,
                  options: [
                    { label: t("widgets-meta:steedos-field_summary_type_count", "COUNT"), value: "count" },
                    { label: t("widgets-meta:steedos-field_summary_type_sum", "SUM"), value: "sum" },
                    { label: t("widgets-meta:steedos-field_summary_type_min", "MIN"), value: "min" },
                    { label: t("widgets-meta:steedos-field_summary_type_max", "MAX"), value: "max" },
                    { label: t("widgets-meta:steedos-field_summary_type_avg", "AVG"), value: "avg" }
                  ],
                  extractValue: true,
                  clearable: true,
                  labelField: "label",
                  valueField: "value",
                  visibleOn: "config.type === 'summary' ? true: false",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.summary_field",
                  label: t("widgets-meta:steedos-field_summary_field", "汇总字段"),
                  labelRemark: t("widgets-meta:steedos-field_summary_field_remark", "字段类型为累计汇总且汇总类型不是COUNT时，必须填写此字段，只支持聚合数值、金额、日期、日期时间类型的字段。"),
                  description: "",
                  requiredOn: "config.type === 'summary' && config.summary_type !== 'count' ? true: false",
                  type: "select",
                  joinValues: false,
                  extractValue: true,
                  clearable: true,
                  disabledOn: "${config.is_system == true}",
                  searchable: true,
                  source: {
                    method: "post",
                    url: "${context.rootUrl}/graphql?reload=${additionalFilters|join}&depend_on_summary_object=${config.summary_object}&depend_on_summary_type=${config.summary_type}",
                    data: {
                      orderBy: "${orderBy}",
                      orderDir: "${orderDir}",
                      pageNo: "${page}",
                      pageSize: "${perPage}",
                      queryFields: "_id space label:label value:name",
                      query: "{options:object_fields(filters: {__filters}, top: {__top}, sort: \"{__sort}\"){_id space label:label value:name},count:object_fields__count(filters:{__filters})}",
                      "$term": "$term",
                      "$value": "$config.summary_field",
                      "summary_object": "$config.summary_object",
                      "summary_type": "$config.summary_type",
                      "$": "$$"
                    },
                    headers: {
                      Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: "\n           const data = payload.data;\n            var defaultValueOptions = data.defaultValueOptions;\n            data.options = _.unionWith(defaultValueOptions, data.options, function(a,b){ return a[\"value\"]=== b[\"value\"]; });\n            delete data.defaultValueOptions;\n            payload.data.options = data.options;\n            return payload;\n        ",
                    sendOn: "this.config.summary_object && this.config.summary_type",
                    requestAdaptor: "......"
                  },
                  visibleOn: "config.type === 'summary' && config.summary_object && config.summary_type && config.summary_type !== 'count'",
                  clearValueOnHidden: true,
                  autoComplete: {
                    method: "get",
                    url: "${context.rootUrl}/service/api/@${config.summary_object}/uiSchema?summary_object=${config.summary_object}&summary_type=${config.summary_type}&term=${term}",
                    data: {
                      summary_type: "${config.summary_type}"
                    },
                    headers: {
                      Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    sendOn: "!!this.config.summary_object && !!this.config.summary_type",
                    adaptor: 'const summary_type = api.body.summary_type;const term = api.query.term;let fields = payload.fields;let options = [];if (fields) { if (summary_type && summary_type !== "count") {if (summary_type === "sum" || summary_type === "avg") {_.forEach(fields, (value, key) => {let fieldType = value.type;if (["formula", "summary"].indexOf(fieldType) > -1) {fieldType = value.data_type;}if (["number", "currency", "percent"].indexOf(fieldType) > -1) {options.push({ label: value.label, value: value.name });}})} else {_.forEach(fields, (value, key) => {let fieldType = value.type;if (["formula", "summary"].indexOf(fieldType) > -1) {fieldType = value.data_type;}if (["number", "currency", "percent", "date", "datetime"].indexOf(fieldType) > -1) {options.push({ label: value.label, value: value.name });}})}}if (term) {options = _.filter(options, (item) => {return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;})}}payload = {data: { options: options },msg: "",status: 0}return payload;'
                  }
                },
                {
                  name: "config.description",
                  label: t("widgets-meta:steedos-field_description", "描述"),
                  required: false,
                  type: "textarea",
                  tpl: "<%=(data.config.description || \"\").split(\"\\n\").join('<br>')%>",
                  clearValueOnHidden: true
                },
                {
                  name: "config.deleted_lookup_record_behavior",
                  label: t("widgets-meta:steedos-field_deleted_lookup_record_behavior", "如果相关表记录被删除怎么办？"),
                  required: true,
                  type: "select",
                  joinValues: false,
                  options: [
                    { label: t("widgets-meta:steedos-field_deleted_lookup_record_behavior_clear", "清除此字段的值。 如果您将此字段设为必填，您不能选择此选项。"), value: "clear" },
                    { label: t("widgets-meta:steedos-field_deleted_lookup_record_behavior_retain", "不允许删除＂作为相关表关系的一部分的相关表记录＂。"), value: "retain" }
                  ],
                  extractValue: true,
                  clearable: true,
                  labelField: "label",
                  valueField: "value",
                  visibleOn: " 'lookup' === config.type ? true: false ",
                  clearValueOnHidden: true,
                  disabledOn: "${config.required==true}",
                  value: "${IFS(true===config.required, \"retain\", !config.required && !config.deleted_lookup_record_behavior, \"clear\", config.deleted_lookup_record_behavior)}"
                },
                {
                  name: "config.write_requires_master_read",
                  label: t("widgets-meta:steedos-field_write_requires_master_read", "当用户对主表记录有读取权限时对子表记录可以增删改"),
                  labelRemark: t("widgets-meta:steedos-field_write_requires_master_read_remark", "设置主记录上创建、编辑或删除子记录所需的最低访问级别。此字段仅适用于·主表/子表·字段类型。勾选表示允许具有'读取'访问权限的用户创建、编辑或删除子记录。反之表示允许具有'读取/写入'访问权限的用户创建、编辑或删除子记录的权限。"),
                  type: "checkbox",
                  visibleOn: "config.type === 'master_detail' ? true: false",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                }
              ]
            },
            /**
             * Tab Form
             */
            {
              title: t("widgets-meta:steedos-field_tab_form", "表单"),
              className: "ae-formItemControl-body",
              body: [
                {
                  name: "config.required",
                  label: t("widgets-meta:steedos-field_required", "必填"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  visibleOn: "['autonumber','summary','formula'].indexOf(config.type) > -1 ? false: true",
                  clearValueOnHidden: true,
                  fieldName: "config.required"
                },
                {
                  name: "config.is_wide",
                  label: t("widgets-meta:steedos-field_is_wide", "宽字段"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  labelClassName: "text-left",
                  clearValueOnHidden: true,
                  fieldName: "config.is_wide"
                },
                {
                  name: "config.readonly",
                  label: t("widgets-meta:steedos-field_readonly", "只读"),
                  labelRemark: t("widgets-meta:steedos-field_readonly_remark", "只读字段不显示在表单上，数据不会提交到服务端。"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  clearValueOnHidden: true,
                  fieldName: "config.readonly"
                },
                {
                  name: "config.static",
                  label: t("widgets-meta:steedos-field_static", "静态"),
                  labelRemark: t("widgets-meta:steedos-field_static_remark", "静态字段在表单上显示，用户不可编辑，可动态赋值。"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  clearValueOnHidden: true,
                  fieldName: "config.static"
                },
                {
                  name: "config.inlineHelpText",
                  label: t("widgets-meta:steedos-field_inlineHelpText", "提示文本"),
                  required: false,
                  type: "textarea",
                  tpl: "<%=(data.config.inlineHelpText || \"\").split(\"\\n\").join('<br>')%>",
                  className: "col-span-2 m-0 steedos-textarea-edit ",
                  labelClassName: "text-left",
                  clearValueOnHidden: true,
                  fieldName: "config.inlineHelpText"
                },
                {
                  name: "config.enable_enhanced_lookup",
                  label: t("widgets-meta:steedos-field_enable_enhanced_lookup", "弹出选择"),
                  labelRemark: t("widgets-meta:steedos-field_enable_enhanced_lookup_remark", "被其他字段引用时，使用弹出框选择记录。"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  visibleOn: "['lookup'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true
                },
                {
                  name: "config.create",
                  label: t("widgets-meta:steedos-field_create", "弹出选择时允许新建"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  visibleOn: "['lookup'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true,
                  fieldName: "config.create",
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.depend_on",
                  label: t("widgets-meta:steedos-field_depend_on", "依赖字段"),
                  labelRemark: t("widgets-meta:steedos-field_depend_on_remark", "依赖字段的变化会触发当前字段重算"),
                  description: "",
                  required: false,
                  type: "select",
                  joinValues: false,
                  extractValue: true,
                  clearable: true,
                  disabledOn: "${config.is_system == true}",
                  visibleOn: "['lookup', 'master_detail'].indexOf(config.type) > -1 ? true: false",
                  searchable: true,
                  multiple: true,
                  source: {
                    method: "post",
                    url: "${context.rootUrl}/graphql?reload=${additionalFilters|join}",
                    data: {
                      query: `{options:object_fields(filters: ["object","=","\${config.object}"], top: 200, sort: "created desc"){_id space label:label value:name},count:object_fields__count(filters:["object","=","\${config.object}"])}`,
                      "$value": "$config.depend_on",
                      "$": "$$"
                    },
                    sendOn: "this.config.object",
                    trackExpression: "${config.object}",
                    headers: {
                      Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: "\n const data = payload.data;\nvar defaultValueOptions = data.defaultValueOptions;\ndata.options = _.unionWith(defaultValueOptions, data.options, function(a,b){ return a[\"value\"]=== b[\"value\"]; });\ndelete data.defaultValueOptions;\npayload.data.options = data.options;\nreturn payload;\n"
                  },
                  clearValueOnHidden: true
                },
                {
                  name: "config.enable_thousands",
                  label: t("widgets-meta:steedos-field_enable_thousands", "显示千分符"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  visibleOn: "['number','currency','percent'].indexOf(config.type) > -1 ? true: false",
                  clearValueOnHidden: true,
                  fieldName: "config.enable_thousands"
                }
              ]
            },
            /**
             * Tab Advanced
             */
            {
              title: t("widgets-meta:steedos-field_tab_advanced", "高级"),
              className: "ae-formItemControl-body",
              body: [
                {
                  name: "config.unique",
                  label: t("widgets-meta:steedos-field_unique", "创建唯一索引"),
                  labelRemark: t("widgets-meta:steedos-field_unique_remark", "默认每天凌晨执行一次创建，已有的索引不重复创建。"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  clearValueOnHidden: true
                },
                {
                  name: "config.filterable",
                  label: t("widgets-meta:steedos-field_filterable", "列表页过滤器默认字段"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  clearValueOnHidden: true
                },
                {
                  name: "config.index",
                  label: t("widgets-meta:steedos-field_index", "创建索引"),
                  labelRemark: t("widgets-meta:steedos-field_index_remark", "默认每天凌晨执行一次创建，已有的索引不重复创建。"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  clearValueOnHidden: true
                },
                {
                  name: "config.is_name",
                  label: t("widgets-meta:steedos-field_is_name", "名称字段"),
                  required: false,
                  type: "checkbox",
                  tpl: null,
                  visibleOn: "${ARRAYSOME(['text', 'textarea', 'autonumber', 'date', 'datetime', 'time', 'formula', 'lookup', 'master_detail'], item => item === config.type) && !config.multiple}",
                  clearValueOnHidden: true,
                  disabledOn: "${config.is_system == true}"
                },
                {
                  name: "config.reference_to_field",
                  label: t("widgets-meta:steedos-field_reference_to_field", "外键字段"),
                  labelRemark: t("widgets-meta:steedos-field_reference_to_field_remark", "关联的对象保存到当前对象字段的值；例如：A对象关联B对象后，当A1记录关联了B1记录，默认会存B1记录的_id存到A1记录中。如果修改了外键字段后，会将“外键字段”替换_id存储到A1记录中。"),
                  description: t("widgets-meta:steedos-field_reference_to_field_description", "默认为主键，默认值是_id"),
                  required: false,
                  type: "select",
                  joinValues: false,
                  extractValue: true,
                  clearable: true,
                  disabledOn: "${config.is_system == true}",
                  visibleOn: "['lookup', 'master_detail'].indexOf(config.type) > -1 ? true: false",
                  searchable: true,
                  multiple: false,
                  source: {
                    method: "post",
                    url: "${context.rootUrl}/graphql?reload=${additionalFilters|join}",
                    data: {
                      query: `{options:object_fields(filters: ["object","=","\${config.reference_to}"], top: 200, sort: "created desc"){_id space label:label value:name},count:object_fields__count(filters:["object","=","\${config.reference_to}"])}`,
                      "$value": "$config.reference_to_field",
                      "$": "$$"
                    },
                    sendOn: "this.config.reference_to",
                    trackExpression: "${config.reference_to}",
                    headers: {
                      Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: "\n const data = payload.data;\nvar defaultValueOptions = data.defaultValueOptions;\ndata.options = _.unionWith(defaultValueOptions, data.options, function(a,b){ return a[\"value\"]=== b[\"value\"]; });\ndelete data.defaultValueOptions;\npayload.data.options = data.options;\nreturn payload;\n"
                  },
                  clearValueOnHidden: true
                }
              ]
            }
          ]
        }
      ]
    }
  }
};