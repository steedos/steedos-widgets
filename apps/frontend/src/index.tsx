/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:16:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-23 13:18:34
 * @Description: 
 */
import { createRoot } from "react-dom/client";

import App from "./App";

import { Builder, builder, BuilderComponent } from '@builder6/react';

(window as any)['Builder'] = Builder;
Builder.settings = { 
  rootUrl: 'http://127.0.0.1:8088/backend',
  assetUrls: ['http://127.0.0.1:8080/@steedos-widgets/amis-object@v6.3.12-beta.15/dist/assets.json'],
  context: {
    rootUrl: 'http://127.0.0.1:8088/backend',
    userId: localStorage.getItem('steedos:userId'),
    tenantId: localStorage.getItem('steedos:spaceId'),
    authToken: localStorage.getItem('steedos:authToken'),
  } 
};
(window as any)['builder'] = builder;
(window as any)['BuilderComponent'] = BuilderComponent;


console.log(`set window Builder`);

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
// React.StrictMode
root.render(
  <> 
    <App />
  </>
);
