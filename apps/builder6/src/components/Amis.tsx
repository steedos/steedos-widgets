/*
 * @LastEditTime: 2024-06-25 16:12:37
 * @LastEditors: baozhoutao@steedos.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { PropsWithChildren } from 'react';
import { BuilderElement, Builder } from '@builder6/react';


interface AmisProps {
  context: object;
  schema: object;
  data: object;
  builderState: any;
  builderBlock: BuilderElement;
}

interface AmisComponentState {
  isLoaded: boolean;
}

export class AmisComponent extends React.Component<PropsWithChildren<AmisProps>, AmisComponentState> {
  amis: any = null;
  amisLib: any = null;
  ref: any = null;
  amisScoped: any = null;

  firstLoad = true;

  // componentWillUnmount() {
  //   if (this.amisScoped) {
  //     this.amisScoped.unmount();
  //   }
  // }

  loadResources() {
    if (Builder.isBrowser && (window as any)['amisRequire'] && (window as any)['amisRequire']('amis/embed')) {
      this.setState({ isLoaded: true }, () => {
        this.initializeAmis();
      });
      return;
    }

    const unpkgUrl = Builder.settings["unpkgUrl"] || 'https://unpkg.steedos.cn';
    const amisVersion = Builder.settings["amisVersion"] || '6.5.0';
    const amisTheme = Builder.settings["amisTheme"] || 'antd';

    const scripts = [
      { src: `${unpkgUrl}/amis@${amisVersion}/sdk/sdk.js`, type: "script" },
    ];

    const styles = [
      { href: `${unpkgUrl}/amis@${amisVersion}/sdk/${amisTheme}.css`, type: "link" },
      { href: `${unpkgUrl}/amis@${amisVersion}/sdk/helper.css`, type: "link" },
      { href: `${unpkgUrl}/amis@${amisVersion}/sdk/iconfont.css`, type: "link" },
    ];
    let loadedScripts = 0;
    let loadedStyles = 0;

    const onLoad = () => {
      loadedScripts++;
      if (loadedScripts === scripts.length && loadedStyles === styles.length) {
        this.setState({ isLoaded: true }, () => {
          this.initializeAmis();
        });
      }
    };

    const onError = (src: any) => {
      console.error(`Failed to load resource: ${src}`);
    };

    scripts.forEach(({ src }) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onLoad;
        script.onerror = () => onError(src);
        document.head.appendChild(script);
      } else {
        loadedScripts++;
      }
    });

    styles.forEach(({ href }) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => {
          loadedStyles++;
          if (loadedScripts === scripts.length && loadedStyles === styles.length) {
            this.setState({ isLoaded: true }, () => {
              this.initializeAmis();
            });
          }
        };
        link.onerror = () => onError(href);
        document.head.appendChild(link);
      } else {
        loadedStyles++;
      }
    });

    if (loadedScripts === scripts.length && loadedStyles === styles.length) {
      this.setState({ isLoaded: true }, () => {
        this.initializeAmis();
      });
    }
  }


  initializeAmis() {

    if (Builder.isServer){
      return
    }
    this.amis = (window as any)['amisRequire'] && (window as any)['amisRequire']('amis/embed');
    this.amisLib = (window as any)['amisRequire'] && (window as any)['amisRequire']('amis');
    if (!this.amis) {
      console.error('Amis is not loaded');
      return;
    }
    this.registerComponents();
    const amisTheme = Builder.settings["amisTheme"] || 'antd';
    const { builderState } = this.props;
    const data = {
      ...builderState.state,
      ...this.props.data,
    };
    const context = {
      theme: amisTheme,
      requestAdaptor: (config: any)=>{
        if(config.allowCredentials != true){
          config.withCredentials = false;
          delete config.allowCredentials
        }
        return config;
      },
      ...this.props.context,
      ...builderState.context,
    };
    this.amisScoped = this.amis.embed(this.ref.current, this.props.schema, { data }, context);
    
  }

  registerComponents() {

    Builder.components.forEach((componentMeta:any) => {
      const component = componentMeta.class

      if (component && component.amis && component.amis.render && !component.amis.isRegisterd) {
          console.log(`Register amis component: ${component.amis.render.type}`, component.amis.render);
          component.amis.isRegisterd = true;
          //注册自定义组件，请参考后续对工作原理的介绍
          this.amisLib.Renderer(component.amis.render)(component);
      }
    });
  }

  constructor(props: any) {
    // console.log('AmisComponent', props);

    super(props);
    this.ref = React.createRef<HTMLDivElement>();
   
    this.state = {
      isLoaded: false,
    };
    this.loadResources = this.loadResources.bind(this);
    this.firstLoad = true;
  }

  componentDidMount() {
    this.loadResources();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.schema !== this.props.schema) {
      this.amisScoped.updateSchema(this.props.schema);
    } else if (prevProps.data !== this.props.data) {
      this.amisScoped.updateProps(this.props.data, () => {
        /*更新回调 */
      });
    }
  }


  render() {
    return (
      <div ref={this.ref}>
        {!this.state.isLoaded && (<span>Loading...</span>)} 
      </div>
    );
  }
}
