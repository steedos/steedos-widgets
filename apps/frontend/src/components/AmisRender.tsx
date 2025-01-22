/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:51:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-22 15:42:32
 * @Description: 
 */

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BuilderComponent, Builder, builder, useIsPreviewing } from '@builder6/react';

window['React'] = React;
window['ReactDOM'] = ReactDOM;
(window as any)['Builder'] = Builder;
(window as any)['builder'] = builder;

Builder.settings = { 
  rootUrl: localStorage.getItem('steedos:rootUrl'),
  assetUrls: ['http://127.0.0.1:8080/@steedos-widgets/amis-object@v6.3.12-beta.15/dist/assets.json'],
  context: {
    rootUrl: localStorage.getItem('steedos:rootUrl'),
    userId: localStorage.getItem('steedos:userId'),
    tenantId: localStorage.getItem('steedos:spaceId'),
    authToken: localStorage.getItem('steedos:authToken'),
  } 
};

export const AmisRender = function ({schema = {}, data = {}, env = {}}) {
  const mergedData = {
    ...Builder.settings,
    ...data,
  }
  const mergedEnv = {
    assetUrls: Builder.settings.assetUrls,
    unpkgUrl: 'https://unpkg.steedos.cn',
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
              unpkgUrl: 'https://unpkg.steedos.cn'
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

  return <BuilderComponent model="pages" content={content} data={data}/>
}
