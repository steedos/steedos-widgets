const amisRequire = window['amisRequire'];
const React = window['React'] = amisRequire('react');
const ReactDOM = window['ReactDOM'] = amisRequire('react-dom');
const Builder6React = window['Builder6React'];
const Builder = window['Builder'] = Builder6React.Builder;
const builder = window['builder'] = Builder6React.builder;
window['moment'] = amisRequire('moment');
window['Amis'] = amisRequire('amis');
window['AmisCore'] = amisRequire('amis-core');
window['AmisUI'] = amisRequire('amis-ui');
window['lodash'] = window['_'];

Builder.settings = { 
  rootUrl: localStorage.getItem('steedos:rootUrl'),
  context: {
    rootUrl: localStorage.getItem('steedos:rootUrl'),
    userId: localStorage.getItem('steedos:userId'),
    tenantId: localStorage.getItem('steedos:spaceId'),
    authToken: localStorage.getItem('steedos:authToken'),
  } 
};

export {
  React,
  ReactDOM,
  Builder,
  builder,
}

export const AmisRender = function ({schema, data = {}, env = {}}) {
  const mergedData = {
    ...window['Builder'].settings,
    ...data,
  }
  const mergedEnv = {
    assetUrls: [],
    unpkgUrl: process.env.STEEDOS_UNPKG_URL || 'https://unpkg.steedos.cn',
    ...env,
  }

  const assetUrls = mergedEnv.assetUrls || []
  const content = {
    data: {
      blocks: [
        {
          "@type": "@builder.io/sdk:Element",
          "@version": 2,
          layerName: "Page",
          id: `builder-assets`,
          component: {
            name: "Core:AssetsLoader",
            options: {
              urls: assetUrls,
              unpkgUrl: process.env.STEEDOS_UNPKG_URL,
            },
          },
          children: [
            {
              id: `builder-amis`,
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              component: {
                name: "Core:Amis",
                options: {
                  schema: schema,
                  data: mergedData,
                  env: mergedEnv,
                },
              },
              responsiveStyles: {
                large: {
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  flexShrink: "0",
                  boxSizing: "border-box",
                  width: "100%",
                },
              },
            },
          ],
          responsiveStyles: {
            large: {
              display: "flex" ,
              flexDirection: "column",
              position: "relative",
              flexShrink: "0",
              boxSizing: "border-box",
              width: "100%",
            },
          },
        },
      ],
    },
  };

  return window['React'].createElement(window['Builder6React'].BuilderComponent, {content})
}
