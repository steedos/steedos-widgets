/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 11:10:03
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "华炎魔方-界面",
    componentName: "SteedosIcon",
    title: "图标",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "SteedosIcon",
      main: "",
      destructuring: true,
      subName: ""
    },
    preview: {
    },
    targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
    engines: ["amis"],
    // settings for amis.
    amis: {
      name: 'steedos-icon',
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
      plugin_disabled: {
        rendererName: config.amis.name,
        $schema: '/schemas/UnkownSchema.json',
        name: config.title,
        description: config.title,
        tags: [config.group],
        order: -9999,
        icon: config.amis.icon,
        scaffold: {
          type: config.amis.name,
          category: 'standard',
          name: 'account',
          colorVariant: 'default',
          size: 'medium'
        },
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: "select",
            name: "category",
            label: "Category",
            options: [
              {label: 'action', value: 'action'},
              {label: 'custom', value: 'custom'},
              {label: 'doctype', value: 'doctype'},
              {label: 'standard', value: 'standard'},
              {label: 'utility', value: 'utility'},
            ]
          },
          {
            "name": "name",
            "label": "Name",
            "type": "select",
            "className": "m-0",
            "labelClassName": "text-left",
            "id": "u:d0724fe17aa7",
            "required": true,
            "joinValues": false,
            "extractValue": true,
            "labelField": "symbol",
            "valueField": "symbol",
            "multiple": false,
            searchable: true,
            "source": {
              "method": "get",
              "url": "${context.rootUrl}/ui.icons.json?c=${category}",
              "requestAdaptor": "",
              "data": {
                "category": "${category}"
              },
              "adaptor": "if (payload && payload.length) {\n  let data = {};\n  let sldsStandardIcons = _.find(payload, { name: api.body.category || \"standard\" });\n  sldsStandardIcons = sldsStandardIcons && sldsStandardIcons.icons;\n  data.options = sldsStandardIcons;\n  payload.data = data;\n}\nconsole.log('payload=====',payload);return payload;\n",
              "headers": {
                  "Authorization": "Bearer ${context.tenantId},${context.authToken}"
              },
              "sendOn": "this.category"
            },
            // 卡. "menuTpl": "<span class=\"flex items-center mt-0.5\">\n  <span role=\"img\" aria-label=\"smile\" class=\"anticon anticon-smile\">\n    <span class=\"slds-icon_container slds-icon-standard-${symbol|split:_|join:-}\">\n        <svg class=\"slds-icon slds-icon_x-small\" aria-hidden=\"true\">\n          <use xlink:href=\"/assets/icons/standard-sprite/svg/symbols.svg#${symbol}\"></use>\n        </svg>\n    </span>\n  </span>\n  <span class=\"pl-1.5\">${symbol}</span>\n</span>"
        },
          {
            type: "text",
            name: "className",
            label: "ClassName"
          },
          {
            type: "text",
            name: "containerClassName",
            label: "Container ClassName"
          },
          {
            type: "select",
            name: "colorVariant",
            label: "Icon color variants",
            options: [
              {label: 'base', value: 'base'},
              {label: 'default', value: 'default'},
              {label: 'error', value: 'error'},
              {label: 'light', value: 'light'},
              {label: 'warning', value: 'warning'}
            ]
          },
          {
            type: "select",
            name: "size",
            label: "Size of the icon",
            options: [
              {label: 'xx-small', value: 'xx-small'},
              {label: 'x-small', value: 'x-small'},
              {label: 'small', value: 'small'},
              {label: 'medium', value: 'medium'},
              {label: 'large', value: 'large'},
            ]
          },
          {
            type: 'text',
            name: 'basePath',
            label: 'Base Path'
          }
        ]
      }
    }
  };
  