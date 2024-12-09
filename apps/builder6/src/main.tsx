import { StrictMode } from 'react'
import { Builder, builder } from '@builder6/react';
import * as lodash from 'lodash';

import ReactDOM from 'react-dom';
import './index.css'
import App from './App.tsx'

import { AmisComponent } from './components/Amis.tsx';
import { amisConfig } from './components/Amis.config.ts';
Builder.registerComponent(AmisComponent, amisConfig);

// (window as any)['React'] = React;
// (window as any)['ReactDOM'] = ReactDOM;
(window as any)['Builder'] = Builder;
(window as any)['builder'] = builder;
(window as any)['_'] = lodash;  

ReactDOM.render((
    <App />
), document.getElementById('root')!);
