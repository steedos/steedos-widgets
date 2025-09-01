/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-01 16:08:49
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-record-service_group', '华炎魔方'),
  componentName: "AmisRecordService",
  title: t('widgets-meta:steedos-record-service_title', '记录服务'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisRecordService",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: t('widgets-meta:steedos-record-service_props_objectApiName', '对象名称'),
    },
    {
      name: "recordId",
      propType: "string",
      description: t('widgets-meta:steedos-record-service_props_recordId', '记录Id'),
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-record-service',
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
        body: [], // 容器类字段
        label: config.title,
        objectApiName: "${objectName}",
        recordId: "${recordId}"
      },
      regions: [
        {
          key: 'body',
          label: t('widgets-meta:steedos-record-service_regions_body', '内容区')
        }
      ],
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users'
      },
      panelTitle: t('widgets-meta:steedos-record-service_panelTitle', '设置')
    }
  }
};
