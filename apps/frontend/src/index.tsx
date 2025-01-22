/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:16:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-22 16:23:00
 * @Description: 
 */
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { Builder, builder, BuilderComponent } from '@builder6/react';
import ReactDOM from 'react-dom';

window['React'] = React;
window['ReactDOM'] = ReactDOM;
(window as any)['Builder'] = Builder;
(window as any)['builder'] = builder;
(window as any)['BuilderComponent'] = BuilderComponent;


console.log(`set window Builder`);

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
